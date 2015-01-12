/**
 * @module fonts-size
 */

var self = this;

exports.name = "fonts-size";
exports.category = "responsive";

exports.check = function(checker, browser) {
    browser.do(function(driver) {
        return driver.executeScript(function(args) {
            for (var index in args.tags) {
                args.components.push(document.documentElement.getElementsByTagName(
                    args.tags[index]));
            }
            return args.components;
        }, {
            tags: ["p", "button", "input", "h1", "h2", "h3", "h4",
                "h5", "h6", "li", "a"
            ],
            components: []
        }).then(function(data) {
            var fonts = {
                tag: [],
                size: [],
                location: [],
                content: []
            };
            var addTag = function(name) {
                fonts.tag.push(name);
            };
            var addSize = function(size) {
                fonts.size.push(parseFloat(size.replace("px", "")));
            };
            var addLocation = function(location) {
                fonts.location.push(location);
            };
            var addContent = function(text) {
                fonts.content.push(text);
            };
            for (var i in data) {
                for (var j in data[i]) {
                    data[i][j].getTagName().then(addTag);
                    data[i][j].getCssValue("font-size").then(addSize);
                    data[i][j].getLocation().then(addLocation);
                    data[i][j].getText().then(addContent);
                }
            }
            return fonts;
        }).then(function(fonts) {

            var smallFontsDetected = {
                tag: [],
                size: [],
                location: [],
                content: []
            };
            if (checker.resume["meta-viewport"]) {
                //TODO : manage with wrong meta-viewport declaration
            } else {
                for (var index in fonts.size) {
                    if (fonts.size[index] < 12 && fonts.content[
                        index] !== '') {
                        smallFontsDetected.tag.push(fonts.tag[index]);
                        smallFontsDetected.size.push(fonts.size[
                            index]);
                        smallFontsDetected.location.push(fonts.location[
                            index]);
                        if (fonts.content[index].length > 40) {
                            smallFontsDetected.content.push(fonts.content[
                                index].substring(0, 39) + '...');
                        } else {
                            smallFontsDetected.content.push(fonts.content[
                                index]);
                        }
                    }
                }
            }
            return smallFontsDetected;
        }).then(function(smallFontsDetected) {
            if (smallFontsDetected.size.length > 0) {
                checker.report("too-small-font-size", self.name,
                    self.category, "warning",smallFontsDetected);
                return;
            } else {
                checker.report("ok", self.name, self.category);
            }
        });
    });
};