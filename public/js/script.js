// webSockets client side declaration
var socket = io();

//settings sent to server
// profile : device profile, selected by user.
// url : url of the website which need to be check.
var settings = {
    profile: null,
    url: null
};

//get querystring and return asked url if exist
//this function provide an unique URI to share a report configuration.
// TODO : insert device selector in URI
function checkURI(querystring) {
    var query = {};
    var buffer = querystring.slice(1).split('&');
    console.log(querystring);
    for (var index in buffer) {
        query[buffer[index].split('=')[0]] = buffer[index].split('=')[1];
    }
    if (query["url"]) {
        document.getElementById('url').value = decodeURIComponent(query["url"]);
        if (query["profile"]) {
            $("input[value=" + decodeURIComponent(query["profile"]) + "]").click();
            settings.profile = decodeURIComponent(query["profile"]);
        } else {
            return;
        }
    } else {
        return;
    }
}

//display all home page's elements and hide report page.
//call checkURI function to insert an URI in input element if a query url exist.
function loadHomePage() {
    $('#report').removeClass('report');
    $('#report').hide();
    $('#home').removeClass('report');
    $('#sm').show();
    $('#sm').removeClass('screenshot');
    $('#console-title').hide();
    $('#console').hide();
    checkURI(window.location.search);
}

//display all progress elements, report page and animate smartphone
function loadProgressPage() {
    $('#report').show();
    $('#cog1').addClass("active");
    $('#cog2').addClass("active");
    var scales = {
        'sm': 8.31,
        'sm2': 8.31,
        'tab': 2.5
    };
    var selectedDevice = $('input[name=device]:checked').parent().find('img').eq(
        0);
    var id = selectedDevice.attr('id');
    var scale = scales[id];;
    var offset2 = selectedDevice.offset();
    var offset1 = $('#smartphone').offset();
    var transform = 'transform: translate3d(' +
        (offset1.left - offset2.left) + 'px, ' + (offset1.top - offset2.top) +
        'px,0) scale(' + scale + ',' + scale + ') rotate(360deg)';
    var style = $('<style>#' + id + '.screenshot {  ' + transform +
        ' }</style>').appendTo('head');
    selectedDevice.addClass('screenshot');
    $('#home').addClass('report');
    $('#report').addClass('report');
    setTimeout(function() {
        $('#smartphone').addClass(id);
        selectedDevice.hide();
        selectedDevice.removeClass('screenshot');
        style.remove();
    }, 1000);
}

//hide progress animation
function loadResultPage() {
    $('#cog1').removeClass("active");
    $('#cog2').removeClass("active");
    $("#inprogress").hide("1s");
    $("#tipbody").addClass("collapse");
}

//PROTOCOL of client Side
loadHomePage();
//detect device choice and add a profile device in settings
$('.device-selector').click(function() {
    var id = this.id;
    settings.profile = id;
    $('#device-selected').text(id);
});
//detect form submit, update URI of mobile checker, add URI asked to settings and send data to server side
$('form').submit(function() {
    settings.url = $('#url').val();
    settings.profile = $('input[name="device"]:radio:checked').val();
    var url = window.location.origin + window.location.pathname;
    url += "?url=" + encodeURIComponent(settings.url);
    url += "&profile=" + encodeURIComponent(settings.profile);
    window.history.pushState({}, "mobile checker - " + settings.url, url);
    socket.emit('check', settings);
    return false;
});
//server event : inform the check begin
socket.on('start', function(data) {
    loadProgressPage();
});
//server event : add report header and some infos 
socket.on('tip', function(data) {
    var tip = $("<div></div>");
    tip.html(data);
    var wrapper = $('<div class="col-md-12 content-issue tip"></div>');
    var wrapperOut = $('<div class="col-md-12 issue"></div>').append(wrapper);
    var collapsableLink = $('<a></a>').html(tip.find('h2').html());
    collapsableLink.attr("data-toggle", "collapse");
    collapsableLink.attr("href", "#tipbody");
    var h2 = $('<h2></h2>').appendTo(wrapper);
    h2.addClass('title-issue page-header')
    h2.append(collapsableLink);
    h2.append(' ');
    h2.append($('<small>tip</small>'));
    var div = $('<div></div>').appendTo(wrapper);
    div.attr("id", "tipbody");
    div.append(tip.find('h2').nextAll());
    $('#issues-feed').append(wrapperOut);
});
//server event : display console if some problems detected on server side.
//TODO : display all server side errors. For the moment only display errors detected and interpreted via throw function.
socket.on('exception', function(msg) {
    $('#console-title').show();
    $('#console').show();
    $('#console').text(msg);
});
socket.on('unsafeUrl', function(data) {
    $('#dns-error').remove();
    $('#errors').append($('<div id="dns-error" class="col-md-12"><p>error while resolving ' + data + ' Check the spelling of the host, the protocol (http, https) and ensure that the page is accessible from the public Internet.</p></div>'));
});
//server event : detect when check is done.
socket.on('done', function(data) {});
socket.on('ok', function(data) {});
socket.on('err', function(data) {
    $('#issues-feed').append($(data));
});
//server event : get screenshot path when it is ready and display it in smartphone frame.
socket.on('screenshot', function(path) {
    $('<img>').attr('src', path).attr('alt', 'Screenshot').attr('id',
        'screenshot').attr('width', 266).appendTo('#smartphone');
});
//server event : detect end of all checks and call loadResultPage function.
socket.on('end', function() {
    loadResultPage();
});