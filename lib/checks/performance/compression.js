// detect uncompressed textual resources
exports.name = "compression";
exports.category = "performance";
exports.check = function (checker) {
    var mediaTypeParser = require('media-type');

    var compressableMediaTypes = ['text/html', 'application/json', 'image/svg+xml', 'text/css', 'text/javascript', 'application/javascript', 'text/plain', 'text/xml', 'application/xml'];
    var sink = checker.sink;
    if (checker.webAppData.har && checker.webAppData.har.log && checker.webAppData.har.log.entries) {
        var compressable = [];
        for (var i = 0; i < checker.webAppData.har.log.entries.length ; i++) {
            var entry = checker.webAppData.har.log.entries[i];
            var media = mediaTypeParser.fromString(findHeader(entry.response.headers, "Content-Type"));
            var mediaType = mediaTypeName(media);
            if (entry.response.status === 200 && compressableMediaTypes.indexOf(mediaType) !== -1) {
                console.log(mediaType, entry.response.status, compressableMediaTypes.indexOf(mediaType));
                var contentEncoding = findHeader(entry.response.headers, "Content-Encoding");
                var transferEncoding = findHeader(entry.response.headers, "Transfer-Encoding");
                var hasCompressedContentEncoding = (contentEncoding &&
                                              (contentEncoding.toLowerCase() === 'gzip'
                                               || contentEncoding.toLowerCase() === 'deflate')
                                             );
                var hasCompressedTransferEncoding = (transferEncoding &&
                                                     (transferEncoding.toLowerCase() === 'gzip' || transferEncoding.toLowerCase() === 'deflate')
                                                    );

                if (!hasCompressedContentEncoding && !hasCompressedTransferEncoding) {
                    compressable.push(entry.request.url);
                }
            }
        }
        if (compressable.length) {
	    sink.emit('warning', checker.l10n.message(checker.options.lang, this.category, this.name, "warning", {number: compressable.length, compressable: compressable.join(", ")}));
	    sink.emit('done');
        }

    }
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