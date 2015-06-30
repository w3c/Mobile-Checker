var jsdom = require("jsdom");
var template = '<div class="col-md-12 issue">\
<div id="issue-status" class="col-md-1"><span class="octicon octicon-issue-opened"></span></div>\
<div class="col-md-11 content-issue">\
<h2 class="title-issue page-header"> <br><small class="category"></small></h2>\
<div class="fixit">\
<h2><span class="octicon octicon-issue-closed"></span> HOW TO FIX IT:</h2>\
</div>\
</div>\
</div>';


exports.format = function (markup, category, cb) {
    jsdom.env({html: template, done: function(errors, window) {
        var div = window.document.querySelector("body");
        var report = window.document.createElement("div");
        report.innerHTML = markup;
        var h2 = div.querySelector("h2.title-issue");
        div.querySelector(".category").textContent = category;
        var h2Children = report.querySelector("h2").childNodes;
        for (var i = 0; i < h2Children.length; i++) {
            h2.insertBefore(h2Children[i].cloneNode(true), h2.firstChild);
        }
        var contentChildren = report.querySelectorAll(".issue > *:not(h2)");
        var fixit = div.querySelector(".fixit");
        for (var i = 0; i < contentChildren.length; i++) {
            fixit.parentNode.insertBefore(contentChildren[i].cloneNode(true), fixit);
        }
        var fix = report.querySelector(".fix");
        if (fix === null) {
            fixit.parentNode.removeChild(fixit);
        } else {
            var children = fix.childNodes;
            for (var j = 0 ; j < children.length; j++) {
                fixit.appendChild(children[j].cloneNode(true))
            }
        }
        var collapsable = div.querySelector(".collapsable");
        if (collapsable) {
            var sortable = collapsable.classList && collapsable.classList.contains("sortable");
            var isTable = collapsable.tagName === "table";
            collapsable.setAttribute("class", "panel-collapse collapse" + (isTable ? " table" : "") + (sortable ? " sortable" : ""));
            var toggle = window.document.createElement("a");
            toggle.setAttribute("data-toggle", "collapse");
            toggle.setAttribute("href", "#" + collapsable.id);
            toggle.textContent = collapsable.title;
            collapsable.parentNode.insertBefore(toggle, collapsable);
        }
        var popovers = div.querySelectorAll(".popovers");
        for (var p = 0 ; p < popovers.length; p++) {
            var pop = popovers[p];
            var span = window.document.createElement("span");
            span.setAttribute("class","info btn btn-xs btn-default glyphicon glyphicon-info-sign");
            span.setAttribute("data-body", "container");
            span.setAttribute("data-toggle", "popover");
            span.setAttribute("data-placement", "bottom");
            span.setAttribute("data-html", "true");
            span.setAttribute("data-content", pop.outerHTML);
            span.setAttribute("title", pop.title);
        }
        if (popovers.length) {
            var script = window.document.createElement("script");
            script.textContent = "$('span.info').popover();";
            div.appendChild(script);
        }
        cb(div.innerHTML);
    }});
};
