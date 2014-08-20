var path = require('path')
,	proc = require('child_process')
,	url = require('url')
,	http = require('http')
,   headless = require('headless')
,   ejs = require('ejs')
,   fs = require('fs')
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
    var self = this;
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
        var browser = rootRequire('lib/mobile-browser-emulator');
        browser.run(url, profile.config.width, profile.config.height, servernum, function (key, data) {
            if (key === 'close') {
                self.launchChecklist();
                console.log(self.webAppData.viewport);
                self.sink.emit('end', self.webAppData);
            } else if (key === 'error') {
                console.log(data);
            }
            self.webAppData[key] = data;
        });
    });
};
Checker.prototype.launchChecklist = function () {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this);
};
Checker.prototype.report = function (sink, key, name, category, data) {
    var str = fs.readFileSync(path.join(__dirname, '/issues/' +category+ '/' +name+ '/' +key+ '.ejs'), 'utf8');
    if(!data) var data = {};
    sink.emit('err', ejs.render(str, data));
    sink.emit('done');
}
exports.Checker = Checker;

