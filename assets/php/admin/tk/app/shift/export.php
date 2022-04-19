<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_GET;
$return = null;	
$pay_period = getPayPeriod($con);
$date=SysDate();

$search='';

if( !empty( $param['acct'] ) ){ $search=$search." AND idacct 	= '".$param['acct']."' "; }
if( !empty($param['dfrom']) && empty($param['dto'])){
    $search=$search." AND date BETWEEN DATE('".$param['dfrom']."') AND DATE('".$param['dfrom']."') ";
}
if( !empty($param['dfrom']) && !empty($param['dto']) ){
    $search=$search." AND date BETWEEN DATE('".$param['dfrom']."') AND DATE('".$param['dto']."') ";   
}


$Qry = new Query();	
$Qry->table     = "vw_shift_application";
$Qry->selected  = "*";
$Qry->fields    = "date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."'".$search;
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){

	$count=1;

    while($row=mysqli_fetch_array($rs)){		
		$name23[] = array(
						$count,
                        utf8_decode($row['empname']),
                        $row['business_unit'],
						date('Y-m-d', strtotime($row['date'])),
                        $row['oldshift'],
                        $row['newshift'],
						$row['remarks'],
                        $row['shift_status']
		);
	$count++;
    }
}

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=ChangeShift_'.$date.'.csv');
$output = fopen('php://output', 'w');
fputcsv($output, array($param['company']));
fputcsv($output, array("Change Shift"));
fputcsv($output, array("Export Generated on " . SysDatePadLeft() .' '.SysTime() ));
fputcsv($output, array('#',
						'Employee Name',
                        'Department',
						'Date',
						'Current Shift',
						'Change Shift',
						'Reason',
						'Status')); 
 
if (count($name23) > 0) {
	foreach ($name23 as $row23) {
		fputcsv($output, $row23);
	}
}

?>