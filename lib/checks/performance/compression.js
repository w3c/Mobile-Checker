// detect uncompressed textual resources
exports.name = "compression";
exports.category = "performance";


var self = this;

exports.check = function (checker, browser) {
    var calculatingCompression = 0;
    var calculatedCompression = 0;
    var compressable = [];

    function reportCompressionSaving(err, compressableItem) {
        calculatedCompression ++;
        // Only report compression savings > 1000 bytes
        if (compressableItem.diff > 1000) {
            compressable.push(compressableItem);
        }
        if (calculatedCompression === calculatingCompression) {
            if (compressable.length) {
                compressable.sort(function (a, b) {
                    return b.diff - a.diff;
                });
                var saving = compressable.reduce(function (prev, a) {
                    return prev + a.diff;
                }, 0);
                checker.report(sink, "resources-could-be-compressed", self.name, self.category, {number: compressable.length, compressable: compressable, saving: saving});
            }
        }
    }


    var sink = checker.sink;
    browser.on('har', function (har) {
        if (har && har.log && har.log.entries) {
            for (var i = 0; i < har.log.entries.length ; i++) {
                var entry = har.log.entries[i];
                if (isCompressableResponse(entry.response)
                    && !isCompressedResponse(entry.response)
                    && shouldBeCompressedResponse(entry.response)) {
                    calculatingCompression++;
                    calculateCompressionSaving(entry.request.url, entry.response, reportCompressionSaving);
                }
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
    return response.bodySize > 512;
}

function calculateCompressionSaving(url, response, cb) {
    var zlib = require("zlib");
    var gzipped = zlib.gzip(response.content.text, function (err, buffer) {
        cb(err, {url: url, diff: response.bodySize - buffer.length});
    });
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