var util = require("util")
,   path = require('path')
,   childProcess = require('child_process')
//,   phantomjs = require('phantomjs')
//,   binPath = phantomjs.path
;

var Checker = function () {};

Checker.prototype.check = function (options) {
	//accepted options:
	//	- url : URL for a document to load
	//	- profile : smartphone profile
	//	- checklist : which checks the Checker have to do
	//	- events : where to send the various events
	//	- sockets : web sockets with socket.io
	if(!options.events) return this.throw("The events option is required for reporting.");
	if(!options.url) return this.throw("Without url there is nothing to check.");
    if(!options.profile) options.profile = 'default'; // attention à l'injection de code js
    var self = this;
    var profile = require('./profiles/' + options.profile);
    var sink = options.events;
    var socket = options.sockets;
    var step = 0;
    self.sink = sink;
    self.socket = options.sockets;
    self.step = step;
    var reporting = {
        settings : {

        }
    ,   overviews : {
            screenshot : ''
        }
    ,   analytics : {
            speed : 0
        ,   errors : []
        ,   warning : []
        }
    ,   sources : {
            html : {
                name : []
            ,   content : []
            }
    ,   css : {
                name : []
            ,   content : []
            }
        }
    };
    self.reporting = reporting;
    var childArgs = [
        path.join(__dirname, 'phantomjs-script.js')
    ,   profile.config.width
    ,   profile.config.height
    ,   options.url
    ,   options.ip
    ];
    var phantomjs = childProcess.spawn('phantomjs', childArgs);
    this.done();
    phantomjs.stdout.on('data', function (data) {
        var _data = data + '';
        var buffer = _data.split(':stdout_key:');
        switch (buffer[0]) {
            case 'screenshot':

                reporting.overviews.screenshot = buffer[1];
                console.log(reporting.overviews.screenshot);
            break;
            case 'css':
                var n = buffer[1].charAt(0);
                buffer[1] = buffer[1].replace(n,'');
                reporting.sources.css.content[n] = reporting.sources.css.content[n] + buffer[1];
            break;
            case 'html':
                reporting.sources.html.content[0] = buffer[1];
            break;
            //getDOM() don't work in phantom side
            case 'dom':
            break;
            case 'time':
                reporting.analytics.speed = buffer[1];
            break;
            default:
            break;
        }
    });
    phantomjs.on('close', function (code) {
        self.done();
        console.log('phantomjs process exited with code ' + code);
        //console.log(testdom); -> don't work in phantom side
        self.end();
    });
};

Checker.prototype.done = function () {
    this.step = this.step + 1;
    this.socket.emit('done', this.step);
};
Checker.prototype.checkout = function () {
	//checklist["scrolling"].check(_document, options);
    //checklist["loadspeed"].check(_speed);
};
Checker.prototype.end = function () {
    this.socket.emit('end', this.reporting);
};

exports.Checker = Checker;



    /*("scrolling loadspeed").split(" ").forEach(function (p) {
        checklist[p] = require("./checks/" + p);
    });*/