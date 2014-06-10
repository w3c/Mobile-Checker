exports.name = "speed-checker";

exports.check = function (url){
	var phantom = require('phantom');
	var t;
	var address;
	var ph;
	var page;
	var title;
	var date;

	console.log(url);

	phantom.create(function(ph) {
  		return ph.createPage(function(page) {
    		return page.open(url, function(status) {
      			console.log("opened website ?", status);
      			return page.evaluate((function() {
      				title = document.title;
        			return document.title;
      			}), function(result) {
        			console.log('Page title is ' + result);
        			console.log('----- 1 -----');
      			
    			if (url === 1) {
  					console.log('Usage: loadspeed.js <some URL>');
  					phantom.exit();
				}

				t = 0;
				address = url;
				t = Date.now();

				page.open(url, function(status) {
  					if (status !== 'success') {
    					console.log('FAIL to load the address');
  					} else {
    					t = Date.now() - t;
    					console.log('Loading time ' + t + ' msec');
  					}
  				 return ph.exit();
				});
      			});
      			

    		});
  		});
	});
}