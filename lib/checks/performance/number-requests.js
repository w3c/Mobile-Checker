//check number of requests
exports.name = "number-requests";
exports.category = "performance";
exports.check = function (checker) {
    var sink = checker.sink;
    if (checker.webAppData.har && checker.webAppData.har.log && checker.webAppData.har.log.entries) {
	sink.emit('warning', checker.l10n.message(checker.options.lang, this.category, this.name, "warning", {number: checker.webAppData.har.log.entries.length}));
	sink.emit('done');

    }
}