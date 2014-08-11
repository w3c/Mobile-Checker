var util = require("util")
,   path = require('path')
,   childProcess = require('child_process')
,   url = require('url')
;

var Checker = function () {};

Checker.prototype.check = function (options) {
	//accepted options:
	//	- url : URL for a document to load
	//	- profile : smartphone profile
    //  - lang : language for translation
	//	- checklist : which checks the Checker have to do // coming soon with option choices for users
	//	- events : where to send the various events
	if(!options.events) return this.throw("The events option is required for reporting.");
	if(!options.url) return this.throw("Without url there is nothing to check.");
    if(!options.profile) options.profile = 'default'; // warning to JS injection
    var self = this;
    var l10n = require("./l10n")
    var profile = require('./profiles/' + options.profile);
    var sink = options.events;
    var checklist = [];
        checklist = options.checklist;
    var sourceFiles = new Array();
    var resourcesReceived = new Array();
    var resources;
    var reporting = {
        settings : {

        }
    ,   overviews : {
            screenshot : ''
        }
    ,   analytics : {
            speed : 0
        ,   docWidth : 0
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
    self.reporting = reporting;
    self.checklist = checklist;
    self.profile = profile;
    self.options = options;
    self.l10n = l10n;
    var childArgs = [
        path.join(__dirname, 'phantomjs-script.js')
    ,   profile.config.width
    ,   profile.config.height
    ,   options.url
    ,   options.id
    ];
    var phantomjs = childProcess.spawn('phantomjs', childArgs);
    phantomjs.stdout.on('data', function (data) {
        var _data = data + '';
        var buffer = _data.split(':stdout_key:');
        switch (buffer[0]) {
            case 'screenshot':
                reporting.overviews.screenshot = buffer[1];
            break;
            case 'resource':
                resourcesReceived.push(buffer[1]);
            break;
            case 'css':
                var n = buffer[1].charAt(0);
                buffer[1] = buffer[1].replace(n,'');
                reporting.sources.css.content[n] = reporting.sources.css.content[n] + buffer[1];
            break;
            case 'html':
                reporting.sources.html.content[0] = buffer[1];
                //console.log(buffer[1]);
            break;
            //getDOM() don't work in phantom side
            case 'dom':
                reporting.sources.dom = buffer[1];
            break;
            case 'time':
                reporting.analytics.speed = buffer[1];
            break;
            case 'console':
                console.log(buffer[1]);
            break;
            case 'doc-width':
                reporting.analytics.docWidth = parseFloat(buffer[1]);
            break;
            case 'data':
                resources = JSON.parse(buffer[1]);
            break;
            default:
            //erreure
            break;
        }
    });
    phantomjs.on('close', function (code) {
        console.log('phantomjs process exited with code ' + code);
        //console.log(JSON.stringify(resources.resources[0].headers));
        self.checkout();

        self.end();
    });
};

Checker.prototype.getSourcesFiles = function () {
    var protocol
    ,   fileName
    ,   url
    ;
    for(index in this.resourcesRequested){
        this.resourcesRequested[index] = JSON.parse(this.resourcesRequested[index]);
    }
};
Checker.prototype.done = function () {
    this.step = this.step + 1;
    this.sink.emit('done', this.step);
};
Checker.prototype.checkout = function () {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this);
};
Checker.prototype.end = function () {
    this.sink.emit('end', this.reporting);
};

exports.Checker = Checker;