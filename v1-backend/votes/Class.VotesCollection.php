<?php


class VotesCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																array $filters = array(),
																array $fields = array(),
																array $pagination = array(),
																array $order_by = array('wct_balance DESC'))
	{

		$q_get_votes = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_vote = false;
		$from_table = 'view_votes';
		$cols = Fields::mergeFields(Vote::getAdditionalCols(), $fields, Vote::getDefaultCols());
		if (isset($pagination['offset'])) {
			$q_get_votes->offset($pagination['offset']);
		}
		if (isset($pagination['length'])) {
			$q_get_votes->limit($pagination['length']);
		}
		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'token_id':
					{
						$q_get_votes->where('token_id = :token_id');
						$statements[':token_id'] = $value;
						break;
					}
			}
		}
		$q_get_votes->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);
		$p_get_votes = $db->prepareExecute($q_get_votes, 'CANT_FIND_VOTE', $statements);
		$votes = $p_get_votes->fetchAll(PDO::FETCH_CLASS, 'Vote');
		if (count($votes) == 0 && $is_one_vote) throw new LogicException('CANT_FIND_VOTE');
		if ($is_one_vote) return $votes[0];
		$result_votes = array();
		foreach ($votes as $vote) {
			$result_votes[] = $vote->getParams($fields)->getData();
		}
		return new Result(true, '', $result_votes);

	}

	public static function getSumBalances(ExtendedPDO $db)
	{
		$q_get_votes = App::queryFactory()->newSelect();
		$q_get_votes->distinct()
			->from('view_votes')
			->cols(array(
				'SUM(wct_balance::FLOAT)::NUMERIC(10, 2) AS total_wct_balances'
			));
		$p_get_votes = $db->prepareExecute($q_get_votes, 'CANT_FIND_VOTE');
		return new Result(true, '', array('total_wct_balance' => $p_get_votes->fetchColumn(0)));

	}
}