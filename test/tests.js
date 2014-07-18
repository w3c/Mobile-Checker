var Checker = require("../lib/checker").Checker
,   checker = new Checker()
,   path = require("path")
,   expect = require("expect.js")
,   events = require("events")
,   util = require("util")
;

var tests = {
    //Categories
    responsive : {
        //Checks
        "doc-width": [
        ,   {doc: "width_fail.html", errors: ["responsive.doc-width"]} //fail
        ,   {doc: "width_success.html"} //pass
        ]
    ,   "meta-viewport": [
        ,   {doc: "viewport_incorrect-initial-scale.html", errors: ["incorrect-initial-scale"]} //fail
        ,   {doc: "viewport_incorrect-width.html", errors: ["incorrect-width"]}
        ,   {doc: "viewport_many-viewport.html", errors: ["many-viewport"]}
        ,   {doc: "viewport_no-initial-scale.html", errors: ["no-initial-scale"]}
        ,   {doc: "viewport_no-meta-viewport.html", errors: ["no-meta-viewport"]}
        ,   {doc: "viewport_no-width.html", errors: ["no-width"]}
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
                    it("should " + (passTest ? "pass" : "fail") + "for " + test.doc, function (done) {
                        var c = require("../lib/checks/" + category + "/" + check)
                        ,   sink = new Sink
                        ;
                        console.log(test.doc);
                        sink.on('ok', function () {
                            console.log("ok");
                            sink.ok++;
                        });
                        sink.on('warning', function (type) {
                            console.log("warning");
                            sink.errors.push(type);
                        });
                        sink.on('err', function (type) {
                            console.log("error");
                            sink.errors.push(type);
                        });
                        sink.on('done', function () {
                            console.log('done');
                            sink.done++;
                        });
                        sink.on('end', function () {
                            if(passTest) {
                                expect(sink.errors).to.be.empty();
                                expect(sink.ok).to.eql(sink.done);
                            }
                            else{
                                expect(sink.errors.length).to.eql(test.errors.length);
                                /*for (var i = 0, n = test.errors.length; i < n; i++) {
                                    expect(sink.errors).to.contain(test.errors[i]);
                                }*/

                            }
                            console.log(sink);
                            done();
                        });
                        checker.check({
                            url : path.join(__dirname, "test_server/public/docs", test.doc)
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




