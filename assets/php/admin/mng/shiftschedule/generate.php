<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php');

    $param = json_decode(file_get_contents('php://input'));

    $shift_cols = array("monday"	=>"mon", 
    "tuesday"	=>"tue",
    "wednesday"	=>"wed",
    "thursday"	=>"thu",
    "friday"	=>"fri",
    "saturday"	=>"sat", 
    "sunday"	=>"sun");

    $Qry=new Query();
    $Qry->table="vw_data_timesheet AS a LEFT JOIN vw_dataemployees AS b ON a.empID = b.id";
    $Qry->selected="a.idacct,a.empID,b.lname,b.fname,b.mname,b.idunit,b.business_unit,a.idshift,a.shift_status,a.work_date,a.holiday_id,a.holiday_type";
    $Qry->fields="a.empID = '".$param->idacct."' AND (a.work_date BETWEEN '".$param->datefrom."' AND '".$param->dateto."') ORDER BY CONCAT(a.work_date,b.lname) ASC";
    $rs=$Qry->exe_SELECT($con);
    //echo $Qry->fields;
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $holiday = '';
            $drpending ='';
            $drsubmitted ='';
            $mngsvd = '';

            if( !empty($row['holiday_id']) ){
                $row['shift_status'] = ucwords(strtolower($row['holiday_type'])).' Holiday';
                $holiday = $row['shift_status'];
            }

            if( empty($row['shift_status']) ){
                $shift_field			= "".$shift_cols[  strtolower(''.date("l", strtotime($row['work_date']) )) ];
                $shift_info 			= getDateShiftData( $con, $row['empID'], $shift_field, $row['work_date'] );
                $row['shift_status']	= $shift_info[0];
            }

            if($row['shift_status'] == 'Rest Day'){
                $backgroundColor = '#00b050';
            }else{
                $backgroundColor = '#f39c12';  
            }

           
            $drpending = checkprevdr($con, $param->idacct, $row['work_date'], $param->accountid);
            $drsubmitted =  '';
            $mngsave =  '';
        

            
            
            $data[] = array(
                'status'=>'success',
                'id'    =>  $param->idacct,
                'bg'    => $backgroundColor,
                'drpndng'      => $drpending,
                'drpndngcount'  => $drpending,
                'drsbmt'      => $drsubmitted,
                'mngsave'      => $mngsave,
                'shift_status'  => $row['shift_status'],
                'work_date' =>$row['work_date'],
                'holiday' =>$holiday,
            );
        }
        $return = json_encode($data);
    }else{
        $return = json_encode(array('status'=>'empty'));
    }
    
print $return;
mysqli_close($con);

function checkCS($con, $idacct, $date){
    $Qry=new Query();
    $Qry->table="tbltimeshift LEFT JOIN tblshift ON tbltimeshift.idshift = tblshift.id";
    $Qry->selected="tbltimeshift.*, tblshift.name";
    $Qry->fields="tbltimeshift.idacct='".$idacct."' AND tbltimeshift.date='".$date."' AND tbltimeshift.stat=3 AND tbltimeshift.cancelby IS NULL";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['name'];
        }
    }
    return '';
}



function checkDRIfMNG($con, $idacct, $date){
    $Qry=new Query();
    $Qry->table="tbldutyroster LEFT JOIN tblshift ON tbldutyroster.idshift = tblshift.id";
    $Qry->selected="tbldutyroster.*, tblshift.id as sid";
    $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$date."' AND type_creator=1 AND secretary is null AND manager=0";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['sid'];
        }
    }
    return '';
}

function checkprevdr($con, $idacct, $date, $accountid){
    $newdate = new DateTime($date);
    $newdate->modify("-14 day");
    $newdate = $newdate->format("Y-m-d");

    $Qry=new Query();
    $Qry->table="tbldutyroster LEFT JOIN tblshift ON tbldutyroster.idshift = tblshift.id";
    $Qry->selected="tbldutyroster.*, tblshift.id  as sid";
    $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$newdate."' ORDER by tbldutyroster.id DESC LIMIT 1";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
           return $row['sid'];
        }
    }
    return '';
}


?>