//check width of document (DOM)
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	if (checker.webAppData.documentWidth > checker.profile.config.width) {
<<<<<<< HEAD
		sink.emit('err', checker.l10n.report(this.category, this.name, "rr"));
		sink.emit('done');
=======
		//doc-width-too-large
		sendIssue(sink, "doc-width-too-large", this.name, this.category);
>>>>>>> 32dcc64... Add template issue in checks of meta-viewport & doc-width
	} else {
		//OK
		console.log("ok");
		sink.emit('done');
	}
}

function sendIssue(sink, key, name, category, data) {
	var str = fs.readFileSync(path.join(__dirname, '/../../issues/' +category+ '/' +name+ '/' +key+ '.ejs'), 'utf8');
	if(!data) var data = {};
	sink.emit('err', ejs.render(str, data));
	sink.emit('done');
}
