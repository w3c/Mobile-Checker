var Checker = require("../lib/checkline").Checker
,   checker = new Checker()
,   path = require("path")
,   expect = require("expect.js")
,   events = require("events")
,   util = require("util")
;

global.rootRequire = function(name) {
    return require(__dirname + '/../' + name);
}


var l10n = function(err) {
    var data;
    var errid = err;
    if (err.name !== undefined) {
        errid = err.name;
        data = err.data;
    }
    var components = errid.split(".");
    return checker.l10n.message("en", components[0], components[1], components[2], data);
}

var tests = {
    //Categories
    responsive : {
        //Checks
        "doc-width": [
        ,   {doc: "width_fail.html", errors: ["responsive.doc-width.err"]} //fail
        ,   {doc: "width_success.html"} //pass
        ]
    ,   "meta-viewport": [
        ,   {doc: "viewport_incorrect-initial-scale.html", errors: [{name:"responsive.meta-viewport.5", data:{property: "initial-scale", value: "foo", validValues: "a positive number"}}]} //fail
        ,   {doc: "viewport_incorrect-width.html", errors: [{name:"responsive.meta-viewport.5", data:{property: "width", value: "likeanelephant", validValues: "device-width, device-height, a positive number"}}]}
        ,   {doc: "viewport_many-viewport.html", errors: ["responsive.meta-viewport.2"]}
        ,   {doc: "viewport_no-initial-scale.html"}
        ,   {doc: "viewport_no-meta-viewport.html", errors: ["responsive.meta-viewport.0"]}
        ,   {doc: "viewport_no-width.html"}
        ,   {doc: "viewport_ok.html"}
    ],
    },
    "performance": {
        "number-requests": [
            {doc: "number-requests.html", errors: [{name: "performance.number-requests.warning", data: {number:4}}]}
        ],
        "redirects": [
            {doc: "redirects.html", errors: [{name: "performance.redirects.warning", data: {number:2}}]}
        ],
        "http-errors": [
            {doc: "http-errors.html", errors: [{name: "performance.http-errors.warning", data: {number:1, errors: "http://localhost:3001/foo with error 404 \"Not Found\""}}]},
         {doc: "http-errors-favicon.html", errors: [{name: "performance.http-errors.favicon", data: {url: "http://localhost:3001/favicon.ico"}}]}
        ],

        "compression": [
            {doc: "compressed.html"},
            {doc: "uncompressed.html", errors: [{name: "performance.compression.warning", data: {number:1, compressable: "http://localhost:3001/docs/uncompressed.html"}}]}
        ]
    }
}

function Sink () {
    this.ok = 0;
    this.errors = [];
    this.warnings = [];
    this.done = 0;
}

util.inherits(Sink, events.EventEmitter);

describe('Starting test suite', function () {
    var server = require("./test_server/test_app");
    var port = 3001;
    before(function () {
        server.start(port);
    });

    after(function () {
        server.close();
    });

    Object.keys(tests).forEach(function (category) {
        describe("Category " + category, function () {
            Object.keys(tests[category]).forEach(function (check) {
                describe("Check " + check, function () {
                    tests[category][check].forEach(function (test) {
                        var passTest = test.errors ? false : true;
                        it("should " + (passTest ? "pass" : "fail") + " for " + test.doc, function (done) {
                            var c = require("../lib/checks/" + category + "/" + check)
                            ,   sink = new Sink
                            ;
                            sink.on('ok', function () {
                                sink.ok++;
                            });
                            sink.on('warning', function (type) {
                                sink.errors.push(type);
                            });
                            sink.on('err', function (type) {
                                sink.errors.push(type);
                            });
                            sink.on('done', function () {
                                sink.done++;
                            });
                            sink.on('end', function () {
                                if(passTest) {
                                    expect(sink.errors).to.be.empty();
                                    expect(sink.ok).to.eql(sink.done);
                                }
                                else {
                                    expect(sink.errors).to.eql(test.errors.map(l10n));
                                }
                                done();
                            });
                            checker.check({
                                url : "http://localhost:" + port + "/docs/" + test.doc
                                ,   events : sink
                                ,   ip : "test"
                                ,   profile : "default"
                                ,   lang : "en"
                                ,   checklist: [c]
                            });
                        });
                    });
                });
            });
        });
    });
});



