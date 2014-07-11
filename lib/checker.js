var util = require("util")
,   path = require('path')
,   childProcess = require('child_process')
;

var Checker = function () {};

Checker.prototype.check = function (options) {
	//accepted options:
	//	- url : URL for a document to load
	//	- profile : smartphone profile
	//	X checklist : which checks the Checker have to do // coming soon with option choices for users
	//	- events : where to send the various events
	//	- sockets : web sockets with socket.io
	if(!options.events) return this.throw("The events option is required for reporting.");
	if(!options.url) return this.throw("Without url there is nothing to check.");
    if(!options.profile) options.profile = 'default'; // attention à l'injection de code js
    console.log(options.profile);
    var self = this;
    var profile = require('./profiles/' + options.profile);
    var sink = options.events;
    var socket = options.sockets;
    var step = 0;
    var checklist = [];
    checklist[0] = require("./checks/speed");
    checklist[1] = require("./checks/responsive");
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
            dom : {}
        ,   html : {
                name : []
            ,   content : []
            }
        ,   css : {
                name : []
            ,   content : []
            }
        }
    };
    self.sink = sink;
    self.socket = options.sockets;
    self.step = step;
    self.reporting = reporting;
    self.checklist = checklist;
    self.profile = profile;
    self.options = options;
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
                reporting.sources.dom = buffer[1];
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
        self.checkout();
        self.end();
    });
};

Checker.prototype.done = function () {
    this.step = this.step + 1;
    this.socket.emit('done', this.step);
};
Checker.prototype.checkout = function () {
    this.checklist[0].check(this.reporting, this.profile, this.options);
    this.checklist[1].check(this.reporting, this.profile, this.options);
};
Checker.prototype.end = function () {
    this.socket.emit('end', this.reporting);
};

exports.Checker = Checker;