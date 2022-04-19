<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_GET;
$data  = array();
$date=SysDate();
$year = date("Y");

$search ='';

//Search Department
if( !empty( $param['department'] ) ){
    $arr_id = array();
    $arr 	= getHierarchy($con,$param['department']);
    array_push( $arr_id, $param['department'] );
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
    $search.=" AND id in (".$ids.") "; 
}


$Qry = new Query();	
$Qry->table     = "vw_databusinessunits";
$Qry->selected  = "*";
$Qry->fields    = "stype = 'department'".$search;
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){

        $dept = $row['id'];
        
        //Get 
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

         //OT
         $jann = getTimesheet($con, $ids, $year."-".str_pad(1,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(2,2,"0",STR_PAD_LEFT)."-01");
         $febb = getTimesheet($con, $ids, $year."-".str_pad(2,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(3,2,"0",STR_PAD_LEFT)."-01");
         $marr = getTimesheet($con, $ids, $year."-".str_pad(3,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(4,2,"0",STR_PAD_LEFT)."-01");
         $aprr = getTimesheet($con, $ids, $year."-".str_pad(4,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(5,2,"0",STR_PAD_LEFT)."-01");
         $mayy = getTimesheet($con, $ids, $year."-".str_pad(5,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(6,2,"0",STR_PAD_LEFT)."-01");
         $junn = getTimesheet($con, $ids, $year."-".str_pad(6,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(7,2,"0",STR_PAD_LEFT)."-01");
         $jull = getTimesheet($con, $ids, $year."-".str_pad(7,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(8,2,"0",STR_PAD_LEFT)."-01");
         $augg = getTimesheet($con, $ids, $year."-".str_pad(8,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(9,2,"0",STR_PAD_LEFT)."-01");
         $sepp = getTimesheet($con, $ids, $year."-".str_pad(9,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(10,2,"0",STR_PAD_LEFT)."-01");
         $octt = getTimesheet($con, $ids, $year."-".str_pad(10,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(11,2,"0",STR_PAD_LEFT)."-01");
         $novv = getTimesheet($con, $ids, $year."-".str_pad(11,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(12,2,"0",STR_PAD_LEFT)."-01");
         $decc = getTimesheet($con, $ids, $year."-12-01",((int)$year+1)."-01-01");
         $total_ott = $jann + $febb + $marr + $aprr + $mayy + $junn + $jull + $augg + $sepp + $octt + $novv + $decc;

		$name23[] = array(
						utf8_decode($row['name']),
                        $jann,
                        $febb,
                        $marr,
                        $aprr,
                        $mayy,
                        $junn,
                        $jull,
                        $augg,
                        $sepp,
                        $octt,
                        $novv,
                        $decc,
                        $total_ott,
            
		);
	
    }
}

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=Overtimehours_'.$date.'.csv');
$output = fopen('php://output', 'w');
fputcsv($output, array($param['company']));
fputcsv($output, array("Overtime Hours Report"));
fputcsv($output, array("Export Generated on " . SysDatePadLeft() .' '.SysTime() ));
fputcsv($output, array('Department',
						'January',
						'February',
						'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'Grand Total')); 
 
if (count($name23) > 0) {
	foreach ($name23 as $row23) {
		fputcsv($output, $row23);
	}
}


function getTimesheet($con, $ids, $dfrom, $dto){
    $Qry=new Query();
    $Qry->table     = "vw_dataemployees AS de LEFT JOIN vw_data_timesheet AS dt ON de.id=dt.empID";
    $Qry->selected  = "IFNULL(SUM(dt.ot),0) as sumot";
    $Qry->fields    = "de.idunit IN (".$ids.") AND ( dt.work_date >= '".$dfrom."' AND dt.work_date < '".$dto."' )";
    $rs=$Qry->exe_SELECT($con);
    if( mysqli_num_rows($rs) >= 1 ){
		if($row=mysqli_fetch_array($rs)){
			return $row['sumot'];
		}
	}
    return  0;
}




?>