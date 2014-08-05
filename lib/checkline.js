// dependencies
var path = require('path')
,	childProcess = require('child_process')
,	url = require('url')
,	http = require('http')
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
    ,	dataElements = {
    		success : null
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
    self.dataElements = dataElements;

    this.emulateBrowser(profile, options.url, options.ip);
};

Checker.prototype.emulateBrowser = function (profile, url, userId, callback) {
    self = this;
    var childArgs = [
            path.join(__dirname, 'phantomjs-script.js')
        ,   profile.config.width
        ,   profile.config.height
        ,   url
        ,   userId
        ]
    ,   stdoutBrowser = null
    ;
    var browser = childProcess.spawn('phantomjs', childArgs);
    browser.stdout.on('data', function (data) {
        var buffer = data.toString();
        var buffer = buffer.split(':stdout_key:');
        switch (buffer[0]) {
            case 'msg':
                console.log(buffer[1]);
            break;
            case 'data':
                stdoutBrowser = buffer[1];
            break;
            default:
                console.log("unmanaged data received on stdout browser");
            break;
        }
    });
    browser.on('close', function (exit) {
        console.log("browser process exited: " + exit);
        if(stdoutBrowser) self.initDataElements(JSON.parse(stdoutBrowser), callback);
    });
};

Checker.prototype.initDataElements = function (data, callback) {
    this.dataElements.loadTime = data.loadTime;
    this.dataElements.documentWidth = data.documentWidthWidth;
    for (index in data.resources) {
        var fileName = url.parse(data.resources[index].url).pathname.split('/').pop();
        this.dataElements.resources.push(data.resources[index]);
        if (data.resources[index].contentType == "text/html") {
            if (fileName.length == 0) fileName = "index.html";
            //this.dataElements.html[fileName] = this.downloadSource(data.resources[index].url);
            this.downloadSource(data.resources[index].url);
        } 
        else if (data.resources[index].contentType == "text/css") {
            //this.dataElements.css[fileName] = this.downloadSource(data.resources[index].url);
            this.downloadSource(data.resources[index].url);
            console.log(this.downloadSource(data.resources[index].url));
        }
        
    }
    
};

Checker.prototype.downloadSource = function (url) {
    self = this;
    var data;
    http.get(url, function(res) {
        res.on('data', function (chunk) { 
            data = chunk.toString();
            
        });
    });
    return data;
};

Checker.prototype.loadSource = function (resource, callback) {
    
};

Checker.prototype.checkout = function () {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this);
};

exports.Checker = Checker;

