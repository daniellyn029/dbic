<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$data = array();
$Qry = new Query();	
$Qry->table     = "tblforms01";
$Qry->selected  = "empid, empname, empactiontaken";
$Qry->fields    = "idstatus = 3";

$rs = $Qry->exe_SELECT($con);

while($row=mysqli_fetch_array($rs)){
    $data[] = array( 
        "id" 			    => $row['empid'],
        "name" 			    => $row['empname'],
        "empactiontaken" 	=> 'Pending ' . $row['empactiontaken'], 
    );
}

$Qry1 = new Query();	
$Qry1->table     = "tblforms02";
$Qry1->selected  = "empid, empname, empactiontaken";
$Qry1->fields    = "idstatus = 3";

$rs1 = $Qry1->exe_SELECT($con);

while($row=mysqli_fetch_array($rs1)){
    $data[] = array( 
        "id" 			    => $row['empid'],
        "name" 			    => $row['empname'],
        "empactiontaken" 	=> 'Pending ' . $row['empactiontaken'],
    );
}

$Qry2 = new Query();	
$Qry2->table     = "tblforms03";
$Qry2->selected  = "empid, empname, empactiontaken";
$Qry2->fields    = "idstatus = 3";

$rs2 = $Qry2->exe_SELECT($con);

while($row=mysqli_fetch_array($rs2)){
    $data[] = array( 
        "id" 			    => $row['empid'],
        "name" 			    => $row['empname'],
        "empactiontaken" 	=> 'Pending ' . $row['empactiontaken'],
    );
}


$Qry7 = new Query();	
$Qry7->table     = "vw_dataemployees vd LEFT JOIN vw_data_timesheet vt ON vt.idacct = vd.id";
$Qry7->selected  = "vd.empname,vd.empid,vt.temp";
$Qry7->fields    = "vt.work_date = CURDATE() ";
$rs7 = $Qry7->exe_SELECT($con);

while($row=mysqli_fetch_array($rs7)){
    if($row['temp'] > 37.9){
        $data[] = array( 
            "id" 			    => $row['empid'],
            "name" 			    => $row['empname'],
            "empactiontaken" 	=> '<p style="color : red">High Temperature : ' . $row['temp'] .  ' &#8451;</p>',
        );
    }
}


$return = json_encode($data);



print $return;
mysqli_close($con);
?>