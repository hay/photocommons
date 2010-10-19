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
                    "prop" : "images",
                    "indexpageids" : "1",
                    "titles" : q.title
                };
            },

            "thumbs" : function(q) {
                return {
                    "action" : "query",
                    "prop" : "imageinfo",
                    "iiprop" : "url",
                    "iiurlwidth" : q.width,
                    "indexpageids" : "1",
                    "titles" : q.image
                };
            }
        }

        if (!queries[type]) {
            throw new Error("Unknown query type");
        }

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

            if (value.indexOf("!noencode!") === 0 && typeof value === "string") {
                value = value.slice(10);
            } else {
                value = encodeURIComponent(value);
            }

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
        },

        select : function(event, ui) {
            $("#images").empty();

            var url = getQueryUrl("pageimages", {
                "title" : ui.item.value
            });

            $.getJSON(url, function(data) {
                var pageid = data.query.pageids[0],
                    query = data.query.pages[pageid].images;

                if (!query) $("#images").html("No images found :(");

                $.each(query, function() {
                    var url = getQueryUrl("thumbs", {
                        width : "200",
                        image : this.title
                    });

                    $.getJSON(url, function(data) {
                        var pageid = data.query.pageids[0],
                            src = data.query.pages[pageid].imageinfo[0].thumburl;
                        $("#images").append('<img src="' + src + '" />');
                    });
                });
            });
        }
    });
});