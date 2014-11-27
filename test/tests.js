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
                errors: ["responsive.doc-width.doc-width-too-large"]
            },
                      {
                doc: "width_success.html"
            }
        ],
        "meta-viewport": [, {
            doc: "viewport_incorrect-initial-scale.html",
            errors: [{
                name: "responsive.meta-viewport.invalid-viewport-value",
                data: {
                    property: "initial-scale",
                    value: "foo",
                    validValues: "a positive number"
                }
            }]
        }, {
            doc: "viewport_incorrect-width.html",
            errors: [{
                name: "responsive.meta-viewport.invalid-viewport-value",
                data: {
                    property: "width",
                    value: "likeanelephant",
                    validValues: "device-width, device-height, a positive number"
                }
            }]
        }, {
            doc: "viewport_many-viewport.html",
            errors: [
                "responsive.meta-viewport.several-viewports-declared"
            ]
        }, {
            doc: "viewport_no-initial-scale.html"
        }, {
            doc: "viewport_no-meta-viewport.html",
            errors: ["responsive.meta-viewport.no-viewport-declared"]
        }, {
            doc: "viewport_no-width.html"
        }, {
            doc: "viewport_ok.html"
        }],
    },
    "performance": {
        "number-requests": [{
            doc: "number-requests.html",
            errors: [{
                name: "performance.number-requests.info-number-requests",
                data: {
                    number: 4
                }
            }]
        }],
        "redirects": [{
            doc: "redirects.html",
            errors: [{
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
                        to: "http://localhost:3001/js/script.js",
                        wastedBW: 578,
                        latency: null
                    }],
                    totalWastedBW: 1241,
                    totalLatency: null
                }
            }]
        }],
        "http-errors": [{
            doc: "http-errors.html",
            errors: [{
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
            errors: [{
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
            errors: [{
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
            }]
        }]
    }
};

function Sink() {
    this.ok = 0;
    this.errors = [];
    this.warnings = [];
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
                        var passTest = test.errors ?
                            false : true;
                        it("should " + (passTest ?
                                "pass" : "fail") +
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
                                sink.on('warning',
                                    function(type) {
                                        sink.errors.push(
                                            type);
                                    });
                                sink.on('err', function(
                                    type) {
                                    sink.errors.push(
                                        type);
                                });
                                sink.on('done',
                                    function() {
                                        sink.done++;
                                    });
                                sink.on('end', function() {
                                    if (passTest) {
                                        expect(sink
                                            .errors
                                        ).to.be.empty();
                                        //expect(sink.ok).to.eql(sink.done);
                                    } else {
                                        sink.errors =
                                            cleanNulls(
                                                sink
                                                .errors,
                                                test
                                                .errors
                                        );
                                        expect(sink
                                            .errors
                                        ).to.eql(
                                            test.errors
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
                                    id: uuid.v4(),
                                    formatReport: function(
                                        key, name,
                                        category,
                                        data) {
                                        var fullname =
                                            category +
                                            "." +
                                            name +
                                            "." +
                                            key;
                                        if (!Object.keys(data).length) {
                                            return fullname;
                                        }
                                        return {
                                            name: fullname,
                                            data: data
                                        };
                                    }
                                });
                            });
                    });
                });
            });
        });
    });
});

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
            if (obj2[key] === null) {
                obj[key] = null;
            } else if (typeof obj1[key] === "object") {
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
