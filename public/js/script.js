var socket = io();

var parameters = {
	widthView : 600,
	heightView : 900,
	url : 'undefined'
};

$('form').submit(function(){
	parameters.url = $('#url').val();
	socket.emit('url sent', parameters);
    $('#url').val('');
    $('#report .report-navigation').remove();
    $('#report .report-content').remove();
    return false;
});

$( "input" ).change(function() {
	parameters.widthView = $('#width-range').val();
	parameters.heightView = $('#height-range').val();
	$("#widthView").text(parameters.widthView);
	$("#heightView").text(parameters.heightView);
});

socket.on('report', function(report){

	$("#aviews").attr("href", "/views");
	$("#areport").attr("href", "/report");
	$("#asources").attr("href", "/sources");
	$("#aexport").attr("href", "/export");
    $("li").removeClass("off");
	
	$('#report').append($('<div class="col-md-2 report-navigation"></div>'));
	$('#report').append($('<div class="col-md-10 report-content"><div class="page-header"></div></div>'));
	$('.report-content .page-header').append($('<h1>').text(report.title));
	$('.report-content .page-header').append($('<small>').text(report.title));
 });