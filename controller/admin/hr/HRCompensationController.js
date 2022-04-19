app.controller('HRCompensationController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/hr/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 

	// $scope.emp = null;
	// $scope.post_title = null;
	// $scope.pay_grp = null;
	// $scope.department = null;
	// $scope.job_level = null;
	// $scope.search_hired_date_from = null;
	// $scope.search_hired_date_to = null;
	// $scope.search_reg_date_from = null;
	// $scope.search_reg_date_to = null;
	

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
			joblvl:[],
			dept_choose:'',
			compensationPage:'1',
			pageSize:'10'
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
				$scope.dashboard.values.joblvl 		= data.joblvl;
				$scope.dashboard.values.department 	= data.departments;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
	//getDepartmentSearchDropdown
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}
	
	//Table Function
	$scope.viewCompensationReport = function(){
		$scope.compensationView = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/hr/employee/compensation_view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			$scope.compensationDate = data[0].date;
			$scope.compensationTime = data[0].time;


			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.compensationView = [];

			}else{
				$scope.compensationView = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
	}

	//Search Function
	$scope.searchCompensation = function(){
		$scope.filter = '';
		var urlData = {
			'empid'			 		:$scope.emp,
			'position_title' 		:$scope.post_title,
			'pay_group'		 		:$scope.pay_grp,
			'department'		 	:$scope.department,
			'job_level'		 		:$scope.job_level,
			'search_hired_date_from':$scope.search_hired_date_from,
			'search_hired_date_to'	:$scope.search_hired_date_to,
			'search_reg_date_from'	:$scope.search_reg_date_from,
			'search_reg_date_to'	:$scope.search_reg_date_to,
			'search_labor_type' : $scope.search_labor_type
			// 'search_section'		:$scope.search_section,
			// 'search_salary'			:$scope.search_salary,
			// 'search_monthly_comp'	:$scope.search_monthly_compensation
		}
		$http.post(apiUrl+"admin/hr/report/searchCompensation.php", urlData)
		.then( function (response, status){     
			var data = response.data;


			$scope.compensationView = data;
			$scope.filter = '';
			
			
			//filtered By function
			if($scope.emp == '' || $scope.emp == null){
				$scope.filter = '';
			}else{
				$scope.filter = 'Employee Name';
			}

			if($scope.post_title == '' || $scope.post_title == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Position';
				}else{
					$scope.filter = ' Position';
				}
			}

			if($scope.department == '' || $scope.department == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Department';
				}else{
					$scope.filter = 'Department';
				}
			}

			if($scope.job_level == '' || $scope.job_level == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Job Level';
				}else{
					$scope.filter = 'Job Level';
				}
			}

			if($scope.pay_grp == '' || $scope.pay_grp == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Pay Group';
				}else{
					$scope.filter = 'Pay Group';
				}
			}
			
			if($scope.search_labor_type == '' || $scope.search_labor_type == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Labor Type' ;
				}else{
					$scope.filter += 'Labor Type' ;
				}
			}

			if($scope.search_hired_date_from == '' || $scope.search_hired_date_from == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Hired Date From: ' + $scope.search_hired_date_from;
				}else{
					$scope.filter += 'Hired Date From: ' + $scope.search_hired_date_from;
				}
			}

			if($scope.search_hired_date_to == '' || $scope.search_hired_date_to == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Hired Date To: ' + $scope.search_hired_date_to;
				}else{
					$scope.filter += 'Hired Date To: ' + $scope.search_hired_date_to;
				}
			}

			if($scope.search_reg_date_from == '' || $scope.search_reg_date_from == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Regularization Date From: ' + $scope.search_reg_date_from;
				}else{
					$scope.filter += 'Regularization Date From: ' + $scope.search_reg_date_from;
				}
			}

			if($scope.search_reg_date_to == '' || $scope.search_reg_date_to == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Regularization Date To: ' + $scope.search_reg_date_to;
				}else{
					$scope.filter += 'Regularization Date To: ' + $scope.search_reg_date_to;
				}
			}


  
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	//Reset Search
	$scope.resetsearch = function(){
		$scope.filter	 					='';
		$scope.emp      					='';
		$scope.post_title 					='';
		$scope.pay_grp 						='';
		$scope.search_hired_date_from 		='';
		$scope.search_hired_date_to 		='';
		$scope.search_reg_date_from 		='';
		$scope.search_reg_date_to 			='';
		$scope.department		 			='';
		$scope.job_level		 			='';
		$scope.search_labor_type		 	='';
		

		$timeout(function () {  
		  $("#btn-refreshh").click();
		}, 100);
	}

	//Refresh Page
	$scope.reloadData = function(){
		$scope.filter	 				='';
		$scope.emp       				='';
		$scope.post_title 				='';
		$scope.pay_grp					='';
		$scope.search_hired_date_from 	='';
		$scope.search_hired_date_to 	='';
		$scope.search_reg_date_from 	='';
		$scope.search_reg_date_to 		='';
		$scope.department		 		='';
		$scope.job_level		 		='';
		$scope.search_labor_type		 	='';

		$scope.viewCompensationReport();

	}

	//EXPORT FUNCTION
	$scope.exportReportToExcel = function (eleID) {
		var urlData = {
			'accountid'			: $scope.dashboard.values.accountid,
			'emp'				: $scope.emp,
			'department'		: $scope.department,
			'post_title'		: $scope.post_title,
			'pay_grp'			: $scope.pay_grp,
			'job_level'			: $scope.job_level,
			'search_hired_date_from': $scope.search_hired_date_from,
			'search_hired_date_to'	: $scope.search_hired_date_to,
			'search_reg_date_from'	: $scope.search_reg_date_from,
			'search_labor_type' : $scope.search_labor_type,
			'search_reg_date_to'	: $scope.search_reg_date_to,
			
		}

		$http.post(apiUrl+'admin/hr/report/compensationExport.php',urlData)
		.then( function (response, status){	
			var data = response.data;	
			if(data.status !='empty'){

				//PAGE HEADER
				var page_header = '';
					page_header +=  document.getElementById('compensation_companyName').innerText + '\r\n' +
									document.getElementById('compensation_benefits_txt').innerText + '\r\n' +
									document.getElementById('compensation_benefits_report').innerText + '\r\n' +
									document.getElementById('compensation_date').innerText + '\r\n';

				var jsonData =data;
				var filteredGridData = JSON.parse(JSON.stringify(jsonData));
				var arrData = typeof filteredGridData != 'object' ? JSON.parse(filteredGridData) : filteredGridData;
				var CSV = '';    
				
				//for headers
				var row = "";
				var ctr = 15;
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
					ctr = 15;
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
				
				var fileName = "CompensationReport";			
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
					link.setAttribute("download", "CompensationReport.csv");
					link.click();
				
				}

			}

		}, function(response) {
			$rootScope.modalDanger();
		});




	}

	//SIDE BAR SCROLL
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


	//export to excel function old
	// $scope.export = function () {
	

	// 	var emp   = typeof $scope.emp    === "undefined" ? '' : $scope.emp;
	// 	var post_title   = typeof $scope.post_title    === "undefined" ? '' : $scope.post_title;
	// 	var pay_grp   = typeof $scope.pay_grp    === "undefined" ? '' : $scope.pay_grp;
	// 	var department   = typeof $scope.department    === "undefined" ? '' : $scope.department;
	// 	var job_level   = typeof $scope.job_level    === "undefined" ? '' : $scope.job_level;
	// 	var search_hired_date_from   = typeof $scope.search_hired_date_from    === "undefined" ? '' : $scope.search_hired_date_from;
	// 	var search_hired_date_to   = typeof $scope.search_hired_date_to    === "undefined" ? '' : $scope.search_hired_date_to;
	// 	var search_reg_date_from   = typeof $scope.search_reg_date_from    === "undefined" ? '' : $scope.search_reg_date_from;
	// 	var search_reg_date_to   = typeof $scope.search_reg_date_to    === "undefined" ? '' : $scope.search_reg_date_to;


	// 	var url = apiUrl+"admin/hr/report/compensationExport.php?empid="+emp+"&position_title="+post_title+"&pay_group="+pay_grp+"&department="+department+"&job_level="+job_level+"&search_hired_date_from="+search_hired_date_from+"&search_hired_date_to="+search_hired_date_to+"&search_reg_date_from="+search_reg_date_from+"&search_reg_date_to="+search_reg_date_to;

	// 	var conf = confirm("Export user to CSV?");
	// 	if(conf == true)
	// 	{
	// 		window.open(url, '_blank');
	// 	}
	
	// } 
	




	$rootScope.getAllEmployeeReportFunc();
	$rootScope.getCompanyName();
	$rootScope.allEmployeePositionTitleFunc();
	$rootScope.allEmployeeDepartmentNameFunc();

	
	$scope.dashboard.setup();
}]);
