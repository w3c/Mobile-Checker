//check number of requests
exports.name = "alert";
exports.category = "interactions";

var self = this;

exports.check = function(checker, browser) {
    var sink = checker.sink;
    browser.once('alert', function(text) {
        checker.report(sink, "alert-detected", self.name, self.category, {
            text: text
        });
    });
}
