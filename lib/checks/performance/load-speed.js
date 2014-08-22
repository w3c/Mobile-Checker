//check load speed of website
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

var self = this;

exports.name = "load-speed";
exports.category = "performance";
exports.check = function (checker, browser) {
    browser.on('pageSpeed', function (pageSpeed) {
	var sink = checker.sink;
	if (pageSpeed <= 1500) {
	    //OK
	    sink.emit('done');
	}
	else if (pageSpeed > 1500) {
	    checker.report(sink, "page-load-slowly", self.name, self.category, checker.webAppData.pageSpeed);
	}
    });
}