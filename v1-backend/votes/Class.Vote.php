<?php

class Vote extends AbstractEntity
{

	protected static $DEFAULT_COLS = array(
		'id',
		'address',
		'auth_information',
		'token_id',
		'wct_balance',
		'created_at',
		'updated_at'
	);

	protected static $ADDITIONAL_COLS = array();


	public static function create(int $token_id, ExtendedPDO $db)
	{
		return new Result(false, 'Voting was ended.');
//		if (isset($_SESSION['valid']) && $_SESSION['valid'] === true && $_SESSION['address'] !== null) {
//			$q_ins = App::queryFactory()->newInsert();
//			$upd_stake = file_get_contents('https://nodes.wavesplatform.com/assets/balance/' . $_SESSION['address'] . '/DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J');
//			$stake_json = json_decode($upd_stake, true);
//
//			$q_ins->into('votes')
//				->cols(array(
//					'address' => $_SESSION['address'],
//					'auth_information' => json_encode($_SESSION),
//					'token_id' => $token_id,
//					'wct_balance' => $stake_json['balance']
//				))
//				->onConflictUpdate(array('address'), array(
//					'auth_information' => json_encode($_SESSION),
//					'token_id' => $token_id,
//					'wct_balance' => $stake_json['balance']
//				));
//			$db->prepareExecute($q_ins);
//			return new Result(true, '', array('zero_balance' => $stake_json['balance'] == 0, 'wct_balance' => $stake_json['balance']));
//		} else {
//			throw new InvalidArgumentException();
//		}
	}
}