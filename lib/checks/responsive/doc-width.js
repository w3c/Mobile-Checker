//check width of document (DOM)
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	if (checker.webAppData.documentWidth > checker.profile.config.width) {
		sink.emit('err', checker.l10n.report(this.category, this.name, "rr"));
		sink.emit('done');
	} else {
		console.log("ok");
		sink.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
		sink.emit('done');
	}
}
