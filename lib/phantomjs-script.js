//system args :
//	- system.args[0] : phantomjs-script.js path
//	- system.args[1] : width 
//	- system.args[2] : height
//	- system.args[3] : url
//	- system.args[4] : ip of user (to save screenshot on server)

//send data to node application with console.log('key_name:stdout_key:'+data)
//keys_names :
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
,	data = {
		speed : null
    ,   count : 0
	,	resource : []
	,	screenshot : './public/screenshots/' + system.args[4] + '.png' //screenshot name
	,	dom : {}
	}
;
page.onResourceRequested = function(requestData, networkRequest) {
    console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData.url));
};
page.onResourceReceived = function(response) { 
    console.log(' received : ' + JSON.stringify(response.url));
};
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
    page.evaluate(function() {
        console.log('dom:stdout_key:' + document);
        return document;
    });
}
function getScreenshot (page) {
    page.render('./public/screenshots/' + system.args[4] + '.png', {format: 'png', quality: '100'});
    console.log('screenshot:stdout_key:' + system.args[4] + '.png');
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
    //getDOM(page); -> don't work
    phantom.exit();
});

