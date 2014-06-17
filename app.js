var express = require("express"),
	  app = express(),
	  http = require('http').Server(app),
	  io = require('socket.io')(http),
	  version = require("./package.json").version,
    util = require("util"),
    checkline = require("./lib/checkline"),
    events = require("events");

var fs = require("fs");

app.use(express.static("public"));

function Sink () {}
util.inherits(Sink, events.EventEmitter);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/views', function(req, res){
  res.sendfile('./public/views.html');
});

app.get('/report', function(req, res){
  res.sendfile('./public/report.html');
});

app.get('/sources', function(req, res){
  res.sendfile('./public/sources.html');
});

app.get('/export', function(req, res){
  res.sendfile('./public/export.html');
});

io.on('connection', function(socket){
  console.log('user connect');
  socket.on('url sent', function(options){
    console.log(options);
    var sink = new Sink;
    checkline.run(options, sink);
    sink.on("getReport end", function(report){
      socket.emit("report", report);
    });
  }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});