//viewport influence skill-responsive of mobile website
//check if the viewport is correctly declared
exports.name = "meta-viewport";
exports.category = "responsive";
exports.check = function (checker) {
	var socket = checker.socket;
	var meta = getTagParams(checker.reporting.sources.html.content[0], "meta")
	,	count = 0
	,	metaViewPortContent
	,	width = 0
	,	initialScale = 0
	;
	for (var i = 0; i < meta.length; i++){
		if(meta[i].indexOf('viewport') != -1){
			metaViewPortContent = meta[i].substring(meta[i].indexOf('content') + 9, meta[i].length - 1);
			count++;
		}
		if(count > 1){ //if too much viewport declaration
			socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "2"));
		}
	}
	if(count == 1){
		metaViewPortContent = metaViewPortContent.split(',');
		for (var i = 0; i < metaViewPortContent.length; i++){
			metaViewPortContent[i] = deleteStringSpaces(metaViewPortContent[i]);
			metaViewPortContent[i] = metaViewPortContent[i].split('=');
		}
		for (var i = 0; i < metaViewPortContent.length; i++){
			//check content of viewport
			switch (metaViewPortContent[i][0]) {
            	case 'width':
            		width = 1;
            		if(metaViewPortContent[i][1] == 'device-width'){
            			//ok
            		} else {
            			socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "5"));
            		}
            	break;
            	case 'initial-scale':
            		initialScale = 1;
            		if(metaViewPortContent[i][1] == '1.0'){
            			//ok
            		} else {
            			socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "6"));
            		}
            	break;
            	default:
            	//unmanaged contents detected
            	break;
        	}
		}
		if (width == 0) 
			socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "3"));
		else if (initialScale == 0) 
			socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "4"));
	}
	else{ //no viewport declaration
		socket.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "0"));
	}
}

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

function checkViewPort (src){
	var meta = getTagParams(src, "meta")
	,	count = 0
	,	metaViewPortContent
	;
	for (var i = 0; i < meta.length; i++){
		if(meta[i].indexOf('viewport') != -1){
			metaViewPortContent = meta[i].substring(meta[i].indexOf('content') + 9, meta[i].length - 1);
			count++;
		}
		if(count > 1){ //too much viewport declaration
			return -1; 
		}
	}
	if(count == 1){
		metaViewPortContent = metaViewPortContent.split(',');
		for (var i = 0; i < metaViewPortContent.length; i++){
			metaViewPortContent[i] = deleteStringSpaces(metaViewPortContent[i]);
			metaViewPortContent[i] = metaViewPortContent[i].split('=');
		}
		for (var i = 0; i < metaViewPortContent.length; i++){
			//check content of viewport
			switch (metaViewPortContent[i][0]) {
            	case 'width':
            		if(metaViewPortContent[i][1] == 'width-device'){
            			//ok
            		} else {
            			//error to manage
            		}
            	break;
            	case 'initial-scale':
            		if(metaViewPortContent[i][1] == '1.0'){
            			//ok
            		} else {
            			//error to manage
            		}
            	break;
            	default:
            	//unmanaged contents
            	break;
        	}
		}
		console.log(metaViewPortContent);
		return 1;
	}
	else{ //no viewport declaration
		return 0;
	}
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
