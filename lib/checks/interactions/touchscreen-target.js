var webdriver = require('selenium-webdriver');

var self = this;

exports.name = "touchscreen-target";
exports.category = "interactions";



exports.check = function (checker, browser) {
	var sink = checker.sink;
	browser.do ( function (driver) {
        return driver.executeScript(function (args){
            for (index in args.tags) {
                args.components.push(document.documentElement.getElementsByTagName(args.tags[index]));
            }
            return args.components;
        },{
            tags : ["button", "a", "input"]
        ,   components : new Array()
        }).then(function (data){
            var targets = {
                tag : new Array()
            ,   size : new Array()
            ,   location : new Array()
            ,   content : new Array()
            };
            for(var i in data) {
                for (var j in data[i]) {
                    //check dimensions
                }
            }
        });
    });
}
