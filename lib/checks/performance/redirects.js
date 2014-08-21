// detect redirects
exports.name = "redirects";
exports.category = "performance";

var self = this;

exports.check = function (checker, browser) {
    var redirectCodes = [301, 302, 303, 307];
    var sink = checker.sink;
    browser.on('har', function (har) {
        if (har && har.log && har.log.entries) {
            var redirects = [];
            // we ignore the first entry (the page itself)
            for (var i = 1; i < har.log.entries.length ; i++) {
                var entry = har.log.entries[i];
                if (redirectCodes.indexOf(entry.response.status) !== -1) {
                    redirects.push({from: entry.request.url,
                                    to:   entry.response.redirectURL});
                }
            }
            if (redirects.length) {
	        sink.emit('warning', checker.l10n.message(checker.options.lang, self.category, self.name, "warning", {number: redirects.length}));
	        sink.emit('done');
            }

        }
    });
}