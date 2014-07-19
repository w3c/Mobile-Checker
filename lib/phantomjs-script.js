//system args :
//	- system.args[0] : phantomjs-script.js path
//	- system.args[1] : width 
//	- system.args[2] : height
//	- system.args[3] : url
//	- system.args[4] : ip of user (to save screenshot on server)

//send data to node application with console.log('key_name:stdout_key:'+data)
//keys_names (examples) :
//  - resource_requested
//  - resource_received
//  - start
//  - end
//  - ok
//  - warning
//  - err 
//  - time
//  - screenshot
//  - html
//  - css
//  - script
//  - ...
//example : console.log('resource_requested:stdout_key:'+msg);
var page = require('webpage').create()
,	system = require('system')
,       metaparser = require('./metaviewport-parser')
;


//this function is load each time a resource is requested
page.onResourceRequested = function(requestData, networkRequest) {
    console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData.url));
};
//this function is load each time a resource is received
page.onResourceReceived = function(response) { 
    console.log(' received : ' + JSON.stringify(response.url));
    console.log('console:stdout_key:HTTP GET (200) ' + JSON.stringify(response.url));
};
//this function is load each time a message was written in sand-boxed console of the evaluate function
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

function getCssResources (page) {
    page.evaluate(function() {
        var stylesheets = document.styleSheets;
        for (var i = 0; i < stylesheets.length; i++){
            for (var j = 0; j < stylesheets[i].cssRules.length; j++) {
                console.log('css:stdout_key:' + i + stylesheets[i].cssRules[j].cssText);
            }
        }
        return document;
    });
}
function getHtmlResources (page) {
    console.log('html:stdout_key:' + page.content);
}
//this function have to send DOM (document)
//don't work with success for the moment.
function getDOM (page) {
    var dom = page.evaluate(function() {
        return document;
    });
    console.log('dom:stdout_key:' + JSON.stringify(dom));
}
function getScreenshot (page) {
    // Obtain viewport from DOM
    var contentAttr = page.evaluate(function () {
        var viewports = document.querySelectorAll("meta[name=viewport]");
        // the last one is the one used for rendering
        return viewports[viewports.length - 1].getAttribute("content");
    });
    // parse it
    var viewportProperties = metaparser.parseMetaViewPortContent(contentAttr).validProperties;
    // adjust screenshot parameters accordingly
    if (typeof viewportProperties["width"] === 'number') {
        var origWidth = page.viewportSize.width;
        page.viewportSize.width = viewportProperties["width"];
        page.viewportSize.height = page.viewportSize.height * page.viewportSize.width / origWidth ;
        page.zoomFactor = origWidth / viewportProperties["width"];
        page.clipRect = {top: 0, left: 0, width: page.viewportSize.width, height: page.viewportSize.height};
    }
    page.render('./public/screenshots/' + system.args[4] + '.png', {format: 'png', quality: '100'});
    console.log('screenshot:stdout_key:' + system.args[4] + '.png');
}

function getDocumentWidth (page) {
    page.evaluate(function () {
        console.log('doc-width:stdout_key:' +document.width);
    });
}

page.viewportSize = { width: system.args[1], height: system.args[2] };
page.clipRect = { top: 0, left: 0, width: system.args[1], height: system.args[2] };

var time = Date.now();
page.open(system.args[3], function (status) {
  	if (status !== 'success') {
        console.log('FAIL to load the address');
  	} else {
    	time = Date.now() - time;
    	console.log('time:stdout_key:' + time);
  	}
    getScreenshot(page);
    getCssResources(page);
    getHtmlResources(page);
    getDocumentWidth(page);
    phantom.exit();
});

