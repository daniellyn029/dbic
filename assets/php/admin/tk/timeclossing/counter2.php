<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$date=SysDate();
$time=SysTime();
$return = null;	
$data = array();
if( !empty($param->accountid) ){
	$Qry 			= new Query();	
	$Qry->table     = "vw_payperiod";
	$Qry->selected  = "*";
	$Qry->fields    = "id>0";
	$rs				= $Qry->exe_SELECT($con);		
	if(mysqli_num_rows($rs)>=1){
		while($row=mysqli_fetch_array($rs)){
			$icon = "fa fa-unlock";
			if( (int)$row['stat'] == 1 ){
				$icon = "fa fa-lock";
			}
			$data[] = array(
				"remaining_period" 	=> $row['remaining_period'],
				"cutoff_period"		=> $row['cutoff_period'],
				"payroll_period"  	=> $row['payroll_period'],
				"pay_period" 		=> $row['pay_period'],
				"daysno" 			=> $row['daysno'],
				"headno"			=> $row['headno'],
				"dateclosed"  		=> $row['dateclosed'],
				"closedby" 			=> $row['closedby'],
				"stat" 				=> $row['stat'],
				"icon"				=> $icon
			);
		}
	}
}
$return = json_encode($data);

print $return;
mysqli_close($con);


?>