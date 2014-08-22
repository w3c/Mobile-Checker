var webdriver = require('selenium-webdriver');
var metaparser = rootRequire('lib/metaviewport-parser');
var fs = require("fs");

var Browser = function (config) {
    var display, uaHeader, trackNetwork, browsermobProxy
    , proxy, driver;

    var networkDataGatheringDone = function () {};
    var self = this;
    var flow = webdriver.promise.controlFlow();
    var driverPromise = new webdriver.promise.Deferred();

    function init() {
        config = config || {};
        self.viewport = {};
        self.width = config.browserWidth || 320;
        self.height = config.browserHeight || 480;
        self.desktopWidth = config.browserDekstopWidth || self.width * 3;
        self.desktopHeight = config.browserDekstopHeight || self.height * 3;
        display = config.displayServer || 0;
        uaHeader = config.uaHeader || "";
        trackNetwork = config.trackNetwork || false;
        browsermobProxy = config.browsermobProxy || {'host':'localhost', 'port':8080};
    }

    function setupProxy() {
        var Proxy = require('browsermob-proxy').Proxy;
        proxy = new Proxy({port: browsermobProxy.port, host: browsermobProxy.host});
    }

    function setupBrowser(proxyAddr) {
        var chromedriver = require("chromedriver");
        var chrome = require("selenium-webdriver/chrome");
        var proxy = require('selenium-webdriver/proxy');
        var capabilities = webdriver.Capabilities.chrome();

        if (proxyAddr) {
            var proxyPrefs = proxy.manual({http: proxyAddr, https: proxyAddr});
            capabilities.set(webdriver.Capability.PROXY, proxyPrefs);
        }

        // enabling metaviewport
        var options = new chrome.Options();
        options.addArguments(["--enable-viewport-meta"]);

        if (uaHeader) {
            options.addArguments(['--user-agent=' + uaHeader]);
        }

        capabilities.merge(options.toCapabilities());

        var chromeservicebuilder = new chrome.ServiceBuilder(chromedriver.path).withEnvironment({DISPLAY:':' + display}).build();
        driver = chrome.createDriver(capabilities, chromeservicebuilder)
    }

    function get(url, done) {
        var time = Date.now();
        return driver.get(url).then(function(){
	    time = Date.now() - time;
	    self.emit('pageSpeed', time);
        }).then( function () {
	    return dontGiveUpOnModal(function(d) {
                return setViewPort(d);
            }, driver);
        });
    }

    function reportNetworkTraffic(err, har) {
        var data;
        if (err) {
            self.emit('error', new Error("Failed gathering network traffic: " + err));
            return;
        }
        try {
            data = JSON.parse(har);
        } catch (e) {
            self.emit('error', new Error("Failed to parse network traffic data from proxy"));
            return;
        }
        self.emit('har', data);
    }

    // dontGiveUp from https://gist.github.com/domenic/2936696
    // we need to protect any code sent to the drivder
    // from UnexpectedAlertOpenError
    // we dismiss alerts 10 times at most
    function dontGiveUpOnModal(f, d, count) {
        if (!count) {
            count = 10;
        }
        return f(d).then(
            undefined, // pass through success
            function (err) {
                if (err.name === "UnexpectedAlertOpenError" && count > 0) {
                    // dismiss alert and retry
                    return d.switchTo().alert().dismiss().then(function () { dontGiveUpOnModal(f, d, count - 1); });
                }
                self.emit('error', err);
            }
        );
    }


    function setViewPort(d) {
	var contentAttr;
        return d.findElements(webdriver.By.css('meta[name="viewport"]')).then(function(viewportDecls){
            // return all the metaviewports found
            webdriver.promise.map(
                viewportDecls,
                function (el) {  return el.getAttribute("content");}
            ).then(
                function (contentAttrs) {
                    contentAttr = contentAttrs[contentAttrs.length - 1];
                }
            );
	}).then(function(){
	    if(contentAttr) {
		var viewportProps = metaparser.parseMetaViewPortContent(contentAttr);
		self.viewport = metaparser.getRenderingDataFromViewport(viewportProps.validProperties, self.width, self.height, 4, 0.25 );
	    } else {
        	self.viewport = { zoom: null, width: self.desktopWidth, height: self.desktopHeight };
    	    }
    	    return d.manage().window().setSize(self.viewport.width, self.viewport.height).then(driverPromise.fulfill(d));
	});
    }


    var close = function () {
        return self.do( function (d) {
            networkDataGatheringDone();
            self.emit('done');
            //d.quit();
            return webdriver.promise.fulfilled();
        });
    }

    this.open = function (url) {
        if (trackNetwork) {
            setupProxy();
            var setupProxyAndGet = function () {
                return function (proxyAddr, done) {
                    setupBrowser(proxyAddr);
                    networkDataGatheringDone = done;
                    flow.execute(function () {
                        get(url).then(close);
                    });
                };
            };
            flow.execute(function () {
                proxy.cbHAR({name: url, captureHeaders: true}, setupProxyAndGet(), reportNetworkTraffic);
            });
        } else {
            setupBrowser();
            return get(url).then(close);
        }
    };

    this.do = function(fn) {
        driverPromise.then(function(d) {
            return dontGiveUpOnModal(function () {
                return flow.execute(
                    function () {
                        fn(d);
                    });
            }, d);
        });
    };

    this.takeScreenshot = function (path) {
        return self.do(function (d) {
            d.takeScreenshot().then(function(data){
                var base64Data = data.replace(/^data:image\/png;base64,/,"")
                fs.writeFile(path, base64Data, 'base64', function(err) {
                    if (err) {
                        self.emit('error', err);
                    } else {
                        self.emit('screenshot',path);
                    }
                });
            });
        });
    }

    init();
}

var EventEmitter = require('events').EventEmitter;
var util = require('util');
util.inherits(Browser, EventEmitter);

exports.Browser = Browser;