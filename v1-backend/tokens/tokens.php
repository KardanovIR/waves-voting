<?php

require_once $BACKEND_FULL_PATH . '/tokens/Class.TokensCollection.php';
require_once $BACKEND_FULL_PATH . '/tokens/Class.Token.php';

$__modules['tokens'] = array(
	'GET' => array(
		'' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return TokensCollection::filter(
				$__db,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'{update/price}' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return TokensCollection::updatePrices($__db);
		},
	)
);