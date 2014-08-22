var socket = io();

var settings = {
	widthView : 600,
	heightView : 900, 
	profile : null,
	url : null
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
	//$('.progress-bar').attr("aria-valuenow", progressBar.status);
	//$('.progress-bar').attr("style", "width:" + progressBar.status + "%");
}

function stringifySourceCode () {
	result.source = result.source.replace('<', '&lt;');
	result.source = result.source.replace('>', '&gt;');
}

function loadHomePage () {
	$('#report').hide();
	$('#home').show();
}

function loadProgressPage () {
	$('#home').hide();
	$('#report').show();
	$('#sidebar').hide();
	$('#score').hide();
}

function loadResultPage () {
	$('#home').hide();
	$('#report').show();
	$('#sidebar').hide();
	$('#score').hide();
}

/*
*	protocol
*/

$('.device-selector').click(function (){
	var id = this.id;
	settings.profile = id;
	$('#device-selected').text(id);
});

loadHomePage();

socket.on('start', function (data){
	//progressBar.total = data;
	loadProgressPage();
});
socket.on('done', function (data){
	progressBar.done++;
	//progress();
});
socket.on('ok', function (data){
});
socket.on('err', function (data){
	$('#issues-feed').append($(data));
});
socket.on('screenshot', function (path){
	$('#smartphone').append($('<img src="' +path+ '"' + 'width="266px" alt="cant load screenshot" style="margin-left:29px; margin-top:76px;">'));
});
socket.on('end', function (data){
	//result.source = data.sources.html.content[0];
	//$('#smartphone').append($('<img src="screenshot.png"' + 'width="266px" alt="cant load screenshot" style="margin-left:27px; margin-top:98px;">'));
	//$('#htmlFile').text(result.source);
	//stringifySourceCode();
	loadResultPage();
});

$('form').submit(function (){
	settings.url = $('#url').val();
	//settings.profile = $('input[name="smartphone"]:radio:checked').val();
    $('#url').val('');
	socket.emit('check', settings);
	return false;
});



