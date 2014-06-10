var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	version = require("./package.json").version;

app.use(express.static("public"));

app.get('/', function (req, res){
	res.sendfile('index.html');
});

app.listen(8080);