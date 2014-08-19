// detect HTTP errors
exports.name = "http-errors";
exports.category = "performance";
exports.check = function (checker) {
    var sink = checker.sink;
    if (checker.webAppData.har && checker.webAppData.har.log && checker.webAppData.har.log.entries) {
        var errors = [];

        for (var i = 0; i < checker.webAppData.har.log.entries.length ; i++) {
            var entry = checker.webAppData.har.log.entries[i];
            if (entry.response.status >= 400) {
                errors.push({url: entry.request.url,
                             status: entry.response.status,
                             statusText: entry.response.statusText});
            }
        }
        if (errors.length) {
            var errorReports = errors.map(function (e) { 
                return e.url + " with error " + e.status + ' "'
                    + e.statusText + '"';
            });
	    sink.emit('warning', checker.l10n.message(checker.options.lang, this.category, this.name, "warning", {number: errors.length, errors: errorReports.join(", ")}));
	    sink.emit('done');
        }

    }
}