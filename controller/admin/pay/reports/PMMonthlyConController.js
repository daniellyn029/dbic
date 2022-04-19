app.controller('PMMonthlyConController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/pay/sidebar/index.html";
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
			period:[],
			account:[]
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
				$scope.dashboard.values.period 	= data.period;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	

	
	
	$scope.dashboard.setup();
	
}]);