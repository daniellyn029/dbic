<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_POST;
$return = null;	

$idsuperior = getSuperiorid($con, $param['idsuperior']);

$search='';
//if( array_key_exists('idsuperior', $param) && !empty($param['idsuperior']) ){ $search=$search." AND idsuperior 	= '".$param['idsuperior']."' ";  }
if( !empty( $param['acct'] ) ){ $search=$search." AND idacct 	= '".$param['acct']."' "; }
if( !empty( $param['leave'] ) ){ $search=$search." AND idleave 	= '".$param['leave']."' "; }
if( !empty( $param['docu'] ) ){ $search=$search." AND docnumber like '%".$param['docu']."%' "; }
if( !empty( $param['appstat'] ) ){ $search=$search." AND stat = '".$param['appstat']."' "; }
if( !empty( $param['from'] ) && !empty( $param['to'] ) ){ $search=$search." AND (date between '".$param['from']."' AND '".$param['to']."')"; }

$where = $search;

//sort nga funtion sa table
if( $param['order'][0]['column'] !='' ){//default 
	$arrCols = array("",
					"empname",
					"date",
					"",
					"",
					"",
					"",
					"leave_status");//mao ra ang mailisan na declare na sa ubos php
	$search=$search." ORDER BY ". $arrCols[$param['order'][0]['column']] ." ".$param['order'][0]['dir'];//default
}

if( (int)$param['length'] >= 0 ){
    $search=$search." LIMIT ".$param['length'];	
}
if( $param['start'] !='' && (int)$param['length'] >= 0 ){
    $search=$search." OFFSET ".$param['start'];
}

$Qry = new Query();	
$Qry->table     = "vw_leave_application";
$Qry->selected  = "*";
$Qry->fields    = "((  find_in_set('".$param['idsuperior']."',approver1) AND idacct != '".$param['idsuperior']."' AND idacct != '".$idsuperior."') OR 
                    (  find_in_set('".$param['idsuperior']."',approver2) AND idacct != '".$param['idsuperior']."' AND idacct != '".$idsuperior."') OR
                    (  find_in_set('".$param['idsuperior']."',approver3) AND idacct != '".$param['idsuperior']."' AND idacct != '".$idsuperior."') OR
                    (  find_in_set('".$param['idsuperior']."',approver4) AND idacct != '".$param['idsuperior']."' AND idacct != '".$idsuperior."')
                    )".$search;
$rs = $Qry->exe_SELECT($con);
$recFiltered = getTotalRows($con,$where);
if(mysqli_num_rows($rs)>= 1){
    $data = array( 
        "draw"=> $param['draw'],
        "recordsTotal"=> mysqli_num_rows($rs),
        "recordsFiltered"=> $recFiltered,
        "qry"=>$Qry->fields,
        "data"=>array()
    );
    while($row=mysqli_fetch_array($rs)){
        $pending = 1;
        $action = 0;

        $approvercount = 0;
        if($row['approver1']){
            $approvercount++;
        }
        if($row['approver2']){
            $approvercount++;
        }
         if($row['approver3']){
            $approvercount++;
        }
        if($row['approver4']){
            $approvercount++;
        }

        $row['leave_status'] =  '<span style="font-weight:600 !important; color: red !important"> Pending</span>';

        $approver1 = explode(',',$row['approver1']);
        if (in_array($param['idsuperior'], $approver1)) {
            $action = 1;
        } 
  
        if(!empty($row['approver1_stat'])){
            $pending++;
            $action = 0;
         
            $row['leave_status'] =  '<span style="font-weight:600 !important; color: red !important"> Pending</span>';

            $approver2 = explode(',',$row['approver2']);
            if (in_array($param['idsuperior'], $approver2)) {
                $action = 1;
            } 
        }
         if(!empty($row['approver2_stat'])){
            $pending++;
            $action = 0;
           
            $row['leave_status'] =  '<span style="font-weight:600 !important; color: red !important"> Pending</span>';

           $approver3 = explode(',',$row['approver3']);
           if (in_array($param['idsuperior'], $approver3)) {
               $action = 1;
           } 
          
        }
         if(!empty($row['approver3_stat'])){
            $pending++;
            $action = 0;
            $row['leave_status'] =  '<span style="font-weight:600 !important; color: red !important"> Pending</span>';

            $approver4 = explode(',',$row['approver4']);
            if (in_array($param['idsuperior'], $approver4)) {
                $action = 1;
            } 
        }
        if($row['stat'] == 1){
            $row['leave_status'] = '<span style="font-weight:600 !important; color: green !important"> Approved </span>';
        }
        if($row['stat'] == 2){
            $row['leave_status'] = '<span style="font-weight:600 !important; color: gray !important"> Declined </span>';
        }

       
        if ($action == 1) {
            if($row['stat'] == 1 || $row['stat'] == 2){
                $btn = '';
            }else{
                $btn = '<input type="checkbox" class="circlCheck2"
                        value="' . $row['id'] . '"
                        data-approvercount ="'. $approvercount .'" 
                        data-approver="' . $pending . '" 
                        data-idleave="' . $row['idleave'] . '" 
                        data-hours="' .  $row['hrs'] . '"  
                        data-appid="' .  $row['idacct'] . '"
                        data-period_start="' .  $row['period_start'] . '" 
                        data-period_end="' .  $row['period_end'] . '"
                        data-grace_hour="' .  $row['grace_hour'] . '"  
                        data-date="' .  $row['date'] . '"  >';    
            }
        } else {
            $btn = '';
        }
        
    

		$units = sprintf('%0.2f',($row['hrs'] / 8));
        $data["data"][] = array(
            'id'        		=> (int)$row['id'],
			'docnumber'			=> $row['docnumber'],	
            'idleave'     		=> $row['idleave'],
            'leave_name'   		=> $row['leave_name'],
			'app_type'   		=> $row['leave_name'],
            'leave_type'    	=> $row['leave_type'],
			'idtype'			=> $row['idtype'],
			'idacct'			=> $row['idacct'],
			'empid'				=> $row['empid'],
			'empname'			=> $row['empname'],
			'date'				=> $row['date'],
			'time_in'			=> $row['stime'],
			'time_out'			=> $row['ftime'],
			'hrs'				=> $row['hrs'],
			'remarks'			=> $row['remarks'],
			'file'				=> $row['file'] ? $row['file'] : '',
			'leave_status'		=> $row['leave_status'],
            'date_approve'		=> $row['date_approve'],
            'checkbox'          => $btn,
			'units'				=> $units
        );
    }
    $return =  json_encode($data);
}else{
    $data = array( 
        "draw"=> $param['draw'],
        "recordsTotal"=> mysqli_num_rows($rs),
        "recordsFiltered"=> mysqli_num_rows($rs),
		"qry"=>$Qry->fields,
        "data"=>array()
    );
    $return =  json_encode($data);
}

print $return;
mysqli_close($con);

function getTotalRows($con,$search){
	$Qry = new Query();	
	$Qry->table ="vw_leave_application";
	$Qry->selected ="*";
	$Qry->fields ="id > 0 ".$search;
	$rs = $Qry->exe_SELECT($con);
	return mysqli_num_rows($rs);
}

function getApproverName($con,$idacct){
	$Qry = new Query();	
	$Qry->table ="vw_dataemployees";
	$Qry->selected ="empname";
    $Qry->fields ="id = '" . $idacct . "'";
    $rs            = $Qry->exe_SELECT($con);
    if (mysqli_num_rows($rs) >= 1) {
        if ($row = mysqli_fetch_array($rs)) {
            return $row['empname'];
        }
    }
}

function getSuperiorid( $con,$idacct ){
    $Qry 			= new Query();	
    $Qry->table     = "vw_dataemployees";
    $Qry->selected  = "idsuperior";
    $Qry->fields    = "id = '".$idacct."'";
    $rs = $Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>= 1){
        if($row=mysqli_fetch_array($rs)){
            return $row['idsuperior'];
        }
    }
    return '';
}

?>