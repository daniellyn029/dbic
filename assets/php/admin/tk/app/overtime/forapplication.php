<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$date_create=SysDate();
$time_create=SysTime();
$time 	   = time();
$return = null;

$shift_cols = array("monday"	=>"idmon,mon,mon_in,mon_out,mon_brkin,mon_brkout", 
					"tuesday"	=>"idtue,tue,tue_in,tue_out,tue_brkin,tue_brkout",
					"wednesday"	=>"idwed,wed,wed_in,wed_out,wed_brkin,wed_brkout",
					"thursday"	=>"idthu,thu,thu_in,thu_out,thu_brkin,thu_brkout",
					"friday"	=>"idfri,fri,fri_in,fri_out,fri_brkin,fri_brkout",
					"saturday"	=>"idsat,sat,sat_in,sat_out,sat_brkin,sat_brkout", 
					"sunday"	=>"idsun,sun,sun_in,sun_out,sun_brkin,sun_brkout");


$shift_field	= "".$shift_cols[  strtolower(''.date("l", strtotime( $param->info ) )) ];
$shift_info 	= getDateShiftData( $con, $param->accountid, $shift_field, $param->info  );
$shiftin		= $shift_info[2];
$shiftout		= $shift_info[3];

$return = json_encode($shiftout);
print $return;
mysqli_close($con);


?>