app.controller('MNGMyTeamController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
				$scope.dashboard.values.accounts 	= data.accounts;	
				$scope.dashboard.values.leaves		= data.leaves;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    } 
    
    //Table Function
	$scope.myTeam_func = function(){
		
		$scope.myteam_view = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/mng/comprehensive/myteam/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;
			
			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.myteam_view = [];

			}else{
                $scope.myteam_view = data;
                $scope.length = $scope.myteam_view.length;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
    }

	//Refresh Page
	$scope.reloadData = function(){

		$scope.myTeam_func();

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
			'search_acct'	: $scope.search_acct,
			'search_post'	: $scope.search_post
			
		}
		$http.post(apiUrl+"admin/mng/comprehensive/myteam/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.myteam_view = data;
	
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	// //Filter only the Managers under employee
	$scope.filterAcct = function(acct){
		if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
			return acct.id != '0';
		}else{				
			return acct.idsuperior == $scope.dashboard.values.accountid;
		}
		
	}


    //Click staff image direct to staff profile page
    $scope.staff_profile = function(staff_id){

        $cookieStore.put('pstaff_id', staff_id);
    }

    $scope.staff_profile_functions = function(gstaff_id){
        var urlData = {
            'id': gstaff_id
        }
        $http.post(apiUrl + 'admin/emp/profile/view.php', urlData)
        .then(function (response, status) {
            var data = response.data;

            $scope.view = data[0];

        });
    }

    setTimeout(function () {
        $scope.$apply(function(){
            var gstaff_id =  $cookieStore.get('pstaff_id');

            if(gstaff_id != undefined){
            
                $scope.staff_profile_functions(gstaff_id);
                $cookieStore.remove('gstaff_id');
            };
        });
    }, 100);
    //.END staff 


	// //Export
	$scope.export = function () {
		var idsuperior	= typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid;
		var acctt		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		var postt		= typeof $scope.search_post === "undefined" ? '' : $scope.search_post  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/mng/comprehensive/myteam/export.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&postt=" + postt + "&acctt=" + acctt ;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}
	
	
	


	
	// $scope.myTeam_func();
	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);