<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php');  

$param = json_decode(file_get_contents('php://input'));
$SysDate = SysDate();
$time  = SysTime();

    $Qry=new Query();
    $Qry->table="tblaccount";
    $Qry->selected="id";
    $Qry->fields="id='".$param->id."' AND password='".md5($param->compben_pass)."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

            $data = array(
                'status'=>'success'
            );
        }
        $return = json_encode($data);
    }else{
        $return = json_encode(array('status'=>'wrongpass'));
    }
    
print $return;
mysqli_close($con);
?>

