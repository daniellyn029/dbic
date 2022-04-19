<?php
include "../../assets/php/SimpleXLSX.php";
require_once('../../assets/php/activation.php');
$conn = new connector();
$con = $conn->connect();
require_once('../../assets/php/classPhp.php'); 
	
	$param = $_POST;
	$SysDate = SysDate();
	$SysTime = SysTime();
	if( array_key_exists('file',$_FILES) ){
		//upload file to path
		$folder_path 	= $param['targetPath'];
		$name 			= $_FILES['file']['name'];
		$t				= strtotime($SysDate).time();	
		$extMove 		= pathinfo($name, PATHINFO_EXTENSION);
		$save_name		= $param['info']['file_name'];
		move_uploaded_file($_FILES["file"]["tmp_name"], $folder_path.$save_name);
		
		$filepath = "C:/wamp64/www/dbic/batch/position/Position.xlsx";
		//$filepath = "C:/SAP FILES/ordersystem/OrderEntriesDOSC.csv";
		$data_ctr = 500; // Important, counts of total row in excel
		$val = array();
		$return = NULL;
		if ( $xlsx = SimpleXLSX::parse($filepath) ) {
			$array_err 		= array();
			$array_insert	= array();
			
			foreach ($xlsx->rows() as $kk=>$elt) {
				if( $kk < $data_ctr ){
					if( $kk > 0 ){
						$val = array(
							"idunit"	=> getClassificationID($con,$elt[0]),
							"name"		=> substr(str_replace("'","",$elt[1]),0,200),
							"alias"		=> substr(str_replace("'","",$elt[2]),0,200),
							"isactive"	=> '1'
						);
						if(!empty($val['alias'])){
							if(!empty($val['name'])){
								if(!empty($val['idunit'])){
									$val['alias']     = (strtolower(str_replace("'","",$val['alias']))); 
									$val['name']      = ((str_replace("'","",$val['name']))); 
									if( !checkUnitName($con, $val['name'], '', 'tblposition') ){ 	
										if( !checkAlias($con, $val['alias'], '', 'tblposition') ){    
											/*$Qry3           = new Query();
											$Qry3->table    = "tblposition";
											$Qry3->selected = "name,alias,isactive,idunit";
											$Qry3->fields   = "'".$val['name']."',
																'".$val['alias']."',
																'".$val['isactive']."',
																'".$val['idunit']."'";                    
											$checke = $Qry3->exe_INSERT($con);
											if($checke){
												$return = json_encode(array("status"=>"success","errs"=>array()));
											}else{
												$array_err[] = array(
													"row" => ($kk+1),
													"err" => "Error on Insert"
												);
											}*/
											$array_insert[]	= array(
												$elt[0],
												substr(str_replace("'","",$elt[1]),0,200),
												substr(str_replace("'","",$elt[2]),0,200),
											);
										}else{
											$array_err[] = array(
												"row" => ($kk+1),
												"err" => "Duplicate Alias"
											);
										}
									}else{
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Duplicate Name"
										);
									} 
								}else{
									$array_err[] = array(
										"row" => ($kk+1),
										"err" => "Classification not found in database"
									);
								}
							}else{
								$array_err[] = array(
									"row" => ($kk+1),
									"err" => "No Name"
								);
							}
						}else{
							$array_err[] = array(
								"row" => ($kk+1),
								"err" => "No Alias"
							);
						}
					}else{
						$pword = strtolower($elt[3]);
						if( $pword != "position" ){
							$array_err[] = array(
								"row" => "0",
								"err" => "Invalid File Uploaded"
							);
							$return = json_encode(array("status"=>"error","errs"=>$array_err,"ins"=>$array_insert));
							mysqli_close($con);		
							print $return;
							return;
						}
					}
				}else{
					break;
				}
			}
			$return = json_encode(array("status"=>"success","errs"=>$array_err,"ins"=>$array_insert));
			mysqli_close($con);		
			print $return;
		}
		
	}else{
		$array_err[] = array(
			"row" => "0",
			"err" => "No File Uploaded"
		);
		$return = json_encode(array("status"=>"error","errs"=>$array_err));
		mysqli_close($con);		
		print $return;
		return;
	}
	
function getClassificationID( $con, $str ){
	$Qry 			= new Query();	
	$Qry->table     = "tblbunits as a";
	$Qry->selected  = "id";
	$Qry->fields    = "a.name = '".$str."' ";
	$rs 			= $Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>= 1){
		while($row=mysqli_fetch_array($rs)){
			return $row['id'];
		}
	}
	return '';
}

?>