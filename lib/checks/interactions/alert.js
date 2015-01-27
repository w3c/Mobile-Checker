/**
 * @module alert
 */
//check number of requests
exports.name = "alert";
exports.category = "interactions";

var self = this;

exports.check = function(checker, browser) {
    browser.once('alert', function(text) {
        checker.report("alert-detected", self.name, self.category, "error", {
            text: text
        });
    });
};
