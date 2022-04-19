<?php

function _EMAILDIRECT_LATERALTRANSFER($recipients,$subject,$body,$ticketnumber){
	//return json_encode(array('status'=>'success','sendto'=>$recipients)); //To stop sending email (DELETE THIS AFTER TESTING)


	require_once("class.phpmailer.php");	
	require_once('../../../../activation.php'); 
	$conn = new connector();	
	$con = $conn->connect();
	require_once('../../../../classPhp.php');

	$unique_email = array();	
	foreach($recipients as $recipient)
	{
		foreach($recipient as $email => $name)
		{
			if(!in_array(strtolower($email),$unique_email)){				
				array_push($unique_email,strtolower($email));
			}
		}
	}
	//$mail->AddAddress("ryan.cardoza@delsanonline.com", "Ryan");
	$id ='';
	$idstatus='';
	$Qry=new Query();
    $Qry->table="tblforms01";
    $Qry->selected="id,idstatus";
    $Qry->fields="refferenceno='".$ticketnumber."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
          
			 $id = $row['id'];	
			 $idstatus = $row['idstatus'];	

        }
    }

	foreach($unique_email as $key => $email)
	{
		require("emailSetup.php");
		$mail->AddAddress($email,'');
		$mail->Subject = $subject;
		$mail->IsHTML(true);
		$mail->Body = $body;		
		$mail->Body .= "<br />";
		if( !empty($id) && $idstatus==3 ){
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/lateral-transfer---current---?req=".$id."&p=curr'> Click here to Login!</a>";
		}else{
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/login?'> Click here to Login!</a>";
		}
		$mail->Body .= "<br /><br />";
		$mail->Body .="******************************************<br /> ";
		$mail->Body .="<div style='margin-left:50px'>PLEASE DON'T REPLY</div> ";
		$mail->Body .="******************************************<br />";
		$mail->Send();
	
	}


	return json_encode(array('status'=>'success','sendto'=>$recipients, 'refno'=>"$ticketnumber"));
}

function _EMAILDIRECT_WAGEINCREASE($recipients,$subject,$body,$ticketnumber){
	//return json_encode(array('status'=>'success','sendto'=>$recipients)); //To stop sending email (DELETE THIS AFTER TESTING)


	require_once("class.phpmailer.php");	
	require_once('../../../../activation.php'); 
	$conn = new connector();	
	$con = $conn->connect();
	require_once('../../../../classPhp.php');

	$unique_email = array();	
	foreach($recipients as $recipient)
	{
		foreach($recipient as $email => $name)
		{
			if(!in_array(strtolower($email),$unique_email)){				
				array_push($unique_email,strtolower($email));
			}
		}
	}
	//$mail->AddAddress("ryan.cardoza@delsanonline.com", "Ryan");
	$id ='';
	$idstatus='';
	$Qry=new Query();
    $Qry->table="tblforms02";
    $Qry->selected="id,idstatus";
    $Qry->fields="refferenceno='".$ticketnumber."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
          
			 $id = $row['id'];
			 $idstatus = $row['idstatus'];	

        }
    }

	foreach($unique_email as $key => $email)
	{
		require("emailSetup.php");
		$mail->AddAddress($email,'');
		$mail->Subject = $subject;
		$mail->IsHTML(true);
		$mail->Body = $body;		
		$mail->Body .= "<br />";
		if( !empty($id) && $idstatus==3 ){
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/wage-increase---current---?req=".$id."&p=curr'> Click here to Login!</a>";
		}else{
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/login?'> Click here to Login!</a>";
		}
		$mail->Body .= "<br /><br />";
		$mail->Body .="******************************************<br /> ";
		$mail->Body .="<div style='margin-left:50px'>PLEASE DON'T REPLY</div> ";
		$mail->Body .="******************************************<br />";
		$mail->Send();
	
	}


	return json_encode(array('status'=>'success','sendto'=>$recipients, 'refno'=>"$ticketnumber"));
}

function _EMAILDIRECT_PROMOTION($recipients,$subject,$body,$ticketnumber){
	//return json_encode(array('status'=>'success','sendto'=>$recipients)); //To stop sending email (DELETE THIS AFTER TESTING)


	require_once("class.phpmailer.php");	
	require_once('../../../../activation.php'); 
	$conn = new connector();	
	$con = $conn->connect();
	require_once('../../../../classPhp.php');

	$unique_email = array();	
	foreach($recipients as $recipient)
	{
		foreach($recipient as $email => $name)
		{
			if(!in_array(strtolower($email),$unique_email)){				
				array_push($unique_email,strtolower($email));
			}
		}
	}
	//$mail->AddAddress("ryan.cardoza@delsanonline.com", "Ryan");
	$id ='';
	$idstatus='';
	$Qry=new Query();
    $Qry->table="tblforms03";
    $Qry->selected="id,idstatus";
    $Qry->fields="refferenceno='".$ticketnumber."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
          
			 $id = $row['id'];	
			 $idstatus = $row['idstatus'];

        }
    }

	foreach($unique_email as $key => $email)
	{
		require("emailSetup.php");
		$mail->AddAddress($email,'');
		$mail->Subject = $subject;
		$mail->IsHTML(true);
		$mail->Body = $body;		
		$mail->Body .= "<br />";
		if( !empty($id) && $idstatus==3 ){
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/promotion-and-upgradation---current---?req=".$id."&p=curr'> Click here to Login!</a>";
		}else{
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/login?'> Click here to Login!</a>";
		}
		$mail->Body .= "<br /><br />";
		$mail->Body .="******************************************<br /> ";
		$mail->Body .="<div style='margin-left:50px'>PLEASE DON'T REPLY</div> ";
		$mail->Body .="******************************************<br />";
		$mail->Send();
	
	}


	return json_encode(array('status'=>'success','sendto'=>$recipients, 'refno'=>"$ticketnumber"));
}
function _EMAILDIRECT_CASHADVANCE($recipients,$subject,$body,$ticketnumber){
	//return json_encode(array('status'=>'success','sendto'=>$recipients)); //To stop sending email (DELETE THIS AFTER TESTING)


	require_once("class.phpmailer.php");
	require_once('../../../activation.php');
	$conn = new connector();
	$con = $conn->connect();
	require_once('../../../classPhp.php');

	$unique_email = array();
	foreach($recipients as $recipient){
		foreach($recipient as $email => $name){
			if(!in_array(strtolower($email),$unique_email)){
				array_push($unique_email,strtolower($email));
			}
		}
	}
	//$mail->addaddress("ryan.cardoza@delsanonline.com", "Ryan");
	$id ='';
	$idstatus='';
	$Qry=new Query();
	$Qry->table="tblforms04";
	$Qry->selected="id,idstatus";
	$Qry->fields="refferenceno='".$ticketnumber."'";
	$rs=$Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>=1){
		if($row=mysqli_fetch_array($rs)){
			$id = $row['id'];
			$idstatus = $row['idstatus'];
		}
	}

	foreach($unique_email as $key => $email){
		require("emailSetup.php");
		$mail->AddAddress($email,'');
		$mail->Subject = $subject;
		$mail->IsHTML(true);
		$mail->Body = $body;
		$mail->Body .= "<br />";
		if( !empty($id) && $idstatus==3 ){
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/admin/emp/app/cashadvance-current?req=".$id."&p=curr'> Click here to Login!</a>";
		}else{
			$mail->Body .= "<a href='https://sedaeforms.delsansolutions.com/dbic/#/login?'> Click here to Login!</a>";
		}
		$mail->Body .= "<br /><br />";
		$mail->Body .="******************************************<br /> ";
		$mail->Body .="<div style='margin-left:50px'>PLEASE DON'T REPLY</div> ";
		$mail->Body .="******************************************<br />";
		$mail->Send();
	}


	return json_encode(array('status'=>'success','sendto'=>$recipients, 'refno'=>"$ticketnumber"));
}
?>