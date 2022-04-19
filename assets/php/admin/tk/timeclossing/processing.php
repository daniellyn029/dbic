<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = $_POST;
$date=SysDate();
$time=SysTime();
$return = null;	
$pay_period = getPayPeriod($con);

//Validate parameters
if( empty($param['info']['sdate']) ){
	$return = json_encode(array('status'=>'sdate'));
	print $return;	
	mysqli_close($con);
	return;
}
if( empty($param['info']['fdate']) ){
	$return = json_encode(array('status'=>'fdate'));
	print $return;	
	mysqli_close($con);
	return;
}
if( /*( strtotime( $param['info']['sdate'] ) > strtotime( $param['info']['fdate']  ) ) ||
	( strtotime( $param['info']['sdate'] ) < strtotime( $pay_period['pay_start'] ) ) ||
	( strtotime( $param['info']['fdate'] ) > strtotime( $pay_period['pay_end']   ) ) */
	( strtotime( $param['info']['sdate']) != strtotime( $pay_period['pay_start'] ) ) ||
	( strtotime( $param['info']['fdate']) != strtotime( $pay_period['pay_end'] ) )
){
	$return = json_encode(array('status'=>'invdates'));
	print $return;	
	mysqli_close($con);
	return;
}

if(!empty($param['accountid'])){
	$idpayperiod = getIDPayperiod($con,$param);
	if( $idpayperiod > 0 ){
		$Qry3           = new Query();
		$Qry3->table    = "tblpayperiod";
		$Qry3->selected = "stat='1',dateclosed='".$date.' '.$time."',idby='".$param['accountid']."',headno='".getTSCtr($con,$idpayperiod)."'";
		$Qry3->fields   = "period_start='".$param['info']['sdate']."' AND period_end='".$param['info']['fdate']."'";
		$checke 		= $Qry3->exe_UPDATE($con);	
		if( $checke ){
			$return = json_encode(array('status'=>'success','q'=>$Qry3->fields,'headno'=>getTSCtr($con,$idpayperiod)));
		}else{
			$return = json_encode(array('status'=>'error','q'=>mysqli_error($con),'headno'=>0));
		}
	}else{
		$return = json_encode(array('status'=>'error','q'=>'1','headno'=>0));
	}
}else{
	$return = json_encode(array('status'=>'error','q'=>'','headno'=>0));
}

print $return;
mysqli_close($con);

function getIDPayperiod($con,$param){
	$Qry 			= new Query();	
	$Qry->table     = "vw_payperiod";
	$Qry->selected  = "id";
	$Qry->fields    = "period_start='".$param['info']['sdate']."' AND period_end='".$param['info']['fdate']."' ORDER BY id ASC LIMIT 1";
	$rs				= $Qry->exe_SELECT($con);		
	if(mysqli_num_rows($rs)>=1){
		if($row=mysqli_fetch_array($rs)){
			return (int)$row['id'];
		}
	}
	return 0;
}

function getTSCtr($con, $id_payperiod){
	$Qry 			= new Query();	
	$Qry->table     = "tbltimesheer";
	$Qry->selected  = "count(id) as ctr";
	$Qry->fields    = "id_payperiod='".$id_payperiod."'";
	$rs				= $Qry->exe_SELECT($con);		
	if(mysqli_num_rows($rs)>=1){
		if($row=mysqli_fetch_array($rs)){
			return (int)$row['ctr'];
		}
	}
	return 0;
}

?>