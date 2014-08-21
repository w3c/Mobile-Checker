//check number of requests
exports.name = "number-requests";
exports.category = "performance";

var self = this;

exports.check = function (checker, browser) {
    var sink = checker.sink;
    browser.on('har', function (har) {
        if (har && har.log && har.log.entries) {
	    sink.emit('warning', checker.l10n.message(checker.options.lang, self.category, self.name, "warning", {number: har.log.entries.length}));
	    sink.emit('done');
        }
    });
}