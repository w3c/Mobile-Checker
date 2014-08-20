//check width of document (DOM)
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
exports.name = "fonts-size";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	var tagFonts = checker.webAppData.tagFonts;
	var buffer;
	var ftSize;
	var data = {
		tagName : new Array()
	,	fontSize : new Array()
	,	location : new Array()
	};
	for (index in tagFonts.fontSize){
		buffer = tagFonts.fontSize[index].split('px');
		ftSize = parseFloat(buffer[0]);
		if (ftSize < 16) {
			data.tagName.push(tagFonts.tagName);
			data.fontSize.push(ftSize);
			data.location.push(tagFonts.location);
			console.log("small font");
		}
		//Font size automatically convert in px so we don't need to convert for the moment.
		/*switch(tagFonts.fontSize[index]){
			case 'xx-small':
			break;
			case 'x-small':
			break;
			case 'small':
			break;
			case 'medium':
			break;
			case 'large':
			break;
			case 'x-large':
			break;
			case 'xx-large':
			break;
			default:
				if(tagFonts.fontSize[index].indexOf('px'))
					ftSize = tagFonts.fontSize[index].split('px');
				else if (tagFonts.fontSize[index].indexOf('em'))
					ftSize = tagFonts.fontSize[index].split('em');
				else if (tagFonts.fontSize[index].indexOf('ex'))
					ftSize = tagFonts.fontSize[index].split('ex');
				else if (tagFonts.fontSize[index].indexOf('%'))
					ftSize = tagFonts.fontSize[index].split('%');
			break;
		}*/
	}
	if(data.tagName.length > 0){
		checker.report(sink, "too-small-font-size", this.name, this.category, data);
	}
	else{
		sink.emit('done');
	}
}