<?php
include "../../assets/php/SimpleXLSX.php";
require_once('../../assets/php/activation.php');
$conn = new connector();
$con = $conn->connect();
require_once('../../assets/php/classPhp.php'); 
	
	$SysDate = SysDate();
	$SysTime = SysTime();
		
	$filepath = "C:/wamp64/www/dbic/batch/classification/Classification.xlsx";
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
						"name"		=> substr(str_replace("'","",$elt[0]),0,200),
						"alias"		=> substr(str_replace("'","",$elt[1]),0,250),
						"costcenter"=> substr(str_replace("'","",$elt[2]),0,250),
						"idunder"	=> getClassificationIDUnder($con,substr(str_replace("'","",$elt[3]),0,200)),
						"under_str"	=> substr(str_replace("'","",$elt[3]),0,200),
						"type_str"	=> $elt[4],
						"utype"		=> $elt[5],
						"stat"		=> '1'
					);						
					if(!empty($val['alias'])){
						if(!empty($val['name'])){
							if(!empty($val['utype'])){       
								if( !empty( $val['idunder']) ){
									$val['alias']     = (strtolower(str_replace("'","",$val['alias']))); 
									$val['name']      = ((str_replace("'","",$val['name'])));  
									if( !checkUnitName($con, $val['name'], '', 'tblbunits') ){
										if( !checkAlias($con, $val['alias'], '', 'tblbunits') ){ 
											$allow = 1;
											$Qry3           = new Query();
											$Qry3->table    = "tblbunits";
											$Qry3->selected = "name,alias,unittype,isactive";
											$Qry3->fields   = "'".$val['name']."',
															   '".$val['alias']."',
															   '".$val['utype']."',
															   '".$val['stat']."'";
															   
											if( !empty( $val['costcenter']) ){
												$Qry3->selected = $Qry3->selected.",costcenter";
												$Qry3->fields   = $Qry3->fields.", '".$val['costcenter']."'";
											}
											if( !empty( $val['idunder']) ){
												$Qry3->selected = $Qry3->selected.",idunder";
												$Qry3->fields   = $Qry3->fields.", '".$val['idunder']."'";
											}
											$checke = $Qry3->exe_INSERT($con);
											if($checke){
												$array_insert[]	= $val;
												$return = json_encode(array("status"=>"success","errs"=>array()));
											}else{
												$array_err[] = array(
													"row" => ($kk+1),
													"err" => "Error on Insert"
												);
											}
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
										"err" => "Classification Under specified is not found in database"
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
					}else{
						$array_err[] = array(
							"row" => ($kk+1),
							"err" => "No Alias"
						);
					}
				}else{
					$pword = strtolower($elt[6]);
					if( $pword != "bunit" ){
						$array_err[] = array(
							"row" => "0",
							"err" => "Invalid File Uploaded"
						);
						$return = json_encode(array("status"=>"error","errs"=>$array_err));
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
	}else{
		$return = json_encode(array("status"=>"error","msg"=>"No Excel File Uploaded"));
	}


mysqli_close($con);		
print $return;

function getClassificationIDUnder( $con, $str ){
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