/*
TODO :
	* comment each functions and add some explanations on the API
	* implement is_port_acceptable function
	* make each function can be call separately
	* manage url parsing errors
*/

/*
dependencies
*/
var urllib = require('url'),
	dns = require('dns'),
	ip = require('ip'),
	Q = require('q');

function all_addrs(data) {
	/*
	Return via promise array of IP addresses linked to an hostname.
	*/
	var deferred = Q.defer();
	dns.resolve(data.host, function(err, addrs) {
		if (err) deferred.resolve(err);
		data['addrs'] = addrs;
		deferred.resolve(data);
	});
	return deferred.promise;
}

function is_addr_local(addr) {
	/*
	Return true if the given ip addresse (addr) is local, else false.
	*/
	if (ip.isPrivate(addr)) {
		return true;
	} else {
		return false;
	}
}

function is_host_local(data) {
	/*
	Test if a hostname has local IP addresses.

    This function checks every IP address given, which are associated to an hostname.

    Returns true if local addresse detected
    or false if no local addresse detected.
    */
	for (var index in data.addrs) {
		if (is_addr_local(data.addrs[index])) {
			data['is_host_local'] = true;
		}
	}
	data['is_host_local'] = false;
	return data;
}

function is_host_blacklisted(data) {
	/*
	Test if the hostname is not blacklisted
	
	Return true if blacklisted hostname
	or false if not blacklisted.
	*/
	if (data.blacklist.indexOf(data.host) == -1) {
		data['is_host_blacklisted'] = false;
	} else {
		data['is_host_blacklisted'] = true;
	}
	return data;
}

function is_protocol_acceptable(data) {
	/*
	Test if the protocol asked is acceptable
	
	Return true if acceptable protocol else return false.

	Acceptable protocol list can be define in options arg.
	By default acceptables protocols are http & https.
	*/
	if (data.protocol_scheme.indexOf(data.protocol) == -1) {
		data['is_protocol_acceptable'] = false;
	} else {
		data['is_protocol_acceptable'] = true;
	}
	return data;
}

function check_url_safety(url, cb, options) {
	/*
	Run a check suite to control safety of an url given.
	
	Options are available :
		* protocol_scheme : list of protocols accepted. By default : http, https
		* blacklist : list of blacklisted hostnames. By default : none

	Result of the check suite is recover via callback given.

	Return true if all checks passed else return a report with value (true or false) for each check.
	*/
	if (!options) {
		options = {};
		options.protocol_scheme = ['http', 'https'];
		options.blacklist = [];
	} else {
		if (!options.protocol_scheme) options.protocol_scheme = ['http', 'https'];
		if (!options.blacklist) options.blacklist = [];
	}

	var data = {
		url: url,
		host: urllib.parse(url)["host"],
		protocol: urllib.parse(url)["protocol"].split(':')[0],
		port: urllib.parse(url)["port"],
		protocol_scheme: options.protocol_scheme,
		blacklist: options.blacklist
	};
	all_addrs(data)
		.then(is_host_local)
		.then(is_protocol_acceptable)
		.then(is_host_blacklisted)
		.then(function(data) {
			if (data['is_protocol_acceptable'] == true && data['is_host_blacklisted'] == false && data['is_host_local'] == false) {
				return true;
			} else {
				return data;
			}
		}).then(cb);
}