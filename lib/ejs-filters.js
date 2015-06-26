exports.loadFilters = function(ejs) {

    // provide a shortened readable version of a URL
    ejs.filters.ellipsizeUrl = function(url, maxsize) {
        maxsize = maxsize || 40;
        if (url.length < maxsize) {
            // for consistency with other ellipsized URLs
            return url.replace(/^http:\/\//, '');
        }

        var urlparse = require("url");
        var urlObj = urlparse.parse(url);
        urlObj.port = undefined;
        urlObj.host = urlObj.hostname;
        urlObj.auth = undefined;
        urlObj.hash = undefined;
        var path = urlObj.path;
        urlObj.pathname = undefined;
        urlObj.search = undefined;
        urlObj.query = undefined;
        var urlStart = urlparse.format(urlObj);
        urlStart = urlStart.replace(/^http:\/\//, '');
        return urlStart + path.slice(0, maxsize - urlStart.length - 1) + "…";
    };

    ejs.filters.number = function(number) {
        if (number !== null) {
            return number.toLocaleString();
        }
        return null;
    };

    ejs.filters.byteSize = function(number) {
        if (number > 1024) {
            var kb = Math.round(10 * number / 1024) / 10;
            return kb.toLocaleString() + " kB";
        }
        return number.toLocaleString() + " B";
    };

};
