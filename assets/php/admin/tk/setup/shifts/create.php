<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));

if(!empty($param->accountid)){
	if(!empty($param->info->name)){	
		$param->info->name  = strtoupper(strtolower(str_replace("'","",$param->info->name))); 		
		if( checkShiftName($con,$param->info->name, '') ){
			$return = json_encode(array("status"=>"exists1"));
			print $return;
			mysqli_close($con);
			return;
		}

		$Qry3           = new Query();
		$Qry3->table    = "tblshift";
		$Qry3->selected = "name,paidbreaks";
		$Qry3->fields   = "'".$param->info->name."','".$param->pdbreaks."'";  
		
		if( !empty($param->info->stime) ){			
			if( (strtotime($param->info->stime) > strtotime($param->info->ftime)) || !empty($param->info->stime) && empty($param->info->ftime) ){
				if( !empty($param->info->stime) && empty($param->info->ftime) ){
					$return = json_encode(array("status"=>"err1"));
					print $return;
					mysqli_close($con);
					return;
				}else{
					$date_out 		= date('Y-m-d', strtotime("+1 day", strtotime( SysDate() )));
					$difference		= sprintf('%0.2f', (strtotime($date_out.' '.$param->info->ftime) - strtotime(SysDate().' '.$param->info->stime)) / ( 60 * 60 ));
					if( $difference != 8 ){
						$return = json_encode(array("status"=>"err1"));
						print $return;
						mysqli_close($con);
						return;
					}
				}				
			}			
			$Qry3->selected = $Qry3->selected	.	",stime";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->stime."'";
		}
		if( !empty($param->info->ftime) ){
			if( (strtotime($param->info->stime) > strtotime($param->info->ftime)) || empty($param->info->stime) && !empty($param->info->ftime) ){
				if( empty($param->info->stime) && !empty($param->info->ftime) ){
					$return = json_encode(array("status"=>"err1"));
					print $return;
					mysqli_close($con);
					return;
				}else{
					$date_out 		= date('Y-m-d', strtotime("+1 day", strtotime( SysDate() )));
					$difference		= sprintf('%0.2f', (strtotime($date_out.' '.$param->info->ftime) - strtotime(SysDate().' '.$param->info->stime)) / ( 60 * 60 ));
					if( $difference != 8 ){
						$return = json_encode(array("status"=>"err1"));
						print $return;
						mysqli_close($con);
						return;
					}
				}
			}
			$Qry3->selected = $Qry3->selected	.	",ftime";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->ftime."'";
        }
        
		if( !empty($param->info->breakin) ){
			if( (strtotime($param->info->breakin) > strtotime($param->info->breakout)) || (!empty($param->info->breakin) && empty($param->info->breakout)) ){
				$return = json_encode(array("status"=>"err2"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->stime ) && (strtotime($param->info->stime) > strtotime($param->info->breakin)) ){
				$return = json_encode(array("status"=>"err2"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->ftime ) && (strtotime($param->info->ftime) < strtotime($param->info->breakin)) ){
				$return = json_encode(array("status"=>"err2"));
				print $return;
				mysqli_close($con);
				return;
			}
			$Qry3->selected = $Qry3->selected	.	",breakin";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->breakin."'";
		}
		if( !empty($param->info->breakout) ){
			if( (strtotime($param->info->breakin) > strtotime($param->info->breakout)) || (empty($param->info->breakin) && !empty($param->info->breakout)) ){
				$return = json_encode(array("status"=>"err2"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->stime ) && (strtotime($param->info->stime) > strtotime($param->info->breakout)) ){
				$return = json_encode(array("status"=>"err2"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->ftime ) && (strtotime($param->info->ftime) < strtotime($param->info->breakout)) ){
				$return = json_encode(array("status"=>"err2"));
				print $return;
				mysqli_close($con);
				return;
			}
			$Qry3->selected = $Qry3->selected	.	",breakout";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->breakout."'";
        }
        if( !empty($param->info->ambreakin) ){
			if( (strtotime($param->info->ambreakin) > strtotime($param->info->ambreakout)) || (!empty($param->info->ambreakin) && empty($param->info->ambreakout)) ){
				$return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->stime ) && (strtotime($param->info->stime) > strtotime($param->info->ambreakin)) ){
				$return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->ftime ) && (strtotime($param->info->ftime) < strtotime($param->info->ambreakin)) ){
				$return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
            }
            if ($param->info->ambreakin > strtotime('12:00am') && $current_time < strtotime('12:00pm')) {
                $return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
             }
            
			$Qry3->selected = $Qry3->selected	.	",ambreakin";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->ambreakin."'";
        }
        if( !empty($param->info->ambreakout) ){
			if( (strtotime($param->info->ambreakin) > strtotime($param->info->ambreakout)) || (empty($param->info->ambreakin) && !empty($param->info->ambreakout)) ){
				$return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->stime ) && (strtotime($param->info->stime) > strtotime($param->info->ambreakout)) ){
				$return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->ftime ) && (strtotime($param->info->ftime) < strtotime($param->info->ambreakout)) ){
				$return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
            }
            if ($param->info->ambreakin > strtotime('12:00am') && $current_time < strtotime('12:00pm')) {
                $return = json_encode(array("status"=>"err3"));
				print $return;
				mysqli_close($con);
				return;
             }

			$Qry3->selected = $Qry3->selected	.	",ambreakout";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->ambreakout."'";
        }
        if( !empty($param->info->pmbreakin) ){
			if( (strtotime($param->info->pmbreakin) > strtotime($param->info->pmbreakout)) || (!empty($param->info->pmbreakin) && empty($param->info->pmbreakout)) ){
				$return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->stime ) && (strtotime($param->info->stime) > strtotime($param->info->pmbreakin)) ){
				$return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->ftime ) && (strtotime($param->info->ftime) < strtotime($param->info->pmbreakin)) ){
				$return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
            }
            if ($param->info->pmbreakin > strtotime('12:00am') && $current_time < strtotime('12:00pm')) {
                $return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
             }
            
			$Qry3->selected = $Qry3->selected	.	",pmbreakin";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->pmbreakin."'";
        }
        if( !empty($param->info->pmbreakout) ){
			if( (strtotime($param->info->pmbreakin) > strtotime($param->info->pmbreakout)) || (empty($param->info->pmbreakin) && !empty($param->info->pmbreakout)) ){
				$return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->stime ) && (strtotime($param->info->stime) > strtotime($param->info->pmbreakout)) ){
				$return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
			}
			if( !empty( $param->info->ftime ) && (strtotime($param->info->ftime) < strtotime($param->info->pmbreakout)) ){
				$return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
            }
            if ($param->info->pmbreakin > strtotime('12:00am') && $current_time < strtotime('12:00pm')) {
                $return = json_encode(array("status"=>"err4"));
				print $return;
				mysqli_close($con);
				return;
             }
             
			$Qry3->selected = $Qry3->selected	.	",pmbreakout";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->pmbreakout."'";
        }

        
        if( !empty($param->info->stype) ){
			$reghrs			= "8.00";
			if( $param->info->stype == "Compressed Schedule" ){
				$reghrs		= "9.50";
			}
			if( strtotime($param->info->stime) > strtotime($param->info->ftime) ) {
				$date_out 	= date('Y-m-d', strtotime("+1 day", strtotime( SysDate() )));
			}else{
				$date_out 	= date('Y-m-d', strtotime(SysDate()));				
			}
			$difference		= sprintf('%0.2f', (strtotime($date_out.' '.$param->info->ftime) - strtotime(SysDate().' '.$param->info->stime)) / ( 60 * 60 ));
			if( $difference < 8 ){
				$reghrs			= "4.00";
				if( $param->info->stype == "Compressed Schedule" ){
					$reghrs			= "4.75";
				}
			}
			$Qry3->selected = $Qry3->selected	.	",stype,reghrs";
			$Qry3->fields   = $Qry3->fields		.	",'".$param->info->stype."','".$reghrs."'";
        }
		
		$checke = $Qry3->exe_INSERT($con);
		if($checke){
			$return = json_encode(array("status"=>"success"));
		}else{
			$return = json_encode(array('status'=>'error'));
		}
				
			
	}else{
		$return = json_encode(array('status'=>'name'));
	}
}else{
	 $return = json_encode(array('status'=>'notloggedin'));
}


print $return;
mysqli_close($con);
?>