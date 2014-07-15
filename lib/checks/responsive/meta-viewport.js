//viewport influence skill-responsive of mobile website
//check if the viewport is correctly declared
exports.name = "meta-viewport";
exports.check = function (checker) {
	var socket = checker.socket;
	var head;
	var headSplit;
	var meta = [];
	var viewport = [];
	var buffer;
	var metaBool = true;
	var i = 0;
	if (checker.reporting.sources.html.content[0].indexOf('<head>') == -1){
		console.log('no head in html file');
	} else {
		head = checker.reporting.sources.html.content[0].substring(checker.reporting.sources.html.content[0].indexOf('<head>'),checker.reporting.sources.html.content[0].indexOf('</head>') + 7);
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
			console.log('no meta view port declared');
		} else if (viewport.length = 1){
		} else if (viewport.length > 1){
			console.log('too much viewport declared');
		}
	}
}
