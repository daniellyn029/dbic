app.controller('MNGAttendanceTodayController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/mng/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	$scope.search = [];
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
			pageSize:'10',
			attendancetodayPage:'1'
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
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 

	//Table Function
	$scope.attendance_func = function(){
		
		$scope.attendace_today_view = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/mng/comprehensive/attendance/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;
			
			//Get Attendance Today DAte
			var today = new Date();
			var dd = today.getDate();
	
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear();
			if(dd<10) 
			{
			    dd='0'+dd;
			} 
	
			if(mm<10) 
			{
			    mm='0'+mm;
			} 
	
			var date = yyyy+'-'+mm+'-'+dd;
			//END
			
			$scope.today = date;

			// $scope.awardsReceivedTime = data[0].time;


			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.attendace_today_view = [];

			}else{
				$scope.attendace_today_view = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
	}

	//Refresh Page
	$scope.refresh = function(){

		$scope.search.acct	='';
		$scope.search.post ='';

		$scope.attendance_func();

	}

	//Reset Search
	$scope.resetsearch = function(){
		$scope.search.acct	='';
		$scope.search.post ='';
	
		
		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);
	}

	//Search Function
	$scope.unitSearch= function(){
		// $scope.filterAcct = '';
		var urlData = {
			'idsuperior'	: $scope.dashboard.values.accountid,
			'search_acct'	:$scope.search.acct,
			'search_post'	:$scope.search.post

		
		
		}
		$http.post(apiUrl+"admin/mng/comprehensive/attendance/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;


			$scope.attendace_today_view = data;

  
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	// //Filter Employee/ Managers Under
	$scope.filterAcct = function(acct){
		if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
			return acct.id != '0';
		}else{				
			return acct.idsuperior == $scope.dashboard.values.accountid;
		}
		
	}

	// //Export
	$scope.export = function () {
		var idsuperior	= typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid;
		var acct		= typeof $scope.search.acct === "undefined" ? '' : $scope.search.acct  ;
		var post		= typeof $scope.search.post === "undefined" ? '' : $scope.search.post  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/mng/comprehensive/attendance/export.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&post=" + post + "&acct=" + acct ;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}
	
	
	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);