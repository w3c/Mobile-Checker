//check width of document (DOM)
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	if (checker.webAppData.documentWidth > checker.profile.config.width) {
		var str = fs.readFileSync(path.join(__dirname, '/../../issues/responsive/doc-width/doc-width-too-large.ejs'), 'utf8');
		sink.emit('err', ejs.render(str, {
			filename : path.join(__dirname, 'doc-width-too-large.ejs')
		}));
		sink.emit('done');
	} else {
		console.log("ok");
		sink.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
		sink.emit('done');
	}
}
