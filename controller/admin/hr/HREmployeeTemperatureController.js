app.controller('HREmployeeTemperatureController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			empTempPage:'1'
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
	$scope.emptemp_func = function (){
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/hr/report/viewEmpTemp.php',urlData)
		.then( function (response, status){						
			var data 		= response.data;

			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.empTempView = [];

			}else{
				$scope.empTempView = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});


	}

	//Search Function
	$scope.unitSearch= function(){
		$scope.filter = '';
		var urlData = {
			'empid'			:$scope.emp,
			'emptemp'		:$scope.emptemp,
			'department' 	:$scope.department,
			'dfrom'			:$scope.dfrom,
			'dto'			:$scope.dto,
		}
		$http.post(apiUrl+"admin/hr/report/searchEmpTemp.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.empTempView = data;

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
					$scope.filter = 'Department Name ';
				}
			}

			if($scope.emptemp == '' || $scope.emptemp == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Temperature ';
				}else{
					$scope.filter = 'Temperature ';
				}
			}

			if($scope.dfrom == '' || $scope.dfrom == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Date From: ' + $scope.dfrom;
				}else{
					$scope.filter = 'Date From: ' + $scope.dfrom;
				}
			}
			
			if($scope.dto == '' || $scope.dto == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Date To: ' + $scope.dto;
				}else{
					$scope.filter = 'Date To: ' + $scope.dto;
				}
			}

  
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	//Refresh Page
	$scope.reloadData = function(){
		$scope.filter	 	='';
		$scope.emp			='';
		$scope.emptemp		='';
		$scope.department	='';
		$scope.dfrom		='';
		$scope.dto			='';


		$scope.emptemp_func();

	}

	//Reset Search
	$scope.resetsearch = function(){
		$scope.filter	 	='';
		$scope.emp			='';
		$scope.emptemp		='';
		$scope.department	='';
		$scope.dfrom		='';
		$scope.dto			='';


		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);

	}

	//EXPORT FUNCTION
	$scope.export = function () {
		var emp			= typeof $scope.emp === "undefined" ? '' : $scope.emp  ;
		var emptemp		= typeof $scope.emptemp === "undefined" ? '' : $scope.emptemp  ;
		var department	= typeof $scope.department === "undefined" ? '' : $scope.department  ;
		var dfrom		= typeof $scope.dfrom === "undefined" ? '' : $scope.dfrom  ;
		var dto			= typeof $scope.dto === "undefined" ? '' : $scope.dto  ;
		var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var filterby		= typeof $("#emptemp_filter").text() === "undefined" ? '' : $("#emptemp_filter").text();
		var url = apiUrl+"admin/hr/report/exportEmpTemp.php?datenow=" + datenow + "&company=" + company + "&emptemp=" + emptemp + "&emp=" + emp + "&department=" + department + "&dfrom=" + dfrom + "&dto=" + dto + "&filterby=" +filterby;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
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
	$rootScope.getCompanyName();
	$rootScope.getAllEmployeeReportFunc();
	$rootScope.allEmployeeDepartmentNameFunc();
	
	$scope.dashboard.setup();
}]);
