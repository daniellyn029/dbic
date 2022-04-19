<?php
require_once('../../../activation.php');
$conn = new connector();	
$con = $conn->connect();
require_once('../../../classPhp.php'); 

$param = json_decode(file_get_contents('php://input'));
$date=SysDate();
$time=SysTime();
$return = null;	
$data = array();

if( !empty($param->accountid) ){
	
	$Qry 			= new Query();	
	$Qry->table     = "vw_data_timesheet AS a LEFT JOIN vw_dataemployees AS b ON a.empID = b.id";
	$Qry->selected  = "b.business_unit AS unit,COUNT(b.idunit) AS ctr";
	if( !empty($param->info->classi) ){
		$dept = $param->info->classi;
		$arr_id = array();
		$arr    = getHierarchy($con, $dept);
		array_push($arr_id, $dept);
		if (!empty($arr["nodechild"])) {
			$a = getChildNode($arr_id, $arr["nodechild"]);
			if (!empty($a)) {
				foreach ($a as $v) {
					array_push($arr_id, $v);
				}
			}
		}
		if (count($arr_id) == 1) {
			$ids = $arr_id[0];
		} else {
			$ids = implode(",", $arr_id);
		}
		$Qry->fields    = "a.id IS NOT NULL AND b.idunit IN (".$ids.") AND a.work_date BETWEEN '".$param->info->sdate."' AND '".$param->info->fdate."'  GROUP BY b.idunit ORDER BY COUNT(b.idunit) DESC";
	}else{
		$Qry->fields    = "a.id IS NOT NULL AND a.work_date BETWEEN '".$param->info->sdate."' AND '".$param->info->fdate."'  GROUP BY b.idunit ORDER BY COUNT(b.idunit) DESC";
	}
	$rs				= $Qry->exe_SELECT($con);
	if(mysqli_num_rows($rs)>=1){
		$ctr=0;
		while($row=mysqli_fetch_array($rs)){
			$ctr= $ctr + $row['ctr'];
			$data[] = array(
				"name" => $row['unit'],
				"ctr"  => $row['ctr'],
				"sum"  => $ctr
			);
		}
	}
}
$return = json_encode($data);

print $return;
mysqli_close($con);

?>