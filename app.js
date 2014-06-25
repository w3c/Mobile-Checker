var express = require("express"),
	  app = express(),
	  http = require('http').Server(app),
	  io = require('socket.io')(http),
	  version = require("./package.json").version,
    util = require("util"),
    checkline = require("./lib/checkline"),
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
  console.log('user connect');
  socket.on('url sent', function(options){
    var sink = new Sink;
    socket.emit('startprogress', 2);
    checkline.run(options, sink);
    step = 0;
    sink.on("stepdone", function(){
      step = step + 1;
      console.log('step' + step + 'done');
      socket.emit("inprogress", step);
      return step;
    });
    sink.on("getReport end", function(report){
      socket.emit("report", report);
      return report;
    });
  }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});