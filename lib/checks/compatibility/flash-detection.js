var webdriver = require('selenium-webdriver');

var self = this;

exports.name = "flash-detection";
exports.category = "compatibility";
exports.check = function (checker, browser) {
    var sink = checker.sink;

    // TODO: should we detect this at the network level instead?
    browser.do ( function (driver) {
        return driver.findElements(webdriver.By.tagName('script')).
            then(function(scripts) {
                webdriver.promise.map(
                    scripts,
                    function (el) {  return el.getAttribute("src");}
                ).then(function(srcs) {
                    for (var i = 0; i < srcs.length; i++) {
                        if (srcs[i].indexOf('swfobject.js') !== -1) {
			    checker.report(sink, "swfobject-lib-detected", self.name, self.category);
                        }
                    }
                });
            });
    });

    browser.do ( function (driver) {
        return driver.findElements(webdriver.By.tagName('embed')).
            then(function(embeds) {
                webdriver.promise.map(
                    embeds,
                    function (el) {  return el.getAttribute("src");}
                ).then(function(srcs) {
                    for (var i = 0; i < srcs.length; i++) {
                        if (srcs[i].indexOf('.swf') !== -1) {
			    checker.report(sink, "swf-file-detected", self.name, self.category);
                        }
                    }
                });
            });
    });
};