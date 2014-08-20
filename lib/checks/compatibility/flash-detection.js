var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
exports.name = "flash-detection";
exports.category = "compatibility";
exports.check = function (checker) {
	var sink = checker.sink;
	var script = getTagParams(checker.webAppData.html, "script");
	var embedTag = getTagParams(checker.webAppData.html, "embed");
	var srcScripts = new Array();
	for(index in script) {
		if(script[index].indexOf('swfobject.js') != -1){
			sendIssue(sink, "swfobject-lib-detected", this.name, this.category);
			break;
		}
	}
	for(index in embedTag) {
		if(embedTag[index].indexOf('.swf') != -1){
			sendIssue(sink, "swf-file-detected", this.name, this.category);
			break;
		}
	}
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

function sendIssue(sink, key, name, category, data) {
	var str = fs.readFileSync(path.join(__dirname, '/../../issues/' +category+ '/' +name+ '/' +key+ '.ejs'), 'utf8');
	if(!data) var data = {};
	sink.emit('err', ejs.render(str, data));
	sink.emit('done');
}