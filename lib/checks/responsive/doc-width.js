//check width of document (DOM)
/**
 * @module doc-width
 */
exports.name = "doc-width";
exports.category = "responsive";

var self = this;

exports.check = function(checker, browser) {
    browser.do(function(driver) {
        return driver.executeScript(function() {
            return [window.document.documentElement.scrollWidth, window.document
.documentElement.clientWidth];
        }).then(function(data) {
            var scrollWidth = data[0];
            var clientWidth = data[1];
            if (scrollWidth > clientWidth) {
                checker.report("doc-width-too-large", self.name,
                    self.category, "warning");
            } else {
                checker.sink.emit('done');
            }
        });
    });
};
