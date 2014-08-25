var jsdom = require("jsdom");
var fs = require('fs');

// loading equivalence table from
// http://peter.sh/experiments/vendor-prefixed-css-property-overview/

jsdom.env(
    "http://peter.sh/experiments/vendor-prefixed-css-property-overview/",
    function (errors, window) {
        var propertiesEquivalences = {};
        var rows = window.document.querySelectorAll("tbody tr");
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var cells = row.querySelectorAll('td');
            // the last cell doesn't interest us at this point
            for (var j = 0; j < cells.length - 1; j++) {
                var cell = cells[j];
                var prop = cell.textContent.replace(' ⓘ', '');
                if (prop) {
                    var unprefixed = unprefix(prop);
                    if (!propertiesEquivalences[unprefixed]) {
                        propertiesEquivalences[unprefixed] = {values:[], unneeded:false};
                    }
                    if (propertiesEquivalences[unprefixed].values.indexOf(prop) === -1) {
                        propertiesEquivalences[unprefixed].values.push(prop);
                    }
                    if (cell.querySelector("span") && cell.querySelector("span").title === 'Also supports the non-prefixed version. Supported for legacy reasons.') {
                        propertiesEquivalences[unprefixed].unneeded = true;
                    }
                }
            }
        }
        fs.writeFileSync("lib/css-prefixes.json", JSON.stringify(propertiesEquivalences));
    }
);

function unprefix(string) {
    return string.replace(/^-[^-]*-/,'');
}
