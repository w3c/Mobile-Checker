var Checker = require("../lib/checker").Checker
,   checker = new Checker()
,   path = require("path")
,   events = require("events")
,   util = require("util")
;

var tests = {
}

function Sink () {}
util.inherits(Sink, events.EventEmitter);

Object.keys(tests).forEach(function (category) {
    describe("Category " + category, function () {
        Object.keys(tests[category]).forEach(function (check) {
            describe("Check " + check, function () {
                tests[category][check].forEach(function (test) {
                    var passTest = test.errors ? false : true;
                    it("should " + (passTest ? "pass" : "fail") + "for" + test.doc, function (done) {
                        var c = require("../lib/checks/" + category + "/" + check)
                        ,   sink = new Sink
                        ;
                        sink.on('ok', function () {
                            console.log("ok");
                        });
                        sink.on('warning', function () {
                            console.log("warning");
                        });
                        sink.on('err', function () {
                            console.log("error");
                        });
                        sink.on('done', function () {
                            console.log('done');
                        });
                        sink.on('end', function () {
                            done();
                        })
                        checker.check({
                            url : "http://new.juniorisen.com"
                        ,   events : sink
                        ,   ip : "test"
                        ,   profile : "default"
                        ,   lang : "en"
                        });

                    })
                })
            })
        })
    })
})

sink.on('end', function(){
    console.log("salut");
});




