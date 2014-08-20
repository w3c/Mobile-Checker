//check width of document (DOM)
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	if (checker.webAppData.documentWidth > checker.webAppData.viewport.width) {
		checker.report(sink, "doc-width-too-large", this.name, this.category);
	} else {
		//OK
		console.log("ok");
		sink.emit('done');
	}
}

