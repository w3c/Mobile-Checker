/**
 * @file
 */
/**
 * @module checker
 * @requires path
 * @requires child_process
 * @requires url
 * @requires http
 * @requires headless
 * @requires ejs
 * @requires fs
 */
var path = require('path'),
    proc = require('child_process'),
    url = require('url'),
    http = require('http'),
    headless = require('headless'),
    ejs = require('ejs'),
    fs = require('fs'),
    browserEmulator = require('mobile-web-browser-emulator'),
    formatter = require('./reports/format.js');

var filters = rootRequire('lib/ejs-filters');

filters.loadFilters(ejs);

/**
 * @class
 */
var Checker = function() {};


/**
 * @augments Checker
 * @param {Object} options
 * @param {String} options.url URL for a document to load
 * @param {String} options.profile profile of the device selected
 * @param {Array} options.checklist array of checks to do
 * @param {} options.events where to send the various events
 * @param {Number} options.id generated id to save an unique screenshot
 */
Checker.prototype.check = function(options) {
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
/**
 * @augments Checker
 * @param {Object} profile device's profile
 * @param {Number} profile.width device's width
 * @param {Number} profile.height device's height
 * @param {String} url URL for a document to load
 */
Checker.prototype.emulateBrowser = function(profile, url) {
    var self = this;
    var opt = {
        display: {
            width: profile.width,
            height: profile.height
        }
    };
    headless(opt, function(err, childProcess, servernum) {
        var Browser = browserEmulator.Browser;
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
            browser.close();
            childProcess.kill();
        });
        browser.on('screenshot', function(path) {
            self.sink.emit('screenshot', path.substring(7));
        });
        browser.on('done', function() {
            self.sink.emit('end');
        });
        self.launchChecklist(browser);
        browser.close(childProcess);
    });
};
/**
 * @augments Checker
 * @param {Object} browser browser object which emulate a mobile browser
 */
Checker.prototype.launchChecklist = function(browser) {
    for (var i = 0; i < this.checklist.length; i++)
        this.checklist[i].check(this, browser);
};
/**
 * @augments Checker
 * @param {String} key represent the key of the send issue
 * @param {String} name name of the done check
 * @param {String} category of the concerned check
 * @param {Object} data optional data send with check result
 */
Checker.prototype.report = function(key, name, category, status, data) {
    var self = this;
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
        this.formatReport(key, name, category, status, data, function (rep) {
            self.sink.emit('err', {
                "issue": rep,
                "status": status
            });
            self.sink.emit('done');
        });
    }
};

/**
 * @augments Checker
 * @param {String} key represent the key of the send issue
 * @param {String} name name of the done check
 * @param {String} category of the concerned check
 * @param {Object} data optional data send with check result
 */
function reportFormatter(key, name, category, status, data, cb) {
    var str = fs.readFileSync(path.join(__dirname, '/reports/' + category + '/' +
        name + '/' + key + '.ejs'), 'utf8');
    data = data || {};
    data.name = name;
    data.category = category;
    formatter.format(ejs.render(str, data), status, category, cb);
}
/**
 * @augments Checker
 * @param {} sink events
 * @param {String} msg error message to send to client console via sink event
 */
Checker.prototype.throw = function(sink, msg) {
    if (!sink) return console.error(
        "[BOOM] No event sink with which to report system errors.\nAlso: " +
        msg);
    sink.emit("exception", msg);
};

exports.Checker = Checker;
