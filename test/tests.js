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


var l10n = function(errid) {
    console.log(checker);
    var components = errid.split(".");
    return checker.l10n.message("en", components[0], components[1], components[2]);
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
        ,   {doc: "viewport_incorrect-initial-scale.html", errors: ["responsive.meta-viewport.6"]} //fail
        ,   {doc: "viewport_incorrect-width.html", errors: ["responsive.meta-viewport.5"]}
        ,   {doc: "viewport_many-viewport.html", errors: ["responsive.meta-viewport.2"]}
        ,   {doc: "viewport_no-initial-scale.html", errors: ["responsive.meta-viewport.4"]}
        ,   {doc: "viewport_no-meta-viewport.html", errors: ["responsive.meta-viewport.0"]}
        ,   {doc: "viewport_no-width.html", errors: ["responsive.meta-viewport.3"]}
        ,   {doc: "viewport_ok.html"}
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
                            else{
                                expect(sink.errors).to.eql(test.errors.map(l10n));
                                /*for (var i = 0, n = test.errors.length; i < n; i++) {
                                    expect(sink.errors).to.contain(test.errors[i]);
                                }*/

                            }
                            done();
                        });
                        checker.check({
                            url : "file://" + path.join(__dirname, "test_server/public/docs", test.doc)
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




