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
			"title":""
		,	"what": "The meta viewport declares an incorrect width."
		,	"why":""
		,	"how": ""
		}
	,	"responsive.meta-viewport.6": {
			"title":""
		,	"what": "The meta viewport declares an incorrect initial-scale."
		,	"why":""
		,	"how": ""
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
    var l10n = messages[lang][category + "." + check + "." + res];
    if (!l10n) return "No such entry: " + category + "." + check + res;
    if (data) {
    	for (var key in data){
    		for(var msg in l10n){
    			l10n[msg] = l10n[msg].replace("${" + key + "}", data[key]);
    		}
    	}
    }
    return l10n;
};