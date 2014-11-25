var domainNameParser = require("effective-domain-name-parser");
var urlparse = require("url");
var mediaTypeParser = require('media-type');

exports.localUrlCompare = function(mainUrl) {
    var mainDNS = domainNameParser.parse(urlparse.parse(mainUrl).hostname);
    var mainName = mainDNS.sld + '.' + mainDNS.tld;

    return function(a, b) {
        var comparison = compareDomainName(urlparse.parse(a).hostname,
            urlparse.parse(b).hostname);
        if (comparison === 0) {
            return cmp(a, b);
        }
        return comparison;
    };

    // sort by main domain name (e.g. w3.org)
    // put first the domain of the original request
    function compareDomainName(a, b) {
        var aDNS = domainNameParser.parse(a);
        var bDNS = domainNameParser.parse(b);
        var aName = aDNS.sld + "." + aDNS.tld;
        var bName = bDNS.sld + "." + bDNS.tld;
        if (aName === bName) {
            return 0;
        }
        if (aName === mainName) {
            return -1;
        }
        if (bName === mainName) {
            return 1;
        }
        return cmp(aName, bName);
    }

    function cmp(a, b) {
        var aStr = a.toString();
        var bStr = b.toString();
        return (aStr === bStr ? 0 : (aStr < bStr ? -1 : 1));
    }
};

exports.findHeader = function(headers, name, last) {
    var matchingHeaders = headers.filter(function(i) {
        return i.name.toLowerCase() === name.toLowerCase();
    });
    if (!matchingHeaders.length) {
        return;
    }
    if (last) {
        return matchingHeaders[matchingHeaders.length - 1].value;
    }
    return matchingHeaders[0].value;
};

exports.mediaTypeName = function(mime) {
    var media = mediaTypeParser.fromString(mime);
    if (media.isValid()) {
        return media.type + '/' + media.subtype + (media.hasSuffix() ? '+' +
            media.suffix : '');
    }
};
