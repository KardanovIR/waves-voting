<?php


$__modules['users'] = array(
	'GET' => array(
		'me' => function () {
			return new Result(true, '', array(
				'address' => $_SESSION['address'] ?? null,
				'wct_balance' => $_SESSION['wct_balance'] ? $_SESSION['wct_balance'] / 100 : 0,
			));
		}
	)
);