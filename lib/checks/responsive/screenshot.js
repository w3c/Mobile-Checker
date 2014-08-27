var webdriver = require('selenium-webdriver');

var self = this;

exports.name = "meta-viewport";
exports.category = "responsive";
exports.check = function(checker, browser) {
    browser.takeScreenshot("public/"+ checker.id +".png");
};