exports.name = "scrolling";

exports.check = function (_document, options) {
	if (_document.width > options.widthView) {console.log("WARNING - page width is largest than screen size.");}
	else {console.log("OK - page width is not largest than screen size. ");}
}