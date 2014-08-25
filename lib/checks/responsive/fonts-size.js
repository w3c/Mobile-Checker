//check width of document (DOM)
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
        	tags : ["header", "div", "section", "p", "button", "input", "h1", "h2", "h3", "h4", "h5", "h6"]
        ,	components : new Array ()
        }).then(function (data) {
        	var fonts = {
				tagName : new Array()
			,	fontSize : new Array()
			,	location : new Array()
			};
        	for(var i in data) {
        		for (var j in data[i]) {
        			data[i][j].getTagName().then(function(name){
        				fonts.tagName.push(name);
        			});
        			data[i][j].getCssValue("font-size").then(function(size){
        				fonts.fontSize.push(size);
        			});
        			data[i][j].getLocation().then(function(location){
        				fonts.fontSize.push(location);
        			});
        		}
        	}
        	return fonts;
        }).then(function(fonts){

        });
    });

    /*for(var index in tags){
driver.executeScript(function (tag) {
return document.documentElement.getElementsByTagName(tag);
- }, tags[index]).then(function(tag){
-
+ }, tags[index]).then(function(tag, index){
for (var index in tag){
tag[index].getCssValue("font-size").then(function(ftSize){
- console.log("msg:stdout_key:"+ftSize);
- fontSizes.push(ftSize);
+ tagFontSize.fontSize.push(ftSize);
+ });
+ tag[index].getTagName().then(function(tagName){
+ tagFontSize.tagName.push(tagName);
+ });
+ tag[index].getLocation().then(function(location){
+ tagFontSize.location.push(location);
});
}
-
}).then(function(){
- cb('font-size', fontSizes);
+ cb('tagFonts', tagFontSize);
});
}



	for (index in tagFonts.fontSize){
		buffer = tagFonts.fontSize[index].split('px');
		ftSize = parseFloat(buffer[0]);
		if (ftSize < 16) {
			data.tagName.push(tagFonts.tagName);
			data.fontSize.push(ftSize);
			data.location.push(tagFonts.location);
		}
	}
	if(data.tagName.length > 0){
		checker.report(sink, "too-small-font-size", this.name, this.category, data);
	}
	else{
		sink.emit('done');
	}*/
}