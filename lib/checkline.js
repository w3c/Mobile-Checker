exports.name = "checkline";

exports.run = function(options, sink){
	var phantom = require('phantom'),
    Q = require('q'),
    util = require("util");

	var checklist = {};

    var _ph,
        _page,
        _time,
        _document,
        _speed;

    var report = {
        speed: 0,
        htmlContent: "",
        cssContent: "",
        httpHeaders : ""
    };

("scrolling speed-checker").split(" ").forEach(function (p) {
    checklist[p] = require("./checks/" + p);
});

function createPhantomObj () {
    var deferred = Q.defer();
    phantom.create(function (ph){
        _ph = ph;
        deferred.resolve(ph);
    });
    console.log(' #-$ createPhantomObj');
    return deferred.promise;   
}

function createPageObj () {
    var deferred = Q.defer();
    _ph.createPage(function (page){
        _page = page;
        deferred.resolve(page);
    });
    console.log(' #-$ createPageObj');
    return deferred.promise;
}

function putPageOptions () {
    _page.set('viewportSize', {width:options.widthView,height:options.heightView});
    _page.set('clipRect', {top:0,left:0,width:options.widthView,height:options.heightView});
    _page.set('onResourceReceived', function(response) {console.log('headers : ' + JSON.stringify(response.headers)); });
    console.log(' #-$ putPageOptions');
}

function openPage () {
    var deferred = Q.defer();
    _time = Date.now();
    _page.open(options.url, function (status) {
        console.log("opening " +options.url, status);
        _speed = Date.now() - _time;
        report.speed = _speed;
        deferred.resolve(status);
    });
    console.log(' #-$ openPage');
    return deferred.promise;
}

function closePage () {
    _page.close();
    console.log(' #-$ closePage');
}

function getScreenshot () {
    _page.render('public/screenshots/screenshot' + '.png');
    console.log(' #-$ getScreenshot');
}

function getHTML () {
    var deferred = Q.defer();
    _page.get('content', function(html){
        report.htmlContent = html;
        deferred.resolve(html);
    });
    console.log(' #-$ getHTML');
    return deferred.promise;
}

function evaluatePage () {
    var deferred = Q.defer();
    _page.evaluate(
        function (){
            return document;
        },
        function (document){
            _document = document;
            console.log(_document.width);
            deferred.resolve(document);
        }
    );
    console.log(' #-$ evaluatePage');
    return deferred.promise;
}

function emitStepDone () {
    sink.emit("stepdone");
}

function runChecks () {
    checklist["scrolling"].check(_document, options);
}

function emitReport () {
    sink.emit("getReport end", report);
    console.log(' #-$ emitReport');
}

createPhantomObj()
    .then(emitStepDone)
    .then(createPageObj)
    .then(emitStepDone)
    .then(putPageOptions)
    .then(emitStepDone)
    .then(openPage)
    .then(emitStepDone)
    .then(getScreenshot)
    .then(emitStepDone)
    .then(getHTML)
    .then(emitStepDone)
    .then(evaluatePage)
    .then(emitStepDone)
    .then(runChecks)
    .then(emitReport);


/* have to find an other way to do that (less callback) : sink (event.Emitter) ? async Q promise*/
 /* var getPage = function(){
    phantom.create(
      function(ph){
        return ph.createPage(
          function(page){
           page.set('viewportSize', {width:options.widthView,height:options.heightView});
           page.set('clipRect', {top:0,left:0,width:options.widthView,height:options.heightView});
           page.set('onResourceReceived', function(response) {
            console.log('headers : ' + JSON.stringify(response.headers));
            });
            return page.open(options.url,
              function(status){
                console.log("opening " +options.url, status);
                page.render('public/screenshots/screenshot' + '.png');
                page.get('content', function(result){
                  report.htmlContent = result;
                });
                sink.emit("stepdone");
                return page.evaluate(
                  function(){

                    return document;
                  }, 
                  function(result){
                    _page = result;
                    if(options.url === 1){
                      console.log('Usage: loadspeed.js <some URL>');
                      phantom.exit();
                    }
                    report.speed = Date.now();
                    page.open(options.url, 
                      function(status){
                        if (status !== 'success') {
                          console.log('FAIL to load the address');
                          sink.emit("stepdone");

                        } 
                        else{
                          report.speed = Date.now() - report.speed;
                          console.log('Loading time ' + report.speed + ' msec');
                          sink.emit("stepdone");
                          sink.emit("getPage end");
                        }
                        return ph.exit();
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  } */

 // getPage();

  //make report here
  /*sink.on("getPage end", function(){
    sink.emit("getReport end", report);
  });*/
}
