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


exports.start = function (port) {
    port = port || 3001;
    http.listen(port, function(){
        console.log('listening on *:' + port);
    });
};

exports.close = function () {
    http.close();
};