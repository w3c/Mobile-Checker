var reporting;

var messages = {
	en: {
	//responsive
		//responsive/doc-width
		"responsive.doc-width.err": "Warning, webpage's width is larger than a mobile screen size. Double scrolling could be a result of it."
	,	"responsive.doc-width.ok": ""
		//responsive/meta-viewport
	,	"responsive.meta-viewport.2": "too much viewport are declared. Please check your html file and put an only meta viewport"
	,	"responsive.meta-viewport.0": "no meta viewport tag declared. If you want to have a 'mobile friendy' website you have to add a meta viewport tag with parameters : name='viewport' content='width=width-device,initial-scale=0.1'"
	,	"responsive.meta-viewport.ok": "" //ok
	,	"responsive.meta-viewport.3": "no width content declared in your meta view port. If you want to have a 'mobile friendy' website you have to add a meta viewport tag with parameters : name='viewport' content='width=width-device,initial-scale=0.1'"
	,	"responsive.meta-viewport.4": "no initial-scale content declared in your meta view port. If you want to have a 'mobile friendy' website you have to add a meta viewport tag with parameters : name='viewport' content='width=width-device,initial-scale=0.1'"
	,	"responsive.meta-viewport.5": "incorrect width content in meta viewport. If you want to have a 'mobile friendy' website you have to add a meta viewport tag with parameters : name='viewport' content='width=width-device,initial-scale=0.1'"
	,	"responsive.meta-viewport.6": "incorrect width content in meta viewport. If you want to have a 'mobile friendy' website you have to add a meta viewport tag with parameters : name='viewport' content='width=width-device,initial-scale=0.1'"
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