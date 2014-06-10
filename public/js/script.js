var socket = io();

$('form').submit(function(){
	socket.emit('url sent', $('#url').val());
    $('#url').val('');
    return false;
});