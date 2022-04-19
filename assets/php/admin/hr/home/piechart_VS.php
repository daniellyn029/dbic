<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$pay_period = getPayPeriod($con);

$search='';
if( !empty($param->dateFrom) && !empty($param->dateTo) ){
    $search=$search." AND pay_date BETWEEN DATE('".$param->dateFrom."') AND DATE('".$param->dateTo."') ";
   
}

$pie_data	= array(getHoursOT($con, $param->accountid,$param),getScheWH($con, $param->accountid,$param));
$pie_colour = array('#b0beec','#ebab76');
$pie_labels	= array('Overtime Hours','Scheduled Work Hours');
    


$data = array(
    "lbl" 	=> $pie_labels,
    "ctr"	=> $pie_data,
    "colour"=> $pie_colour,
    "sum"	=> (int)array_sum($pie_data),
    // "pay_start"  => $pay_period['pay_start'],
    // "pay_end"    => $pay_period['pay_end'],
    // "href" 	     => $pie_href
);

$return = json_encode($data);


print $return;
mysqli_close($con);



function getHoursOT($con, $idacct,$param){
    $pay_period = getPayPeriod($con);
    $Qry=new Query();
    $Qry->table="tblpayroll";
    $Qry->selected="SUM(units) AS ctr";
    $Qry->fields="class_id=18 AND (pay_date >= '".$param->dateFrom."' AND pay_date <= '".$param->dateTo."') AND idstatus=1";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

            return intval($row['ctr']);
        }
    }
    return 0;
}


function getScheWH($con, $idacct,$param){
    $pay_period = getPayPeriod($con);
    $Qry=new Query();
    $Qry->table="vw_data_timesheet";
    $Qry->selected="SUM(excess) as ctr";
    $Qry->fields="work_date >= '".$param->dateFrom."' AND work_date <= '".$param->dateTo."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return intval($row['ctr']);
        }
    }
    return 0;
}




?>