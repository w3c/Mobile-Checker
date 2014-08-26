//check number of requests
exports.name = "number-requests";
exports.category = "performance";

var self = this;

exports.check = function(checker, browser) {
    var sink = checker.sink;
    browser.on('har', function(har) {
        if (har && har.log && har.log.entries) {
            checker.report(sink, "info-number-requests", self.name, self.category, {
                number: har.log.entries.length
            });
        }
    });
}
