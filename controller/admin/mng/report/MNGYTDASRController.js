
app.controller('MNGYTDASRController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			period:[],
			pageSize:'10',
			tardinessPage:'1'
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
				console.log($scope.dashboard.values.period);
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    } 
	
	//Table Function
	$scope.yrtdasr_func = function(){
	
		$scope.yrtdasr_view = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/mng/report/yrtdasr/view.php',urlData)
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




			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.yrtdasr_view = [];

			}else{
				$scope.yrtdasr_view = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
	}

	//Search Function
	$scope.unitSearch= function(){
		var urlData = {
			'idsuperior'	: $scope.dashboard.values.accountid,
			'search_acct'	: $scope.search_acct,
			// '_from'			: $scope._from,
			// '_to'			: $scope._to

		
		}
		$http.post(apiUrl+"admin/mng/report/yrtdasr/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;


			$scope.yrtdasr_view = data;

	
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	//Reset Search
	$scope.resetSearch = function(){
		$scope.search_acct  = '';
		// $scope._from 		='';
		// $scope._to 			='';

		

		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);
	}

	//Refresh Page
	$scope.refresh = function(){
		$scope.search_acct  ='';
		// $scope._from 		='';
		// $scope._to 			='';

		$scope.yrtdasr_func();

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
		var search_acct		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		// var post		= typeof $scope.search.post === "undefined" ? '' : $scope.search.post  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/mng/report/yrtdasr/export.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&search_acct=" + search_acct ;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}
	
	
	$rootScope.getCompanyName();
	
	
	$scope.dashboard.setup();
}]);