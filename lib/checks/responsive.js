exports.name = "responsive";

exports.check = function (reporting, profile, options) {
	checkWidth(reporting, profile, options);
	checkViewPort(reporting, profile, options);

}

function checkWidth (reporting, profile, options) {
	var socket = options.sockets;
	if (reporting.sources.dom.width > profile.config.width) {
		console.log("error : page width is largest than screen size.");
		socket.emit('err', 'page width is largest than screen size.');
	} else {
		console.log("ok : page width is not largest than screen size. ");
		socket.emit('ok', 'page width is not largest than screen size. ');
	}
}

function checkViewPort (reporting, profile, options) {
	var socket = options.sockets;
	var head;
	var headSplit;
	var meta = [];
	var viewport = [];
	var buffer;
	var metaBool = true;
	var i = 0;
	if (reporting.sources.html.content[0].indexOf('<head>') == -1){
		console.log('no head in html file');
	} else {
		head = reporting.sources.html.content[0].substring(reporting.sources.html.content[0].indexOf('<head>'),reporting.sources.html.content[0].indexOf('</head>') + 7);
		headSplit = head.split(' '); 
		head = "";
		for (var j = 0; j < headSplit.length; j++){
			if(headSplit[j] != ' '){
				head = head + headSplit[j];
			}
		}
		
		while (metaBool == true) {
			if(head.indexOf('<meta') == -1){
				console.log('no more meta tag in head');
				metaBool = false;
			} else {
				head = head.substring(head.indexOf('<meta'), head.length - 1);
				buffer = head.substring(0, head.indexOf('>') + 1);
				head = head.substring(buffer.length - 1, head.length - 1);
				meta[i] = buffer;
				console.log(meta[i]);
				i++;
			}
		}
		i = 0;
		for (var j = 0; j < meta.length; j++){
			if(meta[j].indexOf('name="viewport"') != -1){
				console.log(meta[j]);
				viewport[i] = meta[j].indexOf('name="viewport"');
				i++;
			}
		}
		if(viewport.length < 1) {
			console('no meta view port declared');
		} else if (viewport.length = 1){
		} else if (viewport.length > 1){
			console.log('too much viewport declared');
		}
	}
}