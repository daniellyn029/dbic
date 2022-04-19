<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

	$param = json_decode(file_get_contents('php://input'));
	// $param = $_POST;
	$date_create=SysDate();
	$time_create=SysTime();
	$return = null;
    
    if($param->button=='save'){
        foreach($param->employee as $key=>$value){
            $ctr = 1;
            foreach($value as $key2=>$value2){
                $newsched = $value2->drpndng;
                if($newsched){
                    if(!checkIfHasPending($con, $value2->id, $value2->work_date)){
                        $remarks = 'New schedule from '.$value2->shift_status.' to '.getIdShift($con, $value2->drpndng);
            
                        $time 	   = time();
                        $docnumber = "SS".$value2->id.strtotime( $date_create.$time ).$time.$ctr;
                        $ctr++;

                        $iu = getIdUnit($con, $value2->id);

                        $id_payperiod = getIdPayPeriod($con, $value2->work_date);

                        $Qry 			= new Query();
                        $Qry->table 	= "tbldutyroster";
                        $Qry->selected 	= "docnumber, 
                                            unit, 
                                            creator, 
                                            idacct, 
                                            idshift, 
                                            date, 
                                            remarks, 
                                            id_payperiod, 
                                            date_create, 
                                            time_create, 
                                            type_creator, 
                                            secretary";
                        $Qry->fields 	= " '".$docnumber."',
                                            '".$iu."',
                                            '".$param->accountid."',
                                            '".$value2->id."',
                                            '".$value2->drpndng."',
                                            '".$value2->work_date."',
                                            '".$remarks."',
                                            '".$id_payperiod."',
                                            '".$date_create."',
                                            '".$time_create."',
                                            '".$param->typec."',
                                            '0'";
                        $checkentry 	= $Qry->exe_INSERT($con); 
                    }else{
                        $remarks = 'New schedule from '.$value2->shift_status.' to '.getIdShift($con, $value2->drpndng);

                        $Qryb 			= new Query();	
                        $Qryb->table 	= "tbldutyroster";
                        $Qryb->selected = "idshift='".$value2->drpndng."', remarks='".$remarks."'";
                        $Qryb->fields 	= "idacct='".$value2->id."' AND date='".$value2->work_date."'";
                        $checkentryb 	= $Qryb->exe_UPDATE($con); 
                    }
                }else{
                    $Qry 			= new Query();	
                    $Qry->table     = "tbldutyroster";
                    $Qry->fields   	= "idacct='".$value2->id."' AND date='".$value2->work_date."' AND secretary='0' AND type_creator='2'";
                    $Qry->exe_DELETE($con);
                }
            }
        }

        $return = json_encode(array('savestatus'=>'success'));
        print $return;
        mysqli_close($con);
    }

    if($param->button=='submit'){
   
        foreach($param->employee as $key=>$value){
            foreach($value as $key2=>$value2){
                $newsched = $value2->drpndng;
                $drsbmt = $value2->drsbmt;
                if($drsbmt){
                    $return = json_encode(array('submitstatus'=>'ooops'));
                    print $return;
                    mysqli_close($con);
                    return;
                }
                if($newsched){
                    if(!checkIfSaved($con, $value2->id, $value2->work_date)){
                        $return = json_encode(array('submitstatus'=>'oops'));
                        print $return;
                        mysqli_close($con);
                        return;
                    }
                }
                
            }
        }

        $ctr = 1;
        foreach($param->employee as $key=>$value){
            foreach($value as $key2=>$value2){
                $newsched = $value2->drpndng;
                if($newsched){
                    $Qryb 			= new Query();	
                    $Qryb->table 	= "tbldutyroster";
                    $Qryb->selected = "secretary='1'";
                    $Qryb->fields 	= "idacct='".$value2->id."' AND date='".$value2->work_date."' AND secretary='0' AND type_creator='2'";
                    $checkentryb 	= $Qryb->exe_UPDATE($con); 
                }
            }
        }
        $return = json_encode(array('submitstatus'=>'success'));
        print $return;
        mysqli_close($con);
    }

    // if(!empty($param->idacct)){
	// 	$ctr=1;
	// 	foreach($param->dates as $key=>$value){
	// 		if($param->newschd[$key] != ''){
	// 			if(!checkIfHasPending($con, $param->idacct, $param->dates[$key])){
	// 				$id_payperiod = getIdPayPeriod($con, $param->dates[$key]);

	// 				$remarks = 'New schedule from '.$param->oldschd[$key].' to '.$param->newschd[$key];
	
	// 				$time 	   = time();
	// 				$docnumber = "SS".$param->idacct.strtotime( $date_create.$time ).$time.$ctr;
	// 				$ctr++;
	
	// 				// echo getIdShift($con, $param->newschd[$key]) . "\n";
	
	// 				// echo $param->dates[$key]."\n";
	
	// 				$Qry 			= new Query();
	// 				$Qry->table 	= "tbltimeshift";
	// 				$Qry->selected 	= "docnumber, creator, idacct, idshift, date, remarks, stat, id_payperiod, date_create";
	// 				$Qry->fields 	= " '".$docnumber."',
	// 									'".$param->accountid."',
	// 									'".$param->idacct."',
	// 									'".getIdShift($con, $param->newschd[$key])."',
	// 									'".$param->dates[$key]."',
	// 									'".$remarks."',
	// 									'3',
	// 									'".$id_payperiod."',
	// 									'".$date_create."'";
	// 				$checkentry 	= $Qry->exe_INSERT($con); 
	// 			}
	// 		}
	// 	}
	// 	$return = json_encode(array('status'=>'success'));
    // }else{
    //     $return = json_encode(array('status'=>'error'));
    // }


function getIdPayPeriod($con, $date){
    $Qry=new Query();
    $Qry->table="tblpayperiod";
    $Qry->selected="*";
    $Qry->fields="period_start<='".$date."' AND period_end>='".$date."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['id'];
        }
    }
    return '';
}

function getIdShift($con, $name){
    $Qry=new Query();
    $Qry->table="tblshift";
    $Qry->selected="name";
    $Qry->fields="id='".$name."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['name'];
        }
    }
    return '';
}

// function checkIfHasPending($con, $idacct, $date, $unit){
//     $Qry=new Query();
//     $Qry->table="tbldutyroster";
//     $Qry->selected="*";
//     $Qry->fields="idacct='".$idacct."' AND date='".$date."' AND unit='".$unit."' AND (secretary=0 OR secretary=1) AND type_creator=2";
//     $rs=$Qry->exe_SELECT($con);
//     if(mysqli_num_rows($rs)>=1){
//         while($row=mysqli_fetch_array($rs)){
//             return true;
//         }
//     }
//     return false;
// }

function checkIfHasPending($con, $idacct, $date){
    $Qry=new Query();
    $Qry->table="tbldutyroster";
    $Qry->selected="*";
    $Qry->fields="idacct='".$idacct."' AND date='".$date."' AND manager != 1";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return true;
        }
    }
    return false;
}

function checkIfSaved($con, $idacct, $date){
    $Qry=new Query();
    $Qry->table="tbldutyroster";
    $Qry->selected="*";
    $Qry->fields="idacct='".$idacct."' AND date='".$date."' AND type_creator=2 AND secretary=0";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return true;
        }
    }
    return false;
}

function getIdUnit($con, $idacct){
    $Qry=new Query();
    $Qry->table="vw_dataemployees";
    $Qry->selected="idunit";
    $Qry->fields="id='".$idacct."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['idunit'];
        }
    }
    return null;
}

function getTblUnits($con, $idacct){
    $data = array();
    $Qry=new Query();
    $Qry->table="tblbunits";
    $Qry->selected="id";
    $Qry->fields="scheduler='".$idacct."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            array_push($data, $row['id']);
        }
    }
    return $data;
}

?>