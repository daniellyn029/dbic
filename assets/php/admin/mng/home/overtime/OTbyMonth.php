<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param 		= json_decode(file_get_contents('php://input'));
$return 	= null;	

$str =  $param->accountid;

$year = date("Y");
$month = $param->search_month;
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
	// 	$data1=array();
	// 	$data2=array();
	// 	$Qry 			= new Query();	
	// 	$Qry->table     = "vw_databusinessunits";
	// 	$Qry->selected  = "*";
	// 	$Qry->fields    = "unittype=3";
	// 	$rs 			= $Qry->exe_SELECT($con);
	// 	if( mysqli_num_rows($rs) >= 1 ){
			
	// 		while($row=mysqli_fetch_array($rs)){
	// 			$ids = 0;
	// 			$dept =$row['id'];
	// 			//$arr_leaves=array();

	// 			$month = $param->search_month;

	// 			//Get heirarchy
	// 			if (!empty($dept)) {
	// 				$arr_id = array();
	// 				$arr    = getHierarchy($con, $dept);
	// 				array_push($arr_id, $dept);
	// 				if (!empty($arr["nodechild"])) {
	// 					$a = getChildNode($arr_id, $arr["nodechild"]);
	// 					if (!empty($a)) {
	// 						foreach ($a as $v) {
	// 							array_push($arr_id, $v);
	// 						}
	// 					}
	// 				}
	// 				if (count($arr_id) == 1) {
	// 					$ids = $arr_id[0];
	// 				} else {
	// 					$ids = implode(",", $arr_id);
	// 				}
	// 				array_push($data2,$ids);
				
	// 				// while($month<=12){
	// 					if( $month != 12 ){
	// 						$dFrom	= $year."-".str_pad($month,2,"0",STR_PAD_LEFT)."-01";
	// 						$dTo	= $year."-".str_pad(((int)$month+1),2,"0",STR_PAD_LEFT)."-01";
	// 					}else{
	// 						$dFrom	= $year."-12-01";
	// 						$dTo	= ((int)$year+1)."-01-01";
	// 					}
				
	// 					$arr_leaves  = getCountsOT($con,  $ids, $dFrom, $dTo);
	// 					$month++;
	// 				// }
	// 				array_push($data1,$arr_leaves);
	// 			}
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
        "status"	=>	"success",
        "overtime"	=> getEmpCountOT($con,  $ids, $dFrom, $dTo),
        
        "emps"     =>  getEmp($con, $ids),
        
        "pp"        => $str,
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

function getCountsOT($con,  $ids, $dFrom, $dTo){
	$Qry 			= new Query();	
	$Qry->table     = "tblpayroll";
	$Qry->selected  = "COUNT(id) AS ctr";
    $Qry->fields    = "id_acct IN (".$ids.") AND (pay_date >= '".$dFrom."' AND pay_date < '".$dTo."') AND idstatus=1 AND class_id=18 GROUP BY id_acct ";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

			return $row['ctr'];
		}
	}
	return 0;
}

function getEmpCountOT($con, $ids, $dFrom, $dTo){
	$data=array();
	$Qry 			= new Query();	
	$Qry->table     = "vw_dataemployees";
	$Qry->selected  = "*";
	$Qry->fields    = "idunit IN (".$ids.")";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

			array_push($data,getCountsOT($con,  $row['id'], $dFrom, $dTo));
			
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