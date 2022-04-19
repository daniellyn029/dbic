<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_GET;
$data  = array();
$date = SysDatePadLeft();
$pay_period = getPayPeriod($con);


$search ='';

if( !empty( $param['search_acct'] ) ){ $search=$search." AND idacct 	= '".$param['search_acct']."' "; }

if( !empty($param['_from']) && empty($param['_to'])){
    $search=$search." AND work_date BETWEEN DATE('".$param['_from']."') AND DATE('".$param['_from']."') ";
}

if( !empty($param['_from']) && !empty($param['_to']) ){
    $search=$search." AND work_date BETWEEN DATE('".$param['_from']."') AND DATE('".$param['_to']."') ";
    
}


$dept = getIdUnit($con,$param['idsuperior']);


//Get Managers Under person
$ids=0;if( !empty( $dept ) ){
    $arr_id = array();
    $arr 	= getHierarchy($con,$dept);
    array_push( $arr_id, $dept );
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
$Qry->table     = "vw_dataemployees AS de LEFT JOIN vw_data_timesheet AS dt ON de.id = dt.empID";
$Qry->selected  = "de.id, de.empname, dt.work_date , dt.shiftin , dt.in,de.idunit,dt.late";
$Qry->fields    = "idunit IN (".$ids.") AND (dt.work_date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."') AND (dt.in > shiftin)".$search;
$rs 			= $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){
        
            $name23[] = array(
                            utf8_decode($row['empname']),
                            $row['work_date'],
                            $row['shiftin'],
                            $row['in'],
                            $row['late'],
                          
                            
            );
 
    }
}


// print_r($name23);
// return;


header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=TardinessReport'.$date.'.csv');
$output = fopen('php://output', 'w');
fputcsv($output, array($param['company']));
fputcsv($output, array("Attendance Today"));
fputcsv($output, array("Export Generated on " . SysDatePadLeft() .' '.SysTime() ));
fputcsv($output, array('Employee Name',
                        'Date',
                        'Shiftin',
                        'In',
                        'Late')); 
 
if (count($name23) > 0) {
	foreach ($name23 as $row23) {
		fputcsv($output, $row23);
	}
}

function getIdUnit($con, $idsuperior){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="idunit";
    $Qry->fields="id='".$idsuperior."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['idunit'];
        }
    }
    return null;
}

function getTimeshet($con,$pay_period,$idacct){
    $data = array();
    $Qry 			= new Query();	
    $Qry->table     = "vw_dataemployees AS de LEFT JOIN vw_data_timesheet AS dt ON de.id = dt.empID";
    $Qry->selected  = "de.empname, dt.work_date , dt.shiftin , dt.in,de.idunit,dt.late,de.id";
    $Qry->fields    = "de.id='".$idacct."' AND (dt.work_date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."') AND (dt.in > shiftin)";
    $rs 			= $Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>= 1){
        while($row=mysqli_fetch_array($rs)){

                //Count all row 
                $countin = mysqli_num_rows($rs); 

              

                $data[] = array( 
                    "work_date"     => $row['work_date'],
                    "shiftin"       => $row['shiftin'],
                    "in"            => $row['in'],
                    "count_in"      => $countin,
                    "late"          => $row['late'],
                    "idacct"        => $row['id'],
                );

        }
    }
    return $data;
}



function getTotalTardy($con,$pay_period,$idacct){
    $data= array();
    $Qry=new Query();
    $Qry->table="vw_dataemployees AS de LEFT JOIN vw_data_timesheet AS dt ON de.id = dt.empID";
    $Qry->selected="de.empname, dt.work_date , dt.shiftin , dt.in,de.idunit,SUM(dt.late) as total_tardy";
    $Qry->fields="de.id='".$idacct."' AND (dt.work_date BETWEEN '".$pay_period['pay_start']."' AND '".$pay_period['pay_end']."') AND (dt.in > shiftin)";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){


            $data[] = array(

                "total_tardy" => $row['total_tardy']

            );
        }
    }
    return $data;
}


?>