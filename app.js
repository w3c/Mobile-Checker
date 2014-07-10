var express = require("express"),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	version = require("./package.json").version,
    util = require("util"),
    Checker = require("./lib/checker").Checker,
    events = require("events"),
    Q = require('q'),
    logger  = require('morgan');

var fs = require("fs");
var step;

app.use(logger());
app.use(express.static("public"));

function Sink () {}
util.inherits(Sink, events.EventEmitter);


app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    var address = socket.handshake.address;
    console.log("New connection from " + address.address + ":" + address.port);
    socket.on('check', function(options){
        var sink = new Sink;
        
        sink.on("stepdone", function(){
            step = step + 1;
            console.log('step' + step + 'done');
            socket.emit('done', step);
            return step;
        });
        sink.on("getReport end", function(report){
            console.log("on envoie le rapport");
            socket.emit("end", report);
        return report;
        });
        checkout = new Checker();
        socket.emit('start', 7);
        checkout.check({
            url : options.url
        ,   events : sink
        ,   sockets : socket
        ,   widthView : options.widthView
        ,   heightView : options.heightView
        ,   ip : address.address
        });
        step = 0;
    }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});