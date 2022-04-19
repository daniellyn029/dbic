<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$year = date("Y");
$month = 1;
$months = array(
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July ',
	'August',
	'September',
	'October',
	'November',
	'December',
);

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


$Qry = new Query();	
$Qry->table     = "tblpayroll";
$Qry->selected  = "SUM(units) AS tot_units, YEAR(pay_date) AS yr,id_acct";
$Qry->fields    = "YEAR(pay_date)='".$year."' AND class_id=18 AND dept_id IN (".$ids.")";
$rs = $Qry->exe_SELECT($con);

while($row=mysqli_fetch_array($rs)){

    $data[] = array( 
        "tot_units"         => $row['tot_units'],
        "yr"                => $row['yr'],
        "getTotAmt"        => getTotAmt($con, $row['id_acct'], $ids)

    );
}



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


function getTotAmt($con, $idacct,$ids){
    $data=array();
    $year = date("Y");
    $Qry=new Query();
    $Qry->table="tblpayrolltotal";
    $Qry->selected="IFNULL(SUM(ytd),0) as ytd";
    $Qry->fields="ytd IS NOT NULL AND pay_yr ='".$year."'AND id_class=18 AND dept_id IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if( mysqli_num_rows($rs) >= 1 ){
        while($row=mysqli_fetch_array($rs)){
            
            $data[] =array(
                "amount"    => $row['ytd'],
            );
        }
    }
    return  $data;
}

?>