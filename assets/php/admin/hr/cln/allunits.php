<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));

$Qry = new Query();	
$Qry->table     = "tblbunits";
$Qry->selected  = "id";
$Qry->fields    = "name = '" . $param->department . "'";


$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){
        $id = getdepartmentchilds($con, $row['id']);
        array_push($id,$row['id']);
    }

    $id = implode(",", $id); 

    $Qry1 = new Query();	
    $Qry1->table     = "vw_clnbunits";
    $Qry1->selected  = "*";
    $Qry1->fields    = "depid IN (".$id.")";

    $rs1 = $Qry1->exe_SELECT($con);
    if(mysqli_num_rows($rs1)>= 1){
        while($row1=mysqli_fetch_array($rs1)){
            $data[] = array('id'              => $row1['id'],
                            'fname'           => $row1['fname'],
                            'mname'           => $row1['mname'],
                            'lname'           => $row1['lname'],
                            'middleinitial'   => $row1['middleinitial'],
                            'suffix'          => $row1['suffix'],
                            'company'         => $row1['company'],
                            'SheorHe'         => $row1['HeorShe'],
                            "department"	  => $row1['depid'],
                            "position"	      => $row1['jobposition'],
                            "hireddate"	      => $row1['hireddate'],
                            "annualpay"	      => $row1['annualpay'],);
        }
    }else{
        $return = json_encode(array('w'=>$Qry->fields));
    
    }

	$return = json_encode($data);
}else{
	$return = json_encode(array('w'=>$Qry->fields));
	
}


function getdepartmentchilds( $con, $idunit){
    $id			    = array();
    $Qry 			= new Query();	
    $Qry->table     = "tblbunits";
    $Qry->selected  = "*";
    $Qry->fields    = "idunder = '".$idunit."'";
    $rs2 			= $Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs2)>= 1){
        while($row2=mysqli_fetch_array($rs2)){
            $childids = getdepartmentchilds($con, $row2['id']);
            if (!empty($childids)) {
                $childids = implode(",", $childids); 
                array_push($id,$childids); 
           }
        
            array_push($id,$row2['id']); 
        }
    }
    return $id;
}

print $return;
mysqli_close($con);
?>