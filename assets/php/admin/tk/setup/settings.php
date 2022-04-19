<?php
require_once('../../../activation.php');
$param = json_decode(file_get_contents('php://input'));

$conn = new connector();	

if( !empty($param->conn) && (int)$param->conn > 1 ){	
	
	$varcon = "connect".(int)$param->conn;
	$con = $conn->$varcon();
}else{
	$con = $conn->connect();
}

require_once('../../../classPhp.php'); 


$data = array( 
	"leavetype" 	=> getLeaveTypes($con),
	"leaves"		=> getLeaves($con),
	"shifttypes"	=> getShiftsTypes($con),
	"holidaytypes"	=> getHolidayTypes($con),
	"accounts"		=> getAccounts($con,''),
	"period"		=> getPayPeriod($con),
	"departments"	=> getAllDepartment($con),
	"positions"		=> getPositions($con),
	"joblocation"	=> getJobLocation($con),
	"paygroup"		=> getPayGroups($con),
	"labortype"		=> getLabors($con),
	"joblvl"		=> getJobLvls($con),
	"work_dates"	=> getMinMax($con),
	"measures"		=> getMeasures($con),
	"timeconf"		=> getTimeLogsConf($con),
	"workshifts" 	=> getWShifts($con),
	"holidays" 		=> getHoliday($con)
);
$return = json_encode($data);

print $return;
mysqli_close($con);
?>