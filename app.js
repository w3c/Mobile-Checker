/*
 *  see documentation at http://guibbs.github.io/Mobile-Checker-Documentation/
 */
/**
 * @file
 * @requires express
 * @requires http
 * @requires socket.io
 * @requires util
 * @requires checker.js
 * @requires events
 * @requires morgan
 * @requires node-uuid
 * @requires url
 * @requires child_process
 * @requires checkremote.js
 * @requires fs
 */
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
    fs = require("fs");

var checklist = [
    require('./lib/checks/performance/number-requests'), require(
        './lib/checks/performance/redirects'), require(
        './lib/checks/performance/http-errors'), require(
        './lib/checks/performance/compression'), require(
        './lib/checks/responsive/doc-width'), require(
        './lib/checks/responsive/meta-viewport'), require(
        './lib/checks/responsive/fonts-size'), require(
        './lib/checks/responsive/screenshot'), require(
        './lib/checks/compatibility/flash-detection'), require(
        './lib/checks/compatibility/css-prefixes'), require(
        './lib/checks/interactions/alert'), require(
        './lib/checks/interactions/touchscreen-target')
];

app.use(express.static('public'));

function Sink() {}
util.inherits(Sink, events.EventEmitter);


io.on('connection', function(socket) {
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
            console.log('done');
            socket.emit('done');
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
                });
            }
        });
        urlSafetyChecker.checkUrlSafety(data.url, function(err, result) {
            if (result != false) {
                socket.emit('start', 3);
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
                checker.check({
                    url: result,
                    events: sink,
                    sockets: socket,
                    profile: data.profile,
                    checklist: checklist,
                    id: uid,
                    lang: "en"
                });
                step = 0;
            } else {
                socket.emit('unsafeUrl', data.url);
            }
        })

    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});