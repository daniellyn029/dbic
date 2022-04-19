<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php');

    $param = json_decode(file_get_contents('php://input'));

    $arr_id = array();

    if($param->type==2){
        $idunits = getTblUnits($con, $param->accountid);
        foreach( $idunits AS $value ){
            $dept = $value;
            $ids=0;if( !empty( $dept ) ){
                $arr 	= getHierarchy($con,$dept);
                array_push( $arr_id, $dept );
                if( !empty( $arr["nodechild"] ) ){
                    $a = getChildNode($arr_id, $arr["nodechild"]);
                    if( !empty($a) ){
                        foreach( $a AS $v ){
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
    
        }
    }else if($param->type==1){
        $dept = getIdUnit($con,$param->accountid);
        $ids=0;if( !empty( $dept ) ){
            $arr 	= getHierarchy($con,$dept);
            array_push( $arr_id, $dept );
            if( !empty( $arr["nodechild"] ) ){
                $a = getChildNode($arr_id, $arr["nodechild"]);
                if( !empty($a) ){
                    foreach( $a AS $v ){
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
    }

    $Qry=new Query();
    $Qry->table="vw_data_timesheet AS a";
    $Qry->selected="DISTINCT a.work_date";
    $Qry->fields="(a.work_date BETWEEN '".$param->datefrom."' AND '".$param->dateto."') ORDER BY CONCAT(a.work_date) ASC";
    $rs=$Qry->exe_SELECT($con);
    //echo $Qry->fields;
    if(mysqli_num_rows($rs)>=1){
        $array1 = array();
        $array2 = array();
        while($row=mysqli_fetch_array($rs)){

            //array_push($array1, $row['work_date']);
            
            $array1[] = array(
                'work_date' => $row['work_date'],
            );

        }
        
    }else{
        $return = json_encode(array('status'=>'empty'));
    }

    $data = array(
        'work_date' => $array1,
        'employee'  => getQuery($con, $param, $ids)
    );
    $return = json_encode($data);    
print $return;
mysqli_close($con);

function getQuery($con, $param, $ids){
    $data = array();

    if($param->type==1){
        $Qry=new Query();
        $Qry->table="tbldutyroster";
        $Qry->selected="idacct";
        //$Qry->fields="unit='".$param->unit."' AND idstat=0 AND DATE BETWEEN '".$param->datefrom."' AND '".$param->dateto."' AND (secretary!=0 OR secretary is null) GROUP BY idacct";
        $Qry->fields="unit IN (".$ids.") AND (manager!=1 OR manager is null) AND idstat=0 AND DATE BETWEEN '".$param->datefrom."' AND '".$param->dateto."' AND (secretary!=0 OR secretary is null) GROUP BY idacct";
        $rs=$Qry->exe_SELECT($con);
        if(mysqli_num_rows($rs)>=1){
            while($row=mysqli_fetch_array($rs)){
                $data[] = array(
                    "idacct"=> $row['idacct']
                );
            }
        }
    }else if($param->type==2){
        $Qry=new Query();
        $Qry->table="tbldutyroster";
        $Qry->selected="idacct";
        //$Qry->fields="unit='".$param->unit."' AND idstat=0 AND DATE BETWEEN '".$param->datefrom."' AND '".$param->dateto."' AND type_creator=2 GROUP BY idacct";
        $Qry->fields="unit IN (".$ids.") AND (manager!=1 OR manager is null) AND idstat=0 AND DATE BETWEEN '".$param->datefrom."' AND '".$param->dateto."' AND type_creator=2 GROUP BY idacct";
        $rs=$Qry->exe_SELECT($con);
        if(mysqli_num_rows($rs)>=1){
            while($row=mysqli_fetch_array($rs)){
                $data[] = array(
                    "idacct"=> $row['idacct']
                );
            }
        }
    }

    return $data;
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