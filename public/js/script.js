var socket = io();

$('form').submit(function(){
	socket.emit('url sent', $('#url').val());
    $('#url').val('');
    $('#report .report-navigation').remove();
    $('#report .report-content').remove();
    return false;
});

socket.on('report', function(report){
	$('#report').append($('<div class="col-md-2 report-navigation"></div>'));
	$('#report').append($('<div class="col-md-10 report-content"><div class="page-header"></div></div>'));
	$('.report-content .page-header').append($('<h1>').text(report.title));
	$('.report-content .page-header').append($('<small>').text(report.title));
 });