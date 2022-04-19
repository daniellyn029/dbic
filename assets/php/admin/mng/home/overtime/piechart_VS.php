<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$pay_period = getPayPeriod($con);

$search='';
if( !empty($param->dateFrom) && !empty($param->dateTo) ){
    $search=$search." AND pay_date BETWEEN DATE('".$param->dateFrom."') AND DATE('".$param->dateTo."') ";
   
}

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

$pie_data	= array(getHoursOT($con, $param->accountid,$param,$ids),getScheWH($con, $param->accountid,$param,$ids));
$pie_colour = array('#b0beec','#ebab76');
$pie_labels	= array('Overtime Hours','Scheduled Work Hours');
    


$data = array(
    "lbl" 	=> $pie_labels,
    "ctr"	=> $pie_data,
    "colour"=> $pie_colour,
    "sum"	=> (int)array_sum($pie_data),
    // "href" 	     => $pie_href
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

function getHoursOT($con, $idacct,$param,$ids){
    $Qry=new Query();
    $Qry->table="tblpayroll";
    $Qry->selected="SUM(units) AS ctr";
    $Qry->fields="class_id=18 AND (pay_date >= '".$param->dateFrom."' AND pay_date <= '".$param->dateTo."') AND idstatus=1 AND dept_id IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

            return intval($row['ctr']);
        }
    }
    return 0;
}


function getScheWH($con, $idacct,$param,$ids){
    $Qry=new Query();
    $Qry->table="vw_data_timesheet as dt left join vw_dataemployees as de on dt.empID = de.id";
    $Qry->selected="SUM(excess) as ctr";
    $Qry->fields="(dt.work_date >= '".$param->dateFrom."' AND dt.work_date <= '".$param->dateTo."') AND de.idunit IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return intval($row['ctr']);
        }
    }
    return 0;
}




?>