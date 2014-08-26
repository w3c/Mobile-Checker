global.rootRequire = function(name) {
    return require(__dirname + '/../' + name);
}

var Browser = require("../lib/mobile-browser-emulator").Browser,
    expect = require("expect.js"),
    webdriver = require('selenium-webdriver');



describe("Starting and quiting browser", function() {
    it('should start and stop without error with correct proxy', function(
        done) {
        var browser = new Browser({
            port: 8080,
            trackNetwork: true
        });
        browser.on('error', function(msg) {
            expect().fail(msg);
            done();
        });
        browser.open("file://" + __dirname + "/browser-tests/ok.html");
        browser.do(function() {
            done();
            return webdriver.promise.fulfilled();
        });
        browser.close();
    });

    it('should emit an error with incorrect proxy', function(done) {
        var browser = new Browser({
            browsermobProxy: {
                port: 8081
            },
            trackNetwork: true
        });
        browser.on('error', function(err) {
            expect(err.message).to.be(
                'Failed gathering network traffic: Error: connect ECONNREFUSED'
            );
            done();
        });
        browser.open("file://" + __dirname + "/browser-tests/ok.html");
        browser.close();
    });

});

describe("Getting data from browser", function() {
    var browser = new Browser();

    it('should return the title of the page "OK"', function(done) {
        browser.open("file://" + __dirname + "/browser-tests/ok.html");
        browser.do(function(driver) {
            return driver.findElement(webdriver.By.tagName('title'))
                .then(function(title) {
                    title.getInnerHtml().then(function(
                        titleText) {
                        expect(titleText).to.be('OK');
                        done();
                    });
                });
        });
        browser.close();

    });

    it('should return the title of the page "Alert", even with an alert',
        function(done) {
            browser.open("file://" + __dirname +
                "/browser-tests/alert.html");
            browser.do(function(driver) {
                return driver.findElement(webdriver.By.tagName('title'))
                    .then(function(title) {
                        title.getInnerHtml().then(function(
                            titleText) {
                            expect(titleText).to.be('Alert');
                            done();
                        });
                    });
            });
            browser.close();
        });

    it(
        'should return the title of the page "Alert2", even with a delayed alert',
        function(done) {
            browser.open("file://" + __dirname +
                "/browser-tests/alert2.html");
            setTimeout(function() {
                browser.do(function(driver) {
                    return driver.findElement(webdriver.By.tagName(
                        'title')).then(function(title) {
                        title.getInnerHtml().then(function(
                            titleText) {
                            expect(titleText).to.be(
                                'Alert2');
                            done();
                        });
                    });
                });
                browser.close();
            }, 2500);

        });


});

describe("Getting data from network", function() {
    var server = require("./test_server/test_app.js");
    var browser = new Browser({
        browsermobProxy: {
            port: 8080
        },
        trackNetwork: true
    });

    before(function() {
        server.start(3001, '/../browser-tests');
    });

    it("should get the status code of a loadable page", function(done) {
        browser.on('har', function(har) {
            expect(har.log.entries[0].response.status).to.be(200);
            done();
        });
        browser.open("http://localhost:3001/ok.html");
        browser.close();
    });

    after(function() {
        server.close();
    });
});

describe("Getting data from browser and network", function() {
    var server = require("./test_server/test_app.js");
    var browser = new Browser({
        browsermobProxy: {
            port: 8080
        },
        trackNetwork: true
    });
    before(function() {
        server.start(3001, '/../browser-tests');
    });

    it("should get the status code and title of a loadable page", function(
        done) {
        browser.on('har', function(har) {
            expect(har.log.entries[0].response.status).to.be(200);
            done();
        });
        browser.open("http://localhost:3001/ok.html");
        browser.do(function(d) {
            return d.findElement(webdriver.By.tagName('title')).then(
                function(title) {
                    title.getInnerHtml().then(function(
                        titleText) {
                        expect(titleText).to.be('OK');
                    });
                });
        });
        browser.close();
    });

    after(function() {
        server.close();
    });
});
