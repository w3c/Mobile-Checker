exports.name = "checkline";

exports.run = function(options, sink){
	var phantom = require('phantom'),
  util = require("util"),
		checklist = {},
		_page,
    time,
    content;

var report = {
  time: 0,
  htmlContent: ""
};

("speed-checker").split(" ").forEach(function (p) {
             checklist[p] = require("./checks/" + p);
  });

/* have to find an other way to do that (less callback) : sink (event.Emitter) ? async Q promise*/

  var getPage = function(){
    phantom.create(
      function(ph){
        return ph.createPage(
          function(page){
           page.set('viewportSize', {width:options.widthView,height:options.heightView});
           page.set('clipRect', {top:0,left:0,width:options.widthView,height:options.heightView});
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
                    report.time = Date.now();
                    page.open(options.url, 
                      function(status){
                        if (status !== 'success') {
                          console.log('FAIL to load the address');
                          sink.emit("stepdone");

                        } 
                        else{
                          report.time = Date.now() - report.time;
                          console.log('Loading time ' + report.time + ' msec');
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
  }

  var makeReport = function () {

  }

  getPage();

  //make report here
  sink.on("getPage end", function(){
    sink.emit("getReport end", report);
  });
  
}
