<?php
require_once('../../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../../classPhp.php'); 


$param = json_decode(file_get_contents('php://input'));
$data  = array();
$date = SysDatePadLeft();

$search ='';

if( !empty( $param->search_acct ) ){ $search=$search." AND idacct 	= '".$param->search_acct."' "; }
if( !empty( $param->search_post ) ){ $search=$search." AND idpos 	= '".$param->search_post."' "; }


$dept = getIdUnit($con,$param->idsuperior);
$ids=0;

//Get Managers Under person
$ids=0;if( !empty( $dept ) ){
    $arr_id = array();
    $arr 	= getHierarchy($con,$dept);
    array_push( $arr_id, 0 );
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
$Qry->table     = "vw_dataemployees AS de LEFT JOIN vw_data_timesheet AS dt ON de.id = dt.empID";
$Qry->selected  = "de.id,de.sexstr,de.idunit,dt.idleave,dt.leavestat, dt.work_date, de.pic, de.empname, de.business_unit, dt.shift_status, dt.in, dt.out,dt.shiftin,dt.shiftout,dt.temp";
$Qry->fields    = "de.id != '".$param->idsuperior."' AND dt.shift_status IS NOT NULL AND dt.work_date = '".$date."' AND (de.idunit IN (".$ids.") OR de.idsuperior='".$param->idsuperior."' )".$search;
$rs = $Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>= 1){ 
    while($row=mysqli_fetch_array($rs)){

        $absent='';
        $sl='';
        $vl='';
        $lwop='';
        $spl='';
        $pl='';
        $spel='';
        $bl='';
        $el='';
        $mcl='';
        $berl='';
        $ml='';
        $late='';

        if(strtotime($row['in']) == '' || strtotime($row['in']) == null && strtotime($row['out']) == '' || strtotime($row['out']) == null) {
            $absent = 'Absent';
        }
        if(strtotime($row['in']) > strtotime($row['shiftin'])) {
            $late = $row['in'];
        }
        if($row['idleave'] == '1' && $row['leavestat'] == '1') {
            $sl = 'Sick Leave';
        }
        if($row['idleave'] == '2' && $row['leavestat'] == '1') {
            $vl = 'Vacation Leave';
        }
        if($row['idleave'] == '3' && $row['leavestat'] == '1') {
            $lwop = 'Leave Without Pay';
        }
        if($row['idleave'] == '4' && $row['leavestat'] == '1') {
            $spl = 'Solo Parent Leave';
        }
        if($row['idleave'] == '6' && $row['sexstr'] == 'MALE' && $row['leavestat'] == '1') {
            $pl = 'Paternity Leave';
        }
        if($row['idleave'] == '7' && $row['leavestat'] == '1') {
            $spel = 'Special Leave';
        }
        if($row['idleave'] == '8' && $row['leavestat'] == '1') {
            $bl = 'Birthday Leave';
        }
        if($row['idleave'] == '9' && $row['leavestat'] == '1') {
            $el = 'Emergency Leave';
        }
        if($row['idleave'] == '10' && $row['sexstr'] == 'FEMALE' && $row['leavestat'] == '1') {
            $mcl = 'Magna Carta Leave';
        }
        if($row['idleave'] == '11' && $row['leavestat'] == '1') {
            $berl = 'Bereavement Leave';
        }
        if($row['idleave'] == '12' && $row['sexstr'] == 'FEMALE' && $row['leavestat'] == '1') {
            $mcl = 'Maternity Leave';
        }


        if($row['temp'] > 37.4){
            $temp = '<p style="color:red">'.$row['temp']. ' &deg;C</p>';
        }else if(empty($row['temp'])){
            $temp='';
        }else{
            $temp = '<p>'.$row['temp']. ' &deg;C</p>';
        }


        $data[] = array( 
        "id"        	=> $row['id'],
        "pic"           => $row['pic'],
        "empname" 		=> $row['empname'],
        "temp" 		    => $temp,      
        "post" 		    => $row['business_unit'],
        "shift_status"  => $row['shift_status'],
        "in" 		    => $row['in'],
        "out" 		    => $row['out'],
        "shiftin"         => $row['shiftin'],
        "shiftout"        => $row['shiftout'],
        "absent"          => $absent,
        "sickleave"       => $sl,
        "vacationleave"   => $vl,
        "lwop"            => $lwop,
        "spl"             => $spl,
        "pl"              => $pl,
        "spel"            => $spel,
        "bl"              => $bl,
        "el"              => $el,
        "mcl"             => $mcl,
        "berl"            => $berl,
        "ml"              => $ml,
        "late"              => $late,


        );
        $return = json_encode($data);
    }

}else {

    $return = json_encode(array());
}



$return = json_encode($data);
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




?>