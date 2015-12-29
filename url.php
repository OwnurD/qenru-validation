<?php



if($_POST)
{
	$response = array(
		"data" => "I'm ajax response",
		"success" => true
		);
	echo json_encode($response);
}




?>