var socket = io();

var settings = {
    widthView: 600,
    heightView: 900,
    profile: null,
    url: null
};
var progressBar = {
    total: 0,
    done: 0,
    status: 0
};

var result = {};
var smartphoneSelectorHidden = 1;
var checkSelectorHidden = 1;
/*
 *	functions
 */
var checkUrl = function(querystring) {
    var query = {};
    var buffer = querystring.slice(1).split('&');
    console.log(querystring);
    for (var index in buffer) {
        query[buffer[index].split('=')[0]] = buffer[index].split('=')[1];
    }
    if (query["url"]) {
        document.getElementById('url').value = query["url"];
    } else {
        return;
    }
}


function progress() {
    progressBar.status = (progressBar.done / progressBar.total) * 100;
    //$('.progress-bar').attr("aria-valuenow", progressBar.status);
    //$('.progress-bar').attr("style", "width:" + progressBar.status + "%");
}

function stringifySourceCode() {
    result.source = result.source.replace('<', '&lt;');
    result.source = result.source.replace('>', '&gt;');
}

function loadHomePage() {
    $('#sidebar').hide();
    $('#report').removeClass('report');
    $('#report').hide();
    $('#home').removeClass('report');
    $('#sm').show();
    $('#sm').removeClass('screenshot');
    $('#console-title').hide();
    $('#console').hide();
    checkUrl(window.location.search);
}
$

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
    }, 1000)


}

function loadResultPage() {
    $('#cog1').removeClass("active");
    $('#cog2').removeClass("active");
    $("#inprogress").hide("1s");
}

/*
 *	protocol
 */

$('.device-selector').click(function() {
    var id = this.id;
    settings.profile = id;
    $('#device-selected').text(id);
});

loadHomePage();

socket.on('start', function(data) {
    //progressBar.total = data;
    loadProgressPage();
});
socket.on('done', function(data) {
    progressBar.done++;
    //progress();
});
socket.on('ok', function(data) {});
socket.on('err', function(data) {
    $('#issues-feed').append($(data));
});
socket.on('screenshot', function(path) {
    $('<img>').attr('src', path).attr('alt', 'Screenshot').attr('id',
        'screenshot').attr('width', 266).appendTo('#smartphone');
});
socket.on('end', function() {
    loadResultPage();
});
socket.on('exception', function(msg) {
    $('#console-title').show();
    $('#console').show();
    $('#console').text(msg);
});

$('form').submit(function() {
    settings.url = $('#url').val();
    settings.profile = $('input[name="device"]:radio:checked').val();
    var url = window.location.origin + window.location.pathname;
    url += "url=" + encodeURIComponent(settings.url);
    window.history.pushState({}, "mobile checker - " + settings.url, url);
    socket.emit('check', settings);
    return false;
});

$('span.info').popover();