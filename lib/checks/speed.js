exports.name = "speed";

exports.check = function (reporting, profile, options) {
	var socket = options.sockets;
	if (reporting.analytics.speed <= 500) {
		console.log("ok : your website load in " + reporting.analytics.speed + " ms");
		socket.emit('ok', 'your page load in ' + reporting.analytics.speed + ' ms');
	}
	else if (reporting.analytics.speed > 500 && reporting.analytics.speed <= 1000) {
		console.log("ok : your website load in " + reporting.analytics.speed + " ms");
		socket.emit('ok', 'your page load in ' + reporting.analytics.speed + ' ms');
	}
	else if (reporting.analytics.speed > 1000 && reporting.analytics.speed <= 1500) {
		console.log("warning : your website load in " + reporting.analytics.speed + " ms");
		socket.emit('warning', 'your page load in ' + reporting.analytics.speed + ' ms');
	}
	else if (reporting.analytics.speed > 1500) {
		console.log("error : your website load in " + reporting.analytics.speed + " ms");
		socket.emit('err', 'your page load in ' + reporting.analytics.speed + ' ms');
	}
}