var events = require('events')
,	util = require('util')
,	logger  = require('morgan')
,	Q = require('q')
,	Checker = require("../lib/checker").Checker
;

var tests = {

	responsive : [
		{doc : 'width_success'}
	,	{doc : 'width_fail'}
	]

,	speed : [
		
	]

,	certificate : [

	]

};

function Sink () {}
util.inherits(Sink, events.EventEmitter);

var sink = new Sink();
		var checkout = new Checker();
		checkout.check({
            url : 'localhost:3000/width_success'
        ,   events : sink
        ,   widthView : 600
        ,   heightView : 900
        ,   ip : "test"
        });
        sink.on('stepdone', function () {
        	console.log('step done !');
        });

/*Object.keys(tests).forEach(function (category){
	tests[category].forEach( function (test){
		var sink = new Sink();
		var checkout = new Checker();
		checkout.check({
            url : 'localhost:3000/' + test
        ,   events : sink
        ,   widthView : 600
        ,   heightView : 900
        });
        sink.on('stepdone', function () {
        	console.log('step done !');
        });
	});
});*/