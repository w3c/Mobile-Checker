var messages = {
	en: {

	// title : title of issue reported to users
	// what : "what's up?" more details on what happened.
	// why : explain why it's an error or warning.
	// how : say how to fix it. =)
	//
	//
	// to insert data use ${data_key} in message.
	//
	//responsive
		//responsive/doc-width
		"responsive.doc-width.err": {
			"title": "The width of the page is larger than an average mobile browser size"
		,	"what": "The width of the page is larger than an average mobile browser size - this means users will have to scroll horizontally and vertically, or zoom in and out."
		,	"why": ""
		,	"how": ""
		}
	,	"responsive.doc-width.ok": {
			"title": ""
		,	"what": ""
		,	"why":""
		,	"how": ""
		}
		//responsive/meta-viewport
	,	"responsive.meta-viewport.2": {
			"title": "More than one viewports are declared"
		,	"what": "More than one viewports are declared in the HTML. Please check your HTML file keep a single meta viewport"
		,	"why": "Only the last meta viewport declaration is taken into account; the other declarations should be removed as they clutter the code and may have an impact on performance."
		,	"how": "Keep only the last meta viewport declaration."
		}
	,	"responsive.meta-viewport.0": {
			"title":"No mobile viewport declared."
		,	"what": "No mobile viewport declared. The meta viewport tag helps adapt the way Web pages are displayed in mobile browsers."
		,	"why": "Without meta viewport declared, mobile browsers will render a Web page as they would on a ~1000px screen; in most cases, this will force users to zoom before they can interact with the page, and then they will have to scroll awkwardly to navigate on the page."
		,	"how": "Declare a mobile viewport using a meta viewport tag in the head of the HTML markup."
		}
	,	"responsive.meta-viewport.ok": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"responsive.meta-viewport.3": {
			"title":""
		,	"what": "The meta viewport does not declare a width, nor an initial-scale, and thus will not adapt the Web page to mobile screens."
		,	"why":""
		,	"how": ""
		}
	,	"responsive.meta-viewport.4": {
			"title":""
		,	"what": "The meta viewport does not declare a width, nor an initial-scale, and thus will not adapt the Web page to mobile screens."
		,	"why":""
		,	"how": ""
		}
	,	"responsive.meta-viewport.5": {
			"title": "Invalid value for ${property} in meta viewport"
		,	"what": "The property ${property} in the meta viewport declaration has an invalid value: ${value}."
		,	"why":"Because ${value} is not a recognized value for ${property}, it will be ignored by the browser."
		,	"how": "Use a valid value for ${property}, one of: ${validValues}."
		}
	,	"responsive.meta-viewport.7": {
			"title":"Hardcoded viewport width"
		,	"what": "The meta viewport uses an hardcoded value for the width of the viewport."
		,	"why": "A numeric hardcoded value for the meta viewport declaration makes the page less responsive to the actual screen used; if the width is larger than the screen width, the page will be hard to read and will not benefit from some optimizations (e.g. removal of the 300 ms delay in clicks); if the page is significantly more narrow than the screen (as is likely on tablets), the page will not benefit from the whole screen real estate."
		,	"how": "Use device-width as the value of the width  parameter in the meta viewport declaration."
		}
	,	"responsive.meta-viewport.8": {
                         "title": "Unknown parameter in viewport declaration"
                         ,"what": ""
                         ,"why": ""
                         ,"how": ""
        }
	,	"responsive.meta-viewport.9": {
                         "title": "Non-standard parameter in viewport declaration"
                         ,"what": ""
                         ,"why": ""
                         ,"how": ""
        }
	,	"responsive.meta-viewport.10": {
                         "title": "Users are prevented to zoom"
                         ,"what": "The meta viewport declaration prevents users to zoom in on the page."
                         ,"why": "Except in some specific cases (e.g. games), preventing users to zoom in a page is discouraged; users may want to see details in an image, or may have trouble reading at the current zoom level."
                         ,"how": ""
        }
        //responsive/font-size
    ,	"responsive.fonts-size.too-small-font-size": {
                         "title": "too small font size detected"
                         ,"what": "element ${htmlTag} detected with font-size lower than 16px."
                         ,"why": "On a mobile device, it's recommended to not put font-size lower than 16px because the user experience will be deteriorated with small font size. It could force user to zoom on their mobile device."
                         ,"how": "It's recommened to put font-size power than 16px. 18px is cool for paragraph on a mobile device."
        }
	//performance
		//performance/load-speed
	,	"performance.load-speed.err": {
			"title":"Very slow page load"
		,	"what": "The page loads very slowly. "
		,	"why":""
		,	"how": "Reduce the size and the number of associated resources."
		}
	,	"performance.load-speed.warning": {
			"title":"Slow page load"
		,	"what": "The page loads slowly. "
		,	"why":""
		,	"how": "Reduce the size and the number of associated resources."
		}
	,	"performance.load-speed.ok": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
		//performance/number-requests
	,	"performance.number-requests.warning": {
			"title":"Loading the page requires ${number} network requests"
		,	"what":""
		,	"why":""
		,	"how": ""
		}
		//performance/redirects
	,	"performance.redirects.warning": {
			"title":"${number} redirects encountered during page load"
		,	"what":"When loading the resources required to display the page from the network, ${number} HTTP redirects were triggered."
		,	"why":"Each HTTP redirects require an additional round trip on the network, which slows down the page load without any benefit to the user."
		,	"how": "Use the final destination URL for the resources."
		}
		//performance/http-errors
	,	"performance.http-errors.warning": {
			"title":"${number} HTTP errors encountered during page load"
		,	"what":"When loading the resources required to display the page from the network, ${number} HTTP errors were triggered."
		,	"why":"HTTP errors imply that the target resource was not loaded, which can impact the proper functioning of the page, and implies unneeded network traffic."
		,	"how": "Check the following resources to determine where the error comes from: ${errors}."
		}
		//performance/compression
	,	"performance.compression.warning": {
			"title":"${number} resources could be compressed"
		,	"what":"The following resources loaded to display the page could be transmitted more quickly if they were compressed: ${compressable}."
		,	"why":"Reducing the overall amount of data needed to display the page makes it load faster, a critical component of the user experience on mobile browsers."
		,	"how": "Enable compression on the Web server."
		}

		//performance/resources-size
	,	"performance.resources-size.warning": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"performance.resources-size.ok": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
		//performance/blocking-resources
	,	"performance.blocking-resources.err": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"performance.blocking-resources.warning": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"performance.blocking-resources.ok": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
		//performance/downloading-fonts
	,	"performance.downloading-fonts.warning": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"performance.downloading-fonts.ok": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	//compatibility
		//compatibility/flash-detection
	,	"compatibility.flash-detection.swfobject-lib-detected": {
			"title": "Flash application detected."
		,	"what": "Usage of Adobe Flash has been detected on the page, through the swfobject Javascript library."
		,	"why": "Adobe Flash will not run on many mobile devices."
		,	"how": "Nowadays, technologies such as HTML5, SVG and the canvas API provide well-supported replacements for most Flash features."
		}
	,	"compatibility.flash-detection.swf-file-detected": {
			"title": "Flash application detected."
		,	"what": "An Adobe Flash application is loaded via the embed tag."
		,	"why": "Adobe Flash will not run on many mobile devices."
		,	"how": "Nowadays, technologies such as HTML5, SVG and the canvas API provide well-supported replacements for most Flash features."
		}
	//security
		//security/SSL
	,	"security.ssl.err": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"security.ssl.warning": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	,	"security.ssl.ok": {
			"title":""
		,	"what":""
		,	"why":""
		,	"how": ""
		}
	}
}

exports.message = function (lang, category, check, res, data) {
    if (!messages[lang]) return "No such language: " + lang;
    var l10nTemplates = messages[lang][category + "." + check + "." + res];
    var l10nMessages = {};
    if (!l10nTemplates) return "No such entry: " + category + "." + check + res;
    for(var msg in l10nTemplates){
        l10nMessages[msg] = l10nTemplates[msg];
        if (data) {
    	    for (var key in data){
     		l10nMessages[msg] = l10nMessages[msg].replace("${" + key + "}", data[key]);
    	    }
        }
}
    return l10nMessages;
};