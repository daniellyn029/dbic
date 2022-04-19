app.controller('HRPersonnelActionController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			accttype:[],
			civilstat:[],
			emptypes:[]
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
			$http.post(apiUrl+'admin/hr/employee/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.emptypes 	= data.emptypes;
				$scope.dashboard.values.accttype 	= data.acctypes;
				$scope.dashboard.values.civilstat 	= data.civilstat;				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    } 
    
    // $scope.eforms = {
	// 	values: {
	// 		accountid	: $cookieStore.get('acct_id'),
	// 		accteid		: $cookieStore.get('acct_eid'),
	// 		accouttype	: $cookieStore.get('acct_type'),
	// 		accoutfname	: $cookieStore.get('acct_fname'),
	// 		accoutlname	: $cookieStore.get('acct_lname'),
	// 		acct_loc	: $cookieStore.get('acct_loc'),
	// 		approver	: $cookieStore.get('isapprover'),
	// 		formList: null			
	// 	},
	// 	formlist: function(){
	// 		//spinnerService.show('eFormspinner');
	// 		var urlData = {
	// 			'accountid'		: $scope.eforms.values.accountid,
	// 			'type'			: $scope.eforms.values.accouttype,
	// 			'approver'		: $scope.eforms.values.approver
	// 		}
	// 		$http.post(apiUrl+'admin/hr/personnelaction/formlist.php',urlData)
	// 		.then(function(data, status){
	// 			if(data.status=='error'){
	// 				$scope.eforms.values.formList = [];
	// 				$scope.GBLMSG = 'Something Went Wrong! Please Reload The Page.';
	// 				$scope.GBLshowAlert = true;
	// 				$scope.GBLshowAlertColor = 'alert alert-danger';
	// 				$scope.GBLshowAlertIcon = 'icon fa fa-ban';
	// 				$scope.GBLshowAlertStatus = 'Oops!';
	// 			}else if(data.status=='empty'){
	// 				$scope.eforms.values.formList = [];
	// 				$scope.GBLMSG = 'Nothing to Display.';
	// 				$scope.GBLshowAlert = true;
	// 				$scope.GBLshowAlertColor = '';
	// 				$scope.GBLshowAlertIcon = '';
	// 				$scope.GBLshowAlertStatus = '';
	// 			}else{
	// 					$scope.eforms.values.formList = data;
	// 			}

	// 		})
	// 		.error(function(data){
	// 			$scope.eforms.values.formList = [];
	// 			$scope.GBLMSG = 'Something Went Wrong! Please Reload The Page.';
	// 			$scope.GBLshowAlert = true;
	// 			$scope.GBLshowAlertColor = 'alert alert-danger';
	// 			$scope.GBLshowAlertIcon = 'icon fa fa-ban';
	// 			$scope.GBLshowAlertStatus = 'Oops!';
	// 		})
	// 		.finally(function(){
	// 			 $timeout(function () {
	// 				//spinnerService.hide('eFormspinner');
	// 				$scope.loggedIn = true;
	// 			  }, 1000);
	// 		});
	// 	}	
	// }

	$scope.eforms = function(){
		$scope.formList = null;
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'type'			: $scope.dashboard.values.accouttype,
			'approver'		: $scope.dashboard.values.approver,
		}
		$http.post(apiUrl+'admin/hr/personnelaction/formlist.php',urlData)
		.then( function (response, status){			
			var data = response.data;	
			if(data.status=='error'){
				$scope.formList = [];
				$scope.GBLMSG = 'Something Went Wrong! Please Reload The Page.';
				$scope.GBLshowAlert = true;
				$scope.GBLshowAlertColor = 'alert alert-danger';
				$scope.GBLshowAlertIcon = 'icon fa fa-ban';
				$scope.GBLshowAlertStatus = 'Oops!';
			}else if(data.status=='empty'){
				$scope.formList = [];
				$scope.GBLMSG = 'Nothing to Display.';
				$scope.GBLshowAlert = true;
				$scope.GBLshowAlertColor = '';
				$scope.GBLshowAlertIcon = '';
				$scope.GBLshowAlertStatus = '';
			}else{
				$scope.formList = data;
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
	
	$scope.dashboard.setup();
}]);