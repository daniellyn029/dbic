<?php
include "../../assets/php/SimpleXLSX.php";
require_once('../../assets/php/activation.php');
$conn = new connector();
$con = $conn->connect();
require_once('../../assets/php/classPhp.php'); 

	$filepath = "C:/wamp64/www/dbic/batch/shifts/Shifts.xlsx";
	//$filepath = "C:/SAP FILES/ordersystem/OrderEntriesDOSC.csv";
	
	$SysDate = SysDate();
	$SysTime = SysTime();
	
	$data_ctr = 500; // Important, counts of total row in excel
	
	$val = array();
	if ( $xlsx = SimpleXLSX::parse($filepath) ) {
		$array_err = array();
		foreach ($xlsx->rows() as $kk=>$elt) {
			if( $kk < $data_ctr ){
				if( $kk > 0 ){
					
					$stime 		= strtotime($elt[1]);
					$ftime 		= strtotime($elt[2]);
					$breakin	= strtotime($elt[3]);
					$breakout 	= strtotime($elt[4]);
					if( $stime && $ftime && $breakin && $breakout ){
						$val = array(
							"name"		=> substr(str_replace("'","",$elt[0]),0,200),
							"stime"		=> "".date_format(date_create($elt[1]),"H:i:s"),
							"ftime"		=> "".date_format(date_create($elt[2]),"H:i:s"),
							"breakin"	=> "".date_format(date_create($elt[3]),"H:i:s"),
							"breakout"	=> "".date_format(date_create($elt[4]),"H:i:s"),
						);
						
						echo "<pre>";
						print_r( $val );
						echo "</pre>";
						
						
						if(!empty($val['name'])){
							if( checkShiftName($con,$val['name'], '') ){
								$array_err[] = array(
									"row" => ($kk+1),
									"err" => "Shift Name already exists"
								);
							}else{
								$ok_proceed		= true;
								$Qry3           = new Query();
								$Qry3->table    = "tblshift";
								$Qry3->selected = "name";
								$Qry3->fields   = "'".$val['name']."'";
								if( !empty($val['stime']) ){			
									if( (strtotime($val['stime']) > strtotime($val['ftime'])) || !empty($val['stime']) && empty($val['ftime']) ){
										if( !empty($val['stime']) && empty($val['ftime']) ){
											$array_err[] = array(
												"row" => ($kk+1),
												"err" => "No Time Out Specified"
											);
											$ok_proceed		= false;
										}else{
											$date_out 		= date('Y-m-d', strtotime("+1 day", strtotime( SysDate() )));
											$difference		= sprintf('%0.2f', (strtotime($date_out.' '.$val['ftime']) - strtotime(SysDate().' '.$val['stime'])) / ( 60 * 60 ));
											if( $difference != 8 ){
												$array_err[] = array(
													"row" => ($kk+1),
													"err" => "The difference of Time In and Time Out is not equal to 8 hours"
												);
												$ok_proceed		= false;
											}else{
												$Qry3->selected = $Qry3->selected	.	",stime";
												$Qry3->fields   = $Qry3->fields		.	",'".$val['stime']."'";
											}
										}				
									}else{			
										$Qry3->selected = $Qry3->selected	.	",stime";
										$Qry3->fields   = $Qry3->fields		.	",'".$val['stime']."'";
									}
								}
								if( !empty($val['ftime']) ){
									if( (strtotime($val['stime']) > strtotime($val['ftime'])) || empty($val['stime']) && !empty($val['ftime']) ){
										if( empty($val['stime']) && !empty($val['ftime']) ){
											$array_err[] = array(
												"row" => ($kk+1),
												"err" => "No Time In Specified"
											);
											$ok_proceed		= false;
										}else{
											$date_out 		= date('Y-m-d', strtotime("+1 day", strtotime( SysDate() )));
											$difference		= sprintf('%0.2f', (strtotime($date_out.' '.$val['ftime']) - strtotime(SysDate().' '.$val['stime'])) / ( 60 * 60 ));
											if( $difference != 8 ){
												$array_err[] = array(
													"row" => ($kk+1),
													"err" => "The difference of Time In and Time Out is not equal to 8 hours"
												);
												$ok_proceed		= false;
											}else{
												$Qry3->selected = $Qry3->selected	.	",ftime";
												$Qry3->fields   = $Qry3->fields		.	",'".$val['ftime']."'";
											}
										}
									}else{
										$Qry3->selected = $Qry3->selected	.	",ftime";
										$Qry3->fields   = $Qry3->fields		.	",'".$val['ftime']."'";
									}
								}
								if( !empty($val['breakin']) ){
									if( (strtotime($val['breakin']) > strtotime($val['breakout'])) || (!empty($val['breakin']) && empty($val['breakout'])) ){
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Invalid time specified in Break In or Break Out 1"
										);
										$ok_proceed		= false;
									}elseif( !empty( $val['stime'] ) && (strtotime($val['stime']) > strtotime($val['breakin'])) ){
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Invalid time specified in Break In or Break Out 2"
										);
										$ok_proceed		= false;
									}elseif( !empty( $val['ftime'] ) && (strtotime($val['ftime']) < strtotime($val['breakin'])) ){
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Invalid time specified in Break In or Break Out 3"
										);
										$ok_proceed		= false;
									}else{
										$Qry3->selected = $Qry3->selected	.	",breakin";
										$Qry3->fields   = $Qry3->fields		.	",'".$val['breakin']."'";
									}
								}
								if( !empty($val['breakout']) ){
									if( (strtotime($val['breakin']) > strtotime($val['breakout'])) || (empty($val['breakin']) && !empty($val['breakout'])) ){
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Invalid time specified in Break In or Break Out 4"
										);
										$ok_proceed		= false;
									}elseif( !empty( $val['stime'] ) && (strtotime($val['stime']) > strtotime($val['breakout'])) ){
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Invalid time specified in Break In or Break Out 5"
										);
										$ok_proceed		= false;
									}elseif( !empty( $val['ftime'] ) && (strtotime($val['ftime']) < strtotime($val['breakout'])) ){
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Invalid time specified in Break In or Break Out 6"
										);
										$ok_proceed		= false;
									}else{
										$Qry3->selected = $Qry3->selected	.	",breakout";
										$Qry3->fields   = $Qry3->fields		.	",'".$val['breakout']."'";
									}
								}
								if( $ok_proceed ){
									$checke = $Qry3->exe_INSERT($con);
									if($checke){
										$return = json_encode(array("status"=>"success","errs"=>array()));
									}else{
										$array_err[] = array(
											"row" => ($kk+1),
											"err" => "Error on Insert"
										);
									}
								}
							}
						}else{
							$array_err[] = array(
								"row" => ($kk+1),
								"err" => "No Shift Name specified"
							);
						}
					}else{
						$array_err[] = array(
							"row" => ($kk+1),
							"err" => "Error on Time Format"
						);
					}
				}else{
					$pword = strtolower($elt[5]);
					if( $pword != "shifts" ){
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
	}else{
		$array_err[] = array(
			"row" => "0",
			"err" => "Invalid File Uploaded"
		);
		$return = json_encode(array("status"=>"error","errs"=>$array_err));
		mysqli_close($con);		
		print $return;
		return;
	}
if( !empty( $array_err ) ){
	$return = json_encode(array("status"=>"error","errs"=>$array_err));
}
mysqli_close($con);		
print $return;

?>