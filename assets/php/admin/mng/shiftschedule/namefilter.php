<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php');

$param = json_decode(file_get_contents('php://input'));
$bunit = getDepartment($con, $param->unit);
$idpayperiod = getidpayperiod($con, $param->datefrom, $param->dateto);

$Qry3=new Query();
$Qry3->table="tbldutyrosterstat";
$Qry3->selected="*";
$Qry3->fields="id_payperiod = '". $idpayperiod  ."' AND id_department = '". 	$bunit ."'";
$rs3=$Qry3->exe_SELECT($con);

if(mysqli_num_rows($rs3)>=1){
    while($row3=mysqli_fetch_array($rs3)){
        $drlock = $row3['status'];
    }
}else{
        $drlock = 0;
}

$shift_cols = array("monday"	=>"mon", 
"tuesday"	=>"tue",
"wednesday"	=>"wed",
"thursday"	=>"thu",
"friday"	=>"fri",
"saturday"	=>"sat", 
"sunday"	=>"sun");

$Qry=new Query();
$Qry->table="vw_data_timesheet AS a LEFT JOIN vw_dataemployees AS b ON a.empID = b.id";
$Qry->selected="a.idacct,a.empID,b.lname,b.fname,b.mname,b.idunit,b.business_unit,a.idshift,a.shift_status,a.work_date,a.holiday_id,a.holiday_type,a.id_payperiod";
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

        if($param->usec!=''){
            $drpending = checkDRSecSaved($con, $param->idacct, $row['work_date']);
            $drsubmitted = checkDRSecSubmitted($con, $param->idacct, $row['work_date'],'submitted');
            $mngsave = checkDRSecSubmitted($con, $param->idacct, $row['work_date'],'save');
        }else{
            $drpending = checkDRMngSaved($con, $param->idacct, $row['work_date'], $param->accountid);
            $drsubmitted =  '';
            $mngsave =  '';
        }

        $data[] = array(
            'status'        =>'success',
            'id'            =>  $param->idacct,
            'bg'            => $backgroundColor,
            'drpndng'       => $drpending,
            'drpndngcount'  => $drpending,
            'drsbmt'        => $drsubmitted,
            'mngsave'       => $mngsave,
            'shift_status'  => $row['shift_status'],
            'work_date'     =>$row['work_date'],
            'holiday'       =>$holiday,
            'drlock'        =>	$drlock,
            
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
    $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$date."' AND type_creator=1 AND secretary is null AND manager=0  ORDER by id DESC  LIMIT 1";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['sid'];
        }
    }
    return '';
}
function checkDRSecSaved($con, $idacct, $date){
    $Qry=new Query();
    $Qry->table="tbldutyroster LEFT JOIN tblshift ON tbldutyroster.idshift = tblshift.id";
    $Qry->selected="tbldutyroster.*, tblshift.id  as sid";
    $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$date."' AND type_creator=2 AND secretary=0 AND (manager=0 OR manager is null)  ORDER by id DESC  LIMIT 1";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            return $row['sid'];
        }
    }
    return '';
}

function checkDRMngSaved($con, $idacct, $date, $accountid){
    $Qry=new Query();
    $Qry->table="tbldutyroster LEFT JOIN tblshift ON tbldutyroster.idshift = tblshift.id";
    $Qry->selected="tbldutyroster.*, tblshift.id  as sid";
    $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$date."' AND (manager=0 OR manager is null) AND secretary =1  ORDER by id DESC  LIMIT 1";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
           return $row['sid'];
        }
    }
    return '';
}

function checkDRSecSubmitted($con, $idacct, $date, $type){
    if($type == 'submitted'){
        $Qry=new Query();
        $Qry->table="tbldutyroster LEFT JOIN tblshift ON tbldutyroster.idshift = tblshift.id";
        $Qry->selected="tbldutyroster.*, tblshift.name";
        $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$date."' AND (type_creator=2) AND secretary=1 AND (manager=0 OR manager is null)  ORDER by id DESC  LIMIT 1";
        $rs=$Qry->exe_SELECT($con);
        if(mysqli_num_rows($rs)>=1){
            while($row=mysqli_fetch_array($rs)){
                return $row['name'];
            }
        }
        return '';
    }
    if($type == 'save'){
        $Qry=new Query();
        $Qry->table="tbldutyroster LEFT JOIN tblshift ON tbldutyroster.idshift = tblshift.id";
        $Qry->selected="tbldutyroster.*, tblshift.name";
        $Qry->fields="tbldutyroster.idacct='".$idacct."' AND tbldutyroster.date='".$date."' AND (type_creator=1) AND secretary=1 AND (manager=0 OR manager is null)  ORDER by id DESC  LIMIT 1";
        $rs=$Qry->exe_SELECT($con);
        if(mysqli_num_rows($rs)>=1){
            while($row=mysqli_fetch_array($rs)){
                return $row['name'];
            }
        }
        return '';
    }
   
}

function getDepartment( $con, $idunit ){
    $Qry 			= new Query();	
    $Qry->table     = "vw_databusinessunits";
    $Qry->selected  = "*";
    $Qry->fields    = "id = '".$idunit."'";
    $rs 			= $Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>= 1){
        if($row=mysqli_fetch_array($rs)){
            if($row['stype'] == 'Department'){
                $id = $row['id'];
            }else{
                $id = getDepartment( $con, $row['idunder']);
            }
        }
    }
    return $id;
}


function getidpayperiod( $con, $from, $to ){
    $Qry 			= new Query();	
    $Qry->table     = "vw_payperiod";
    $Qry->selected  = "id";
    $Qry->fields    = "period_start = '".$from."' AND period_end = '".$to."'";
    $rs 			= $Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>= 1){
        if($row=mysqli_fetch_array($rs)){
            $id = $row['id'];
        }
    }
    return $id;
}


?>