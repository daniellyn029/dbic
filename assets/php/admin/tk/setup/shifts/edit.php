<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));

if(!empty($param->accountid)){
	if(!empty($param->info->name)){	
		$param->info->name  = strtoupper(strtolower(str_replace("'","",$param->info->name))); 
		if( checkShiftName($con,$param->info->name, $param->info->id) ){
			$return = json_encode(array("status"=>"exists1"));
			print $return;
			mysqli_close($con);
			return;
		}		
		
		$Qry3           = new Query();
		$Qry3->table    = "tblshift";
		$Qry3->selected = "name='".$param->info->name."',paidbreaks='".$param->pdbreaks."'";
		
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
			$Qry3->selected = $Qry3->selected	.	",stime='".$param->info->stime."'";
		}else{
			$Qry3->selected = $Qry3->selected	.	",stime=NULL";
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
			$Qry3->selected = $Qry3->selected	.	",ftime='".$param->info->ftime."'";
		}else{
			$Qry3->selected = $Qry3->selected	.	",ftime=NULL";
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
			$Qry3->selected = $Qry3->selected	.	",breakin='".$param->info->breakin."'";
		}else{
			$Qry3->selected = $Qry3->selected	.	",breakin=NULL";
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
			$Qry3->selected = $Qry3->selected	.	",breakout='".$param->info->breakout."'";
		}else{
			$Qry3->selected = $Qry3->selected	.	",breakout=NULL";
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

            $Qry3->selected = $Qry3->selected	.	",ambreakin='".$param->info->ambreakin."'";
        }else{
			$Qry3->selected = $Qry3->selected	.	",ambreakin=NULL";
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
            
            $Qry3->selected = $Qry3->selected	.	",ambreakout='".$param->info->ambreakout."'";
        }else{
            $Qry3->selected = $Qry3->selected	.	",ambreakout=NULL";
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
            
            $Qry3->selected = $Qry3->selected	.	",pmbreakin='".$param->info->pmbreakin."'";
        }else{
            $Qry3->selected = $Qry3->selected	.	",pmbreakin=NULL";
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
             
            $Qry3->selected = $Qry3->selected	.	",pmbreakout='".$param->info->pmbreakout."'";
        }else{
            $Qry3->selected = $Qry3->selected	.	",pmbreakout=NULL";
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
            $Qry3->selected = $Qry3->selected	.	",stype='".$param->info->stype."',reghrs='".$reghrs."'";
        }else{
			$Qry3->selected = $Qry3->selected	.	",stype=NULL";
        }
		
		
		$Qry3->fields   = "id='".$param->info->id."'";                    
        $checke = $Qry3->exe_UPDATE($con);
        
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