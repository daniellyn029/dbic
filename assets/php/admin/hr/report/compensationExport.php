<?php 
 	require_once('../../../activation.php');
    require_once('../../../classPhp.php');
    $conn = new connector();
    $con = $conn->connect();
	// $param = $_GET;
	$param = json_decode(file_get_contents('php://input'));
	$date=SysDate();

	$search='';

	if( !empty( $param->emp ) ){ $search=$search." AND empid like 	'%".$param->emp."%' "; }
	//Search Department
    if( !empty( $param->department ) ){
        $arr_id = array();
        $arr 	= getHierarchy($con,$param->department);
        array_push( $arr_id, $param->department );
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
        $search.=" AND idunit in (".$ids.") "; 
    }
	if( !empty( $param->search_labor_type ) ){ $search=$search." AND labor_type = '".$param->search_labor_type."' "; }
	if( !empty( $param->post_title ) ){ $search=$search." AND post like   '%".$param->post_title."%' "; }
	if( !empty( $param->pay_grp ) ){ $search=$search." AND pay_grp like   '%".$param->pay_grp."%' "; }
	if( !empty( $param->job_level ) ){ $search=$search." AND joblvl like   '%".$param->job_level."%' "; }
	// if( !empty( $param['SECTION ) ){ $search=$search." AND pay_grp like   '%".$param['SECTION."%' "; }
	
	// //HIRED SEARCH
	if( !empty( $param->search_hired_date_from ) && empty( $param->search_hired_date_to )){
		$search=$search." AND hdate BETWEEN DATE('".$param->search_hired_date_from."') AND DATE('".$param->search_hired_date_from."') ";
	}
	
	if( !empty( $param->search_hired_date_from ) && !empty( $param->search_hired_date_to ) ){
		$search=$search." AND hdate BETWEEN DATE('".$param->search_hired_date_from."') AND DATE('".$param->search_hired_date_to."') ";
	}

	// //REGULARIZATION SEARCH
	if( !empty( $param->search_reg_date_from ) && empty( $param->search_reg_date_to )){
		$search=$search." AND rdate BETWEEN DATE('".$param->search_reg_date_from."') AND DATE('".$param->search_reg_date_from."') ";
	}
	
	if( !empty( $param->search_reg_date_from ) && !empty( $param->search_reg_date_to ) ){
		$search=$search." AND rdate BETWEEN DATE('".$param->search_reg_date_from."') AND DATE('".$param->search_reg_date_to."') ";
	}

	
	//$name23 = array();
	$Qry = new Query();	
	$Qry->table     = "vw_dataemployees";
	$Qry->selected  = "*";
	$Qry->fields    = "id>0 ".$search;
	$where = $Qry->fields;	
	$rs = $Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>= 1){
		while($row=mysqli_fetch_array($rs)){
			
			//Format date for display
			$hired_date_format=date_create($row['hdate']);

			if(!empty($row['rdate'])){
				$reg_date_format=date_create($row['rdate']);
				$reg_date_format=date_format($reg_date_format,"m/d/Y ");
			}else{
				$reg_date_format = '';
			}

			
			$getCompAllowance = getCompAllowance($con, $row['id']);
			$str = '';
			$str1 = '';
			$ctr = 1;
			
			if($getCompAllowance){
				foreach($getCompAllowance as $val){
					$str=$str . $ctr . ". " . $val['description']."\n";
					$str1=$str1 . $ctr . ". " . $val['amt']."\n";
					$ctr++;
				}
			}


			$data[] = array(
							"EMPLOYEE ID"  			=> $row['empid'],							
							"EMPLOYEE NAME"  		=> ucwords(strtolower($row['empname'])),
							"POSITION TITLE"  		=> ucwords(strtolower(utf8_decode($row['post']))),
							"JOB LEVEL"  			=> $row['joblvl'],
							"PAY GROUP"  			=> ucwords(utf8_decode($row['pay_grp'])),
							"LABOR TYPE" 			=> ucwords(utf8_decode($row['labor_type'])),
							"HIRED DATE"  			=> date_format($hired_date_format,"m/d/Y"), 
                            "REGULARIZATION DATE"   => $reg_date_format,
							"DEPARTMENT NAME" 		=> ucwords(strtolower(utf8_decode($row['business_unit']))),
							"SALARY "  				=> number_format($row['salary'], 2, '.', ','),
							// "RICE ALLOWANCE"  		=> number_format($row['riceallowance'], 2, '.', ','),
							// "CLOTHING ALLOWANCE"  	=> number_format($row['clothingallowance'], 2, '.', ','),
							// "LAUNDRY ALLOWANCE"  	=> number_format($row['laundryallowance'], 2, '.', ','),
							"type of allowance"  		=> $str,
							"amount"					=> $str1,
							"TOTAL MONTHLY ALLOWANCE" => $row['tot_compensation'],
							"ANNUAL GROSS COMPENSATION" => $row['annual_gross']
				
                    );
		}
		$return = json_encode($data);
	}else{
		$return = json_encode(array('status'=>'empty'));
	}

print $return;	
mysqli_close($con);



function getCompAllowance($con, $accountid){
	$Qry=new Query(); 
	$data=array();
    $Qry->table="tblacctallowance LEFT JOIN tblallowance ON tblacctallowance.idallowance = tblallowance.id";
    $Qry->selected="*";
    $Qry->fields="tblacctallowance.id>0  AND idacct='".$accountid."'";
    $rs=$Qry->exe_SELECT($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

			$data[] = array( 
				"id"            => $row['id'],
                "idacct"        => $row['idacct'],
                "description"   => $row['description'],
                // "idmethod"      => $row['idmethod'] ? $row['idmethod'] : '1',
                "amt"           => $row['amt'] ? number_format($row['amt'],2) : '0.00',
			);
        }
    }
    return $data;
}


?>