/**
 * @file
 */
/**
 * @module checkremote
 * @requires url
 * @requires dns
 * @requires ip
 * @requires q
 * @todo implement is_port_acceptable function
 * @todo make each function can be call separately
 * @todo docs
 */
var checkremote = exports,
	urllib = require('url'),
	dns = require('dns'),
	ip = require('ip'),
	Q = require('q');


/**
 * get all IP addresses linked to the given host
 * @augments checkremote
 * @param {Object} data data must contain at min host element for use in this function
 * @return {Promise} data promise which contain all addrs
 */
function all_addrs(data) {
	var deferred = Q.defer();
	dns.resolve(data.host, function(err, addrs) {
		if (err) deferred.resolve(err);
		data['addrs'] = addrs;
		deferred.resolve(data);
	});
	return deferred.promise;
}

/**
 * check if an IP addresses is private
 * @augments checkremote
 * @param {String} addr
 * @return {boolean} return true if the given addresse (addr) is lcoal, else false
 */
function is_addr_local(addr) {
	if (ip.isPrivate(addr) == true) {
		return true;
	} else {
		return false;
	}
}
/**
 * Test if a hostname has local IP addresses.
 * This function check every IP address given, which are associated to an hostname.
 * @augments checkremote
 * @param {Object} data data must contain at min addrs (IP addresses tab) element for use in this function
 * @return {Object} return data Object which contain is_host_local boolean. His value will be true if local addresse detected, else false
 */
function is_host_local(data) {
	data['is_host_local'] = false;
	for (var index in data.addrs) {
		if (is_addr_local(data.addrs[index]) == true) {
			data['is_host_local'] = true;
		}
	}
	return data;
}
/**
 * Test if the hostname is not blacklisted
 * @augments checkremote
 * @param {Object} data data must contain at min blacklist array for use in this function
 * @return {Object} return data Object which contain is_blacklisted boolean. His value will be true if blacklisted hostname, else false
 */
function is_host_blacklisted(data) {
	if (data.blacklist.indexOf(data.host) == -1) {
		data['is_host_blacklisted'] = false;
	} else {
		data['is_host_blacklisted'] = true;
	}
	return data;
}
/**
 * Test if the protocol asked is acceptable. 
 * @augments checkremote
 * @param {Object} data data must contain at min protocol of a parsed url & protocol_scheme array (list of acceptable protocols) for use in this function
 * @return {Object} return data Object which contain is_protocol_acceptable boolean. His value will be true if acceptable protocol, else false
 */
function is_protocol_acceptable(data) {
	if (data.protocol_scheme.indexOf(data.protocol) == -1) {
		data['is_protocol_acceptable'] = false;
	} else {
		data['is_protocol_acceptable'] = true;
	}
	return data;
}
/**
 * Run a check suite to control safety of an url given. 
 * Result of the check suite is recover via callback given : 
 * true if all checks passed else return a report with value (true or false) for each check.
 * @augments checkremote
 * @param {String} url 
 * @param {function} cb callback
 * @param {Object} options
 * @param {Array} options.protocol_scheme list of protocols accepted. By default : http, https
 * @param {Array} options.blacklist list of blacklisted hostnames. By default : none
 */
checkremote.check_url_safety = function(url, cb, options) {
	if (!urllib.parse(url).host) {
		cb(false);
		return;
	}
	if (!urllib.parse(url).protocol) {
		cb(false);
		return;
	}
	if (!urllib.parse(url).hostname) {
		cb(false);
		return;
	}
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
		host: urllib.parse(url)["hostname"],
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
	return;
}