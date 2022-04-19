app.controller('MNGResoCenterController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			ResoCentPage:'1'
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
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    } 
    
    //Table Function
	$scope.resocenter_func = function(){
	
		$scope.resocenter_view = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/mng/report/resocenter/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.resocenter_view = [];

			}else{
				$scope.resocenter_view = data;
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
			'_from'			: $scope._from,
			'_to'			: $scope._to

		
		}
		$http.post(apiUrl+"admin/mng/report/resocenter/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;


			$scope.resocenter_view = data;

  
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
    
    //Refresh Page
	$scope.refresh = function(){
		$scope.search_acct  ='';
		$scope._from 		='';
		$scope._to 			='';

		$scope.resocenter_func();

	}
	//Reset Search
	$scope.resetSearch = function(){
		$scope.search_acct  = '';
		$scope._from 		='';
		$scope._to 			='';

		

		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);
	}


    // //Export
	$scope.export = function () {
		var idsuperior	= typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid;
		var search_acct		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		var _from		= typeof $scope._from === "undefined" ? '' : $scope._from  ;
		var _to			= typeof $scope._to === "undefined" ? '' : $scope._to  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/mng/report/resocenter/export.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&_from=" + _from + "&_to=" + _to + "&search_acct=" + search_acct;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}
	
	
	$rootScope.getCompanyName();


	$scope.dashboard.setup();
}]);