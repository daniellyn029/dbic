app.controller('MNGTimesheetRecordController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/mng/sidebar/index.html";
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
				$scope.dashboard.values.period 		= data.period;
				$scope.dashboard.values.accounts 	= data.accounts;
				$scope.dashboard.values.leaves		= data.leaves;

				$scope.search_dfrom = $scope.dashboard.values.period.pay_start;
				$scope.search_dto = $scope.dashboard.values.period.pay_end;

				if($scope.search_dfrom!='' && $scope.search_dto!=''){
					$scope.timesheet_details_func();
				}

			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    } 
    
    //Table Function
	$scope.timesheet_details_func = function(){
		
		$scope.timesheet_view = [];
		
		var urlData = {
			'dfrom'	: $scope.search_dfrom,
			'dto'	: $scope.search_dto,
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/mng/comprehensive/timesheet/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;
			
			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.timesheet_view = [];

			}else{
				$scope.timesheet_view = data;

				//GET TOTAL WORK HOURS
				$scope.timesheet_view.forEach(function(item,index){
					var ctr = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr += parseFloat(item1.work_hours);
					})
					$scope.timesheet_view[index].twh=ctr;
				})

				//GET THE TOTAL OF THE TOTAL WORK HOURS
				$scope.timesheet_view.forEach(function(item,index){
					var ctr1 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr1 += parseFloat(item1.total_work_hours);
					})
					$scope.timesheet_view[index].totalwh=ctr1;
				})

				//GET TOTAL EXCESS WORK HOURS
				$scope.timesheet_view.forEach(function(item,index){
					var ctr2 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr2 += parseFloat(item1.excess_work_hours);
					})
					$scope.timesheet_view[index].totalewh=ctr2;
				})

				//GET TOTAL LATE
				$scope.timesheet_view.forEach(function(item,index){
					var ctr3 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr3 += parseFloat(item1.late);
					})
					$scope.timesheet_view[index].totallate=ctr3;
				})

				//GET TOTAL UNDERTIME
				$scope.timesheet_view.forEach(function(item,index){
					var ctr4 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr4 += parseFloat(item1.undertime);
					})
					$scope.timesheet_view[index].totalut=ctr4;
				})

				//GET TOTAL ABSENT
				$scope.timesheet_view.forEach(function(item,index){
					var ctr5 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr5 += parseFloat(item1.absent);
					})
					$scope.timesheet_view[index].totalabsent=ctr5;
				})

		
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
	}
	
	//Refresh Page
	$scope.reloadData = function(){

		$scope.timesheet_details_func();

	}

	//Reset Search
	$scope.resetsearch = function(){
		$scope.search_acct	='';
		$scope.search_post 	='';
	
		
		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);
	}

	//Search Function
	$scope.unitSearch= function(){
		var urlData = {
			'idsuperior'	: $scope.dashboard.values.accountid,
			'dfrom'			: $scope.search_dfrom,
			'dto'			: $scope.search_dto,
			'search_acct'	: $scope.search_acct,
			'search_post'	: $scope.search_post
			
		}
		$http.post(apiUrl+"admin/mng/comprehensive/timesheet/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.timesheet_view = data;
	
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	//Filter only the Managers under employee
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
		var acctt		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		var postt		= typeof $scope.search_post === "undefined" ? '' : $scope.search_post  ;
		var dfrom		= typeof $scope.search_dfrom === "undefined" ? '' : $scope.search_dfrom  ;
		var dto			= typeof $scope.search_dto === "undefined" ? '' : $scope.search_dto  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/mng/comprehensive/timesheet/export.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&postt=" + postt + "&acctt=" + acctt + "&dfrom=" + dfrom + "&dto=" + dto ;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}

	//CutOff Period next and previous button function
	$scope.cutoffData = function( f ){
		if( parseInt( f ) == 0 ){
			$scope.dashboard.setup();
			$scope.search_dfrom 	= $cookieStore.get('pay_start');
			$scope.search_dto 		= $cookieStore.get('pay_end');
			$scope.unitSearch();
		}else{
			var urlData = {
				'idperiod'  : $scope.dashboard.values.period.id,
				'f'		 	: f
			}
			$http.post(apiUrl+'payperiod.php',urlData)
			.then( function (response, status){			
				var data = response.data;				
				if( data.length == 0 ){
					$scope.dashboard.setup();
					$scope.search_dfrom 	= $cookieStore.get('pay_start');
					$scope.search_dto 		= $cookieStore.get('pay_end');
					$scope.unitSearch();
				}else{
					$scope.search_dfrom 		= data.pay_start;
					$scope.search_dto 			= data.pay_end;
					$scope.dashboard.values.period = data;
				}
				$scope.unitSearch();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}

	
	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);