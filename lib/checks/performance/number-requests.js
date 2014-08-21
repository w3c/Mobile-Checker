//check number of requests
exports.name = "number-requests";
exports.category = "performance";
exports.check = function (checker) {
    var sink = checker.sink;
    if (checker.webAppData.har && checker.webAppData.har.log && checker.webAppData.har.log.entries) {
    checker.report(sink, "info-number-requests", this.name, this.category, {number: checker.webAppData.har.log.entries.length});
    }
}