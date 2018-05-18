<?php
/*
Plugin Name: PhotoCommons
Plugin URI: https://www.mediawiki.org/wiki/PhotoCommons
Description: Search and add free images from Wikimedia Commons directly in your blog
Author: Hay Kranen, Timo Tijhof
Version: 0.2.0-alpha
Author URI: https://www.mediawiki.org/wiki/PhotoCommons
License: GPL2
*/

require_once __DIR__ . '/inc/class-photocommons.php';
new PhotoCommons();
