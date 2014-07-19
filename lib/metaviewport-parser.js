/*
from http://dev.w3.org/csswg/css-device-adapt/#viewport-meta
 Parse-Content(S)
i ← 1
while i ≤ length[S]
    do while i ≤ length[S] and S[i] in [whitespace, separator, '=']
        do i ← i + 1
    if i ≤ length[S]
        then i ← Parse-Property(S, i)

Parse-Property(S, i)
start ← i
while i ≤ length[S] and S[i] not in [whitespace, separator, '=']
    do i ← i + 1
if i > length[S] or S[i] in [separator]
    then return i
property-name ← S[start .. (i - 1)]
while i ≤ length[S] and S[i] not in [separator, '=']
    do i ← i + 1
if i > length[S] or S[i] in [separator]
    then return i
while i ≤ length[S] and S[i] in [whitespace, '=']
    do i ← i + 1
if i > length[S] or S[i] in [separator]
    then return i
start ← i
while i ≤ length[S] and S[i] not in [whitespace, separator, '=']
    do i ← i + 1
property-value ← S[start .. (i - 1)]
Set-Property(property-name, property-value)
return i */
exports.parseMetaViewPortContent = function (S) {
    var parsedContent = {
        validProperties : {},
        unknownProperties: {},
        invalidValues : {}
    };
    var i = 1;
    while (i <= S.length) {
        while (i <= S.length && RegExp(' |\x0A|\x09|\0d|,|;|=').test(S[i-1])) {
            i++;
        }
        if (i <= S.length) {
            i = parseProperty(parsedContent, S, i);
        }
    }
    return parsedContent;
};

var propertyNames = ["width", "height", "initial-scale", "minimum-scale", "maximum-scale", "user-scalable"];

function parseProperty(parsedContent, S, i) {
    var start = i;
    while (i <= S.length && !RegExp(' |\x0A|\x09|\0d|,|;|=').test(S[i-1])) {
        i++;
    }
    if (i > S.length || RegExp(',|;').test(S[i-1])) {
        return i;
    }
    var propertyName = S.slice(start - 1, i-1);
    while (i <= S.length && !RegExp(',|;|=').test(S[i-1])) {
        i++;
    }
    if (i > S.length || RegExp(',|;').test(S[i-1])) {
        return i;
    }
    while (i <= S.length && RegExp(' |\x0A|\x09|\0d|=').test(S[i-1])) {
        i++;
    }
    if (i > S.length || RegExp(',|;').test(S[i-1])) {
        return i;
    }
    start = i;
    while (i <= S.length && !RegExp(' |\x0A|\x09|\0d|,|;|=').test(S[i-1])) {
        i++;
    }
    var propertyValue = S.slice(start - 1, i-1);
    setProperty(parsedContent, propertyName, propertyValue);
    return i;
}

function setProperty(parsedContent, name, value) {
    if (propertyNames.indexOf(name) >= 0) {
        var number = parseFloat(value);
        if (!isNaN(number)) {
            parsedContent.validProperties[name] = number;
            return;
        }
        var string = value.toLowerCase();
        if (string === "yes" || string === "no" || string === "device-width" || string === "device-height") {
            parsedContent.validProperties[name] = string;
            return;
        }
        parsedContent.validProperties[name] = null;
        parsedContent.invalidValues[name] = value;
    } else {
        parsedContent.unknownProperties[name] = value;
    }
}