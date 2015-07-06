global.rootRequire = function(name) {
    return require(__dirname + '/../' + name);
};

var Checker = require("../lib/checker").Checker,
    checker = new Checker(),
    path = require("path"),
    expect = require("expect.js"),
    events = require("events"),
    util = require("util"),
    uuid = require('node-uuid');


var tests = {
    //Categories
    responsive: {
        //Checks
        "doc-width": [, {
                doc: "width_fail.html",
                warning: ["responsive.doc-width.doc-width-too-large"]
            },
                      {
                doc: "width_success.html"
            }
        ],
        "meta-viewport": [, {
            doc: "viewport_incorrect-initial-scale.html",
            error: [{
                name: "responsive.meta-viewport.invalid-viewport-value",
                data: {
                    property: "initial-scale",
                    value: "foo",
                    validValues: "a positive number"
                }
            }]
        }, {
            doc: "viewport_incorrect-width.html",
            error: [{
                name: "responsive.meta-viewport.invalid-viewport-value",
                data: {
                    property: "width",
                    value: "likeanelephant",
                    validValues: "device-width, device-height, a positive number"
                }
            }]
        }, {
            doc: "viewport_many-viewport.html",
            warning: [
                "responsive.meta-viewport.several-viewports-declared"
            ]
        }, {
            doc: "viewport_no-initial-scale.html"
        }, {
            doc: "viewport_no-meta-viewport.html",
            error: ["responsive.meta-viewport.no-viewport-declared"]
        }, {
            doc: "viewport_no-width.html"
        }, {
            doc: "viewport_ok.html"
        }],
    },
    "performance": {
        "number-requests": [{
            doc: "number-requests.html",
            info: [{
                name: "performance.number-requests.info-number-requests",
                dataSorter: {entries:"url"},
                data: {
                    number: 4,
                    entries: [{
                                  "url": "http://0.0.0.0:3001/css/style.css",
                                  "status": 200,
                                  "mimeType": "text/css; charset=UTF-8",
                                  "bodySize": 106,
                                  "time": null
                              },
                              {
                                  "url": "http://0.0.0.0:3001/docs/number-requests.html",
                                  "status": 200,
                                  "mimeType": "text/html; charset=UTF-8",
                                  "bodySize": 139,
                                  "time": null
                              },
                              {
                                  "url": "http://0.0.0.0:3001/favicon.ico",
                                  "status": 404,
                                  "mimeType": "text/html",
                                  "bodySize": 24,
                                  "time": null
                              },
                              {
                                  "url": "http://0.0.0.0:3001/js/script.js",
                                  "status": 200,
                                  "mimeType": "application/javascript",
                                  "bodySize": 0,
                                  "time": null
                              }
                             ]
                }
            }]
        }],
        "redirects": [{
            doc: "redirects.html",
            warning: [{
                name: "performance.redirects.redirects-encountered",
                data: {
                    number: 2,
                    redirects: [{
                        from: "http://0.0.0.0:3001/redirect.css",
                        to: "http://0.0.0.0:3001/css/style.css",
                        wastedBW: 663,
                        latency: null
                    }, {
                        from: "http://0.0.0.0:3001/scheme-relative-redirect",
                        to: "http://0.0.0.0:3001/js/script.js",
                        wastedBW: 576,
                        latency: null
                    }],
                    totalWastedBW: 1239,
                    totalLatency: null
                }
            }]
        }],
        "http-errors": [{
            doc: "http-errors.html",
            error: [{
                name: "performance.http-errors.http-errors-detected",
                data: {
                    number: 1,
                    errors: [{
                        url: "http://0.0.0.0:3001/foo",
                        status: 404,
                        statusText: "Not Found"
                    }]
                }
            }]
        }, {
            doc: "http-errors-favicon.html",
            warning: [{
                name: "performance.http-errors.favicon",
                data: {
                    url: "http://0.0.0.0:3001/favicon.ico"
                }
            }]
        }],

        "compression": [{
            doc: "compressed.html"
        }, {
            doc: "uncompressed.html",
            warning: [{
                name: "performance.compression.resources-could-be-compressed",
                data: {
                    number: 1,
                    compressable: [{
                        url: "http://0.0.0.0:3001/docs/uncompressed.html",
                        origSize: 1363,
                        diff: 1055
                    }],
                    saving: 1055
                }
            }],
        }],
        "exif": [{
            doc: "firework.jpg",
            warning: [{
                name: "performance.exif.images-could-be-unexified",
                data: {
                    number: 1,
                    minifiable: [{
                        url: "http://0.0.0.0:3001/docs/firework.jpg",
                        origSize: 106571,
                        diff: 65532
                    }],
                    saving: 65532
                }
            }]
        }],
    },
    "compatibility":{
        "css-prefixes":[
            {
                doc: "css-prefixes.html",
                warning: [{
                    name: "compatibility.css-prefixes.missing-prefixes",
                    data: {
                        "missingPrefixes": {
                            "http://0.0.0.0:3001/docs/prefixes.css": [
                                {
                                    "rule": "body {\n  -webkit-columns: 2;\n}",
                                    "position": {
                                        "line": 1,
                                        "column": 1
                                    },
                                    "prop": "columns",
                                    "missing": [
                                        "columns",
                                        "-moz-columns"
                                    ],
                                    "decls": [
                                        "-webkit-columns: 2;\n"
                                    ],
                                    "value": "2"
                                }
                            ]
                        }
                    }
                }]
            },
            {
                doc: "css-inconsistent-prefixes.html",
                warning: [{
                    name: "compatibility.css-prefixes.mismatching-prefixes",
                    data: {
                        "mismatchingPrefixes": {
                            "http://0.0.0.0:3001/docs/inconsistent-prefixes.css": [
                                {
                                    "rule": "body {\n  -webkit-border-radius: 5%;\n  border-radius: 15%;\n}",
                                    "position": {
                                        "line": 1,
                                        "column": 1
                                    },
                                    "prop": "border-radius",
                                    "decls": [
                                        "-webkit-border-radius: 5%;\n",
                                        "border-radius: 15%;\n"
                                    ]
                                }
                            ]
                        }
                    }
                }]
            }]
    },
    "integration":{
        "manifest":[
            {
                doc: "no-manifest.html"
            },
            {
                doc: "multiple-manifests.html",
                warning: [{
                    name: "integration.manifest.multiple-manifests",
                    data: {
                        links: ["http://0.0.0.0:3001/docs/manifest.json", "http://0.0.0.0:3001/docs/manifest.json"]
                    }
                }]
            },
            {
                doc: "404-manifest.html",
                warning: [{
                    name: "integration.manifest.httperror",
                    data: {
                        manifest: "http://0.0.0.0:3001/docs/manifest1.json",
                        httperror: 404
                    }
                }]
            },
            {
                doc: "badjson-manifest.html",
                warning: [{
                    name: "integration.manifest.jsonerror",
                    data: {
                        manifest: "http://0.0.0.0:3001/docs/badmanifest.json",
                        error: {name: "SyntaxError", message: "Unexpected end of input"}
                    }
                }]
            },
            {
                doc: "invalid-manifest.html",
                warning: [{
                    name: "integration.manifest.jsonserror",
                    data: {
                        manifest: "http://0.0.0.0:3001/docs/invalidmanifest.json",
                        errors: [
                            {
                                "property": "instance.name",
                                "message": "is not of a type(s) string",
                                "schema": {
                                    "description": "The name of the web application.",
                                    "type": "string"
                                },
                                "instance": 1,
                                "stack": "instance.name is not of a type(s) string"
                            }
                        ]
                    }
                }]
            },
            {
                doc: "brokenlinks-manifest.html",
                warning: [{
                    name: "integration.manifest.httperror_property",
                    data: {
                        manifest: "http://0.0.0.0:3001/docs/brokenlinks-manifest.json",
                        property: "start_url",
                        url: "http://0.0.0.0:3001/url/does/not/exist",
                        error: 404
                    }
                }]
            },
            {
                doc: "brokenlinks-manifest2.html",
                warning: [{
                    name: "integration.manifest.networkerror_property",
                    data: {
                        manifest: "http://0.0.0.0:3001/docs/brokenlinks-manifest2.json",
                        property: "icon",
                        url: "http://domain-does-not-exist/",
                        error: {
                            "code": "ENOTFOUND",
                            "errno": "ENOTFOUND",
                            "syscall": "getaddrinfo"
                        }
                    }
                }]
            }

        ]
    }
};

function Sink() {
    this.ok = 0;
    this.error = [];
    this.warning = [];
    this.info = [];
    this.done = 0;
}

util.inherits(Sink, events.EventEmitter);

describe('Starting test suite', function() {
    var server = require("./test_server/test_app");
    var port = 3001;
    before(function() {
        server.start(port);
    });

    after(function() {
        server.close();
    });

    Object.keys(tests).forEach(function(category) {
        describe("Category " + category, function() {
            Object.keys(tests[category]).forEach(function(check) {
                describe("Check " + check, function() {
                    tests[category][check].forEach(function(
                        test) {
                        var testOutcome = test.error ? "error" : test.warning ? "warning" : test.info ? "info" : "pass";
                        var formatter;
                        if (test.error === undefined) test.error = [];
                        if (test.warning === undefined) test.warning = [];
                        if (test.info === undefined) test.info = [];

                        it("should " + (testOutcome === "pass" ?
                                "emit no report" : "emit a report") +
                            " for " + test.doc,
                            function(done) {
                                var c = require(
                                        "../lib/checks/" +
                                        category + "/" +
                                        check),
                                    sink = new Sink();
                                sink.setMaxListeners(0);
                                sink.on('ok', function() {
                                    sink.ok++;
                                });
                                sink.on('err', function(
                                    report) {
                                    sink[report.status].push(
                                        report.issue);
                                });
                                sink.on('done',
                                    function() {
                                        sink.done++;
                                    });
                                sink.on('end', function() {
                                    if (testOutcome === "pass") {
                                        expect(sink
                                            .error
                                        ).to.be.empty();

                                        expect(sink
                                            .warning
                                        ).to.be.empty();

                                        expect(sink
                                            .info
                                        ).to.be.empty();
                                        //expect(sink.ok).to.eql(sink.done);
                                    } else {
                                        sort(sink.error,
                                             test.error);
                                        sort(sink.warning,
                                             test.warning);
                                        sort(sink.info,
                                             test.info);
                                        sink.error =
                                            cleanNulls(
                                                sink
                                                .error,
                                                test
                                                .error
                                            );

                                        sink.warning =
                                            cleanNulls(
                                                sink
                                                .warning,
                                                test
                                                .warning
                                            );

                                        sink.info =
                                            cleanNulls(
                                                sink
                                                .info,
                                                test
                                                .info
                                            );
                                        expect(sink
                                            .error
                                        ).to.eql(
                                            test.error
                                        );
                                        expect(sink
                                            .warning
                                        ).to.eql(
                                            test.warning
                                        );
                                        expect(sink
                                            .info
                                        ).to.eql(
                                            test.info
                                        );

                                    }
                                    done();
                                });
                                checker.check({
                                    url: "http://0.0.0.0:" +
                                        port +
                                        "/docs/" +
                                        test.doc,
                                    events: sink,
                                    profile: "default",
                                    checklist: [c],
                                    id: uuid.v4()
                                });
                                formatter = checker.formatReport;
                                checker.formatReport = formatReport;
                            });
                        if (testOutcome !== "pass") {
                            it("should be renderable without exception", function(done) {
                                test[testOutcome].forEach(function(t) {
                                    var name = t;
                                    if (t.name) {
                                        name = t.name;
                                    }
                                    var comps = name.split(".");
                                    formatter(comps[2], comps[1], comps[0], testOutcome, t.data, function() { done(); });
                                });
                            });
                        }
                    });
                });
            });
        });
    });
});

function formatReport(key, name, category, status, data, cb) {
    var fullname = category + "." + name + "." + key;
    if (!Object.keys(data).length) {
        cb(fullname);
    } else {
        cb({
            name: fullname,
            data: data
        });
    }
}

function cleanNulls(obj1, obj2) {
    var obj;
    if (Array.isArray(obj1)) {
        obj = [];
        for (var i = 0; i < obj1.length; i++) {
            obj[i] = cleanNulls(obj1[i], obj2[i]);
        }
    } else if (typeof obj1 === "object") {
        obj = {};
        var keys = Object.keys(obj1);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            if (obj2 && obj2[key] === null) {
                obj[key] = null;
            } else if (obj2 && typeof obj1[key] === "object") {
                obj[key] = cleanNulls(obj1[key], obj2[key]);
            } else {
                obj[key] = obj1[key];
            }
        }
    } else {
        if (obj2 === null) {
            obj = null;
        } else {
            obj = obj1;
        }
    }
    return obj;
}

// Sort lists in test results to avoid false positives when order is not
// deterministic
function sort(errors1, errors2) {
    function keysrt(key,desc) {
        return function(a,b){
            return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        };
    }

    for (var i = 0 ; i < errors2.length; i++) {
        var err2 = errors2[i];
        if (err2.dataSorter) {
            for (var key in err2.dataSorter) {
                var sortProperty = err2.dataSorter[key];
                errors1[i].data[key].sort(keysrt(sortProperty));
            }
            delete err2.dataSorter;
        }
    }
}
