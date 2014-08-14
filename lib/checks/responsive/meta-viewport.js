//viewport influence skill-responsive of mobile website
//check if the viewport is correctly declared
exports.name = "meta-viewport";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	var meta = getTagParams(checker.webAppData.html, "meta")
	,	count = 0
	,	metaViewPortContent
	,	width = 0
	,	initialScale = 0
	;
	for (var i = 0; i < meta.length; i++){
		if(meta[i].indexOf('viewport') != -1){
			metaViewPortContent = meta[i].substring(meta[i].indexOf('content') + 9, meta[i].length - 1);
			count++;
			if(count > 1){ //if too much viewport declaration
			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "2"));
			sink.emit('done');
			break;
			}
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
            			sink.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
            			sink.emit('done');
            		} else {
            			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "5"));
            			sink.emit('done');
            		}
            	break;
            	case 'initial-scale':
            		initialScale = 1;
            		if(metaViewPortContent[i][1] == '1.0'){
            			sink.emit('ok', checker.l10n.message(checker.options.lang, this.category, this.name, "ok"));
            			sink.emit('done');
            		} else {
            			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "6"));
            			sink.emit('done');
            		}
            	break;
            	default:
            	//unmanaged contents detected
            	break;
        	}
		}
		if (width == 0) { 
			sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "3"));
		    sink.emit('done');
                }
		if (initialScale == 0)  {
		    sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "4"));
		    sink.emit('done');
                }
	}
	else if (count == 0) { //no viewport declaration
		sink.emit('err', checker.l10n.message(checker.options.lang, this.category, this.name, "0"));
		sink.emit('done');
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
