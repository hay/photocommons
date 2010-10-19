$(document).ready(function() {
    $("#search").keyup(function() {
        var search = $("#search").val();
        var url = 'http://commons.wikimedia.org/w/api.php?action=opensearch&format=json&callback=?&search=' + search;
        $.getJSON(url, function(data) {
            $("#results").empty();
            $.each(data[1], function() {
                $("#results").append('<li><a>' + this + '</a></li>');
            });
        });
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