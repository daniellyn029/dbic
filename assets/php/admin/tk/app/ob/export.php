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

if( !empty( $param['search_acct'] ) ){ $search=$search." AND idacct 	= '".$param['search_acct']."' "; }
if( !empty($param['dfrom']) && empty($param['dto'])){
    $search=$search." AND date BETWEEN DATE('".$param['dfrom']."') AND DATE('".$param['dfrom']."') ";
}
if( !empty($param['dfrom']) && !empty($param['dto']) ){
    $search=$search." AND date BETWEEN DATE('".$param['dfrom']."') AND DATE('".$param['dto']."') ";   
}


$Qry = new Query();	
$Qry->table     = "vw_ob_application";
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
						$row['location'],
						$row['remarks'],
                        $row['ob_status']
		);
	$count++;
    }
}

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=OB_'.$date.'.csv');
$output = fopen('php://output', 'w');
fputcsv($output, array($param['company']));
fputcsv($output, array("Official Business Trip"));
fputcsv($output, array("Export Generated on " . SysDatePadLeft() .' '.SysTime() ));
fputcsv($output, array('Employee Name',
                        'Department',
						'Date',
						'Location',
						'Reason',
						'Status')); 
 
if (count($name23) > 0) {
	foreach ($name23 as $row23) {
		fputcsv($output, $row23);
	}
}

?>