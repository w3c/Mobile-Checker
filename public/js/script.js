var socket = io();

var settings = {
	widthView : 600,
	heightView : 900, 
	profil : 'undefined',
	url : 'undefined'
};
var progressBar = {
	total : 0,
	done : 0,
	status : 0
};

var result = {};

/*
*	functions
*/
function progress () {
	progressBar.status = (progressBar.done/progressBar.total)*100;
	$('.progress-bar').attr("aria-valuenow", progressBar.status);
	$('.progress-bar').attr("style", "width:" + progressBar.status + "%");
}

function stringifySourceCode () {
	result.source = result.source.replace('<', '&lt;');
	result.source = result.source.replace('>', '&gt;');
}

function loadHomePage () {
	$('.sidebar').hide();
	$('#overview').hide();
	$('#reports').hide();
	$('#analytics').hide();
	$('#sources').hide();
	$('#export').hide();
	$('#main-action').show();
	$('.intro').show();
}

function loadProgressPage () {
	$('#main-action').hide();
	$('.intro').hide();
	$('.sidebar').hide();
	$('#overview').hide();
	$('#reports').hide();
	$('#analytics').hide();
	$('#sources').hide();
	$('#export').hide();
}

function loadResultPage () {
	$('#main-action').hide();
	$('.intro').hide();
	$('.sidebar').show();
	$('#overview').show();
	$('#reports').show();
	$('#analytics').show();
	$('#sources').show();
	$('#export').show();
}

/*
*	protocol
*/

loadHomePage();

socket.on('start', function (data){
	progressBar.total = data;
	loadProgressPage();
});

socket.on('request', function (request){
	$("#console-body").append('<p>' + request + '</p>');
});

socket.on('done', function (data){
	progressBar.done++;
	progress();
});

socket.on('end', function (data){
	result.source = data.htmlContent;
	$('#smartphone-img').append($('<img src="screenshots/screenshot.png" width="225px" height="374px" alt="screenshot">'));
	$('#htmlFile').text(result.source);
	stringifySourceCode();
	loadResultPage();
});

$('form').submit(function (){
	settings.url = $('input').val();
    $('input').val('');
	socket.emit('check', settings);
	return false;
});



