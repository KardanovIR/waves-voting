<?php


abstract class AbstractCollection
{

	public abstract static function filter(ExtendedPDO $db,
																				 array $filters = array(),
																				 array $fields = array(),
																				 array $pagination = array(),
																				 array $order_by = array('created_at'));


	public static function one(ExtendedPDO $db,
														 int $id,
														 array $fields = array())
	{

		return static::filter($db, array('id' => $id), $fields);
	}

}