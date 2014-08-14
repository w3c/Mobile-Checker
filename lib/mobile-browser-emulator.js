//Dependencies
var webdriver = require('selenium-webdriver')
,	fs = require('fs')
,	metaparser = require('./metaviewport-parser')
;
//system args :
//  - system.args[0] : phantomjs-script.js path
//  - system.args[1] : width 
//  - system.args[2] : height
//  - system.args[3] : url
//  - system.args[4] : user id

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
//  - debug
//  - ...
//example : console.log('resource_requested:stdout_key:'+msg);

function setViewPort (driver) {
	var metaTags = new Array();
	var metaNames = new Array();
	var viewports = new Array();
	var contentAttr;
	var renderingData;
	driver.findElements(webdriver.By.css('meta[name="viewport"]')).then(function(viewportDecls){
                // return all the metaviewports found
                webdriver.promise.map(
                    viewportDecls,
                    function (el) {  return el.getAttribute("content");}
                ).then(
                    function (contentAttrs) {
                        console.log('metaviewports:stdout_key:' + JSON.stringify(contentAttrs));
                        contentAttr = contentAttrs[contentAttrs.length - 1];
                    }
                );
	}).then(function(){
		if(contentAttr) {
			var viewportProps = metaparser.parseMetaViewPortContent(contentAttr);
			renderingData = metaparser.getRenderingDataFromViewport(viewportProps.validProperties, process.argv[3], process.argv[4], 4, 0.25 );
		} else {
        	renderingData = { zoom: null, width: process.argv[3]*3, height: process.argv[4]*3 };
    	        }
    	        driver.manage().window().setSize(renderingData.width, renderingData.height);
	});
}

var driver = new webdriver.Builder()
						  .withCapabilities(webdriver
						  .Capabilities.chrome())
						  .build();
var time = Date.now();
driver.get(process.argv[2]).then(function(){
	time = Date.now() - time;
	console.log('pageSpeed:stdout_key:' +time);
}).then(setViewPort(driver));
driver.findElement(webdriver.By.tagName('head')).then(function(head){
	head.getInnerHtml().then(function(innerHtml){
		console.log('head:stdout_key:'+innerHtml);
	});
});
driver.executeScript(function () {
	return document.documentElement.innerHTML; 
}).then(function(html){
	console.log('html:stdout_key:'+html);
});
driver.executeScript(function () {
	return document.documentElement.clientWidth; //document.width not supported by chrome driver or selenium.
}).then(function(width){
	console.log('documentWidth:stdout_key:'+width);
});
var tags = [
	"html"
,	"body"
,	"header"
,	"div"
,	"section"
,	"p"
,	"button"
,	"input"
,	"h1"
,	"h2"
,	"h3"
,	"h4"
,	"h5"
,	"h6"
,	
];
for(index in tags){
	driver.executeScript(function (tag) {
		return document.documentElement.getElementsByTagName(tag);
	}, tags[index]).then(function(p){
		for (index in p){
			p[index].getCssValue("font-size").then(function(ftSize){
				console.log("msg:stdout_key:"+ftSize);
			});
		}
	});
}
/*driver.executeScript(function () {
	return document.documentElement.getElementsByTagName('p');
}).then(function(p){
	for (index in p){
		p[index].getCssValue("font-size").then(function(ftSize){
			console.log("msg:stdout_key:"+ftSize);
		});
	}
});*/
driver.takeScreenshot().then(function(data){
    var base64Data = data.replace(/^data:image\/png;base64,/,"")
    fs.writeFile("public/screenshot.png", base64Data, 'base64', function(err) {
        if(err) console.log(err);
    });
});
