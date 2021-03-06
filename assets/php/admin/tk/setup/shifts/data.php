<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 

$param = $_POST;
$return = null;	

$search='';
/*
if( !empty( $param['name'] ) ){ $search=" AND name like   '%".$param['name']."%' "; }
if( !empty( $param['alias'] ) ){ $search=" AND alias like   '%".$param['alias']."%' "; }
*/
$where = $search;

if( $param['length'] !='' ){
    $search=$search." LIMIT ".$param['length'];	
}
if( $param['start'] !='' ){
    $search=$search." OFFSET ".$param['start'];
}

$Qry = new Query();	
$Qry->table     = "tblshift";
$Qry->selected  = "*";
$Qry->fields    = "id>0 ".$search;
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
        $paidbreaks = explode(",", $row['paidbreaks']);
        $pdbreaks ='';

        foreach($paidbreaks as $key => $value) {    
           if($value == 1){
               if($key == 0){
                $pdbreak = '<input type="checkbox" name="pdbreaks'.$row['id'].'[]" checked>AM ';
               }
               if($key == 1){
                $pdbreak = '<input type="checkbox" name="pdbreaks'.$row['id'].'[]" checked>NOON ';
               }
               if($key == 2){
                $pdbreak = '<input type="checkbox" name="pdbreaks'.$row['id'].'[]" checked>PM ';
               }
           }else{
                if($key == 0){
                $pdbreak = '<input type="checkbox" name="pdbreaks'.$row['id'].'[]">AM ';
               }
               if($key == 1){
                $pdbreak = '<input type="checkbox" name="pdbreaks'.$row['id'].'[]">NOON ';
               }
               if($key == 2){
                $pdbreak = '<input type="checkbox" name="pdbreaks'.$row['id'].'[]">PM ';
               }
           }

           $pdbreaks = $pdbreaks . $pdbreak;
        }

        $data["data"][] = array(
            'id'    	=> $row['id'],
            'name'  	=> $row['name'],
            'stime' 	=> ( is_null($row['stime']) ? '' : date("h:i:s A",strtotime($row['stime'])) ),
            'ftime'		=> ( is_null($row['ftime']) ? '' : date("h:i:s A",strtotime($row['ftime'])) ),
            'ambstart' 	=> ( is_null($row['ambreakin']) ? '' : date("h:i:s A",strtotime($row['ambreakin'])) ),
            'ambend'	=> ( is_null($row['ambreakout']) ? '' : date("h:i:s A",strtotime($row['ambreakout'])) ),
			'breakin' 	=> ( is_null($row['breakin']) ? '' : date("h:i:s A",strtotime($row['breakin'])) ),
            'breakout'	=> ( is_null($row['breakout']) ? '' : date("h:i:s A",strtotime($row['breakout'])) ),
            'pmbstart' 	=> ( is_null($row['pmbreakin']) ? '' : date("h:i:s A",strtotime($row['pmbreakin'])) ),
            'pmbend'	=> ( is_null($row['pmbreakout']) ? '' : date("h:i:s A",strtotime($row['pmbreakout'])) ),
            'pdbreak'	=> $pdbreaks,
            'stype'	    =>$row['stype'],
			'isdefault'	=> $row['isdefault']
        );
    }
    $return =  json_encode($data);
}else{
    $data = array( 
        "draw"=> $param['draw'],
        "recordsTotal"=> mysqli_num_rows($rs),
        "recordsFiltered"=> mysqli_num_rows($rs),
        "data"=>array()
    );
    $return =  json_encode($data);
}

print $return;
mysqli_close($con);

function getTotalRows($con,$search){
	$Qry = new Query();	
	$Qry->table ="tblshift";
	$Qry->selected ="*";
	$Qry->fields ="id > 0 ".$search;
	$rs = $Qry->exe_SELECT($con);
	return mysqli_num_rows($rs);
}

?>