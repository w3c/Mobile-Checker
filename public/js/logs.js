var socket = io();

socket.on('logs', function(data) {
	$('#logs').html(data);
});