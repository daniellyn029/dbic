<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$data  = array();
$year = date("Y");
$date  = SysDateDan();
$time  = SysTime();

$search ='';

//Search Department
if( !empty( $param->department ) ){
    $arr_id = array();
    $arr 	= getHierarchy($con,$param->department);
    array_push( $arr_id, $param->department );
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



$Qry2 = new Query();	
$Qry2->table     = "vw_databusinessunits";
$Qry2->selected  = "*";
$Qry2->fields    = "stype = 'department'".$search;
$rs2 = $Qry2->exe_SELECT($con);
if(mysqli_num_rows($rs2)>= 1){
    while($row2=mysqli_fetch_array($rs2)){

        $dept = $row2['id'];
        
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


         $data[] = array( 
            "name"     => $row2['name'],
            "dept"      => $dept,
            "ids"       => $ids,
            "jan"       => $jann,
            "feb"       => $febb,
            "mar"       => $marr,
            "apr"       => $aprr,
            "may"       => $mayy,
            "jun"       => $junn,
            "jul"       => $jull,
            "aug"       => $augg,
            "sep"       => $sepp,
            "oct"       => $octt,
            "nov"       => $novv,
            "dec"       => $decc,
            "total_ot"  => $total_ott,
            "date"      => $date,
            "time"      => date ("H:i:s A",strtotime($time)),
            
        );


    } $return = json_encode($data);
}else {

    $return = json_encode(array());
}


print $return;
mysqli_close($con);

function getTimesheet($con, $ids, $dfrom, $dto){
    $Qry=new Query();
    $Qry->table     = "vw_dataemployees AS de LEFT JOIN vw_data_timesheet AS dt ON de.id=dt.empID";
    $Qry->selected  = "IFNULL(SUM(dt.reg_ot_rate),0) as sum_ot_rate";
    $Qry->fields    = "de.idunit IN (".$ids.") AND ( dt.work_date >= '".$dfrom."' AND dt.work_date < '".$dto."' )";
    $rs=$Qry->exe_SELECT($con);
    if( mysqli_num_rows($rs) >= 1 ){
		if($row=mysqli_fetch_array($rs)){
			return $row['sum_ot_rate'];
		}
	}
    return  0;
}


?>