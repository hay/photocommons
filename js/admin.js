(function($) {

	/**
	 * Escape a string for HTML.
	 *
	 * Converts special characters to HTML entities.
	 *
	 * @param {string} text The string to escape
	 * @return {string} HTML
	 */
	function escHtml(text) {
		return text.replace( /['"<>&]/g, function ( s ) {
			switch ( s ) {
			case '\'':
				return '&#039;';
			case '"':
				return '&quot;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '&':
				return '&amp;';
			}
		} );
	}

	/**
	 * @param {string} key
	 * @return {string} Message text
	 */
	function msg(key) {
		var raw = WP_PHOTOCOMMONS.translations[key];
		if (!raw) {
			throw new Error('Unknown message key: ' + key);
		}
		return raw;
	}

	function msgEsc(key) {
		return escHtml(msg(key));
	}

	function addButtons() {
		$('#wp-content-media-buttons').append(''.concat(
			'<button type="button" id="photocommons-add"',
			'class="button">',
			'<img src="' + WP_PHOTOCOMMONS.imgButtonUrl + '"/>',
			'Add Wikimedia Commons image</button>'
		));

		var $dialog = $('<div id="photocommons-dialog"></div>')
			.html(''.concat(
				'<label for="wp-photocommons-search">',
				msgEsc('Search'),
				':</label>',
				'<input type="search" id="wp-photocommons-search" />',
				'<ul id="wp-photocommons-results"></ul>',
				'<img src="' + WP_PHOTOCOMMONS.imgLoaderUrl + '" style="display:none;" id="wp-photocommons-loading" />',
				'<div id="wp-photocommons-images"></div>'
			))
			.appendTo('body');

		PhotoCommons.init();

		$dialog.dialog({
			title: msg('PhotoCommons') + ' - ' + msg('Insert images from Wikimedia Commons'),
			width: 800,
			height: 500,
			autoOpen: false
		});

		$('#photocommons-add').on('click', function(e) {
			e.preventDefault();

			$dialog.dialog('open');
		});

		$('#wp-photocommons-images').on('click', '.image', function() {
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

			$dialog.dialog('close');
		});

	}

	$( addButtons );

})(jQuery);
