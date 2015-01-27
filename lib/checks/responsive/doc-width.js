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
            window.scrollTo(1, 0);
            return window.scrollX;
        }).then(function(documentWidth) {
            console.log(documentWidth);
            console.log('saadsad');
            console.log(browser.viewport.width);
            if (documentWidth > 0) {
                checker.report("doc-width-too-large", self.name,
                    self.category, "warning");
            } else {
                checker.sink.emit('done');
            }
        });
    });
};
