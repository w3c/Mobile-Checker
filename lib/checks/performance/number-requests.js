/**
 * @module number-requests
 */
//check number of requests
exports.name = "number-requests";
exports.category = "performance";

var self = this;

exports.check = function(checker, browser) {
    browser.on('har', function(har, done) {
	if (har && har.log && har.log.entries) {
	    checker.report("info-number-requests", self.name, self.category, "info", {
		number: har.log.entries.length,
                entries: har.log.entries.map(
                    function(e) { return { url: e.request.url,
                                           status: e.response.status,
                                           mimeType: e.response.content.mimeType,
                                           bodySize: e.response.bodySize,
                                           time: e.time
                                         };
                                })
	    });
        }
        done();
    });
};