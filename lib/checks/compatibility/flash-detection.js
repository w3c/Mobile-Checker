exports.name = "flash-detection";
exports.category = "compatibility";
exports.check = function (checker) {
	var sink = checker.sink;
	var script = getTagParams(checker.reporting.sources.html.content[0], "script");
	var embedTag = getTagParams(checker.reporting.sources.html.content[0], "embed");
	var srcScripts = new Array();
	for(index in script) {
		if(script[index].indexOf('swfobject.js') != -1){
			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "swfobject-lib-detected"));
			break;
		}
	}
	for(index in embedTag) {
		if(embedTag[index].indexOf('.swf') != -1){
			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "swf-file-detected"));
			break;
		}
	}
	sink.emit('done');
};

function getTagParams(src, tagName){
	var start = "<" + tagName
	,	end =">"
	,	res = []
	,	count = 0
	;
	while (src.indexOf(start) != -1){
		src = src.substring(src.indexOf(start), src.length - 1);
		res[count] = src.substring(0 + start.length, src.indexOf(end));
		src = src.substring(src.indexOf(end), src.length - 1);
		count++;
	}
	return res;
}

function deleteStringSpaces(str){
	var buffer;
	buffer = str.split(' ');
	str = '';
	for (var i = 0; i < buffer.length; i++){
		str = str + buffer[i];
	}
	return str;
}

function getTagContent(html, tagName){
	var start
	,	end
	,	params = getTagParams(html, tagName)
	;
	for (var i = 0; i < params.length; i++){
		start = "<" + tagName + params[i] + ">";
		end = ""
	}
	if(getTagParams(html, tagName)) var start = "<" + tagName + getTagParams(html, tagName) + ">";
	else var start = "<" + tagName + ">";
}