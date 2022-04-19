<?php
date_default_timezone_set('Asia/Manila');
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param 		= json_decode(file_get_contents('php://input'));
$return 	= null;	


$str =  $param->accountid;


$year = date("Y");
$month = $param->search_leave_month;
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

$dept = getIdUnit($con,$param->accountid);
$ids=0;

//Get Managers Under person
$ids=0;if( !empty( $dept ) ){
    $arr_id = array();
    $arr 	= getHierarchy($con,$dept);
    array_push( $arr_id, 0 );
    if( !empty( $arr["nodechild"] ) ){
        $a = getChildNode($arr_id, $arr["nodechild"]);
        if( !empty($a) ){
            foreach( $a as $v ){
                array_push( $arr_id, $v );
            }
        }
    }
    if( count($arr_id) == 1 ){
        $ids 			= $arr_id[0];
    }else{
        $ids 			= implode(",",$arr_id);
    }
}

if( !empty( $param->accountid ) ){

	// if( strlen($str) > 0 ){
	// 	$Qry 			= new Query();	
	// 	$Qry->table     = "vw_dataemployees";
	// 	$Qry->selected  = "*";
	// 	$Qry->fields    = "idunit IN (".$ids.")";
	// 	$rs 			= $Qry->exe_SELECT($con);
	// 	if( mysqli_num_rows($rs) >= 1 ){
	// 		while($row=mysqli_fetch_array($rs)){


			
                
	// 		}
	// 	}

		
	// }


    if( $month != 12 ){
            $dFrom	= $year."-".str_pad($month,2,"0",STR_PAD_LEFT)."-01";
            $dTo	= $year."-".str_pad(((int)$month+1),2,"0",STR_PAD_LEFT)."-01";
	}else{
		$dFrom	= $year."-12-01";
		$dTo	= ((int)$year+1)."-01-01";
	}
   

	$data	 	= array(
        "status"		  => "success",        
        "emps"            =>  getEmp($con,$ids),
		"countleaves"     =>  getEmpCountLeaves($con,  $ids, $dFrom, $dTo),
        "pp"              => $str,
	);
	
	$return =  json_encode($data);
}else{
	$return = json_encode(array('status'=>'error'));
}

$return =  json_encode($data);
print $return;
mysqli_close($con);

function getIdUnit($con, $idacct){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="idunit";
    $Qry->fields="id='".$idacct."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['idunit'];
        }
    }
    return null;
}

function getCountsLEAVE($con,  $ids, $dFrom, $dTo){
	$Qry 			= new Query();	
	$Qry->table     = "tblpayroll";
	$Qry->selected  = "COUNT(id) AS ctr";
    // $Qry->fields    = "dept_id IN (".$idunit.") AND (pay_date >= '".$dFrom."' AND pay_date < '".$dTo."') AND idstatus=1 AND class_id=19 ";
    $Qry->fields    = "id_acct IN (".$ids.") AND (pay_date >= '".$dFrom."' AND pay_date < '".$dTo."') AND idstatus=1 AND class_id=19 GROUP BY id_acct ";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

			return $row['ctr'];
		}
	}
	return 0;
}

function getEmpCountLeaves($con, $ids, $dFrom, $dTo){
	$data=array();
	$Qry 			= new Query();	
	$Qry->table     = "vw_dataemployees";
	$Qry->selected  = "*";
	$Qry->fields    = "idunit IN (".$ids.")";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

			array_push($data,getCountsLEAVE($con,  $row['id'], $dFrom, $dTo));
			
		}
	}
	return $data;
}

function getEmp($con, $ids){
	$data=array();
	$Qry 			= new Query();	
	$Qry->table     = "vw_dataemployees";
	$Qry->selected  = "*";
	$Qry->fields    = "idunit IN (".$ids.")";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

			array_push($data,$row['empname']);
			
		}
	}
	return $data;
}


?>