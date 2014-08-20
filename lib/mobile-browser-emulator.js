var webdriver = require('selenium-webdriver');

var Browser = function (config) {
    var width, height, display, uaHeader, trackNetwork, browsermobProxy
    , proxy, driver;

    var networkDataGatheringDone = function () {};
    var self = this;

    function init() {
        config = config || {};
        width = config.browserWidth || 320;
        height = config.browserHeight || 480;
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
        driver = chrome.createDriver(capabilities, chromeservicebuilder);
    }

    function get(url, done) {
        var time = Date.now();
        return driver.get(url).then(function(){
	    time = Date.now() - time;
	    self.emit('pageSpeed', time);
        }).then( function () {
            return self.do(
                function (driver) {
                    return setViewPort(driver);
                }
            )
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
    function dontGiveUpOnModal(f, count) {
        if (!count) {
            count = 10;
        }
        return f().then(
            undefined, // pass through success
            function (err) {
                if (err.name === "UnexpectedAlertOpenError" && count > 0) {
                    // dismiss alert and retry
                    return driver.switchTo().alert().dismiss().then(function () { dontGiveUpOnModal(f, count - 1); });
                }
                self.emit('error', err);
            }
        );
    }


    function setViewPort (driver) {
	var contentAttr;
	var renderingData;
	return driver.findElements(webdriver.By.css('meta[name="viewport"]')).then(function(viewportDecls){
            // return all the metaviewports found
            webdriver.promise.map(
                viewportDecls,
                function (el) {  return el.getAttribute("content");}
            ).then(
                function (contentAttrs) {
                    self.emit('metaviewports', contentAttrs);
                    contentAttr = contentAttrs[contentAttrs.length - 1];
                }
            );
	}).then(function(){
	    if(contentAttr) {
		var viewportProps = metaparser.parseMetaViewPortContent(contentAttr);

		renderingData = metaparser.getRenderingDataFromViewport(viewportProps.validProperties, width, height, 4, 0.25 );
	    } else {
        	renderingData = { zoom: null, width: width*3, height: height*3 };
    	    }
            self.emit('viewport', renderingData);
    	    return driver.manage().window().setSize(renderingData.width, renderingData.height);
	});
    }


    var close = function () {
        return self.do( function (driver) {
            networkDataGatheringDone();
            self.emit('done');
            //driver.quit();
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
                    return get(url).then(close);
                };
            };

            proxy.cbHAR({name: url, captureHeaders: true}, setupProxyAndGet(), reportNetworkTraffic);
        } else {
            setupBrowser();
            return get(url).then(close);
        }
    };

    this.do = function(fn) {
        return dontGiveUpOnModal(function () {
            return fn(driver);
        });
    };

    this.takeScreenshot = function (path) {
        return self.do(function () {
            driver.takeScreenshot().then(function(data){
                var base64Data = data.replace(/^data:image\/png;base64,/,"")
                fs.writeFile("public/screenshot.png", base64Data, 'base64', function(err) {
                    if(err) cb('error', err);
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