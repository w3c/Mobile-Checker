//viewport influence skill-responsive of mobile website
//check if the viewport is correctly declared
var metaparser = rootRequire('lib/metaviewport-parser');

var wellknownMetaviewportProperties = ["target-densitydpi"];

exports.name = "meta-viewport";
exports.category = "responsive";
exports.check = function (checker) {
    var sink = checker.sink;
    var metaviewports = checker.webAppData.metaviewports;
    if (metaviewports  === undefined || metaviewports.length === 0) {
	sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "0"));
	sink.emit('done');
        return;
    }
    if (metaviewports.length > 1) {
	sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "2"));
	sink.emit('done');
    }
    // the last one is the one used
    var actualViewport = metaviewports[metaviewports.length - 1];
    var parsedViewport = metaparser.parseMetaViewPortContent(actualViewport);
    if (!parsedViewport.validProperties["width"] && !parsedViewport.validProperties["initial-scale"]) {
	sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "3"));
        sink.emit('done');
    } else {
        if (parsedViewport.validProperties["width"]) {
            if (parsedViewport.invalidValues["width"]) {
            	sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "5"));
            	sink.emit('done');
            } else if (parsedViewport.validProperties["width"] === "device-width" || parsedViewport.validProperties["width"] === "device-height") {
                sink.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
            	sink.emit('done');
            } else {
            	sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "7"));
            	sink.emit('done');
            }
        }
        if (parsedViewport.validProperties["initial-scale"]) {
            if (parsedViewport.invalidValues["initial-scale"]) {
            	sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "6"));
            	sink.emit('done');
            } else {
                sink.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
            	sink.emit('done');
            }
        }
        if (parsedViewport.validProperties["user-scalable"] === "no") {
	    sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "10"));
            sink.emit('done');
        }
        var unknownProperties = Object.keys(parsedViewport.unknownProperties);
        var nonstandardProperties = unknownProperties.filter(
            function (i) {
                return wellknownMetaviewportProperties.indexOf(i) !== -1;
            }
        );
        var unrecognizedProperties = unknownProperties.filter(
            function (i) {
                return wellknownMetaviewportProperties.indexOf(i) === -1;
            }
        );
        if (nonstandardProperties.length) {
	    sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "9"));
            sink.emit('done');
        }
        if (unrecognizedProperties.length) {
	    sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "8"));
            sink.emit('done');
        }
    }
}

