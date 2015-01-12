/**
 * @module touchscreen-target
 */

var self = this;

exports.name = "touchscreen-target";
exports.category = "interactions";

exports.check = function(checker, browser) {
    browser.do(function(driver) {
        return driver.executeScript(function(args) {
            for (var index in args.tags) {
                args.components.push(document.documentElement.getElementsByTagName(
                    args.tags[index]));
            }
            return args.components;
        }, {
            tags: ["button", "a", "input"],
            components: []
        }).then(function(data) {
            var targets = {
                tag: [],
                size: [],
                location: [],
                outerHtml: []
            };
            var addTo = function(target) {
                return function(x) {
                    targets[target].push(x);
                };
            };
            var addTag = addTo("tag");
            var addSize = addTo("size");
            var addLocation = addTo("location");
            var addOuterHtml = addTo("outerHtml");
            for (var i in data) {
                for (var j in data[i]) {
                    data[i][j].getTagName().then(addTag);
                    data[i][j].getSize().then(addSize);
                    data[i][j].getLocation().then(addLocation);
                    data[i][j].getOuterHtml().then(addOuterHtml);
                }
            }
            return targets;
        }).then(function(targets) {
            var smallTargetsDetected = {
                tag: [],
                size: {
                    width: [],
                    height: []
                },
                location: [],
                outerHtml: []
            };
            if (checker.resume["meta-viewport"]) {

            } else {
                for (var index in targets.size) {
                    if ((targets.size[index].width < 48 || targets.size[
                            index].height < 48) && targets.size[
                            index].width !== 0 && targets.size[index]
                        .height !== 0) {
                        smallTargetsDetected.tag.push(targets.tag[
                            index]);
                        smallTargetsDetected.size.width.push(
                            targets.size[index].width);
                        smallTargetsDetected.size.height.push(
                            targets.size[index].height);
                        smallTargetsDetected.location.push(targets.location[
                            index]);
                        if (targets.outerHtml[index].length > 40) {
                            smallTargetsDetected.outerHtml.push(
                                targets.outerHtml[index].substring(
                                    0, 39) + '...');
                        } else {
                            smallTargetsDetected.outerHtml.push(
                                targets.outerHtml[index]);
                        }
                    }
                }
            }
            return smallTargetsDetected;
        }).then(function(smallTargetsDetected) {
            if (smallTargetsDetected.size.width.length > 0) {
                checker.report("too-small-touchscreen-target",
                    self.name, self.category, "warning", smallTargetsDetected);
                return;
            } else {
                checker.report("ok", self.name, self.category);
            }
        });
    });
};