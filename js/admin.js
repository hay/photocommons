(function($) {

	function _(msg) {
		return window.PhotoCommons.translations[msg];
	}

	function addButtons() {
		$('#wp-content-media-buttons').append(''.concat(
			'<button type="button" id="photocommons-add"',
			'class="button">',
			'<img src="' + WP_PHOTOCOMMONS.imgButtonUrl + '"/>',
			'Add Wikimedia Commons image</button>'
		));

		$('<div id="photocommons-dialog"></div>').appendTo('body').load(WP_PHOTOCOMMONS.searchUrl, function() {
			PhotoCommons.init();

			dialog = $('#photocommons-dialog').dialog({
				title : _('PhotoCommons') + ' - ' + _('Insert images from Wikimedia Commons'),
				width : 800,
				height : 500,
				autoOpen: false
			});
		});

		$('#photocommons-add').live('click', function(e) {
			e.preventDefault();

			$("#photocommons-dialog").dialog('open');

			$('#wp-photocommons-images .image').live('click', function() {
				var file = $(this).attr('data-filename'),
					shortcode = '[photocommons file="' + file + '" width="300"] ';

				// Depending on whether we are in Wysiwyg or HTML mode we
				// do a different insert
				if ($('#edButtonHTML').hasClass('active')) {
					// HTML editor
					$('#content').val( function(i,val){
						return shortcode + val;
					});
				} else {
					// Wysiwyg
					tinyMCE.execCommand('mceInsertContent', false, shortcode);
				}

				$("#photocommons-dialog").dialog('close');
			});
		});
	}

	$(document).ready( addButtons );

})(jQuery);
