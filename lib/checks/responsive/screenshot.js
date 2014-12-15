/**
 * @module screenshot
 * @requires selenium-webdriver
 */
var webdriver = require('selenium-webdriver');

var self = this;

exports.name = "meta-viewport";
exports.category = "responsive";
exports.check = function(checker, browser) {
    browser.takeScreenshot(checker.options.SCREENSHOTS_DIR + checker.id + ".png");
};