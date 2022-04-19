app.controller('HRresignDetailController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/hr/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	
		
	$scope.dashboard = {
		values: {
			loggedid	: $cookieStore.get('acct_id'),
			accountid	: $cookieStore.get('acct_id'),
			accteid		: $cookieStore.get('acct_eid'),
			accouttype	: $cookieStore.get('acct_type'),	
			accoutfname	: $cookieStore.get('acct_fname'),
			accoutlname	: $cookieStore.get('acct_lname'),
			acct_loc	: $cookieStore.get('acct_loc'),	
			userInformation: null,
			accounts:[],
			leaves:[],
			period:[],
			daterange:'',
			late_tbl: [],
			absent_tbl:[],
			late_details:[],
			absent_details:[],
			present_tbl:[],
			present_details:[],
			leaves_tbl:[],
			applications_data:[],
			bdates:[],
			dept_ctr:[],
			dept_choose:'',
			pageSize:'10',
			resignDetailPage:'1'
		},
		active: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'tmsmems/loggedinuser.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				if(data.status=='error'){	
					$rootScope.modalDanger();
				}else{
					$scope.dashboard.values.userInformation = data;
				}					
			}, function(response) {
				$rootScope.modalDanger();
			});	
		},
		setup: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/setup/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.accounts 	= data.accounts;	
				$scope.dashboard.values.leaves		= data.leaves;
				$scope.dashboard.values.period		= data.period;
				$scope.dashboard.values.department 	= data.departments;
				$scope.dashboard.values.daterange	= moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY') + ' - ' + moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY');
				
					$("#picker1").daterangepicker({
						startDate: moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY'),
						endDate: moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY'),
						locale: {
						  cancelLabel: 'Clear',
						  format: 'MM/DD/YYYY'
						}
					});
					$("#picker1").on('apply.daterangepicker', function(ev, picker) {
						$timeout(function () {	
							// $scope.attendance_counter();
							// $scope.dept_attendance_ctr();
							//$scope.applications_functions();
							return;
						}, 100);
					});
					$("#picker1").on('cancel.daterangepicker', function(ev, picker) {
						$timeout(function () {	
							var dateText = moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY') + ' - ' + moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY');
							$("#picker1").val(dateText);	
							$scope.dashboard.values.daterange	= dateText;
							// $scope.attendance_counter();
							// $scope.dept_attendance_ctr();
							//$scope.applications_functions();
							return;
						}, 100);
						
					});
					// $scope.attendance_counter();
					// $scope.birthdate_update();
					// $scope.dept_attendance_ctr();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
	//getDepartmentSearchDropdown
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}
	
	//Table Funtion
	$scope.resignDetailReport = function (){

		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,

		}

		$http.post(apiUrl+'admin/hr/report/resignDetailView.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			$scope.resignDetailDate = data[0].date;
			$scope.resignDetailTime = data[0].time;


			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.resignDetailView = [];

			}else{
				$scope.resignDetailView = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});


	}

	//Search Function
	$scope.searchResignDetailEmployees= function(){
		$scope.filter = '';
		var urlData = {
			'empid'				:$scope.emp,
			'hired_from'		:$scope.hired_from,
			'hired_to'			:$scope.hired_to,
			'resigned_from'		:$scope.resigned_from,
			'resigned_to'		:$scope.resigned_from,
			'position'			:$scope.position,
			'department'		:$scope.department,
		}
		$http.post(apiUrl+"admin/hr/report/searchResignDetailEmployees.php", urlData)
		.then( function (response, status){     
			var data = response.data;


			$scope.resignDetailView = data;
			$scope.filter = '';
			//filtered By function
			if($scope.emp == '' || $scope.emp == null){
				$scope.filter = '';
			}else{
				$scope.filter = 'Employee Name/ID ';
			}

			if($scope.department == '' || $scope.department == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Department Name ';
				}else{
					$scope.filter = 'Department Name';
				}
			}

			if($scope.position == '' || $scope.position == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Position Title ';
				}else{
					$scope.filter = 'Position Title ';
				}
			}

			if($scope.hired_from == '' || $scope.hired_from == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Hired Date From: ' + $scope.hired_from;
				}else{
					$scope.filter = 'Hired Date From: ' + $scope.hired_from;
				}
			}

			if($scope.hired_to == '' || $scope.hired_to == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Hired Date To: ' + $scope.hired_to;
				}else{
					$scope.filter = 'Hired Date To: ' + $scope.hired_to;
				}
			}
			/*
			if($scope.resigned_from == '' || $scope.resigned_from == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And End Date From: ' + $scope.resigned_from;
				}else{
					$scope.filter = 'End Date From: ' + $scope.resigned_from;
				}
			}

			if($scope.resigned_to == '' || $scope.resigned_to == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And End Date To: ' + $scope.resigned_to;
				}else{
					$scope.filter = 'End Date To: ' + $scope.resigned_to;
				}
			}
			*/
  
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	//Refresh Page
	$scope.reloadData = function(){
		$scope.filter	 	='';
		$scope.emp       	='';
		$scope.hired_from ='';
		$scope.hired_to    ='';
		$scope.resigned_from ='';
		$scope.resigned_to ='';
		$scope.position ='';
		$scope.department ='';

		$scope.resignDetailReport();

	}

	//Reset Search
	$scope.resetsearch = function(){
		$scope.filter	 	='';
		$scope.emp      	='';
		$scope.hired_from ='';
		$scope.hired_to    ='';
		$scope.resigned_from ='';
		$scope.resigned_from ='';
		$scope.position ='';
		$scope.department ='';

		$timeout(function () {  
		  $("#btn-refreshh").click();
		}, 100);
	}

	//EXPORT FUNCTION
	$scope.exportReportToExcel = function (eleID) {
		var urlData = {
			'accountid'	 	: $scope.dashboard.values.accountid,
			'empid' 		: $scope.emp,
			'dept_code' 	: $scope.department_code,
			'department' 	: $scope.department,
			'position' 		: $scope.position,
			'hired_from' 	: $scope.hired_from,
			'hired_to'   	: $scope.hired_to,
			'resigned_from' : $scope.resigned_from,
			'resigned_to'   : $scope.resigned_to,

		}


		$http.post(apiUrl+'admin/hr/report/resignedEmployeeExport.php',urlData)
		.then( function (response, status){	
			var data = response.data;	
			if(data.status !='empty'){

				//PAGE HEADER
				var page_header = '';
					page_header +=  document.getElementById('resigned_employees_company_name').innerText + '\r\n' +
									document.getElementById('resigned_employees_report').innerText + '\r\n' +
									document.getElementById('resigned_employees_filter').innerText + '\r\n' +
									document.getElementById('resigned_employees_from_to').innerText + '\r\n' +
									document.getElementById('resigned_employees_report_generated').innerText + '\r\n';
						
									
				var jsonData =data;
				var filteredGridData = JSON.parse(JSON.stringify(jsonData));
				var arrData = typeof filteredGridData != 'object' ? JSON.parse(filteredGridData) : filteredGridData;
				var CSV = '';    
				
				//for headers
				var row = "";
				var ctr = 8;
					for (var index in arrData[0]) {
						if(ctr >= 1 ){
							row += index.toUpperCase() + ',';
						}
						ctr=ctr-1;
					}
				row = row.slice(0, -1);
				CSV += row + '\r\n';
				
				//1st loop is to extract each row
				for (var i = 0; i < arrData.length; i++) {
					var row = "";
					//2nd loop will extract each column and convert it in string comma-seprated
					ctr = 8;
					for (var index in arrData[i]) {
						if(ctr >= 1 ){
							if( arrData[i][index] == null || arrData[i][index]==""){
								arrData[i][index] = "";
							}
							row += '"' + arrData[i][index] + '",';
						}
						ctr=ctr-1;
					}
					row.slice(0, row.length - 1);
					//add a line break after each row
					CSV += row + '\r\n';
				}

				if (CSV == '') {        
					alert("Invalid data");
					return;
				}
				
				var fileName = "ResignedEmployeeReport";			
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
					var IEwindow = window.open();
					IEwindow.document.write('sep=,\r\n' + CSV);
					IEwindow.document.close();
					IEwindow.document.execCommand('SaveAs', true, fileName + ".csv");
					IEwindow.close();
				} else {
					var csv = page_header + CSV;
					var link = document.createElement("a");
					link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv));
					link.setAttribute("download", "ResignedEmployeeReport.csv");
					link.click();
				}

			}




		}, function(response) {
			$rootScope.modalDanger();
		});




	}


	$(document).ready(function () {
		if ($("body").hasClass("sidebar-collapse")) {
			$('.sidebar').removeClass("sidebar1280")
		} else {
			$('.sidebar').addClass('sidebar1280')
		}
	});
	
	$scope.toggleside = function () {
		if ($("body").hasClass("sidebar-collapse")) {
			$('.sidebar').addClass('sidebar1280')
		} else {
			$('.sidebar').removeClass("sidebar1280")
		}
	}


	// //export to excel function
	// $scope.export = function () {
    
	// 	var emp   = typeof $scope.emp    === "undefined" ? '' : $scope.emp;
	// 	var position   = typeof $scope.position    === "undefined" ? '' : $scope.position;
	// 	var department   = typeof $scope.department    === "undefined" ? '' : $scope.department;
	// 	var hired_from   = typeof $scope.hired_from    === "undefined" ? '' : $scope.hired_from;
	// 	var hired_to   = typeof $scope.hired_to    === "undefined" ? '' : $scope.hired_to;
	// 	var resigned_from   = typeof $scope.resigned_from    === "undefined" ? '' : $scope.resigned_from;
	// 	var resigned_to   = typeof $scope.resigned_to    === "undefined" ? '' : $scope.resigned_to;
			
	// 	var url = apiUrl+"admin/hr/report/resignedEmployeeExport.php?empid="+emp+"&position="+position+"&department="+department+"&hired_from="+hired_from+"&hired_to="+hired_to+"&resigned_from="+resigned_from+"&resigned_to="+resigned_to;
	
	// 	var conf = confirm("Export user to CSV?");
	// 		  if(conf == true)
	// 		  {
	// 			  window.open(url, '_blank');
	// 		  }
	
	// } 


	$rootScope.getCompanyName();
	$rootScope.getAllEmployeeReportFunc();
	$rootScope.allEmployeePositionTitleFunc();
	$rootScope.allEmployeeDepartmentNameFunc();


	$scope.dashboard.setup();
}]);
