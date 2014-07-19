var metaparser = require("../lib/metaviewport-parser")
,   expect = require("expect.js");

var buildParsedContent = function (valid, unknown, invalid) {
    var parsed = {validProperties: {}, unknownProperties: {}, invalidValues: {}};
    if (valid) {
        parsed.validProperties = valid;
    }
    if (unknown) {
        parsed.unknownProperties = unknown;
    }
    if (invalid) {
        parsed.invalidValues = invalid;
    }
    return parsed;
}

var tests = [
    {desc: "parse correctly a simple valid viewport declaration",
     inp: "width=device-width, initial-scale=1, maximum-scale=2",
     out: buildParsedContent({"width":"device-width","initial-scale":1, "maximum-scale":2})},
    {desc: "ignore the string after a number in a value",
     inp: "width=400px",
     out: buildParsedContent({"width":400})},
    {desc: "handle a semi-colon as a comma",
     inp: "width=400; initial-scale=1.5",
     out: buildParsedContent({"width":400,"initial-scale":1.5})},
    {desc: "report separately unknown property names",
     inp:"widht=400px; initial-scale=1.5",
     out: buildParsedContent({"initial-scale":1.5}, {"widht": "400px"})},
    {desc: "handle whitespace correctly",
     inp:"        width=400\
 \r, initial-scale=2",
     out:buildParsedContent({"width":400, "initial-scale":2})},
    {desc: "report unknown values",
     inp:"width=foo",
     out: buildParsedContent({"width":null}, null, {"width":"foo"})}
];

tests.forEach(function (test) {
    describe("Parsing " + test.inp, function () {
        it('should ' + test.desc + ' "' + test.inp + '"', function () {
            var out = metaparser.parseMetaViewPortContent(test.inp);
            expect(out).to.eql(test.out);
            // strict deep equality for valid properties
            Object.keys(out.validProperties).forEach(function (name) {
                expect(out.validProperties[name]).to.equal(test.out.validProperties[name]);
            });
        });
    });
});