global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    util = require("util"),
    Checker = require("./lib/checker").Checker,
    events = require("events"),
    logger = require('morgan'),
    uuid = require('node-uuid'),
    proc = require('child_process');


var fs = require("fs");
var step;
var checklist = [
    require('./lib/checks/performance/number-requests'), require(
        './lib/checks/performance/redirects'), require(
        './lib/checks/performance/http-errors'), require(
        './lib/checks/performance/compression'), require(
        './lib/checks/responsive/doc-width'), require(
        './lib/checks/responsive/meta-viewport'), require(
        './lib/checks/responsive/fonts-size'), require(
        './lib/checks/compatibility/flash-detection'), require(
        './lib/checks/compatibility/css-prefixes'), require(
        './lib/checks/interactions/alert'), require(
        './lib/checks/interactions/touchscreen-target')
];

app.use(logger());
app.use(express.static("public"));

function Sink() {}
util.inherits(Sink, events.EventEmitter);


app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    var address = socket.handshake.address;
    socket.on('check', function(data) {
        var sink = new Sink,
            checker = new Checker,
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
            step++;
            console.log('done');
            socket.emit('done', step);
        });
        sink.on('end', function(data) {
            socket.emit('end', data);
        });
        sink.on('exception', function(data) {
            socket.emit('exception', data);
        });
        socket.on('disconnect', function() {
            io.sockets.emit('user disconnected');
            if (screenshot) {
                fs.unlink('public/' + uid + '.png', function(err) {
                    if (err) throw err;
                    console.log('delete with success');
                });
            }
        });
        socket.emit('start', 3);
        checker.check({
            url: data.url,
            events: sink,
            sockets: socket,
            profile: data.profile,
            checklist: checklist,
            id: uid,
            lang: "en"
        });
        step = 0;
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
