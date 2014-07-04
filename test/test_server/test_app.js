var express = require('express')
,   app = express()
,   http = require('http').Server(app)
,   fs = require('fs')
;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
    res.sendfile('index.html');
});
app.get('/width_success', function (req, res){
    res.sendfile('./public/docs/width_success.html');
});
app.get('/width_fail', function (req, res){
    res.sendfile('./public/docs/width_fail.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});