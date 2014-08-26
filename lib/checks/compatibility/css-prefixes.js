var webdriver = require('selenium-webdriver');
var cssParser = require('css');
var cssPrefixes = rootRequire('lib/css-prefixes.json');

var utils = rootRequire("lib/checks/utils");


var self = this;

exports.name = "css-prefixes";
exports.category = "compatibility";
exports.check = function(checker, browser) {
    var sink = checker.sink;
    var missingPrefixEquivalent = {};
    var mismatchPrefixEquivalent = {};
    browser.on('har', function(har) {
        if (har && har.log && har.log.entries) {
            for (var i = 0; i < har.log.entries.length; i++) {
                var entry = har.log.entries[i];
                if (entry.response.status === 200) {
                    var mediaType = utils.mediaTypeName(entry.response.content
                        .mimeType);
                    if (mediaType === "text/css") {
                        var url = entry.request.url;
                        var cssObj = cssParser.parse(entry.response.content
                            .text, {
                                silent: true
                            });
                        for (var j = 0; j < cssObj.stylesheet.rules.length; j++) {
                            var rule = cssObj.stylesheet.rules[j];
                            var prefixedProperties = {};
                            var unprefixedProperties = {};
                            if (rule.declarations) {
                                for (var k = 0; k < rule.declarations.length; k++) {
                                    var decl = rule.declarations[k];
                                    if (decl.property && hasprefix(decl.property)) {
                                        var unprefixed = unprefix(decl.property);
                                        if (!prefixedProperties[unprefixed]) {
                                            prefixedProperties[unprefixed] = {};
                                        }
                                        prefixedProperties[unprefixed][decl
                                            .property
                                        ] = decl;
                                    } else {
                                        unprefixedProperties[decl.property] =
                                            decl;
                                    }
                                }
                            }
                            var prefixed = Object.keys(prefixedProperties);
                            for (k = 0; k < prefixed.length; k++) {
                                // add the unprefixed decl if it exists
                                if (unprefixedProperties[prefixed[k]]) {
                                    prefixedProperties[prefixed[k]][
                                        prefixed[k]
                                    ] = unprefixedProperties[prefixed[k]];
                                }
                                var props = prefixedProperties[prefixed[k]];
                                var prefixedNames = Object.keys(props);
                                var ref = props[prefixedNames[0]].value;
                                var misMatchFound = false;
                                for (var l = 1; l < prefixedNames.length; l++) {
                                    // are the various unprefixed decl the same?
                                    if (props[prefixedNames[l]].value !==
                                        ref) {
                                        misMatchFound = true;
                                        break;
                                    }
                                }
                                if (misMatchFound) {
                                    if (!mismatchPrefixEquivalent[url]) {
                                        mismatchPrefixEquivalent[url] = [];
                                    }
                                    mismatchPrefixEquivalent[url].push({
                                        rule: stringify(rule),
                                        position: rule.position.start,
                                        prop: prefixed[k],
                                        decls: values(props).map(
                                            stringify)
                                    });
                                }
                                var equivPrefixes = cssPrefixes[prefixed[k]] ?
                                    cssPrefixes[prefixed[k]].values :
                                    undefined;
                                if (equivPrefixes) {
                                    var missing = [];
                                    for (var l = 0; l < equivPrefixes.length; l++) {
                                        if (!props[equivPrefixes[l]]) {
                                            missing.push(equivPrefixes[l]);
                                        }
                                    }
                                    if (missing.length) {
                                        if (!missingPrefixEquivalent[url]) {
                                            missingPrefixEquivalent[url] = [];
                                        }
                                        missingPrefixEquivalent[url].push({
                                            rule: stringify(rule),
                                            position: rule.position.start,
                                            prop: prefixed[k],
                                            missing: missing,
                                            decls: values(props).map(
                                                stringify),
                                            value: values(props)[0].value
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (Object.keys(missingPrefixEquivalent).length) {
                checker.report(sink, "missing-prefixes", self.name, self.category, {
                    missingPrefixes: missingPrefixEquivalent
                });
            }
            if (Object.keys(mismatchPrefixEquivalent).length) {
                checker.report(sink, "mismatching-prefixes", self.name,
                    self.category, {
                        mismatchingPrefixes: mismatchPrefixEquivalent
                    });
            }
        }
    });
};

function hasprefix(string) {
    return string.match(/^-[^-]*-/);
}

function unprefix(string) {
    return string.replace(/^-[^-]*-/, '');
}

function stringify(obj) {
    var stringified;
    switch (obj.type) {
        case 'rule':
            stringified = obj.selectors.join(', ') + ' {' + '\n';
            for (var i = 0; i < obj.declarations.length; i++) {
                stringified += '  ' + stringify(obj.declarations[i]);
            }
            stringified += "}";
            break;
        case 'declaration':
            stringified = obj.property + ': ' +
                obj.value + ';\n'
            break;
    }
    return stringified;
}

function values(obj) {
    var vals = Object.keys(obj).map(function(key) {
        return obj[key];
    });
    return vals;
}
