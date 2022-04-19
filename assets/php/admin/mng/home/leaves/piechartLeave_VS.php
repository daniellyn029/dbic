<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));


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


$pie_data	= array(getHoursLeaves($con, $param->accountid,$ids),getScheWH($con, $param->accountid,$ids));
$pie_colour = array('#b0beec','#ebab76');
$pie_labels	= array('Overtime Hours','Scheduled Work Hours');


$data = array(
    "lbl" 	=> $pie_labels,
    "ctr"	=> $pie_data,
    "colour"=> $pie_colour,
    "ids"   => $ids,
    "sum"	=> (int)array_sum($pie_data),
);

$return = json_encode($data);


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

function getHoursLeaves($con, $idacct,$ids){
    $Qry=new Query();
    $Qry->table="tblpayroll";
    $Qry->selected="SUM(units) AS ctr";
    $Qry->fields="class_id=19 AND idstatus=1 AND dept_id IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

            return intval($row['ctr']);
        }
    }
    return 0;
}
function getScheWH($con, $idacct,$ids){
    $Qry=new Query();
    $Qry->table="vw_data_timesheet AS dt LEFT JOIN vw_dataemployees AS de ON dt.empID = de.id";
    $Qry->selected="SUM(dt.absent) as ctr";
    $Qry->fields="de.idunit IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return intval($row['ctr']);
        }
    }
    return 0;
}


?>