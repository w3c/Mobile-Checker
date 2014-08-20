//check width of document (DOM)
exports.name = "doc-width";
exports.category = "responsive";
exports.check = function (checker) {
	var sink = checker.sink;
	if (checker.webAppData.documentWidth > checker.profile.config.width) {
		sendIssue(sink, "doc-width-too-large", this.name, this.category);
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
