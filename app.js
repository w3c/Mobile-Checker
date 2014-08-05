var express = require("express"),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
    util = require("util"),
    Checker = require("./lib/checker").Checker,
    events = require("events"),
    logger  = require('morgan');

var fs = require("fs");
var step;
var checklist = [
    require('./lib/checks/performance/load-speed')
,   require('./lib/checks/responsive/doc-width')
,   require('./lib/checks/responsive/meta-viewport')
];

app.use(logger());
app.use(express.static("public"));

function Sink () {}
util.inherits(Sink, events.EventEmitter);


app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    var address = socket.handshake.address;
    socket.on('check', function(data){
        var sink = new Sink
        ,   checker = new Checker
        ;
        sink.on('ok', function(msg){
            //console.log(msg);
            socket.emit('ok', msg);
        });
        sink.on('warning', function(msg){
            //console.log(msg);
            socket.emit('warning', msg);
        });
        sink.on('err', function(msg){
            console.log(msg);
            socket.emit('err', msg);
        });
        sink.on('done', function(){
            step++;
            console.log('step done');
            socket.emit('done', step);
        });
        sink.on('end', function(report){
            socket.emit('end', report);
        });
        socket.emit('start', 3);
        checker.check({
            url : data.url
        ,   events : sink
        ,   sockets : socket
        ,   widthView : data.widthView
        ,   heightView : data.heightView
        ,   profile : data.profile
        ,   checklist : checklist
        ,   ip : address
        ,   lang : "en"
        });
        step = 0;
    }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});