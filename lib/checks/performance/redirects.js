/**
 * @module redirects
 * @requires url
 * @requires utils
 */
// detect redirects
exports.name = "redirects";
exports.category = "performance";

var urlparse = require("url");

var utils = rootRequire("lib/checks/utils");

var self = this;

exports.check = function(checker, browser) {
    var redirectCodes = [301, 302, 303, 307];
    browser.on('har', function(har, done) {
        if (har && har.log && har.log.entries) {
            var redirects = [];
            var mainUrl = har.log.entries[0].request.url;
            // we ignore the first entry (the page itself)
            for (var i = 1; i < har.log.entries.length; i++) {
                var entry = har.log.entries[i];
                if (redirectCodes.indexOf(entry.response.status) !== -1) {
                    var redirectURL = entry.response.redirectURL;

                    // browsermob-proxy seems to fail to resolve
                    // scheme-relative url
                    if (!redirectURL) {
                        redirectURL = urlparse.resolve(entry.request.url,
                            utils.findHeader(entry.response.headers,
                                "location"));
                    }

                    redirects.push({
                        from: entry.request.url,
                        to: redirectURL,
                        wastedBW: entry.request.bodySize + entry.request
                            .headersSize + entry.response.headersSize +
                            entry.response.bodySize,
                        latency: entry.time
                    });
                }
            }
            redirects.sort(function(a, b) {
                return utils.localUrlCompare(mainUrl)(a.from, b.from);
            });
            if (redirects.length) {
                var totalWastedBW = redirects.reduce(function(prev, r) {
                    return prev + r.wastedBW;
                }, 0);
                var totalLatency = redirects.reduce(function(prev, r) {
                    return prev + r.latency;
                }, 0);

                checker.report("redirects-encountered", self.name,
                    self.category, "warning", {
                        number: redirects.length,
                        redirects: redirects,
                        totalWastedBW: totalWastedBW,
                        totalLatency: totalLatency
                    });
            } else {
                checker.sink.emit("done");
            }

        }
        done();
    });
};
