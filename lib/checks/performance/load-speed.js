//check load speed of website
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
exports.name = "load-speed";
exports.category = "performance";
exports.check = function (checker) {
	var sink = checker.sink;
	if (checker.webAppData.pageSpeed <= 1500) {
		//OK
		sink.emit('done');
	}
	else if (checker.webAppData.pageSpeed > 1500) {
		checker.report(sink, "page-load-slowly", this.name, this.category, checker.webAppData.pageSpeed);
	}
}