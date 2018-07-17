<?php

require_once $BACKEND_FULL_PATH . '/tokens/Class.Token.php';
require_once $BACKEND_FULL_PATH . '/tokens/Class.TokensCollection.php';
require_once $BACKEND_FULL_PATH . '/votes/Class.VotesCollection.php';
require_once $BACKEND_FULL_PATH . '/votes/Class.Vote.php';

$__modules['votes'] = array(
	'GET' => array(
		'' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return UsersCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'tokens' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return TokensCollection::filter(
				$__db,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'balances' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return VotesCollection::getSumBalances($__db);
		},
	),
	'POST' => array(
		'{/(id:[0-9]+)}' => function ($token_id) use ($__db, $__request, $__user, $__fields) {
			$result = Vote::create($token_id, $__db);
			return $result;
		}
	)
);