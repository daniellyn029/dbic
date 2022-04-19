<?php
require_once('../../../activation.php');
$conn = new connector();
$con  = $conn->connect();
require_once('../../../classPhp.php');

$param 		= json_decode(file_get_contents('php://input'));
$str 		=  $param->accountid;
$return 	= null;	
$data		= array(
				"name" => array(),
				"data" => array()
			);
$first_day_this_month = date('Y-01-01');
$last_day_this_month  = date('Y-m-t');

$ids=0;
$dept = getIdUnit($con,$param->accountid);
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

$Qry 			= new Query();	
$Qry->table     = "vw_dataemployees";
$Qry->selected  = "GROUP_CONCAT(id) as idacct";
$Qry->fields    = "(idunit IN (".$ids.") OR idsuperior='".$param->accountid."') AND id != '".$param->accountid."'";
$rs 			= $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){
        $str = $row['idacct'];
    }
}



if( !empty( $param->accountid ) && !empty($str) ){
	
	$Qry2 			= new Query();	
	$Qry2->table     = "vw_leave_application2 AS a ";
	$Qry2->selected  = "a.idacct, a.empname, COUNT(a.idacct) AS ctr";
	$Qry2->fields    = "(a.date >= '".$first_day_this_month."' AND a.date <= '".$last_day_this_month."' ) AND a.idacct IN (".$str.") GROUP BY a.idacct ORDER BY COUNT(a.idacct) DESC LIMIT 5";
	$rs2 			= $Qry2->exe_SELECT($con);
	if( mysqli_num_rows($rs2) >= 1 ){
		while($row2=mysqli_fetch_array($rs2)){
			
			array_push($data["name"],$row2['empname']);
			array_push($data["data"],$row2['ctr']);
		}
	}
	
	$return =  json_encode($data);
}else{
	//$return = json_encode(array('status'=>'error'));
	$return =  json_encode($data);
}

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

?>