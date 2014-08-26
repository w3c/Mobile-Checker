
var webdriver = require('selenium-webdriver');

var self = this;

exports.name = "fonts-size";
exports.category = "responsive";



exports.check = function (checker, browser) {
	var sink = checker.sink;
	browser.do ( function (driver) {
        return driver.executeScript(function (args) {
        	for (index in args.tags) {
        		args.components.push(document.documentElement.getElementsByTagName(args.tags[index]));
        	}
        	return args.components;
        },{
        	tags : ["p", "button", "input", "h1", "h2", "h3", "h4", "h5", "h6", "li", "a"]
        ,	components : new Array ()
        }).then(function (data) {
        	var fonts = {
				tag : new Array()
			,	size : new Array()
			,	location : new Array()
			,	content : new Array()
			};
        	for(var i in data) {
        		for (var j in data[i]) {
        			data[i][j].getTagName().then(function(name){
        				fonts.tag.push(name);
        			});
        			data[i][j].getCssValue("font-size").then(function(size){
        				fonts.size.push(parseFloat(size.replace("px", "")));
        			});
        			data[i][j].getLocation().then(function(location){
        				fonts.location.push(location);
        			});
        			data[i][j].getText().then(function(text){
        				fonts.content.push(text);
        			});
        		}
        	}
        	return fonts;
        }).then(function (fonts){
        	var smallFontsDetected = {
				tag : new Array()
			,	size : new Array()
			,	location : new Array()
			,	content : new Array()
			};
			if(checker.resume["meta-viewport"]){
				//TODO : manage with wrong meta-viewport declaration
			}else{
				for(index in fonts.size) {
        			if(fonts.size[index] < 12 && fonts.content[index] != '') {
        				smallFontsDetected.tag.push(fonts.tag[index]);
        				smallFontsDetected.size.push(fonts.size[index]);
        				smallFontsDetected.location.push(fonts.location[index]);
        				if(fonts.content[index].length > 40){
        					smallFontsDetected.content.push(fonts.content[index].substring(0,39) + '...');
        				}else{
        					smallFontsDetected.content.push(fonts.content[index]);
        				}
        			}
        		}	
			}
        	return smallFontsDetected;
        }).then(function (smallFontsDetected){
        	if(smallFontsDetected.size.length > 0){
        		checker.report(sink, "too-small-font-size", self.name, self.category, smallFontsDetected);
        		return;
        	}else{
        		checker.report(sink, "ok", self.name, self.category);
        	}
        });
    });
}
