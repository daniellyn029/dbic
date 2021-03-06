<?php
require_once('../../../activation.php');
$param = $_POST;
$conn = new connector();
if( (int)$param['conn'] == 1 ){	
	$con = $conn->connect();
}else{
	$varcon = "connect".(int)$param['conn'];
	$con = $conn->$varcon();
}
require_once('../../../classPhp.php'); 


$return = null;	

$search='';
if( !empty( $param['alias'] ) ){ $search=" AND alias like   '%".$param['alias']."%' "; }
if( !empty( $param['name'] ) ){ $search.=" AND name like   '%".$param['name']."%' "; }
if( strlen($param['stat']) > 0  ){ $search.=" AND isactive  =  '".$param['stat']."' ";    }
if( !empty( $param['utype'] ) ){ $search.=" AND unittype =  '".$param['utype']."' ";   }


$where = $search;

/* //SORTING
if( $param['order'][0]['column'] !=''  ){		
    $cols = array('id','fname','lname','email','type','stat');
    $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir'];		
}
*/

$search=$search." ORDER BY CONCAT(unittype,'-',alias) ASC ";
if( $param['length'] !='' ){
    $search=$search." LIMIT ".$param['length'];	
}
if( $param['start'] !='' ){
    $search=$search." OFFSET ".$param['start'];
}


$Qry = new Query();	
$Qry->table     = "vw_databusinessunits";
$Qry->selected  = "*";
$Qry->fields    = "id>0 AND unittype not in (1,6) ".$search;
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
        $data["data"][] = array(
            'id'        => (int)$row['id'],
            'name'      => $row['name'],
            'alias'     => $row['alias'],
            'idhead'    => $row['idhead'],
            'idunder'   => $row['idunder'],
            'unittype'  => $row['unittype'],
            'isactive'  => $row['isactive'],
            'stype'     => $row['stype'],
            'shead'     => $row['shead'],
            'stat'      => ucwords(strtolower($row['stat']))
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
	$Qry->table ="vw_databusinessunits";
	$Qry->selected ="*";
	$Qry->fields ="id > 0 AND unittype not in (1,6) ".$search;
	$rs = $Qry->exe_SELECT($con);
	return mysqli_num_rows($rs);
}

?>