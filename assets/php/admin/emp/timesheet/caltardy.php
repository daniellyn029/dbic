<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param 		= json_decode(file_get_contents('php://input'));
$return 	= null;	

$year = date("Y");
$month = 1;
$months = array(
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July ',
	'August',
	'September',
	'October',
	'November',
	'December',
);

if( !empty( $param->accountid ) ){
	
	$arr_late = array();
	$arr_ut	  = array();
	$arr_abs  = array();
	
	while($month<=12){
		if( $month != 12 ){
			$dFrom	= $year."-".str_pad($month,2,"0",STR_PAD_LEFT)."-01";
			$dTo	= $year."-".str_pad(((int)$month+1),2,"0",STR_PAD_LEFT)."-01";
		}else{
			$dFrom	= $year."-12-01";
			$dTo	= ((int)$year+1)."-01-01";
		}
		
		$arr_late[] = getCounts($con,  $param->accountid, "late", $dFrom, $dTo);
		$arr_ut[]   = getCounts($con,  $param->accountid, "ut", $dFrom, $dTo);
		$arr_abs[]  = getCounts($con,  $param->accountid, "absent", $dFrom, $dTo);
		
		$month++;
	}
	
	
	$data	 	= array(
		"status"	=>	"success",
		"late"		=>	$arr_late,
		"ut"		=>	$arr_ut,
		"absent"	=>	$arr_abs
	);
	
	$return =  json_encode($data);
}else{
	$return = json_encode(array('status'=>'error'));
}

$return =  json_encode($data);
print $return;
mysqli_close($con);

function getCounts($con,  $idacct, $cols, $dFrom, $dTo){
	$Qry 			= new Query();	
	$Qry->table     = "vw_data_timesheet";
	$Qry->selected  = "COUNT(id) AS ctr";
	$Qry->fields    = "idacct = '".$idacct."' AND ".$cols." IS NOT NULL AND ".$cols." <> '0.00' AND ( work_date >= '".$dFrom."' AND work_date < '".$dTo."' ) ";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		if($row=mysqli_fetch_array($rs)){
			return $row['ctr'];
		}
	}
	return 0;
}


?>