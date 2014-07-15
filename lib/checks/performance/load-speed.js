//check load speed of website
exports.name = "load-speed";
exports.category = "performance";
exports.check = function (checker) {
	var socket = checker.socket;
	if (checker.reporting.analytics.speed <= 1000) {
		socket.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
	}
	else if (checker.reporting.analytics.speed > 1000 && checker.reporting.analytics.speed <= 2000) {
		socket.emit('warning', checker.l10n.message(checker.options.lang, this.category, this.name, "warning"));
	}
	else if (checker.reporting.analytics.speed > 2000) {
		socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "err"));
	}
}