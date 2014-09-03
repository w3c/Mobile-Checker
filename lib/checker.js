var path = require('path'),
    proc = require('child_process'),
    url = require('url'),
    http = require('http'),
    headless = require('headless'),
    ejs = require('ejs'),
    fs = require('fs');

var filters = rootRequire('lib/ejs-filters');

filters.loadFilters(ejs);

var Checker = function() {};

Checker.prototype.check = function(options) {
    //accepted options:
    //	- url : URL for a document to load
    //	- profile : smartphone profile
    //  - lang : language for translation
    //	- checklist : array of checks to do
    //	- events : where to send the various events
    //  - id : generated id to save an unique screenshot
    if (!options.events) return this.throw(
        "The events option is required for reporting.");
    if (!options.url) return this.throw(options.events,
        "Without url there is nothing to check.");
    if (!options.checklist) return this.throw(options.events,
        "Without checklist there is nothing to check");
    if (!options.id) return this.throw(options.events,
        "Without id, the app can't generate screenshot");

    var self = this,
    sink = options.events,
    checklist = options.checklist,
    resume = {
        ok: 0,
        issues: 0
    };
    self.sink = sink;
    self.checklist = checklist;
    self.resume = resume;
    self.options = options;
    self.formatReport = options.formatReport || reportFormatter;
    self.id = options.id;

    fs.readdir(path.join(__dirname, "profiles"), function(err, files) {
        var validProfiles = files;
        if (!options.profile || validProfiles.indexOf(options.profile + ".json") === -1) {
            options.profile = 'default';
        }
        var profile = require('./profiles/' + options.profile + '.json');
        self.profile = profile;

        self.emulateBrowser(profile, options.url);
    });

};
Checker.prototype.emulateBrowser = function(profile, url) {
    var self = this;
    var opt = {
        display: {
            width: profile.width,
            height: profile.height
        }
    };
    headless(opt, function(err, childProcess, servernum) {
        var Browser = rootRequire('lib/mobile-browser-emulator').Browser;
        var browser = new Browser({
            browserWidth: profile.width,
            browserHeight: profile.height,
            uaHeader: 'Mozilla/5.0 (Linux; Android 4.4.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/36.0.1025.133 Mobile Safari/535.19',
            displayServer: servernum,
            browsermobProxy: {
                port: 8080
            },
            trackNetwork: true
        });
        browser.open(url);
        browser.on('error', function(err) {
            console.log(err);
        });
        browser.on('screenshot', function(path) {
            self.sink.emit('screenshot', path.substring(7));
        });
        browser.on('done', function() {
            self.sink.emit('end');
        });
        self.launchChecklist(browser);
        browser.close();
    });
};
Checker.prototype.launchChecklist = function(browser) {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this, browser);
};
Checker.prototype.report = function(key, name, category, data) {
    this.resume[name] = key;
    if (key == "ok") {
        this.resume.ok++;
        this.sink.emit('done');
    } else {
        this.resume.issues++;
        var intl = require("intl");
        if (!data) {
            data = {};
        }
        data.name = name;
        data.category = category;
        this.sink.emit('err', this.formatReport(key, name, category, data));
        this.sink.emit('done');
    }
};


function reportFormatter(key, name, category, data) {
    var str = fs.readFileSync(path.join(__dirname, '/issues/' + category + '/' +
        name + '/' + key + '.ejs'), 'utf8');
    data = data || {};
    return ejs.render(str, data);
}

Checker.prototype.throw = function(sink, msg) {
    if (!sink) return console.error(
        "[BOOM] No event sink with which to report system errors.\nAlso: " +
        msg);
    sink.emit("exception", msg);
};
exports.Checker = Checker;