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
			checker.report("info-number-requests", self.name, self.category, {
				number: har.log.entries.length
			});
		}
		done();
	});
};