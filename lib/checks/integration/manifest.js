// check if there is a JSON manifest
// and if there is, if it is valid
/**
 * @module manifest
 * @requires schema-validator
 */
var SchemaValidator = require('jsonschema').Validator;
var manifestschema = require('./web-manifest.json');
var request = require("request");
var url = require("url");

var self = this;

exports.name = "manifest";
exports.category = "integration";
exports.check = function(checker, browser) {
    function checkUrl(urlRef, baseUrl, type) {
        var absUrl;
        try {
            absUrl = url.resolve(baseUrl, urlRef);
        } catch (e) {
            checker.report("invalidurl_property", self.name,
                           self.category, "warning", {
                               manifest: baseUrl,
                               property: type,
                               url: urlRef,
                               error: e.name
                           });
            return;
        }
        request(absUrl, function (error, response, body) {
            if (error) {
                checker.report("networkerror_property", self.name,
                               self.category, "warning", {
                                   manifest: baseUrl,
                                   property: type,
                                   url: absUrl,
                                   error: error
                               });

                return;
            }
            if (response.statusCode >= 400) {
                checker.report("httperror_property" , self.name,
                               self.category, "warning", {
                                   manifest: baseUrl,
                                   property: type,
                                   url: absUrl,
                                   error: response.statusCode
                               });
                return;
            }
        });
}


    browser.do(function(driver) {
        return driver.findElements(browser.webdriver.By.css('link[rel="manifest"]'))
            .then(function(manifestLinks) {
                // return all the manifests found
                browser.webdriver.promise.map(
                    manifestLinks,
                    function(el) {
                        return el.getAttribute("href");
                    }
                ).then(function(manifests) {
                    if (!manifests || !manifests.length) {
                        return;
                    }
                    var manifest = manifests[0];
                    if (manifests.length > 1) {
                        checker.report("multiple-manifests", self.name,
                                       self.category, "warning", {
                                           links: manifests.slice(1)
                                       });
                    }
                    request(manifests[0], function (error, response, body) {
                        if (error) {
                            checker.report("httperror", self.name,
                                           self.category, "warning", {
                                               manifest: manifest,
                                               error: error
                                       });
                            return;
                        }
                        if (response.statusCode >= 400) {
                            checker.report("httperror", self.name,
                                           self.category, "warning", {
                                               manifest: manifest,
                                               httperror: response.statusCode
                                       });
                            return;
                        }
                        var data;
                        try {
                            data = JSON.parse(body);
                        } catch (e) {
                            checker.report("jsonerror", self.name,
                                           self.category, "warning", {
                                               manifest: manifest,
                                               error: {name: e.name, message: e.message}
                                           });
                            return;
                        }
                        var validator = new SchemaValidator();
                        var check = validator.validate(data, manifestschema);
                        if (check.errors.length > 0) {
                            checker.report("jsonserror", self.name,
                                           self.category, "warning", {
                                               manifest: manifest,
                                               errors: check.errors
                                           });
                        }
                        // Verify URLs are dereferencable
                        if (data.start_url) {
                            checkUrl(data.start_url, manifest, "start_url");
                        }
                        if (data.icons && data.icons.length > 0) {
                            data.icons.forEach( function (icon) {
                                if (icon.src) {
                                    checkUrl(icon.src, manifest, "icon");
                                    // TODO: more tests on icons
                                    // e.g. matching their size with sizes property?
                                    // ensuring that "typical" sizes are provided?
                                }
                            });
                        }
                    });
                });
            });
    });
};

