// detect redirects
exports.name = "redirects";
exports.category = "performance";
exports.check = function (checker) {
    var redirectCodes = [301, 302, 303, 307];
    var sink = checker.sink;
    if (checker.webAppData.har && checker.webAppData.har.log && checker.webAppData.har.log.entries) {
        var redirects = [];
        // we ignore the first entry (the page itself)
        for (var i = 1; i < checker.webAppData.har.log.entries.length ; i++) {
            var entry = checker.webAppData.har.log.entries[i];
            if (redirectCodes.indexOf(entry.response.status) !== -1) {
                redirects.push({from: entry.request.url,
                                to:   entry.response.redirectURL});
            }
        }
        if (redirects.length) {
	    sink.emit('warning', checker.l10n.message(checker.options.lang, this.category, this.name, "warning", {number: redirects.length}));
	    sink.emit('done');
        }

    }
}