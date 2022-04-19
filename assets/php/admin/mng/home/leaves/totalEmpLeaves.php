<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));

$search ='';

// if( !empty( $param->deppt ) ){ $search=$search." AND idunit = '".$param->deppt."' "; }
if( !empty( $param->costcenter ) ){ $search=$search." AND costcenter = '".$param->costcenter."' "; }
if( !empty( $param->jobloc ) ){ $search=$search." AND idloc = '".$param->jobloc."' "; }


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


$date_arr=array();
$Qry = new Query();	
$Qry->table     = "vw_leave_application";
$Qry->selected  = "id,idunit,costcenter,idloc,empname,MIN(DATE) AS min_date, MAX(DATE) AS max_date";
$Qry->fields    = "idunit IN (".$ids.") ".$search." GROUP BY MONTH(DATE)";
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){

        //Get the difference between 2 dates
        $earlier = new DateTime($row['min_date']);
        $later = new DateTime($row['max_date']);
        $diff = $later->diff($earlier)->format("%a")+1;

        $data[] = array( 
            "empname"        => $row['empname'],
            "sdate"          => $row['min_date'],
            "edate"          => $row['max_date'],
            "no_days"        => $diff,
            "costcenter"     => $row['costcenter'],
            "getEmpInfo"     =>getEmpInfo($con, $ids),
            "getEmpjobLoc"   =>getEmpjobLoc($con, $ids),
            
            
            

        );
    }
    $return = json_encode($data);
}else{
    $return = json_encode(array('q'=>$Qry->fields));
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


function getEmpInfo($con, $ids){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="DISTINCT(costcenter)";
    $Qry->fields="idunit IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
			
			$data[] = array(
				"costcenter" => $row['costcenter'],

			);

        }
    }
    return $data;
}

function getEmpjobLoc($con, $ids){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="DISTINCT(job_loc)";
    $Qry->fields="idunit IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
			
			$data[] = array(
				"job_loc" => $row['job_loc'],

			);

        }
    }
    return $data;
}


?>