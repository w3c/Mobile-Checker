var express = require('express')
,   app = express()
,   http = require('http').Server(app)
, compress = require('compression')
,   fs = require('fs')
;

app.use(compress({
  threshold: 512
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
    res.sendfile('index.html');
});
app.get('/redirect.css', function (req, res) {
    res.redirect('/css/style.css');
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