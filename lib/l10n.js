var messages = {
	en: {

	// title : title of issue reported to users
	// what : "what's up ?" more details on what happend.
	// why : explain why it's an error or warning. 
	// how : say how fixed it. =)
	//
	//
	// to insert data use ${data_key} in message. 
	//
	//responsive
		//responsive/doc-width
		"responsive.doc-width.err": {
			"title": "The width of the page is larger than an average mobile browser size"
		,	"what": "The width of the page is larger than an average mobile browser size - this means users will have to pan and zoom both horizontally and vertically."
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
		,	"why":""
		,	"how": ""
		}
	,	"responsive.meta-viewport.0": {
			"title":"No meta viewport tag declared."
		,	"what": "No meta viewport tag declared. The meta viewport tag helps adapt the way Web pages are displayed to mobile screens."
		,	"why":""
		,	"how": ""
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
			"title":""
		,	"what": "The page loads very slowly. Reducing the size of resources sent should help."
		,	"why":""
		,	"how": ""
		}
	,	"performance.load-speed.warning": {
			"title":""
		,	"what": "The page loads slowly. Reducing the size of resources sent should help."
		,	"why":""
		,	"how": ""
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