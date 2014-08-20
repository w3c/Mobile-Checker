//viewport influence skill-responsive of mobile website
//check if the viewport is correctly declared
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var metaparser = rootRequire('lib/metaviewport-parser');

var wellknownMetaviewportProperties = ["target-densitydpi"];

exports.name = "meta-viewport";
exports.category = "responsive";
exports.check = function (checker) {
    var sink = checker.sink;
    var metaviewports = checker.webAppData.metaviewports;
    if (metaviewports  === undefined || metaviewports.length === 0) {
        sendIssue(sink, "no-viewport-declared", this.name, this.category);
        return;
    }
    if (metaviewports.length > 1) {
	sendIssue(sink, "several-viewports-declared", this.name, this.category);
    }
    // the last one is the one used
    var actualViewport = metaviewports[metaviewports.length - 1];
    var parsedViewport = metaparser.parseMetaViewPortContent(actualViewport);
    for (var prop in parsedViewport.invalidValues) {
        sendIssue(sink, "invalid-viewport-value", this.name, this.category, { property: prop, value: parsedViewport.invalidValues[prop], validValues: metaparser.expectedValues[prop].join(", ")});
    }
    if (!parsedViewport.validProperties["width"] && !parsedViewport.validProperties["initial-scale"]) {
        sendIssue(sink, "content-viewport-missed", this.name, this.category);
    } else {
        if (parsedViewport.validProperties["width"]) {
           if (parsedViewport.validProperties["width"] === "device-width" || parsedViewport.validProperties["width"] === "device-height") {
                //OK
            	sink.emit('done');
            } else {
                sendIssue(sink, "hardcoded-viewport-width", this.name, this.category);
            }
        }
        if (parsedViewport.validProperties["initial-scale"]) {
            //OK
            sink.emit('done');
        }
        if (parsedViewport.validProperties["user-scalable"] === "no") {
            sendIssue(sink, "users-are-prevented-to-zoom", this.name, this.category);
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
            sendIssue(sink, "non-standard-viewport-parameter-declared", this.name, this.category);
        }
        if (unrecognizedProperties.length) {
            sendIssue(sink, "unknow-viewport-parameter-declared", this.name, this.category);
        }
    }
}

function sendIssue(sink, key, name, category, data) {
    var str = fs.readFileSync(path.join(__dirname, '/../../issues/' +category+ '/' +name+ '/' +key+ '.ejs'), 'utf8');
    if(!data) var data = {};
    sink.emit('err', ejs.render(str, data));
    sink.emit('done');
}

