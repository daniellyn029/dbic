<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_POST;
$return = null;	
$pay_period = getPayPeriod($con);


$search='';
// //if( array_key_exists('idsuperior', $param) && !empty($param['idsuperior']) ){ $search=$search." AND idsuperior 	= '".$param['idsuperior']."' ";  }
if( !empty( $param['search_acct'] ) ){ $search=$search." AND idacct 	= '".$param['search_acct']."' "; }
if( !empty($param['_from']) && empty($param['_to'])){
    $search=$search." AND date BETWEEN DATE('".$param['_from']."') AND DATE('".$param['_from']."') ";
}
if( !empty($param['_from']) && !empty($param['_to']) ){
    $search=$search." AND date BETWEEN DATE('".$param['_from']."') AND DATE('".$param['_to']."') ";   
}

$where = $search;

//sort nga funtion sa table
if( $param['order'][0]['column'] !='' ){//default 
	$arrCols = array("empname",
					"business_unit",
					"date",
					"",
					"",
					"",
					"",
					"adj_status");//mao ra ang mailisan na declare na sa ubos php
	$search=$search." ORDER BY ". $arrCols[$param['order'][0]['column']] ." ".$param['order'][0]['dir'];//default
}

if( (int)$param['length'] >= 0 ){
    $search=$search." LIMIT ".$param['length'];	
}
if( $param['start'] !='' && (int)$param['length'] >= 0 ){
    $search=$search." OFFSET ".$param['start'];
}

$Qry = new Query();	
$Qry->table     = "vw_attendance_application";
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
        
        $data["data"][] = array(
            'count'             => $count,
            'empname'			=> $row['empname'],
            'business_unit'		=> $row['business_unit'],
            'date'			    => $row['date'],
            'app_type'			=> $row['app_type'],
            'app_time'			=> $row['app_time'],
            'remarks'			=> $row['remarks'],
            'adj_status'		=> $row['adj_status'],
            'file'				=> $row['file'],

			
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
	$Qry->table ="vw_attendance_application";
	$Qry->selected ="*";
	$Qry->fields    = "date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."'".$search;
	$rs = $Qry->exe_SELECT($con);
	return mysqli_num_rows($rs);
}



?>