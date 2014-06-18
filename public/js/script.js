var socket = io();

var parameters = {
	widthView : 600,
	heightView : 900,
	url : 'undefined'
};

var totalstep = 0;
var progress = 0;

/* form and options manager */
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

/* progress bar */
socket.on('startprogress', function(total){
	totalstep = total;
	$('.check-form').remove();
	$('.main').append($('<div class="showprogress col-md-10 col-md-offset-1"><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">0%</div></div></div>'));
});

socket.on('inprogress', function(step){
	progress = (step/totalstep)*100;
	$('.progress-bar').attr("aria-valuenow", progress);
	$('.progress-bar').attr("style", "width:" + progress + "%");
	$('.progress-bar').text(progress + "%");
});

socket.on('endprogress', function(){

});

/* get report */
socket.on('report', function(report){
	$("#aviews").attr("href", "/views");
	$("#areport").attr("href", "/report");
	$("#asources").attr("href", "/sources");
	$("#aexport").attr("href", "/export");
    $("li").removeClass("off");
	
	//$('#report').append($('<div class="col-md-2 report-navigation"></div>'));
	//$('#report').append($('<div class="col-md-10 report-content"><div class="page-header"></div></div>'));
	//$('.report-content .page-header').append($('<h1>').text(report.title));
	//$('.report-content .page-header').append($('<small>').text(report.title));
 });

