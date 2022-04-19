<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php');

    $param = json_decode(file_get_contents('php://input'));

    $Qryb 			= new Query();	
    $Qryb->table 	= "tblbunits";
    $Qryb->selected = "scheduler='".$param->scheduler."'";
    $Qryb->fields 	= "name='".$param->businessunit."'";
    $checkentryb 	= $Qryb->exe_UPDATE($con);
    if($checkentryb){
        $return = json_encode(array('savestatus'=>'success'));
    }else{
        $return = json_encode(array('savestatus'=>'oops'));
    }
    
print $return;
mysqli_close($con);


?>