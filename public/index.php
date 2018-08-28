<?php
session_start();

$path = $_SERVER['REQUEST_URI'];
$path_only = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);


$site_url = 'https://' . $_SERVER['HTTP_HOST'];
//
//if ($path == '/logout') {
//	session_unset();
//	setcookie('verified', false, time() + 3600, '/');  /* expire in 1 hour */
//	header('Location: /');
//}
//if ($path === '/' || $path_only === '/voted') {
//
//} elseif (
//((isset($_SESSION['valid']) &&
//		$_SESSION['valid'] === false) ||
//	(!isset($_SESSION['address']) ||
//		!isset($_SESSION['publicKey']) ||
//		!isset($_SESSION['signature']) ||
//		!isset($_SESSION['hostname']) ||
//		!isset($_SESSION['signedData'])))
//) {
//	header('Location: /');
//}

?>
  <!DOCTYPE html>
  <html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <!--
		manifest.json provides metadata used when your web app is added to the
		homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
	-->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
  <!--
		Notice the use of %PUBLIC_URL% in the tags above.
		It will be replaced with the URL of the `public` folder during the build.
		Only files inside the `public` folder can be referenced from the HTML.

		Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
		work correctly both with client-side routing and a non-root public URL.
		Learn how to configure a non-root public URL by running `npm run build`.
	-->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
        crossorigin="anonymous">
  <link rel="stylesheet" href="/style.css"
        crossorigin="anonymous">
  <link rel="stylesheet" href="/add.css"
        crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta property="og:type" content="article"/>
  <meta property="og:description" content="Vote for next ERC20 listing on DEX"/>

	<?php

	$tokens_list = array(
		'BNT', 'CTXC', 'DENT', 'ENJ', 'GNT', 'REP', 'RLC',
		'THETA', 'ZIL', 'ZRX', 'KNC', 'MITH', 'OMG'
	);

	if (isset($_GET['social']) && isset($_GET['token']) && in_array($_GET['token'], $tokens_list)) {
		if ($_GET['social'] === 'fb' || $_GET['social'] === 'vk') {
			echo "<meta property=\"og:image\" content=\"{$site_url}/img/share/{$_GET['token']}/1200x628.png\" />";
		} elseif ($_GET['social'] === 'twitter') {
			echo "<meta name=\"twitter:card\" content=\"summary_large_image\" />";
			echo "<meta name=\"twitter:image\"  content=\"{$site_url}/img/share/{$_GET['token']}/910x512.png\" />";
		} else {
			echo "<meta property=\"og:image\" content=\"{$site_url}/img/share/{$_GET['token']}/910x512.png\" />";
		}
		echo "
        <meta property=\"og:title\" content=\"Waves ERC20 DEX Vote\"/>
        <meta property=\"twitter:title\" content=\"Waves ERC20 DEX Vote\"/>
        <meta property=\"og:description\"        content=\"Vote for your favourite REC20 to be listed first on DEX\" />";
	}else{
	  echo "<title>Waves ERC20 DEX Vote</title>";
  }
	?>

  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=kPx8X8g8xR">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=kPx8X8g8xR">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=kPx8X8g8xR">
  <link rel="mask-icon" href="/safari-pinned-tab.svg?v=kPx8X8g8xR" color="#5bbad5">
  <link rel="shortcut icon" href="/favicon.ico?v=kPx8X8g8xR">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">


</head>

<?php
require_once('./index.html');