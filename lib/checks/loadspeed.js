exports.name = "loadspeed";

exports.check = function (_speed) {
	if (_speed <= 500) {console.log("OK - loadspeed - your website load in " + _speed + " ms");}
	else if (_speed > 500 && _speed <= 1000) {console.log("OK - loadspeed - your website load in " + _speed + " ms");}
	else if (_speed > 1000 && _speed <= 1500) {console.log("WARNING - loadspeed - your website load in " + _speed + " ms");}
	else {console.log("WARNING - loadspeed - your website load in " + _speed + " ms");}
}