<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php');

$param 		= json_decode(file_get_contents('php://input'));
$return 	= null;	

$str =  $param->accountid;


$year = $param->search_year;
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
	
	$arr_OTyear  = array();

	if( strlen($str) > 0 ){
		while($month<=12){
			if( $month != 12 ){
				$dFrom	= $year."-".str_pad($month,2,"0",STR_PAD_LEFT)."-01";
				$dTo	= $year."-".str_pad(((int)$month+1),2,"0",STR_PAD_LEFT)."-01";
			}else{
				$dFrom	= $year."-12-01";
				$dTo	= ((int)$year+1)."-01-01";
			}


            $arr_OTyear[]  = getCountsOTbyYear($con,  $str, $dFrom, $dTo, $ids);
			
			$month++;
			
		}
    }
	
	
	$data	 	= array(
        "status"	=>	"success",
        "OTyear"	=> $arr_OTyear,
		// "OTyear"	=>	getCountsOTbyYear($con, $dFrom, $dTo, $ids),
		"yearss"	=> getYear($con,$str, $dFrom, $dTo),
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

function getCountsOTbyYear($con, $idacct, $dFrom, $dTo, $ids){
	$Qry 			= new Query();	
	$Qry->table     = "tblpayroll";
	$Qry->selected  = "COUNT(id) AS ctr";
	$Qry->fields    = "(pay_date >= '".$dFrom."' AND pay_date < '".$dTo."') AND idstatus=1 AND class_id=18 AND dept_id IN (".$ids.")";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		if($row=mysqli_fetch_array($rs)){
			return $row['ctr'];
		}
	}
	return 0;
}

function getYear($con){
	$date_arr = array();
	$Qry 		   = new Query();	
	$Qry->table    = "tblpayroll";
	$Qry->selected = "IFNULL(MIN(YEAR(pay_date)),2018) AS min_year, IFNULL(MAX(YEAR(pay_date)), YEAR(CURDATE())) AS max_year";
	$Qry->fields   = "id>0";
	$rs 		   = $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		if($row=mysqli_fetch_array($rs)){
			//For Loop
			for ($x = (int)$row['min_year']; $x <= (int)$row['max_year']; $x++) {
				array_push($date_arr,(int)$x);
			}
		}
	}
	return $date_arr;
}


?>