// detect uncompressed textual resources
exports.name = "compression";
exports.category = "performance";

var self = this;
exports.check = function (checker, browser) {
    var sink = checker.sink;
    browser.on('har', function (har) {
        if (har && har.log && har.log.entries) {
            var compressable = [];
            for (var i = 0; i < har.log.entries.length ; i++) {
                var entry = har.log.entries[i];
                if (isCompressableResponse(entry.response)
                    && !isCompressedResponse(entry.response)
                    && shouldBeCompressedResponse(entry.response)) {
                    compressable.push(entry.request.url);
                }
            }
            if (compressable.length) {
                checker.report(sink, "resources-could-be-compressed", self.name, self.category, {number: compressable.length, compressable: compressable});
            }

        }
    });
}

function isCompressableResponse(response) {
    var mediaTypeParser = require('media-type');
    var compressableMediaTypes = ['text/html', 'application/json',
                                  'image/svg+xml', 'text/css',
                                  'text/javascript', 'application/javascript',
                                  'text/plain', 'text/xml', 'application/xml'];

    var media = mediaTypeParser.fromString(findHeader(response.headers, "Content-Type"));
    var mediaType = mediaTypeName(media);
    return (response.status === 200 && compressableMediaTypes.indexOf(mediaType) !== -1);
}

function isCompressedResponse(response) {
    var contentEncoding = findHeader(response.headers, "Content-Encoding");
    var transferEncoding = findHeader(response.headers, "Transfer-Encoding");
    var hasCompressedContentEncoding = (contentEncoding &&
                                        (contentEncoding.toLowerCase() === 'gzip'
                                         || contentEncoding.toLowerCase() === 'deflate')
                                                       );
    var hasCompressedTransferEncoding = (transferEncoding &&
                                         (transferEncoding.toLowerCase() === 'gzip' || transferEncoding.toLowerCase() === 'deflate')
                                        );
    return hasCompressedTransferEncoding || hasCompressedContentEncoding;
}

function shouldBeCompressedResponse(response) {
    // TODO: instead, should calculate how much compression wins us
    return response.bodySize > 512;
}

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

function mediaTypeName(media) {
    if (media.isValid()) {
        return media.type + '/' + media.subtype + (media.hasSuffix() ? '+' + media.suffix : '');
    }
}