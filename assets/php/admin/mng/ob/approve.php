<?php
require_once('../../../activation.php');
$conn = new connector();
$con  = $conn->connect();
require_once('../../../classPhp.php');

$param       = json_decode(file_get_contents('php://input'));
$date_action = date("Y-m-d", strtotime(SysDate()));

foreach ($param->info as $key => $value) {
    $obid   = $value->obid;
    $apprseq   = $value->approversequence;
    $apprcount = $value->approvercount;

    if ($apprcount == $apprseq) {
        $Qry        = new Query();
        $Qry->table = "tbltimeobtrip";
        $Qry->selected = "stat = '1',
                            date_approve ='" . SysDate() . "',
                            approver2_stat='1',
                            approver2_date='" . SysDate() . "',
                            approver2_time='" . SysTime() . "'";   
        $date_approve = SysTime();

        $Qry->fields = "id='" . $obid . "'";
        $Qry->exe_UPDATE($con);
    }else{
        $Qry        = new Query();
        $Qry->table = "tbltimeobtrip";
        $Qry->selected = "approver1_stat='1',
                        approver1_date='" . SysDate() . "',
                        approver1_time='" . SysTime() . "'";
        $Qry->fields = "id='" . $obid . "'";
        $Qry->exe_UPDATE($con);
    }

   
}


$return = json_encode(array(
    "status" => "success"
));

print $return;
mysqli_close($con);


?>