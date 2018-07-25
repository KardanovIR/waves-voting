<?php


class Token extends AbstractEntity
{
	protected static $DEFAULT_COLS = array(
		'id',
		'name',
		'description',
		'price',
		'icon',
		'created_at',
		'updated_at',
		'wct_share',
		'wct_amount',
		'votes_count',
		'link',
		'coinmarketcap_id',
	);

	protected static $ADDITIONAL_COLS = array(
		'voted_for' => '((SELECT COUNT(id) FROM votes WHERE token_id = view_tokens.id AND address = :address) > 0)::BOOLEAN AS voted_for',
		'votes_percentage'
	);


	public function getParams(array $fields = null): Result
	{
		$result_data = parent::getParams($fields)->getData();
		if (isset($fields['votes'])) {
			$votes_meta = $fields['votes'];
			$result_data['votes'] = VotesCollection::filter(
				App::DB(),
				array('token_id' => $result_data['id']),
				Fields::parseFields($votes_meta['fields'] ?? ''),
				$votes_meta['pagination'] ??
				array(
					'length' => $votes_meta['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $votes_meta['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($votes_meta['order_by'] ?? ''))->getData();
		}
		return new Result(true, '', $result_data);
	}
}