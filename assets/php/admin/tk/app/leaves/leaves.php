<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$return = null;	

$Qry = new Query();	
$Qry->table     = "vw_leave_application";
$Qry->selected  = "*";

if($param->date == ''){
    $Qry->fields    = "idacct = '".$param->accountid."' 
                    AND ( year( CURRENT_DATE()) = year(date)
                    and month( CURRENT_DATE()) = month(date) )";
}else{
    $date = $param->date;
    $Qry->fields    = "idacct = '".$param->accountid."' 
                    AND ( year('". $date ."') = year(date)
                    and month('". $date ."') = month(date) )";
}

$rs = $Qry->exe_SELECT($con);

if(mysqli_num_rows($rs)>= 1){
    while($row=mysqli_fetch_array($rs)){
        $start= $row['date'];
        $end = $row['date'];

        // $data["data"][] = array(
        //  'id'        		=> (int)$row['id'],
		// 	'docnumber'			=> $row['docnumber'],	
        //  'idleave'     		=> $row['idleave'],
        //  'leave_name'   		=> $row['leave_name'],
        //  'leave_type'    	=> $row['leave_type'],
		// 	'idtype'			=> $row['idtype'],
		// 	'idacct'			=> $row['idacct'],
		// 	'empid'				=> $row['empid'],
		// 	'empname'			=> $row['empname'],
		// 	'date'				=> $row['date'],
		// 	'time_in'			=> $row['stime'],
		// 	'time_out'			=> $row['ftime'],
		// 	'hrs'				=> $row['hrs'],
		// 	'remarks'			=> $row['remarks'],
		// 	'file'				=> $row['file'],
		// 	'leave_status'		=> $row['leave_status'],
		// 	'date_approve'		=> $row['date_approve']
        // );

        if( $row['idleave'] == '2'){
            $backgroundColor = '#fe9901';
        }
        if( $row['idleave'] == '1'){
            $backgroundColor = '#00af50';
        }
        if( $row['idleave'] == '3'){
            $backgroundColor = '#525050';
        }
        if( $row['idleave'] == '4'){
            $backgroundColor = '#395723';
        }
        if($row['idleave'] == '5'){
            $backgroundColor = '#7e6000';
        }
        if($row['idleave'] == '6'){
            $backgroundColor = '#01b0f1';
        }
        if($row['idleave'] == '7'){
            $backgroundColor = '#01b0f1';
        }
        if($row['idleave'] == '8'){
            $backgroundColor = '#ff3300';
        }
        if($row['idleave'] == '9'){
            $backgroundColor = '#0071c0';
        }
        if($row['idleave'] == '10'){
            $backgroundColor = '#1f4e78';
        }
        if($row['idleave'] == '11'){
            $backgroundColor = '#58267f';
        }
        if($row['idleave'] == '12'){
            $backgroundColor = '#7e6000';
        }

        $approverstatus = '';
        $findhr = array('1');

        if($row['stat'] == 3){
            if (in_array($row['idleave'], $findhr)){
                if(is_null($row['approver1_stat'])){
                    if($row['approver1_stat'] == 1){
                    
                    } else if($row['approver1_stat'] == 2){
                    
                    }else if($row['approver1_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                         $approverstatus = 'Pending HR';
                    }
                }else if(is_null($row['approver2_stat'])){
                    if($row['approver2_stat'] == 1){
                    
                    } else if($row['approver2_stat'] == 2){
                    
                    }else if($row['approver2_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                        $approverstatus = 'Pending Department Head';
                    }
                }else if(is_null($row['approver3_stat'])){
                    if($row['approver3_stat'] == 1){
                    
                    } else if($row['approver3_stat'] == 2){
                    
                    }else if($row['approver3_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                        $approverstatus = 'Pending Second Approver';
                    }
                }else if(is_null($row['approver4_stat'])){
                    if($row['approver4_stat'] == 1){
                    
                    } else if($row['approver4_stat'] == 2){
                    
                    }else if($row['approver4_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                        $approverstatus = 'Pending Third Approver';
                    }
                }
                
            }else{
                if(is_null($row['approver1_stat'])){
                    if($row['approver1_stat'] == 1){
                    
                    } else if($row['approver1_stat'] == 2){
                    
                    }else if($row['approver1_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                        $approverstatus = 'Pending Department Head';
                    }
                }else if(is_null($row['approver2_stat'])){
                    if($row['approver2_stat'] == 1){
                    
                    } else if($row['approver2_stat'] == 2){
                    
                    }else if($row['approver2_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                        $approverstatus = 'Pending Second Approver';
                    }
                }else if(is_null($row['approver3_stat'])){
                    if($row['approver3_stat'] == 1){
                    
                    } else if($row['approver3_stat'] == 2){
                    
                    }else if($row['approver3_stat'] == 3){
                    
                    }else if($row['cancel_reason'] != null){
                        $approverstatus = 'Cancelled';
                    }else{
                        $approverstatus = 'Pending Third Approver';
                    }
                }
            }
        }
        if($row['stat'] == 2){
            $approverstatus = 'Disapproved';
            if($row['approver1_stat' == 2]){
                $row['cancel_reason']  = $row['approver1_reason'];
            }
             if($row['approver2_stat' == 2]){
                $row['cancel_reason']  = $row['approver2_reason'];
            }
             if($row['approver3_stat' == 2]){
                $row['cancel_reason']  = $row['approver3_reason'];
            }
             if($row['approver4_stat' == 2]){
                $row['cancel_reason']  = $row['approver4_reason'];
            }
        }
        if($row['stat'] == 1){
            $approverstatus = 'Approved';
        }

        $data[] = array( 
            "id" 			    => $row['id'],
			"creator"			=> $row['creator'],
            "title" 			=> $row['leave_name'],
            "start" 			=> $start,
            "end" 		    	=> $end,
            "backgroundColor"   => $backgroundColor,
            'leave_status'		=> $row['leave_status'],
            'remarks'		    => $row['remarks'],
            'cancelreason'		=> $row['cancel_reason'],
            'approverstatus'    => $approverstatus,
            'file'              => $row['file']
        );
    }
    $return =  json_encode($data);
}else{
    $return = json_encode(array());
}

print $return;
mysqli_close($con);

?>