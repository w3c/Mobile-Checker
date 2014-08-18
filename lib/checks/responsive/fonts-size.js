//check width of document (DOM)
exports.name = "fonts-size";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	var tagFonts = checker.webAppData.tagFonts;
	var buffer;
	var ftSize;
	var data = new Array();
	for (index in tagFonts.fontSize){
		buffer = tagFonts.fontSize[index].split('px');
		ftSize = parseFloat(buffer[0]);
		if (ftSize < 16) {
			data["htmlTag"] = "&lt;" + tagFonts.tagName[index] + "&gt;";
			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "too-small-font-size", data));
			console.log("petite police detected");
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
	sink.emit('done');
}