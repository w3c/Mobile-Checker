var socket = io();

var settings = {
	widthView : 600,
	heightView : 900, 
	profile : 'undefined',
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
	$('#console').hide();
	$('.progressbar').hide();
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
	$('#tool-title').hide();
	$('#console').show();
	$('.progressbar').show();
}

function loadResultPage () {
	$('#main-action').hide();
	$('.intro').hide();
	$('.sidebar').show(1000);
	$('#overview').show(1000);
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
socket.on('console', function (msg){
	$("#console-body").append('<p>' + msg + '</p>');
});
socket.on('done', function (data){
	progressBar.done++;
	progress();
});
socket.on('ok', function (data){
	$('#analytics').append($('<div class="col-md-12 ok"><h1>' + data + '</h1></div>'));
});
socket.on('warning', function (data){
	$('#analytics').append($('<div class="col-md-12 warning"><h1>' + data + '</h1></div>'));

});
socket.on('err', function (data){
	$('#analytics').append($('<div class="col-md-12 error"><h1>' + data + '</h1></div>'));
});
socket.on('end', function (data){
	result.source = data.sources.html.content[0];
	$('#smartphone-img').append($('<img src="screenshots/' + data.overviews.screenshot + '"' + 'width="225px" height="354px" alt="screenshot">'));
	$('#htmlFile').text(result.source);
	stringifySourceCode();
	loadResultPage();
});

$('form').submit(function (){
	settings.url = $('#url').val();
	settings.profile = $('input[name="smartphone"]:radio:checked').val();
    $('#url').val('');
	socket.emit('check', settings);
	return false;
});



