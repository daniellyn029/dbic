<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$data = array();

$ids = implode(",",$param->id);

$Qry = new Query();	
$Qry->table     = "vw_overtime_application";
$Qry->selected  = "*";
$Qry->fields    = "id in (".$ids.")";
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
	$app1 = 0;
	$app2 = 0;
	$data = array(
		"idacct"		=> '',
		"date"			=> '',
		"reason"		=> '',
		"stat"			=> '',
		"ctr_1"			=> $app1,
		"ctr_2"			=> $app2,
		"data"			=> array()
	);
	
    while($row=mysqli_fetch_array($rs)){
		
		$curr_appr = '2';
		if( empty($row['approver1_stat']) && empty($row['approver2_stat']) && (int)$row['stat'] != 4 ){
			$curr_appr = '1';
			$app1++;
		}elseif( !empty($row['approver1_stat']) && empty($row['approver2_stat']) && (int)$row['stat'] != 4 ){
			$curr_appr = '2';
			$app2++;
		}
		
        $data["data"][] = array(
            "id"        			=> $row['id'],
            "docnumber" 			=> $row['docnumber'],			
            "idacct" 				=> $row['idacct'],
			"idunit"				=> $row['idunit'],
			"idsuperior"			=> $row['idsuperior'],
            "empid" 				=> $row['empid'],			
            "empname" 				=> $row['empname'],
            "date" 					=> $row['date'],
			"planned_date_start"	=> $row['planned_date_start'],
			"planned_date_end"		=> $row['planned_date_end'],
			"planned_time_start"	=> date('h:i A', strtotime($row['planned_time_start'])),
			"planned_time_end"		=> date('h:i A', strtotime($row['planned_time_end'])),
			"planned_start"			=> $row['planned_start'],
			"planned_end"			=> $row['planned_end'],
			"planned_hrs"			=> $row['planned_hrs'],
			"actual_start"			=> $row['actual_start'],
			"actual_end"			=> $row['actual_end'],
			"actual_hrs"			=> $row['actual_hrs'],			
            "start_time" 			=> date('h:i A', strtotime($row['start_time'])),
			"end_time" 				=> date('h:i A', strtotime($row['end_time'])),		
			"remarks" 				=> $row['remarks'],
			"file" 					=> $row['file'],
			"curr_stat"				=> $row['stat'],
			"stat" 					=> $row['stat'],
			"ot_status"				=> $row['ot_status'],
			"date_approve"			=> $row['date_approve'],
			"approve_hr"			=> $row['approve_hr'],
			"id_payperiod"			=> $row['id_payperiod'],
			"period_start"			=> $row['period_start'],
			"period_end"			=> $row['period_end'],
			"grace_hour"			=> $row['grace_hour'],
			"reason"				=> '',
			"curr_appr"				=> $curr_appr
        );
    }
	$data['ctr_1'] = $app1;
	$data['ctr_2'] = $app2;
}
        
$return = json_encode($data);

print $return;
mysqli_close($con);
?>