<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = $_POST;
$return = null;	
$search='';
if( array_key_exists('accountid', $param) && !empty($param['accountid']) ){
	if( array_key_exists('units', $param) && !empty($param['units']) ){
		$search=$search." AND (idsuperior 	= '".$param['accountid']."' OR idsuperior in (".$param['units'].") ) "; 
	}else{
		$search=$search." AND idsuperior 	= '".$param['accountid']."' "; 
	}
}
if( !empty( $param['acct'] ) ){ $search=$search." AND idacct 	= '".$param['acct']."' "; }
if( !empty( $param['docu'] ) ){ $search=$search." AND docnumber like '%".$param['docu']."%' "; }
if( !empty( $param['appstat'] ) ){ $search=$search." AND stat = '".$param['appstat']."' "; }
if( !empty( $param['from'] ) && !empty( $param['to'] ) ){ $search=$search." AND (date between '".$param['from']."' AND '".$param['to']."')"; }
if( !empty( $param['from'] ) && empty( $param['to'] ) ){ $search=$search." AND (date between '".$param['from']."' AND '".$param['from']."')"; }

$where = $search;

//sort nga funtion sa table
if( $param['order'][0]['column'] !='' ){//default 
	$arrCols = array("",
					"empname",
					"date",
					"",
					"",
					"",
					"shift_status");//mao ra ang mailisan na declare na sa ubos php
	$search=$search." ORDER BY ". $arrCols[$param['order'][0]['column']] ." ".$param['order'][0]['dir'];//default
}


if( (int)$param['length'] >= 0 ){
    $search=$search." LIMIT ".$param['length'];	
}
if( $param['start'] !='' && (int)$param['length'] >= 0 ){
    $search=$search." OFFSET ".$param['start'];
}


$dept = getIdUnit($con,$param['accountid']);




//Get Managers Under person
$ids=0;if( !empty( $dept ) ){
    $arr_id = array();
    $arr 	= getHierarchy($con,$dept);
    array_push( $arr_id, $dept );
    if( !empty( $arr["nodechild"] ) ){
        $a = getChildNode($arr_id, $arr["nodechild"]);
        if( !empty($a) ){
            foreach( $a as $v ){
                array_push( $arr_id, $v );
            }
        }
    }
    if( count($arr_id) == 1 ){
        $ids 			= $arr_id[0];
    }else{
        $ids 			= implode(",",$arr_id);
    }
}


$Qry = new Query();	
$Qry->table     = "vw_shift_application";
$Qry->selected  = "*";
//$Qry->fields    = "sa.stat=3 AND de.idunit IN (".$ids.") ".$search;
$Qry->fields    = "id>0 ".$search;

$rs = $Qry->exe_SELECT($con);
$recFiltered = getTotalRows($con,$ids,$where);
if(mysqli_num_rows($rs)>= 1){
    $data = array( 
        "draw"=> $param['draw'],
        "recordsTotal"=> mysqli_num_rows($rs),
        "recordsFiltered"=> $recFiltered,
        "qry"=>$Qry->fields,
        "data"=>array()
    );
    
    while($row=mysqli_fetch_array($rs)){
        $data["data"][] = array(     
            'id'                =>$row['id'],       
			'date'			    => $row['date'],	
            'docnumber'     	=> $row['docnumber'],
            'empname'   		=> $row['empname'],
			'shift_old'    		=> $row['oldshift'],
            'shift_name'    	=> $row['newshift'],				
			'shift_status'		=> ucwords(strtolower($row['shift_status'])),
			'remarks'			=> $row['remarks']
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

function getTotalRows($con,$ids,$search){
	$Qry = new Query();	
	$Qry->table ="vw_shift_application";
	$Qry->selected ="*";
	//$Qry->fields ="sa.stat=3 AND de.idunit IN (".$ids.") ".$search;
	$Qry->fields ="id>0 ".$search;
	$rs = $Qry->exe_SELECT($con);
	return mysqli_num_rows($rs);
}



?>