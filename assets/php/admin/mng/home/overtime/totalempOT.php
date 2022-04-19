<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));

$search ='';

if( !empty( $param->deppt ) ){ $search=$search." AND idunit = '".$param->deppt."' "; }
if( !empty( $param->costcenter ) ){ $search=$search." AND costcenter = '".$param->costcenter."' "; }
if( !empty( $param->jobloc ) ){ $search=$search." AND idloc = '".$param->jobloc."' "; }


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
$Qry->table     = "vw_dataemployees";
$Qry->selected  = "*";
$Qry->fields    = "idunit IN (".$ids.")".$search;
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){
        
            $tot_jan_nov =getTotOTHrs($con, $row['id'], $ids, $year."-".str_pad(1,2,"0",STR_PAD_LEFT)."-01",$year."-".str_pad(12,2,"0",STR_PAD_LEFT)."-01");
            $tot_dec  = getTotOTHrs($con, $row['id'], $ids, $year."-12-01",((int)$year+1)."-01-01");
            $total_units = $tot_jan_nov + $tot_dec;

            $total_amounts =  getTotAmt($con,$row['id'], $ids);

        $data[] = array( 
            "idacct"                => $row['id'],
            "idunit"                => $row['idunit'],
            "empname"               => $row['empname'],
            "total_amount"          => $total_amounts,
            "total_OTHrs"           => $total_units,
            "getEmpCostcnter"       => getEmpCostcnter($con, $ids),
            "getEmpjobLoc"          => getEmpjobLoc($con, $ids)
            
            

        );
    }
    $return = json_encode($data);
}else{
    $return = json_encode(array('q'=>$Qry->fields));
}
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

function getTotAmt($con,$idacct,$ids){
    $year = date("Y");
    $data=array();
    $Qry=new Query();
    $Qry->table="tblpayrolltotal";
    $Qry->selected="*";
    $Qry->fields="id_acct = '".$idacct."' AND dept_id IN (".$ids.") AND ytd IS NOT NULL AND ytd <> ' ' AND pay_yr ='".$year."' AND id_class=18";
    $rs=$Qry->exe_SELECT($con);
    if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){
            
            $data[]=array(
                "amount"    => $row['ytd'],
            );
		}
	}
    return  $data;
}


function getTotOTHrs($con,$idacct, $ids, $dfrom, $dto){
    $Qry=new Query();
    $Qry->table="tblpayroll";
    $Qry->selected="SUM(units) AS ctr";
    $Qry->fields="id_acct = '".$idacct."' AND dept_id IN (".$ids.") AND units IS NOT NULL AND units <> ' ' AND ( pay_date >= '".$dfrom."' AND pay_date < '".$dto."' ) AND class_id=18";
    $rs=$Qry->exe_SELECT($con);
    if( mysqli_num_rows($rs) >= 1 ){
		while($row=mysqli_fetch_array($rs)){
			return $row['ctr'];
		}
	}
    return  0;
}

function getEmpCostcnter($con, $ids){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="DISTINCT(costcenter)";
    $Qry->fields="idunit IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
			
			$data[] = array(
				"costcenter" => $row['costcenter'],

			);

        }
    }
    return $data;
}

function getEmpjobLoc($con, $ids){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="DISTINCT(job_loc)";
    $Qry->fields="idunit IN (".$ids.")";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
			
			$data[] = array(
				"job_loc" => $row['job_loc'],

			);

        }
    }
    return $data;
}


?>