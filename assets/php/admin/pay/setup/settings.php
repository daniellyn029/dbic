<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 


$data = array( 
	"emptypes" => getEmployeeType($con),
    "acctypes" => getAccountType($con),
	"civilstat"=> getCivilStatus($con)
);
$return = json_encode($data);

print $return;
mysqli_close($con);
?>