var reporting;

var messages = {
	en: {
	//responsive
		//responsive/doc-width
		"responsive.doc-width.warning": "Warning, webpage's width is larger than a mobile screen size. Double scrolling could be a result of it."
	,	"responsive.doc-width.ok": ""
		//responsive/meta-viewport
	,	"responsive.meta-viewport.warning": ""
	,	"responsive.meta-viewport.ok": ""
	//performance
		//performance/load-speed
	,	"performance.load-speed.err": "Warning, your website load very slowly. You have to improve it. You can do it if you reduce size of resources sent."
	,	"performance.load-speed.warning": "Warning, your website load slowly. To improve it you can reduce size of resources sent."
	,	"performance.load-speed.ok": ""
		//performance/resources-size
	,	"performance.resources-size.warning": ""
	,	"performance.resources-size.ok": ""
		//performance/blocking-resources
	,	"performance.blocking-resources.err": ""
	,	"performance.blocking-resources.warning": ""
	,	"performance.blocking-resources.ok": ""
		//performance/downloading-fonts
	,	"performance.downloading-fonts.warning": ""
	,	"performance.downloading-fonts.ok": ""
	//security
		//security/SSL
	,	"security.ssl.err": ""
	,	"security.ssl.warning": ""
	,	"security.ssl.ok": ""
	}
}

exports.message = function (lang, category, check, res) {
    if (!messages[lang]) return "No such language: " + lang;
    var l10n = messages[lang][category + "." + check + "." + res];
    if (!l10n) return "No such entry: " + category + "." + check;
    return l10n;
};