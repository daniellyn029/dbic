<?php
require_once('../../../activation.php');
$param = json_decode(file_get_contents('php://input'));
$conn = new connector();
if( (int)$param->conn == 1 ){	
	$con = $conn->connect();
}else{
	$varcon = "connect".(int)$param->conn;
	$con = $conn->$varcon();
	$concorp = $conn->connect();
}

require_once('../../../classPhp.php'); 
$data = array();

$Qry = new Query();	
$Qry->table     = "vw_datacompanyinfo";
$Qry->selected  = "*";
$Qry->fields    = "id>0";
$rs = $Qry->exe_SELECT($con);
if(mysqli_num_rows($rs)>= 1){
    if($row=mysqli_fetch_array($rs)){
        $img_prof = null;
		if( (int)$param->conn == 1 ){
			if( !file_exists((int)$row['id'].".jpg") ){
				$img_prof = "assets/images/undefined.jpg?".time();
			}else{
				$img_prof = 'assets/php/admin/org/company/'.(int)$row['id'].".jpg?".time();
			} 
		}else{
			$external_link = getdbUrl($concorp,$param->conn)."assets/php/admin/org/company/".(int)$row['id'].".jpg?".time();
			if (@getimagesize($external_link)) {
				$img_prof = $external_link;
			} else {
				$img_prof = "assets/images/undefined.jpg?".time();
			}
		}
		
		
        $data = array( 
            "id"            => $row['id'],
            "name" 	        => $row['name'],
			"profile"		=> $row['profile'],
            "alias" 	    => $row['alias'], 
			"email"			=> $row['email'], 
            "cnumber" 	    => $row['cnumber'],
            "fnumber" 	    => $row['fnumber'],
            "website" 	    => $row['website'],
            "idbir" 	    => $row['idbir'],
            "idsss" 	    => $row['idsss'],
            "idibig" 	    => $row['idibig'],
            "idhealth" 	    => $row['idhealth'],
            "idtype" 	    => $row['idtype'],
            "comptype" 	    => $row['comptype'],
            "idind" 	    => $row['idind'],
            "compind" 	    => $row['compind'],
            "idsize" 	    => $row['idsize'],
            "compsize" 	    => $row['compsize'],
            "pic"           => $img_prof,
            "addr_bldg"     => $row['addr_bldg'],
            "addr_street"   => $row['addr_street'],
            "addr_brgy"     => $row['addr_brgy'],
            "addr_city"     => $row['addr_city'],
            "addr_prov"     => $row['addr_prov'],
            "addr_code"     => $row['addr_code'],
            "mission"       => $row['mission'],
            "vision"        => $row['vision'],
            "picFile"       => ''
        );
    }
}else{
    $img_prof = "assets/images/undefined.jpg?".time();
    $data = array( 
        "id"        => '',
        "name" 	    => '',
		"profile"	=> '',
		"email"		=> '',
        "alias" 	=> '',
        "address" 	=> '',
        "cnumber" 	=> '',
        "fnumber" 	=> '',
        "website" 	=> '',
        "idbir" 	=> '',
        "idsss" 	=> '',
        "idibig" 	=> '',
        "idhealth" 	=> '',
        "idtype" 	=> '',
        "comptype" 	=> '',
        "idind" 	=> '',
        "compind" 	=> '',
        "idsize" 	=> '',
        "compsize" 	=> '',
        "pic"       => $img_prof,
        "picFile"   => ''
    );
}
        
$return = json_encode($data);

print $return;
mysqli_close($con);
?>