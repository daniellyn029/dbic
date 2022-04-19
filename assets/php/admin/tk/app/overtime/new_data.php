<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_POST;
$return = null;	
$pay_period = getPayPeriod($con);

$search='';

// if( array_key_exists('idsuperior', $param) && !empty($param['idsuperior']) ){ 
// 	if( array_key_exists('units', $param) && !empty($param['units']) ){
// 		$search=$search." AND (idsuperior 	= '".$param['idsuperior']."' OR idsuperior in (".$param['units'].") ) ";  
// 	}else{
// 		$search=$search." AND idsuperior 	= '".$param['idsuperior']."' ";  
// 	}
// }
if( !empty( $param['acct'] ) ){ $search=$search." AND idacct 	= '".$param['acct']."' "; }
if( !empty($param['dfrom']) && empty($param['dto'])){
    $search=$search." AND date BETWEEN DATE('".$param['dfrom']."') AND DATE('".$param['dfrom']."') ";
}
if( !empty($param['dfrom']) && !empty($param['dto']) ){
    $search=$search." AND date BETWEEN DATE('".$param['dfrom']."') AND DATE('".$param['dto']."') ";   
}

$where = $search;

//sort nga funtion sa table
if( $param['order'][0]['column'] !='' ){//default 
	$arrCols = array("empname",
					"business_unit",
					"date",
					"",
					"planned_hrs",
					"",
					"ot_status");//mao ra ang mailisan na declare na sa ubos php
	$search=$search." ORDER BY ". $arrCols[$param['order'][0]['column']] ." ".$param['order'][0]['dir'];//default
}



if( (int)$param['length'] >= 0 ){
    $search=$search." LIMIT ".$param['length'];	
}
if( $param['start'] !='' && (int)$param['length'] >= 0 ){
    $search=$search." OFFSET ".$param['start'];
}

$Qry = new Query();	
$Qry->table     = "vw_overtime_application";
$Qry->selected  = "*";
$Qry->fields    = "date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."'".$search;
$rs = $Qry->exe_SELECT($con);
$recFiltered = getTotalRows($con,$where);
if(mysqli_num_rows($rs)>= 1){
    $data = array( 
        "draw"=> $param['draw'],
        "recordsTotal"=> mysqli_num_rows($rs),
        "recordsFiltered"=> $recFiltered,
        "qry"=>$Qry->fields,
        "data"=>array()
	);
	$count=1;
    while($row=mysqli_fetch_array($rs)){
		
		// $ot_s = date('Y-m-d h:i A', strtotime($row['planned_start']));
		// $arr_s = explode(" ",$row['planned_start']);
		// if( $arr_s[0] == $row['date'] ){
		// 	$ot_s = date('h:i A', strtotime($arr_s[1]));
		// }
		
		// $ot_f = date('Y-m-d h:i A', strtotime($row['planned_end']));
		// $arr_f = explode(" ",$row['planned_end']);
		// if( $arr_f[0] == $row['date'] ){
		// 	$ot_f = date('h:i A', strtotime($arr_f[1]));
		// }
        
        $units = sprintf('%0.2f',($row['planned_hrs'] / 60));
        
        $data["data"][] = array(
            'count'				=> $count,    
            'empname'			=> $row['empname'],
            'business_unit'		=> $row['business_unit'],
            'date'			    => $row['date'],
            'app_time'			=> $row['app_time'],
            // 'units2'			=> $row['planned_hrs'],
            'remarks'			=> $row['remarks'],
            'units2'			=>$units ,
            'ot_status'			=> $row['ot_status'],           

		);
		$count++;
    }
    $return =  json_encode($data);
}else{
    $data = array( 
        "draw"=> $param['draw'],
        "recordsTotal"=> mysqli_num_rows($rs),
        "recordsFiltered"=> mysqli_num_rows($rs),
		"qry"=>$Qry->fields,
        "data"=>array()
    );
    $return =  json_encode($data);
}

print $return;
mysqli_close($con);

function getTotalRows($con,$search){
    $pay_period = getPayPeriod($con);
	$Qry = new Query();	
	$Qry->table ="vw_overtime_application";
	$Qry->selected ="*";
	$Qry->fields    = "date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."'".$search;
	$rs = $Qry->exe_SELECT($con);
	return mysqli_num_rows($rs);
}

?>