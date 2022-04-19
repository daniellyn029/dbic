<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));


// $Qry = new Query();	
// $Qry->table     = "vw_databusinessunits";
// $Qry->selected  = "*";
// $Qry->fields    = "unittype = '3'";
// $rs = $Qry->exe_SELECT($con);

// $arr_ids 	= array();
// $array_lbl 	= array();
// $arr_data 	= array();
// $pie_colour = array();
// if(mysqli_num_rows($rs)>= 1){  
//     while($row=mysqli_fetch_array($rs)){
		
//         array_push($array_lbl,$row['name']);
        
// 		$dept = $row['id'];
//         $ids=0;
        
// 		if (!empty($dept)) {
// 			$arr_id = array();
// 			$arr    = getHierarchy($con, $dept);
// 			array_push($arr_id, $dept);
// 			if (!empty($arr["nodechild"])) {
// 				$a = getChildNode($arr_id, $arr["nodechild"]);
// 				if (!empty($a)) {
// 					foreach ($a as $v) {
// 						array_push($arr_id, $v);
// 					}
// 				}
// 			}
// 			if (count($arr_id) == 1) {
// 				$ids = $arr_id[0];
// 			} else {
// 				$ids = implode(",", $arr_id);
// 			}
//         }
        
// 		array_push($arr_ids,$ids);
//         array_push($arr_data,getDept($con,$ids));
//     }
// }

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

$pie_data	= getLates($con,$ids);
$pie_colour = array('#b0beec');
$pie_labels	= getEmp($con, $ids);



$data = array(

    "lbl" 	=> $pie_labels,
    "ctr" 	=> $pie_data,
    "colour"=> $pie_colour,



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

function getEmp($con, $ids){
	$data=array();
	$Qry 			= new Query();	
	$Qry->table     = "vw_dataemployees";
	$Qry->selected  = "*";
	$Qry->fields    = "idunit IN (".$ids.")";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

			array_push($data,$row['empname']);
			
		}
	}
	return $data;
}

function getLates($con, $ids){
	$data=array();
	$Qry 			= new Query();	
	$Qry->table     = "vw_dataemployees";
	$Qry->selected  = "*";
	$Qry->fields    = "idunit IN (".$ids.")";
	$rs 			= $Qry->exe_SELECT($con);
	if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){

            $Qry2 			= new Query();	
            $Qry2->table     = "vw_data_timesheet AS dt LEFT JOIN vw_dataemployees AS de ON dt.empID = de.id";
            $Qry2->selected  = "COUNT(dt.late) AS ctr";
            $Qry2->fields    = "dt.empID =  '".$row['id']."' AND MONTH(dt.work_date) = MONTH(CURRENT_DATE()) AND YEAR(dt.work_date) = YEAR(CURRENT_DATE()) AND dt.late IS NOT NULL AND dt.late <> ' ' AND dt.late > 0";
            $rs2 			= $Qry2->exe_SELECT($con);
            if( mysqli_num_rows($rs2) >= 1 ){
                while($row2=mysqli_fetch_array($rs2)){
                    
                    array_push($data,$row2['ctr']);
                }
            }
			
		}
	}
	return $data;
}


?>