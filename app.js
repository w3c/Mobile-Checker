global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};

var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    util = require("util"),
    Checker = require("./lib/checker").Checker,
    events = require("events"),
    logger = require('morgan'),
    uuid = require('node-uuid'),
    url = require('url'),
    proc = require('child_process'),
    urlSafetyChecker = require('safe-url-input-checker'),
    mkdirp = require('mkdirp'),
    ejs = require('ejs'),
    path = require('path'),
    headless = require('headless'),
    Browser = require('mobile-web-browser-emulator').Browser,
    fs = require("fs");

var SCREENSHOTS_DIR = 'public/tmp/screenshots/';

var checklist = [
    require('./lib/checks/performance/number-requests'), require(
        './lib/checks/performance/redirects'), require(
        './lib/checks/performance/http-errors'), require(
        './lib/checks/performance/compression'), require(
        './lib/checks/responsive/doc-width'), require(
        './lib/checks/responsive/meta-viewport'), require(
        './lib/checks/responsive/screenshot'), require(
        './lib/checks/compatibility/flash-detection'), require(
        './lib/checks/compatibility/css-prefixes'), require(
        './lib/checks/interactions/alert')
];

var logs = {
    currentState: {
        clients: 0,
        validations: 0
    },
    history: {
        startDate: new Date(),
        clients: 0,
        validations: 0
    }
}

/*
 * Job Manager
 * Manage a job queue to avoid a server overload
 */
var maxJobs = 5;
var jobQueue = [];
var currentJobs = 0;

function newJob(checker, options) {
    if (currentJobs < maxJobs) {
        currentJobs++;
        checker.check(options);
    } else {
        addJobToQueue(checker, options);
    }
}

function addJobToQueue(checker, options) {
    jobQueue.push({
        checker: checker,
        options: options
    });
    options.events.emit('wait');
}

function removeJobToQueue(jobIndex){ 
    jobQueue.splice(jobIndex, 1);
}

function runNewJobFromQueue() {
    if (currentJobs < maxJobs) {
        currentJobs++;
        jobQueue[0].checker.check(jobQueue[0].options);
        removeJobToQueue(0);
    } else {
        return;
    }
}

function endJob(){
    if (currentJobs > 0)
        currentJobs--;
    if(jobQueue.length > 0) 
        runNewJobFromQueue();
}

function removeDisconnectJobToQueue(checkId) {
    for(var i = 0; i < jobQueue.length - 1; i++) {
        if(jobQueue[i].options.id == checkId) {
            removeJobToQueue(i);
        }
    }
}

function init() {
    createFolder(SCREENSHOTS_DIR, clearScreenshotFolder);
}

function updateLogs(code, socket) {
    switch (code) {
        case 'NEW_CLIENT':
            logs.currentState.clients++;
            logs.history.clients++;
            break;
        case 'NEW_VALIDATION':
            logs.currentState.validations++;
            logs.history.validations++;
            break;
        case 'CLIENT_DECONNECTED':
            logs.currentState.clients--;
            break;
        case 'VALIDATION_ENDED':
            logs.currentState.validations--;
            break;
    }
    socket.broadcast.emit('logs', reportLogs());
}

function reportLogs() {
    var str = fs.readFileSync(path.join(__dirname, '/lib/logs/logs.ejs'), 'utf8');
    return ejs.render(str, logs);
}

function createFolder(path, cb) {
    mkdirp(path, function(err) {
        if (err) console.error(err);
        else cb();
    });
}

function unlinkFile(path) {
    fs.unlink(path, function(err) {
        if (err) throw err;
    });
}

function unlinkScreenshot(filename) {
    unlinkFile(SCREENSHOTS_DIR + filename);
}

var clearScreenshotFolder = function() {
    fs.readdir(SCREENSHOTS_DIR, function(err, files) {
        files.forEach(function(name) {
            unlinkScreenshot(name);
        });
    });
}

function displayTip(socket) {
    setTimeout(function() {
        fs.readdir("lib/tips", function(err, files) {
            var tip = "lib/tips/" + files[Math.floor(files.length * Math.random())];
            fs.readFile(tip, {
                encoding: "utf-8"
            }, function(err, data) {
                if (err) {
                    return;
                }
                socket.emit("tip", data);
                validProfiles = files;
            });
        });
    }, 1500);
}

function Sink() {}

util.inherits(Sink, events.EventEmitter);

app.set('views', __dirname + '/public');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/logs', function(req, res) {
    res.render('logs', logs);
});

init();

io.on('connection', function(socket) {
    updateLogs('NEW_CLIENT', socket);
    socket.on('check', function(data) {
        var sink = new Sink(),
            checker = new Checker(),
            uid = uuid.v4(),
            screenshot = false;
        sink.on('ok', function(data) {
            socket.emit('ok', data);
        });
        sink.on('warning', function(data) {
            socket.emit('warning', data);
        });
        sink.on('err', function(data) {
            socket.emit('err', data);
        });
        sink.on('screenshot', function(data) {
            screenshot = true;
            socket.emit('screenshot', data);
        });
        sink.on('done', function() {
            socket.emit('done');
        });
        sink.on('end', function(data) {
            updateLogs('VALIDATION_ENDED', socket);
            endJob();
            socket.emit('end', data);
        });
        sink.on('wait', function(){
            socket.emit('wait', jobQueue.length);
        });
        sink.on('exception', function(data) {
            socket.emit('exception', data);
        });
        socket.on('disconnect', function() {
            updateLogs('CLIENT_DECONNECTED', socket);
            removeDisconnectJobToQueue(uid);
            if (screenshot) {
                unlinkScreenshot(uid + '.png');
            }
        });
        urlSafetyChecker.checkUrlSafety(data.url, function(err, result) {
            if (result !== false) {
                socket.emit('start', 3);
                updateLogs('NEW_VALIDATION', socket);
                displayTip(socket);
                newJob(checker, {
                    url: result,
                    events: sink,
                    sockets: socket,
                    profile: data.profile,
                    checklist: checklist,
                    id: uid,
                    SCREENSHOTS_DIR: SCREENSHOTS_DIR,
                    lang: "en"
                });
                step = 0;
            } else {
                socket.emit('unsafeUrl', data.url);
            }
        });
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});