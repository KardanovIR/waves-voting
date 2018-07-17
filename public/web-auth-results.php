<?php
error_reporting(E_ALL);
session_start();
$host = $_SERVER['SERVER_NAME'];
$url = "http://localhost:8080/api/validate?s={$_REQUEST['s']}&p={$_REQUEST['p']}&a={$_REQUEST['a']}&d={$_REQUEST['d']}&r={$host}";
$results = json_decode(@file_get_contents($url), true);
if ($results['valid'] === true) {
	$_SESSION['valid'] = true;
	$_SESSION['address'] = $results['address'] ?? null;
	$_SESSION['publicKey'] = $results['publicKey'] ?? null;
	$_SESSION['signature'] = $results['signature'] ?? null;
	$_SESSION['hostname'] = $results['hostname'] ?? null;
	$_SESSION['signedData'] = $results['signedData'] ?? null;
	setcookie('verified', true, time() + 3600, '/');  /* expire in 1 hour */


	// get balance and details
	$balance_url = 'https://nodes.wavesplatform.com/assets/balance/' . $_SESSION['address'] . '/DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J';
	$balance_json = json_decode(@file_get_contents($balance_url), true);
	$_SESSION['wct_balance'] = $balance_json['balance'];
} else {
	$_SESSION['valid'] = false;
	$_SESSION['address'] = null;
	$_SESSION['publicKey'] = null;
	$_SESSION['signature'] = null;
	$_SESSION['hostname'] = null;
	$_SESSION['signedData'] = null;
	setcookie('verified', false, time() + 3600, '/');  /* expire in 1 hour */
}

header('Location: /get-wct');
