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
var smartphoneSelectorHidden = 1;
var checkSelectorHidden = 1;
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
	//$('#analytics').hide();
	$('#sources').hide();
	$('#export').hide();
	$('#console').hide();
	$('.progressbar').hide();
	$('.table').hide();
	$('.select').hide();
	$('#main-action').show();
	$('.intro').show();
	$('#analytics').show();

}

function loadProgressPage () {
	$('#main-action').hide();
	$('.intro').hide();
	$('.sidebar').hide();
	$('#overview').hide();
	$('#reports').hide();
	//$('#analytics').hide();
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
	//$('#analytics').show();
	//$('#sources').show();
	$('#export').show();
	$('#tool-title').show();
}

/*
*	protocol
*/

$('#smartphone-selector-btn').click(function (){
	if (smartphoneSelectorHidden == 1) {
		$('.table').show();
		smartphoneSelectorHidden = 0;
	}else {
		$('.table').hide();
		smartphoneSelectorHidden = 1;
	}
});

$('#check-selector-button').click(function (){
	if (checkSelectorHidden == 1) {
		$('.select').show();
		checkSelectorHidden = 0;
	}else {
		$('.select').hide();
		checkSelectorHidden = 1;
	}
});

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
});
socket.on('warning', function (data){
	$('#analytics').append($('<div class="col-md-12 error"><div class="col-md-11"><p><img src="img/issue-warning.svg" width="35px" style="margin-right:10px;">' + data.title + '</p></div></div>'));
});
socket.on('err', function (data){
	$('#analytics').append($('<div class="col-md-12 error"><div class="col-md-11"><p><img src="img/issue-error.svg" width="35px" style="margin-right:10px;">' + data.title + '</p></div></div>'));
});
socket.on('end', function (data){
	result.source = data.sources.html.content[0];
	$('#smartphone-img').append($('<img src="screenshot.png"' + 'width="225px" height="354px" alt="screenshot">'));
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



