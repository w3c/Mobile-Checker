var path = require('path')
,	proc = require('child_process')
,	url = require('url')
,	http = require('http')
,   headless = require('headless')
,   ejs = require('ejs')
,   filters = rootRequire('lib/ejs-filters')
,   fs = require('fs')
;

filters.loadFilters(ejs);

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
        profile = require('./profiles/' + options.profile)
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
        ,   viewport : {width:0, height:0, zoom: 0}
    	}
    ,	self = this
    ;
    self.profile = profile;
    self.sink = sink;
    self.checklist = checklist;
    self.webAppData = webAppData;
    self.options = options;
    this.emulateBrowser(profile, options.url, options.id);
};
Checker.prototype.emulateBrowser = function (profile, url, id, callback) {
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
        var Browser = rootRequire('lib/mobile-browser-emulator').Browser;
        var browser = new Browser(
            {browserWidth: profile.config.width,
             browserHeight: profile.config.height,
             uaHeader : 'Mozilla/5.0 (Linux; Android 4.4.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/36.0.1025.133 Mobile Safari/535.19',
             displayServer: servernum,
             browsermobProxy: { port: 8080},
             trackNetwork: true});
        browser.open(url);
        browser.on('error', function(err) {
            console.log(err);
        });
        browser.on('screenshot', function() {
            self.sink.emit('screenshot', self.webAppData);
        });
        browser.on('done', function() {
            self.sink.emit('end', self.webAppData);
        });
        browser.takeScreenshot("public/"+ id +".png");
        self.launchChecklist(browser);
        browser.close();
    });
};
Checker.prototype.launchChecklist = function (browser) {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this, browser);
};
Checker.prototype.report = function (sink, key, name, category, data) {
    var intl = require("intl");
    var str = fs.readFileSync(path.join(__dirname, '/issues/' +category+ '/' +name+ '/' +key+ '.ejs'), 'utf8');
    if(!data) var data = {};
    sink.emit('err', ejs.render(str, data));
    sink.emit('done');
}

exports.Checker = Checker;

