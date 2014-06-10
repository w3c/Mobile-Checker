var express = require("express"),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	version = require("./package.json").version,
	checklist = {};

("speed-checker").split(" ")
         .forEach(function (p) {
             checklist[p] = require("./lib/checks/" + p);
});

app.use(express.static("public"));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
   socket.on('url sent', function(url){
    checklist["speed-checker"].check(url);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});