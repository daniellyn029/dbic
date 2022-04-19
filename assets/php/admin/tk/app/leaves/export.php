<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_GET;
$return = null;	
$date=SysDate();
$pay_period = getPayPeriod($con);

$search='';

if( !empty( $param['search_acct'] ) ){ $search=$search." AND idacct 	= '".$param['search_acct']."' "; }
if( !empty($param['_from']) && empty($param['_to'])){
    $search=$search." AND date BETWEEN DATE('".$param['_from']."') AND DATE('".$param['_from']."') ";
}
if( !empty($param['_from']) && !empty($param['_to']) ){
    $search=$search." AND date BETWEEN DATE('".$param['_from']."') AND DATE('".$param['_to']."') ";   
}


$Qry = new Query();	
$Qry->table     = "vw_leave_application";
$Qry->selected  = "*";
$Qry->fields    = "date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."'".$search;
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){

	$count=1;

    while($row=mysqli_fetch_array($rs)){	
		$units = sprintf('%0.2f',($row['hrs'] / 8));
		//mga column sa database
		$name23[] = array(
						$count,
						utf8_decode($row['empname']),
						$row['business_unit'],
						$row['date'],
						$row['leave_name'],
						$units,
                        $row['remarks'],
						$row['leave_status'],


		);
		$count++;
    }
}
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=LeaveApplication_'.$date.'.csv');
$output = fopen('php://output', 'w');
fputcsv($output, array($param['company']));
fputcsv($output, array("Leave Applications"));
fputcsv($output, array("Export Generated on " . SysDatePadLeft() .' '.SysTime() ));
fputcsv($output, array(	'#',
						'Employee Name',
						'Department/Section',
						'Date',
						'Leave Type',
						'Units',
                        'Reason',
                        'Status')); 
 
if (count($name23) > 0) {
	foreach ($name23 as $row23) {
		fputcsv($output, $row23);
	}
}

?>