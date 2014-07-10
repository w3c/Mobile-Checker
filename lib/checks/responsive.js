exports.name = "responsive";

exports.check = function (reporting, profile, options) {
	var socket = options.sockets;
	if (reporting.sources.dom.width > profile.config.width) {
		console.log("error : page width is largest than screen size.");
		socket.emit('err', 'page width is largest than screen size.');
	} else {
		console.log("ok : page width is not largest than screen size. ");
		socket.emit('ok', 'page width is not largest than screen size. ');
	}
}