<?php


class TokensCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																array $filters = array(),
																array $fields = array(),
																array $pagination = array(),
																array $order_by = array('created_at'))
	{

		$q_get_tokens = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_token = false;
		$from_table = 'view_tokens';
		$cols = Fields::mergeFields(Token::getAdditionalCols(), $fields, Token::getDefaultCols());
		if (isset($pagination['offset'])) {
			$q_get_tokens->offset($pagination['offset']);
		}
		if (isset($pagination['length'])) {
			$q_get_tokens->limit($pagination['length']);
		}
		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id':
					{
						$q_get_tokens->where('id = :id');
						$statements[':id'] = $value;
						$is_one_token = true;
						break;
					}
				case 'withVotedFor':
					{
						$statements[':address'] = $_SESSION['address'] ?? 'dummy';
						break;
					}
			}
		}
		$q_get_tokens->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);
		$p_get_tokens = $db->prepareExecute($q_get_tokens, 'CANT_FIND_TOKEN', $statements);
		$tokens = $p_get_tokens->fetchAll(PDO::FETCH_CLASS, 'Token');
		if (count($tokens) == 0 && $is_one_token) throw new LogicException('CANT_FIND_TOKEN');
		if ($is_one_token) return $tokens[0];
		$result_tokens = array();
		foreach ($tokens as $token) {
			$result_tokens[] = $token->getParams($fields)->getData();
		}
		return new Result(true, '', $result_tokens);

	}

	public static function updatePrices(ExtendedPDO $db)
	{
		return new Result(true, '');

//		$tokens = self::filter($db)->getData();
//		foreach ($tokens as $token) {
//			$response = file_get_contents('https://api.coinmarketcap.com/v2/ticker/' . $token['coinmarketcap_id']);
//			$response_json = json_decode($response, true);
//			$q_upd_price = App::queryFactory()->newUpdate();
//			$q_upd_price->table('tokens')
//				->cols(array(
//					'price' => $response_json['data']['quotes']['USD']['price']
//				))
//				->set('updated_at', 'NOW()')
//				->where('id = ? ', $token['id']);
//			$db->prepareExecute($q_upd_price);
//		}

	}
}