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
		
		$filepath = "C:/wamp64/www/dbic/batch/company/CompanyInfo.xlsx";
		$counter_i = 0;
		$counter_u = 0;
		$data = array();
		if ( $xlsx = SimpleXLSX::parse($filepath) ) {
			$array_err 		= array();
			$array_insert	= array();
			foreach ($xlsx->rows() as $kk=>$elt) {
				if( $kk == 1 ){
					$data = array(
						"alias"			=> substr(str_replace("'","",$elt[0]),0,4),
						"name"			=> str_replace("'","",$elt[1]),
						"profile"		=> str_replace("'","",$elt[2]),
						"cnumber"		=> substr(str_replace("'","",$elt[3]),0,20),
						"fnumber"		=> substr(str_replace("'","",$elt[4]),0,20),
						"email"			=> substr(str_replace("'","",$elt[5]),0,150),
						"idtype"		=> getCompanyInfoIDType($con,$elt[6]),
						"idind"			=> getCompanyInfoIDInd($con,$elt[7]),
						"idsize"		=> getCompanyInfoIDSize($con,$elt[8]),
						"website"		=> substr(str_replace("'","",$elt[9]),0,200),
						"idbir"			=> substr(str_replace("'","",$elt[10]),0,25),
						"idsss"			=> substr(str_replace("'","",$elt[11]),0,25),
						"idibig"		=> substr(str_replace("'","",$elt[12]),0,25),
						"idhealth"		=> substr(str_replace("'","",$elt[13]),0,25),
						"addr_bldg"		=> substr(str_replace("'","",$elt[14]),0,200),
						"addr_street"	=> substr(str_replace("'","",$elt[15]),0,200),
						"addr_brgy"		=> substr(str_replace("'","",$elt[16]),0,200),
						"addr_city"		=> substr(str_replace("'","",$elt[17]),0,200),
						"addr_prov"		=> substr(str_replace("'","",$elt[18]),0,200),
						"addr_code"		=> substr(str_replace("'","",$elt[19]),0,4),
						"mission"		=> str_replace("'","",$elt[20]),
						"vision"		=> str_replace("'","",$elt[21])
					);
					
					if( !empty( $data['name'] ) ){
						if( !empty( $data['idtype'] ) ){
							if( !empty( $data['cnumber'] ) ){
								if( !empty( $data['idsize'] ) ){
									if( !empty( $data['idind'] ) ){
										if( !empty( $data['idbir'] ) ){                            
											if( !empty( $data['idsss'] ) ){                            
												if( !empty( $data['idibig'] ) ){                            
													if( !empty( $data['idhealth'] ) ){  
														
														$Qry            = new Query();	
														$Qry->table     = "tblcompany";                                            
														$Qry->selected  = "name='".$data['name']."',alias='".$data['alias']."',cnumber='".$data['cnumber']."',email='". $data['email']."',
														fnumber='".$data['fnumber']."',idtype='".$data['idtype']."',idind='".$data['idind']."',
														idsize='".$data['idsize']."',website='".$data['website']."',idbir='".$data['idbir']."',addr_bldg='".$data['addr_bldg']."',
														idsss='".$data['idsss']."',idibig='".$data['idibig']."',idhealth='".$data['idhealth']."',
														addr_street='".$data['addr_street']."',addr_brgy='".$data['addr_brgy']."',addr_city='".$data['addr_city']."',
														addr_prov='".$data['addr_prov']."',addr_code='".$data['addr_code']."'";
														$Qry->fields  = "id=1";
														if( !empty( $data['profile']  ) ){
															$Qry->selected  = $Qry->selected  . ", profile='".$data['profile']."' ";
														}
														if( !empty( $data['mission']  ) ){
															$Qry->selected  = $Qry->selected  . ", mission='".$data['mission']."' ";
														}
														if( !empty( $data['vision']  ) ){
															$Qry->selected  = $Qry->selected  . ", vision='".$data['vision']."' ";
														}
														$checke = $Qry->exe_UPDATE($con);
														if( $checke ){
															$array_insert[]	= $data;
														}else{
															$array_err[] = array(
																"row" => ($kk+1),
																"err" => "Error on Insert"
															);
														}
													}else{
														$array_err[] = array(
															"row" => ($kk+1),
															"err" => "No Philhealth ID"
														);
													}
												}else{
													$array_err[] = array(
														"row" => ($kk+1),
														"err" => "No Pag-ibig ID"
													);
												}
											}else{
												$array_err[] = array(
													"row" => ($kk+1),
													"err" => "No SSS ID"
												);
											}
										}else{
											$array_err[] = array(
												"row" => ($kk+1),
												"err" => "No BIR ID"
											);
										}
									}else{
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "No Industry"
										);
									}
								}else{
									$array_err[] = array(
										"row" => ($kk+1),
										"err" => "No Size"
									);
								}
							}else{
								$array_err[] = array(
									"row" => ($kk+1),
									"err" => "No Phone"
								);
							}
						}else{
							$array_err[] = array(
								"row" => ($kk+1),
								"err" => "No Type"
							);
						}
					}else{
						$array_err[] = array(
							"row" => ($kk+1),
							"err" => "No Name"
						);
					}
					
				}elseif( $kk == 0 ){
					$pword = strtolower($elt[22]);
					if( $pword != "company" ){
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
			}
			if( !empty( $array_err ) ){
				$return = json_encode(array("status"=>"success","errs"=>$array_err,"ins"=>$array_insert));
			}else{
				$return = json_encode(array("status"=>"success","errs"=>$array_err,"ins"=>$array_insert));
			}
			mysqli_close($con);		
			print $return;
		}else{
			$return = json_encode(array("status"=>"error","msg"=>"No Excel File Uploaded"));
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

function getCompanyInfoIDType( $con, $str ){
	$Qry 			= new Query();	
	$Qry->table     = "tblcomptype as a";
	$Qry->selected  = "*";
	$Qry->fields    = "a.type = '".$str."' ";
	$rs 			= $Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>= 1){
		while($row=mysqli_fetch_array($rs)){
			return $row['id'];
		}
	}
	return '';
}
function getCompanyInfoIDInd( $con, $str ){
	$Qry 			= new Query();	
	$Qry->table     = "tblcompind as a";
	$Qry->selected  = "*";
	$Qry->fields    = "a.industry = '".$str."' ";
	$rs 			= $Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>= 1){
		while($row=mysqli_fetch_array($rs)){
			return $row['id'];
		}
	}
	return '';
}
function getCompanyInfoIDSize( $con, $str ){
	$Qry 			= new Query();	
	$Qry->table     = "tblcompsize as a";
	$Qry->selected  = "*";
	$Qry->fields    = "a.size = '".$str."' ";
	$rs 			= $Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>= 1){
		while($row=mysqli_fetch_array($rs)){
			return $row['id'];
		}
	}
	return '';
}

?>