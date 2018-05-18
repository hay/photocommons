<?php
/*
	Copyright 2011
	@author Husky <huskyr@gmail.com>
	@author Krinkle <krinklemail@gmail.com>

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
class PhotoCommons {
	const PLUGIN = "wp-photocommons";
	const PLUGIN_PATH = '/wp-photocommons/';
	const FILEPATH_PATTERN = 'http://commons.wikimedia.org/w/index.php?title=Special:FilePath&file=%s&width=%s';
	const FILEPAGE_PATTERN = 'http://commons.wikimedia.org/w/index.php?title=File:%s';

	function __construct() {
		if ( is_admin() ) {
			$this->init_admin();
		} else {
			$this->init_frontend();
		}
	}

	public function add_shortcode( $args ) {
		$filename = $args['file'];
		$width = $args['width'];
		$align = empty( $args['align'] ) ? 'alignright' : 'align' . $args['align'];
		$thumb = $this->get_thumb_url( $filename, $width );
		$filepage = $this->get_page_url( $filename, $width );

		return sprintf(
			'<a href="%s" title="%s" class="wp-photocommons-thumb">' .
			'<img src="%s" title="%s via Wikimedia Commons" alt="%s" class="%s" width="%s" />' .
			'</a>',
			$filepage, $filename,
			$thumb, $filename, $filename, $align, $width
		);
	}

	private function get_thumb_url( $file, $width ) {
		return sprintf( self::FILEPATH_PATTERN, rawurlencode( $file ), rawurlencode( $width ) );
	}

	private function get_page_url( $file, $width ) {
		return sprintf( self::FILEPAGE_PATTERN, rawurlencode( $file ) );
	}

	private function init_admin() {
		$this->enqueue_scripts();
		$this->enqueue_styles();
	}

	private function enqueue_scripts() {
		// Register some of our own scripts
		wp_register_script( 'translations', plugins_url() . self::PLUGIN_PATH . 'js/translations.php' );
		wp_register_script( 'admin', plugins_url() . self::PLUGIN_PATH . 'js/admin.js' );
		wp_register_script( 'search', plugins_url() . self::PLUGIN_PATH . 'js/search.js' );
		wp_register_script( 'suggestions', plugins_url() . self::PLUGIN_PATH . 'js/jquery.suggestions.js' );

		// Enqueue external libraries
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'jquery-ui-core' );
		wp_enqueue_script( 'jquery-ui-dialog' );

		// Enqueue our own scripts
		wp_enqueue_script( 'translations' );
		wp_enqueue_script( 'admin' );
		wp_enqueue_script( 'search' );
		wp_enqueue_script( 'suggestions' );
	}

	private function enqueue_styles() {
		// Register our own styles and enqueue
		wp_register_style( 'jquid_jquery_blog_stylesheet', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/redmond/jquery-ui.css' );
		wp_register_style( 'suggestions', plugins_url() . self::PLUGIN_PATH . 'css/jquery.suggestions.css' );
		wp_register_style( 'search', plugins_url() . self::PLUGIN_PATH . 'css/search.css' );

		wp_enqueue_style( 'jquid_jquery_blog_stylesheet' );
		wp_enqueue_style( 'suggestions' );
		wp_enqueue_style( 'search' );

	}

	private function init_frontend() {
		add_shortcode( 'photocommons', array( $this, 'add_shortcode' ) );
	}
}
