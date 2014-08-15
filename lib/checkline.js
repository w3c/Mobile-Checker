var path = require('path')
,	proc = require('child_process')
,	url = require('url')
,	http = require('http')
,   headless = require('headless')
;

var Checker = function () {};

Checker.prototype.check = function (options) {
	//accepted options:
	//	- url : URL for a document to load
	//	- profile : smartphone profile
    //  - lang : language for translation
	//	- checklist : array of checks to do
	//	- events : where to send the various events
	if(!options.events) return this.throw("The events option is required for reporting.");
	if(!options.url) return this.throw("Without url there is nothing to check.");
    if(!options.profile) options.profile = 'default'; // warning to JS injection
    var l10n = require("./l10n")
    ,	profile = require('./profiles/' + options.profile)
    ,	sink = options.events
    ,	checklist = options.checklist
    ,	webAppData = {
            pageSpeed : null
        ,   head : new String()
        ,   documentWidth : null
        ,   html : new String()
    	,	success : null
    	,	errors : null
    	,	warning : null
    	,	loadTime : null
    	,	documentWidth : null
    	,	resources : new Array()
    	,	html : new Array()
    	,	css : new Array()
    	,	script : new Array()
    	,	checkResults : new Array()
    	}
    ,	self = this
    ;
    self.l10n = l10n;
    self.profile = profile;
    self.sink = sink;
    self.checklist = checklist;
    self.webAppData = webAppData;
    self.options = options;
    this.emulateBrowser(profile, options.url, options.ip);
};
Checker.prototype.emulateBrowser = function (profile, url, userId, callback) {
    self = this;
    var childArgs = [
        path.join(__dirname, 'mobile-browser-emulator.js')
    ,   url
    ,   profile.config.width
    ,   profile.config.height
    ]
    ,   stdoutBrowser = null
    ;
    var opt = {display: {width: 320, height: 700}};
    headless(opt,function(err, childProcess, servernum) {
        console.log('Xvfb running on server number', servernum);
        console.log('Xvfb pid', childProcess.pid);
        var browser = proc.spawn('nodejs', childArgs, {env:{ DISPLAY : ':' + servernum }});
        browser.stdout.on('data', function (data) {
            var buffer = data.toString();
            buffer = buffer.split(':stdout_key:');
            switch (buffer[0]) {
                case 'msg':
                    console.log(buffer[1]);
                break;
                case 'pageSpeed':
                    self.webAppData.pageSpeed = buffer[1];
                break;
                case 'head':
                    self.webAppData.head = buffer[1];
                break;
                case 'documentWidth':
                    self.webAppData.documentWidth = buffer[1];
                break;
                case 'metaviewports':
                    self.webAppData.metaviewports = JSON.parse(buffer[1]);
                case 'html':
                    self.webAppData.html = buffer[1];
                break;
                case 'data':
                    stdoutBrowser = buffer[1];
                break;
                default:
                    console.log(buffer);
                break;
            }
        });
        browser.stdout.on('close', function (exit) {
           console.log(self.webAppData.head);
           console.log(self.webAppData.documentWidth);
           console.log(self.webAppData.html);
           console.log(self.webAppData.pageSpeed);
           self.launchChecklist();
           self.sink.emit('end', this.webAppData);
        });
    });
};
Checker.prototype.launchChecklist = function () {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this);
};
exports.Checker = Checker;

