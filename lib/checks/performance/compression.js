/**
 * @module compression
 * @requires utils
 */
// detect uncompressed textual resources
exports.name = "compression";
exports.category = "performance";

var utils = rootRequire("lib/checks/utils");

var self = this;

exports.check = function(checker, browser) {
    var calculatingCompression = 0;
    var calculatedCompression = 0;
    var compressable = [];

    browser.on('har', function(har, done) {
        function reportCompressionSaving(err, compressableItem) {
            calculatedCompression++;
            // Only report compression savings > 1000 bytes
            if (compressableItem.diff > 1000) {
                compressable.push(compressableItem);
            }
            if (calculatedCompression === calculatingCompression) {
                if (compressable.length) {
                    compressable.sort(function(a, b) {
                        return b.diff - a.diff;
                    });
                    var saving = compressable.reduce(function(prev, a) {
                        return prev + a.diff;
                    }, 0);
                    checker.report("resources-could-be-compressed", self.name,
                                   self.category, "warning", {
                                       number: compressable.length,
                                       compressable: compressable,
                                       saving: saving
                                   });
                }
            }
            done();
        }

        if (har && har.log && har.log.entries) {
            for (var i = 0; i < har.log.entries.length; i++) {
                var entry = har.log.entries[i];
                if (isCompressableResponse(entry.response) && !
                    isCompressedResponse(entry.response) &&
                    shouldBeCompressedResponse(entry.response)) {
                    calculatingCompression++;
                    calculateCompressionSaving(entry.request.url, entry.response,
                        reportCompressionSaving);
                }
            }

        }

        if (calculatingCompression === 0) {
            done();
        }
    });
};


function isCompressableResponse(response) {
    var compressableMediaTypes = ['text/html', 'application/json',
        'image/svg+xml', 'text/css',
        'text/javascript', 'application/javascript',
        'text/plain', 'text/xml', 'application/xml'
    ];

    var mediaType = utils.mediaTypeName(response.content.mimeType);
    return (response.status === 200 && compressableMediaTypes.indexOf(mediaType) !==
        -1);
}

function isCompressedResponse(response) {
    var contentEncoding = utils.findHeader(response.headers, "Content-Encoding");
    var transferEncoding = utils.findHeader(response.headers,
        "Transfer-Encoding");
    var hasCompressedContentEncoding = (contentEncoding &&
        (contentEncoding.toLowerCase() === 'gzip' || contentEncoding.toLowerCase() ===
            'deflate')
    );
    var hasCompressedTransferEncoding = (transferEncoding &&
        (transferEncoding.toLowerCase() === 'gzip' || transferEncoding.toLowerCase() ===
            'deflate')
    );
    return hasCompressedTransferEncoding || hasCompressedContentEncoding;
}

function shouldBeCompressedResponse(response) {
    return response.bodySize > 512;
}

function calculateCompressionSaving(url, response, cb) {
    var zlib = require("zlib");
    var gzipped = zlib.gzip(response.content.text, function(err, buffer) {
        cb(err, {
            url: url,
            origSize: response.bodySize,
            diff: response.bodySize - buffer.length
        });
    });
}
