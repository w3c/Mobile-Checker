var socket = io();

var parameters = {
	widthView : 600,
	heightView : 900,
	url : 'undefined'
};

var totalstep = 0;
var progress = 0;
var checkOptions = 0;
var sources;
var hideViews = 0;

$('.input-options').hide();
$('.page-title').hide();
$('.smartphone-view').hide();
$('.report').hide();
$('.sourcefile').hide();
$('.export').hide();
$('.sidebar').hide();
$('.showprogress').hide();

$('#show-options').click('on', function(){
	if(checkOptions == 0){
		$('.input-options').show(); 
		checkOptions = 1;
	}
	else{
		$('.input-options').hide();
		checkOptions = 0; 
	}
});

$('#anewcheck').click('on', function(){
	$('.check-form').show();
	$('a').removeClass('active');
	$('#anewcheck').addClass( "active" );
	$('.smartphone-view').hide();
	$('.report').hide();
	$('.sourcefile').hide();
	$('.export').hide();
});

$('#aviews').click('on', function(){
	$('.smartphone-view').show();
	$('a').removeClass('active');
	$('#aviews').addClass( "active" );
	$('.check-form').hide();
	$('.report').hide();
	$('.sourcefile').hide();
	$('.export').hide();
	$('.showprogress').hide();

});

$('#areport').click('on', function(){
	$('.report').show();
	$('a').removeClass('active');
	$('#areport').addClass( "active" );
	$('.check-form').hide();
	$('.smartphone-view').hide();
	$('.sourcefile').hide();
	$('.export').hide();
	$('.showprogress').hide();
});

$('#asources').click('on', function(){
	$('.sourcefile').show();
	$('a').removeClass('active');
	$('#asources').addClass( "active" );
	$('.check-form').hide();
	$('.smartphone-view').hide();
	$('.report').hide();
	$('.export').hide();
	$('.showprogress').hide();
});

$('#aexport').click('on', function(){
	$('.export').show();
	$('a').removeClass('active');
	$('#aexport').addClass( "active" );
	$('.check-form').hide();
	$('.smartphone-view').hide();
	$('.report').hide();
	$('.sourcefile').hide();
	$('.showprogress').hide();
});

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
	$('.check-form').hide();
	$('.showprogress').show();
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
	sources = report.htmlContent;
	sources = sources.replace('<', '&lt;');
	sources = sources.replace('>', '&gt;');

	$('.sidebar').show();
	$('#anewcheck').addClass( "active" );
	$(".nav-head").attr("class", "col-md-11 col-md-offset-1 nav-head");
	$(".stripes").attr("class", "col-md-11 col-md-offset-1 stripes");
	$('.smartphone-view').append($('<img src="screenshots/screenshot.png" alt="frame">'));
	$('#htmlFile').text(sources);
	$('.main').removeClass('col-md-10');
	$('.main').addClass('col-md-11');
	$('#time').text(report.speed + 'ms');
	//$("#aviews").attr("href", "/views");
	//$("#areport").attr("href", "/report");
	//$("#asources").attr("href", "/sources");
	//$("#aexport").attr("href", "/export");
    //$("li").removeClass("off");
	
	//$('#report').append($('<div class="col-md-2 report-navigation"></div>'));
	//$('#report').append($('<div class="col-md-10 report-content"><div class="page-header"></div></div>'));
	//$('.report-content .page-header').append($('<h1>').text(report.title));
	//$('.report-content .page-header').append($('<small>').text(report.title));
 });
