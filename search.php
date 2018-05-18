<?php
require_once '../../../wp-load.php';

$path = dirname( $_SERVER['PHP_SELF'] );
// Standalone is used to debug/test this page directly,
// without having to the HEAD/BODY with it in admin.
$standalone = empty( $_GET['standalone'] );

if ( $standalone ) : ?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="<?php echo $dir; ?>/css/ui-lightness/jquery-ui-1.8.5.custom.css" />
    <link rel="stylesheet" href="<?php echo $dir; ?>/css/jquery.suggestions.css" />
    <link rel="stylesheet" href="css/search.css" />
</head>
<body>
<?php endif; ?>

    <label for="wp-photocommons-search"><?php _e("Search", "wp-photocommons"); ?>:</label>
	<input type="search" id="wp-photocommons-search" />

	<ul id="wp-photocommons-results"></ul>

	<img src="<?php echo $path; ?>/img/loading.gif" style="display:none;" id="wp-photocommons-loading" />

	<div id="wp-photocommons-images"></div>

<?php if ($standalone) : ?>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
	<script src="<?php echo $path; ?>/js/jquery-ui-1.8.5.custom.min.js"></script>
	<script src="<?php echo $path; ?>/js/search.js"></script>
	<script src="<?php echo $path; ?>/js/jquery.suggestions.js"></script>
</body>
</html>
<?php endif; ?>
