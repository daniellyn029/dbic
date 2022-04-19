app.controller('TKLeaveBalanceController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
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
			joblvl:[],
			dept_choose:'',
			pageSize:'10',
			Pages:'1'
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
	//getDepartmentSearchDropdown Costumized classification(filter)
	// $scope.typeLimit = function( o ){
	// 	return o.unittype != 1 && o.unittype != 6;
	// }

	//Table Funtion
	$scope.leavebalance_func = function (){
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}

		$http.post(apiUrl+'admin/tk/report/leavebalance/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			$scope.datenow = data[0].date;
			$scope.timenow = data[0].time;


			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.leavebal_view = [];

			}else{
				$scope.leavebal_view = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});


	}

	//Search Function
	$scope.search= function(){
		$scope.filter = '';
		var urlData = {
			'empid'			:$scope.emp,
			'department' 	:$scope.department
			
		}
		$http.post(apiUrl+"admin/tk/report/leavebalance/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.leavebal_view = data;

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

	
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}


	//Refresh Page
	$scope.reloadData = function(){
		$scope.filter	 		='';
		$scope.emp       		='';
		$scope.department 		='';

		$scope.leavebalance_func();

	}

	//Reset Search
	$scope.resetSearch = function(){
		$scope.filter	 		='';
		$scope.emp       		='';
		$scope.department 		='';


		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);

	}

	//Export
	$scope.export = function () {
		var idsuperior	= typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid;
		var emp			= typeof $scope.emp === "undefined" ? '' : $scope.emp  ;
		var department	= typeof $scope.department === "undefined" ? '' : $scope.department  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/tk/report/leavebalance/export.php?idsuperior=" + idsuperior + "&emp=" + emp + "&department=" + department + "&company=" + company + "&datenow=" + datenow;	
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}

	//Sidebar ScrollBar
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
	$scope.dashboard.setup();
}]);
