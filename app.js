var express = require("express"),
	  app = express(),
	  http = require('http').Server(app),
	  io = require('socket.io')(http),
	  version = require("./package.json").version,
    util = require("util"),
    checkline = require("./lib/checkline"),
    events = require("events");

app.use(express.static("public"));

function Sink () {}
util.inherits(Sink, events.EventEmitter);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('user connect');
  socket.on('url sent', function(url){
    var sink = new Sink;
    checkline.run(url, sink);
    sink.on("getReport end", function(_page){
      console.log(_page.title);
      socket.emit("report", _page);
    });
  }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});