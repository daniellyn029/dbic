<?php
require_once('../../../activation.php');
$param = $_POST;
$conn = new connector();	
if( (int)$param['conn'] == 1 ){	
	$con = $conn->connect();
}else{
	$varcon = "connect".(int)$param['conn'];
	$con = $conn->$varcon();
	$concorp = $conn->connect();
}
require_once('../../../classPhp.php'); 


$date=SysDate();
$time=SysTime();

if(!empty($param['accountid'])){
	
	if( array_key_exists('file',$_FILES) ){
		$valid_formats = array("pdf");	
		if ($_FILES['file']['error'] == 4) {
			$return = json_encode(array('status'=>'error','on'=>'img_check'));
			print $return;	
			mysqli_close($con);
			return;
		}
		if ($_FILES['file']['error'] == 0) {
			if(!in_array(pathinfo(strtolower($_FILES['file']['name']), PATHINFO_EXTENSION), $valid_formats) ){
				$return = json_encode(array('status'=>'error-upload-type'));
				print $return;	
				mysqli_close($con);
				return;
			}
		}
	}
	
	$param['event']['event_title'] 	= ((str_replace("'","",$param['event']['event_title'])));
	$param['event']['desc'] 		= str_replace("'","",$param['event']['desc']);	
	
	$Qry3           = new Query();
	$Qry3->table    = "tblcompanyact";
	$Qry3->selected = "isall,date_create,idcomp, event_title, efrom, eto, idcreator, event_desc";
	$Qry3->fields   = "'".$param['event']['isall']."','".$date."','1', '".$param['event']['event_title']."', '".$param['event']['efrom']."', '".date('Y-m-d', strtotime("+1 day", strtotime( $param['event']['eto'] )))."', '".$param['accountid']."', '".$param['event']['desc']."' ";                        
	$checke 		= $Qry3->exe_INSERT($con);
	if($checke){
		$last_id = $con->insert_id;
		$pix = 0;
		if( array_key_exists('file',$_FILES) ){
			$pix = 1;
			$extMove 		= pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
			$save_name	 	= $last_id.".".$extMove;
			$folder_path 	= $param['targetPath'];
			move_uploaded_file($_FILES["file"]["tmp_name"], $folder_path.$save_name);
			$Qry33           = new Query();
			$Qry33->table    = "tblcompanyact";
			$Qry33->selected = "filename='".$save_name."'";
			$Qry33->fields   = "id='".$last_id."'";                        
			$checke33 		 = $Qry33->exe_UPDATE($con);
		}
		$data = array( 
            "id"        	=> $last_id,
            "title" 		=> $param['event']['event_title'],
            "start" 		=> $param['event']['efrom'],
            "end" 	    	=> date('Y-m-d', strtotime("+1 day", strtotime( $param['event']['eto'] ))),
			"description"	=> strip_tags($param['event']['desc']),
			"isall"			=> $param['event']['isall'],
			"pix"			=> $pix
        );
		$return = json_encode($data);
	}else{
		 $return = json_encode(array('status'=>'error'));
	}
	
}else{
    $return = json_encode(array('status'=>'notloggedin'));
}

print $return;
mysqli_close($con);
?>