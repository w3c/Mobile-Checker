// detect redirects
exports.name = "redirects";
exports.category = "performance";

var urlparse = require("url");

var self = this;

exports.check = function (checker, browser) {
    var redirectCodes = [301, 302, 303, 307];
    var sink = checker.sink;
    browser.on('har', function (har) {
        if (har && har.log && har.log.entries) {
            var redirects = [];
            // we ignore the first entry (the page itself)
            for (var i = 1; i < har.log.entries.length ; i++) {
                var entry = har.log.entries[i];
                if (redirectCodes.indexOf(entry.response.status) !== -1) {
                    var redirectURL = entry.response.redirectURL;

                    // browsermob-proxy seems to fail to resolve
                    // scheme-relative url
                    if (!redirectURL) {
                        redirectURL = urlparse.resolve(entry.request.url, findHeader(entry.response.headers, "location")) ;
                    }

                    redirects.push({from: entry.request.url,
                                    to: redirectURL,
                                    wastedBW: entry.request.bodySize + entry.request.headersSize + entry.response.headersSize + entry.response.bodySize,
                                    latency: entry.time
                                   });
                }
            }
            if (redirects.length) {
                var totalWastedBW = redirects.reduce(function (prev, r) {
                    return prev + r.wastedBW;
                }, 0);
                var totalLatency = redirects.reduce(function (prev, r) {
                    return prev + r.latency;
                }, 0);

                checker.report(sink, "redirects-encountered", self.name, self.category, {number: redirects.length, redirects: redirects, totalWastedBW: totalWastedBW, totalLatency: totalLatency});
            }

        }
    });
}

// TODO: dup from compression.js
function findHeader(headers, name, last) {
    var matchingHeaders = headers.filter(function (i) { return i["name"].toLowerCase() === name.toLowerCase(); });
    if (!matchingHeaders.length) {
        return;
    }
    if (last) {
        return matchingHeaders[matchingHeaders.length - 1].value;
    }
    return matchingHeaders[0].value;
}
