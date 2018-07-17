<?php


class User
{

	public function getId(){
		return $_SESSION['address'] ?? null;
	}


}