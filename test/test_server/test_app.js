var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    compress = require('compression'),
    fs = require('fs');


var serverport;

app.use(compress({
    threshold: 2048
}));


app.get('/', function(req, res) {
    res.sendfile('index.html');
});
app.get('/redirect.css', function(req, res) {
    res.redirect('/css/style.css');
});

app.get('/scheme-relative-redirect', function(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "//0.0.0.0:" + serverport + "/js/script.js");
    res.end();
});

exports.start = function(port, path) {
    path = path || '/public';
    path = __dirname + path;
    console.log(path);
    app.use(express.static(path));

    serverport = port || 3001;
    http.listen(port, function() {
        console.log('listening on *:' + serverport);
    });
};

exports.close = function() {
    http.close();
};
