function run(url, browserWidth, browserHeight, display, cb) {

//Dependencies
var webdriver = require('selenium-webdriver')
,	fs = require('fs')
,	metaparser = require('./metaviewport-parser')
,       chromedriver = require('chromedriver');
;


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
                        cb('metaviewports', contentAttrs);
                        contentAttr = contentAttrs[contentAttrs.length - 1];
                    }
                );
	}).then(function(){
		if(contentAttr) {
			var viewportProps = metaparser.parseMetaViewPortContent(contentAttr);
			renderingData = metaparser.getRenderingDataFromViewport(viewportProps.validProperties, browserWidth, browserHeight, 4, 0.25 );
		} else {
        	renderingData = { zoom: null, width: browserWidth*3, height: browserHeight*3 };
    	        }
    	        driver.manage().window().setSize(renderingData.width, renderingData.height);
	});
}

var chrome = require("selenium-webdriver/chrome");

var capabilities = webdriver.Capabilities.chrome();
var options = new chrome.Options();
capabilities.merge(options.toCapabilities());

var chromeservicebuilder = new chrome.ServiceBuilder(chromedriver.path).withEnvironment({DISPLAY:':' + display}).build();
var driver = chrome.createDriver(options, chromeservicebuilder);

var time = Date.now();
driver.get(url).then(function(){
	time = Date.now() - time;
	cb('pageSpeed', time);
}).then(setViewPort(driver));
driver.findElement(webdriver.By.tagName('head')).then(function(head){
	head.getInnerHtml().then(function(innerHtml){
		cb('head', innerHtml);
	});
});
driver.executeScript(function () {
	return document.documentElement.innerHTML; 
}).then(function(html){
	cb('html', html);
});
driver.executeScript(function () {
	return document.documentElement.clientWidth; //document.width not supported by chrome driver or selenium.
}).then(function(width){
	cb('documentWidth', width);
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
var fontSizes = new Array();
for(var index in tags){
	driver.executeScript(function (tag) {
		return document.documentElement.getElementsByTagName(tag);
	}, tags[index]).then(function(tag){
		
		for (var index in tag){
			tag[index].getCssValue("font-size").then(function(ftSize){
				console.log("msg:stdout_key:"+ftSize);
				fontSizes.push(ftSize);
			});
		}
		
	}).then(function(){
		cb('font-size', fontSizes);
	});
}
/*driver.executeScript(function () {
	return document.documentElement.getElementsByTagName('p');
}).then(function(p){
	for (index in p){
		p[index].getCssValue("font-size").then(function(ftSize){
			cb("msg:stdout_key:"+ftSize);
		});
	}
});*/
driver.takeScreenshot().then(function(data){
    var base64Data = data.replace(/^data:image\/png;base64,/,"")
    fs.writeFile("public/screenshot.png", base64Data, 'base64', function(err) {
        if(err) cb('error', err);
    });
}).then(function() {cb('close');});
}

exports.run = run;
