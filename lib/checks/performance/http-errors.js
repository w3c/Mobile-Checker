// detect HTTP errors
exports.name = "http-errors";
exports.category = "performance";

var self = this;

exports.check = function (checker, browser) {
    var urlparse = require("url");

    var sink = checker.sink;
    browser.on('har', function (har) {
        if (har && har.log && har.log.entries) {
            var errors = [];
            var faviconNotFound = false;
            for (var i = 0; i < har.log.entries.length ; i++) {
                var entry = har.log.entries[i];
                if (entry.response.status >= 400) {
                    var urlObj = urlparse.parse(entry.request.url);
                    if (urlObj.path === '/favicon.ico' && entry.response.status === 404) {
                        faviconNotFound = entry.request.url;
                    } else {
                        errors.push({url: entry.request.url,
                                     status: entry.response.status,
                                     statusText: entry.response.statusText});
                    }
                }
            }
            if (errors.length) {
                var errorReports = errors.map(function (e) {
                    return e.url + " with error " + e.status + ' "'
                        + e.statusText + '"';
                });
	        sink.emit('warning', checker.l10n.message(checker.options.lang, self.category, self.name, "warning", {number: errors.length, errors: errorReports.join(", ")}));
	        sink.emit('done');
            }
            if (faviconNotFound) {
	        sink.emit('warning', checker.l10n.message(checker.options.lang, this.category, this.name, "favicon", {url: faviconNotFound}));
	        sink.emit('done');
            }
        }
    });
}