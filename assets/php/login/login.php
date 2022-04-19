<?php
require_once('../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));

if( !empty( $param->uname ) ){
	if( !empty( $param->passw ) ){		
		$Qry = new Query();	
		$Qry->table     = "vw_dataemployees";
		$Qry->selected  = "*";
		$Qry->fields    = "etypeid='1' AND empid='".$param->uname."' AND pword='".md5($param->passw)."' ";
		$rs = $Qry->exe_SELECT($con);
		if(mysqli_num_rows($rs)>= 1){
			if($row=mysqli_fetch_array($rs)){

				$dpt = getDeputy1($con, $row['id']); //Jerald
				$promApp = getPromotionApprover($con, $row['id']); //Dan
				$latTransApp = getLateralTransferApprover($con, $row['id']); //Dan
				$WageIncApp = getWageIncreaseApprover($con, $row['id']); //Dan
				$dptmtrx 	= getDeputy2($con, $row['id']);
				
				$data = array( 
					"id"        	=> $row['id'],
					"empid"			=> $row['empid'],
					"fname"			=> $row['fname'],
					"lname"			=> $row['lname'],
					"mname"			=> $row['mname'],
					"suffix"		=> $row['suffix'],
					"empname"		=> $row['empname'],
					"id_type"		=> $row['idaccttype'],
					"idloc"			=> $row['idloc'],
					"hdate"			=> $row['hdate'],
					"dpt1"			=> $dpt, //Jerald
					"promApp"		=> $promApp,//Dan
					"dptmtrx"		=> $dptmtrx,
					"latTransApp"	=> $latTransApp,//Dan
					"WageIncApp"	=> $WageIncApp,//Dan
					"status"		=> "success"
				);
			}
			$return = json_encode($data);
		}else{
			$return = json_encode(array("status"=>"notfound"));
		}
	}else{
		$return = json_encode(array("status"=>"nopass"));
	}	
}else{
	$return = json_encode(array("status"=>"nouname"));
}


print $return;
mysqli_close($con);

?>