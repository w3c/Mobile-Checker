//check width of document (DOM)
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function(checker, browser) {
    var sink = checker.sink;
    browser.do(function(driver) {
        return driver.executeScript(function() {
            return document.documentElement.clientWidth;
        }).then(function(documentWidth) {
            if (documentWidth > browser.viewport.width) {
                checker.report(sink, "doc-width-too-large", self.name,
                    self.category);
            } else {
                sink.emit('done');
            }
        });
    });
};
