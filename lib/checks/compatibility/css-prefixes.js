/**
 * @module css-prefixes
 * @requires css
 * @requires css-prefixes.json
 * @requires utils
 */
var cssParser = require('css');
var cssPrefixes = rootRequire('lib/css-prefixes.json');

var utils = rootRequire("lib/checks/utils");


var self = this;

exports.name = "css-prefixes";
exports.category = "compatibility";
exports.check = function(checker, browser) {
    var missingPrefixEquivalent = {};
    var mismatchPrefixEquivalent = {};
    browser.on('har', function(har, done) {
        if (har && har.log && har.log.entries) {
            for (var i = 0; i < har.log.entries.length; i++) {
                var entry = har.log.entries[i];
                if (entry.response.status === 200) {
                    var mediaType = utils.mediaTypeName(entry.response.content
                        .mimeType);
                    if (mediaType === "text/css") {
                        if (entry.response.content.text === undefined) {
                            // not sure why that happens
                            // but cssparser breaks on undefined
                            continue;
                        }

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
                            for (var p = 0; p < prefixed.length; p++) {
                                // add the unprefixed decl if it exists
                                if (unprefixedProperties[prefixed[p]]) {
                                    prefixedProperties[prefixed[p]][
                                        prefixed[p]
                                    ] = unprefixedProperties[prefixed[p]];
                                }
                                var props = prefixedProperties[prefixed[p]];
                                var prefixedNames = Object.keys(props);
                                var ref = props[prefixedNames[0]].value;
                                var misMatchFound = false;
                                for (var n = 1; n < prefixedNames.length; n++) {
                                    // are the various unprefixed decl the same?
                                    if (props[prefixedNames[n]].value !==
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
                                        prop: prefixed[p],
                                        decls: values(props).map(
                                            stringify)
                                    });
                                }
                                var equivPrefixes = cssPrefixes[prefixed[p]] ?
                                    cssPrefixes[prefixed[p]].values :
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
                                            prop: prefixed[p],
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
                checker.report("missing-prefixes", self.name, self.category, "warning",{
                    missingPrefixes: missingPrefixEquivalent
                });
            }
            if (Object.keys(mismatchPrefixEquivalent).length) {
                checker.report("mismatching-prefixes", self.name,
                    self.category, "warning",{
                        mismatchingPrefixes: mismatchPrefixEquivalent
                    });
            }
        }
        done();
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
                obj.value + ';\n';
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
