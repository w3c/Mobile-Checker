// webSockets client side declaration
var websocket = location.pathname + "socket.io";
var socket = io.connect({ path: websocket });

//settings sent to server
// profile : device profile, selected by user.
// url : url of the website which need to be check.
var settings = {
    profile: null,
    url: null
};

var errors = 0;
var warnings = 0;
var infos = 0;

console.log(window.innerWidth);

var checkButton = document.getElementById('submit');
checkButton.addEventListener('click', clickHandler, true);

window.addEventListener('popstate', function(event) {
    console.log('popstate fired!');
    loadHomePage();
    updateContent(event.state);
});

function clickHandler(event) {
    var data = $('#url').val();
    history.pushState(data, event.target.textContent, event.target.href);
}

function updateContent(data) {
    if(data == null)
        return;
    checkURI(window.location.search);

}
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
        document.getElementById('url').value = "";
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
    $('#sm2').show();
    $('#sm2').removeClass('screenshot');
    $('#tab').show();
    $('#tab').removeClass('screenshot');
    $('#smartphone').removeClass("sm");
    $('#smartphone').removeClass("sm2");
    $('#smartphone').removeClass("tab");
    $('#console-title').hide();
    $('#console').hide();
    $('#cog1').addClass("active");
    $('#cog2').addClass("active");
    checkURI(window.location.search);
}

function loadFailurePage() {
    $('#cog1').removeClass("active");
    $('#cog2').removeClass("active");
    $('#system-info').html($("<p>Sorry, it looks like we’ve crashed :(</p>"));
}

//display all progress elements, report page and animate smartphone
function loadProgressPage() {
    errors = 0;
    warnings = 0;
    infos = 0;
    $('#target').attr('href', document.getElementById('url').value);
    $('#target').text(document.getElementById('url').value);
    $('#report').show();
    $('#tip-issue-feed').empty();
    $('#info-issue-feed').empty();
    $('#error-issue-feed').empty();
    $('#warning-issue-feed').empty();
    $('#info-issue-feed').hide();
    $('#error-issue-feed').hide();
    $('#warning-issue-feed').hide();
    $('#smartphone').empty();
    $('#cog1').addClass("active");
    $('#cog2').addClass("active");
    $('#system-info').html('');
    $("#inprogress").show("1s");
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
    var transformprefixwebkit = '-webkit-transform: translate3d(' +
        (offset1.left - offset2.left) + 'px, ' + (offset1.top - offset2.top) +
        'px,0) scale(' + scale + ',' + scale + ') rotate(360deg)';
    var transform = 'transform: translate3d(' +
        (offset1.left - offset2.left) + 'px, ' + (offset1.top - offset2.top) +
        'px,0) scale(' + scale + ',' + scale + ') rotate(360deg)';
    var style = $('<style>#' + id + '.screenshot {  ' + transform +
        ' }</style>').appendTo('head');
    var styleprefixed = $('<style>#' + id + '.screenshot {  ' + transformprefixwebkit +
        ' }</style>').appendTo('head');
    if($( window ).width() > 990) {
        selectedDevice.addClass('screenshot');
    }
    $('#home').addClass('report');
    $('#report').addClass('report');

    if($( window ).width() > 990) {
        setTimeout(function() {
            $('#smartphone').addClass(id);
            selectedDevice.hide();
            selectedDevice.removeClass('screenshot');
            style.remove();
        }, 1000);
    }

}

//hide progress animation
function loadResultPage() {
    $('#cog1').removeClass("active");
    $('#cog2').removeClass("active");
    $("#inprogress").hide("1s");
    $("#tipbody").addClass("collapse");
    $('#navbar-report').addClass("navbar-active");
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

socket.on('tip', function(data) {
//server event : add report header and some infos
    var tip = $("<div></div>");
    tip.html(data);
    $('#tip-issue-feed').append(tip);
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
    $('#errors').append($(
        '<div id="dns-error" class="alert alert-danger" role="alert">'
        + '<span class="octicon octicon-alert"></span>'
        + ' error while resolving '
        + data
        + '. Check the spelling of the host, the protocol (http, https) and ensure that the page is accessible from the public Internet. '
        + '</div>'
    ));
});

//server event : detect when check is done.
socket.on('done', function(data) {});
socket.on('ok', function(data) {});

socket.on('disconnect', function() {
    loadFailurePage();
});

socket.on('wait', function(data) {
    var waitingTime = data * 10;
    var waitMessage = "<p>Hi, this service is receiving too many requests. Waiting time around " +waitingTime+ "s. Please don't leave the page.</p>";
    $('#system-info').append($(waitMessage));
});

socket.on('jobStarted', function(){
    $('#system-info').empty();
});

socket.on('err', function(data) {
    if (data.status == "error") {
        if (errors == 0) {
            $('#error-issue-feed').show();
            var errortitle = "<div class='alert alert-danger alert-dismissible' role='alert'>"
            + " <h2>Should be fixed</h2></div>";
            $('#error-issue-feed').append($(errortitle));
        }
        $('#error-issue-feed').append($(data.issue));
        errors++;
    }
    if (data.status == "warning") {
        if (warnings == 0) {
            $('#warning-issue-feed').show();
            var warningtitle = "<div class='alert alert-warning alert-dismissible' role='alert'><h2>"
            + " Consider fixing</h2></div>";
            $('#warning-issue-feed').append($(warningtitle));
        }
        $('#warning-issue-feed').append($(data.issue));
        warnings++;
    }
    if (data.status == "info") {
        if (infos == 0) {
            $('#info-issue-feed').show();
            var infotitle = "<div class='alert alert-info alert-dismissible' role='alert'>"
            + "<h2>Potential improvements</h2></div>";
            $('#info-issue-feed').append($(infotitle));
        }
        $('#info-issue-feed').append($(data.issue));
        infos++;
    }
    $.bootstrapSortable();
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
