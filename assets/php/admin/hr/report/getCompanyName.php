<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

    $param = json_decode(file_get_contents('php://input'));

    $Qry=new Query();
    $Qry->table="tblcompany LEFT JOIN vw_dataemployees ON tblcompany.id = vw_dataemployees.idcompany";
    $Qry->selected="tblcompany.name as compname";
    $Qry->fields="vw_dataemployees.id = '".$param->accountid."' ";
    $rs=$Qry->exe_SELECT($con);
    //echo $Qry->fields;
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
      
            $data = array(
                'company_name'   =>$row['compname']
            );
        }
        $return = json_encode($data);
    }else{
        $return = json_encode(array('status'=>'empty'));
    }
    
print $return;
mysqli_close($con);
?>