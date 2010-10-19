window.log = (console && console.log) ? console.log : function(){alert();};

$(document).ready(function() {
    function getQueryUrl(type, args) {
        var queries = {
            "pagesearch" : function(q) {
                return {
                    "action" : "opensearch",
                    "search" : q.search
                };
            },

            "pageimages" : function(q) {
                return {
                    "action" : "query",
                    "indexpageids" : 1,
                    "titles" : q.title
                };
            },

            "thumbs" : function(q) {
                return {
                    "action" : "query",
                    "prop" : "imageinfo",
                    "iiprop" : "url",
                    "iiurlwidth" : q.width,
                    "indexpageids" : 1,
                    "titles" : q.image
                };
            }
        }

        if (!queries[type]) return false;

        return makeUrl(queries[type](args));
    }

    function makeUrl(args) {
        // default arguments
        args = $.extend({
            "format" : "json",
            "callback" : "!noencode!?"
        }, args);

        var url = 'http://commons.wikimedia.org/w/api.php';
        var first = true;
        for (var key in args) {
            var value = args[key];
            url += (first) ? "?" : "&";
            first = false;
            value = (value.indexOf("!noencode!") === 0) ? value.slice(10) : encodeURIComponent(value);
            url += key + '=' + value;
        }
        return url;
    }

    $("#search").autocomplete({
        source : function(request, response) {
            var url = getQueryUrl("pagesearch", {
                "search" : $("#search").val()
            });

            $.getJSON(url, function(data) {
                response(data[1]);
            });
        }
    });


    $("#results a").live('click', function() {
        $("#images").empty();
        var q = $(this).text();
        var url = 'http://commons.wikimedia.org/w/api.php?action=query&prop=images&format=json&indexpageids=1&callback=?&titles=' + q;
        $.getJSON(url, function(data) {
            var pageid = data.query.pageids[0];
            var query = data.query.pages[pageid].images;
            if (!query) return false;
            $.each(query, function() {
                // console.log(this);
                var url = 'http://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=200&callback=?&format=json&indexpageids=1&&titles=' + encodeURIComponent(this.title);
                $.getJSON(url, function(data) {
                    var pageid = data.query.pageids[0];
                    var src = data.query.pages[pageid].imageinfo[0].thumburl;
                    $("#images").append('<img src="' + src + '" />');
                    // console.log(src);
                });
            });
        });
    });
});