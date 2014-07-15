//check width of document (DOM)
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function (checker) {
	var socket = checker.socket;
	if (checker.reporting.analytics.docWidth > checker.profile.config.width) {
		socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "err"));
	} else {
		socket.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
	}
}
