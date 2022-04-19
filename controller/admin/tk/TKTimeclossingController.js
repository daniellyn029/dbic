app.controller('TKTimeclossingController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	$scope.processing = {
		sdate	: $cookieStore.get('pay_start'),
		fdate	: $cookieStore.get('pay_end'),
		classi	: ''
	};
	$scope.swipeclassi 	= '';
	$scope.file_ctr 	= 0;
	$scope.swipe_ctr 	= [];
	$scope.unit_ctr 	= [];
	
	
	
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
			depts:[],
			conf:[]
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
				$scope.dashboard.values.depts 	= data.departments;
				$scope.dashboard.values.conf 	= data.timeconf;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.process = function(){
		$scope.file_ctr = 0;
		var file = null;
		$scope.isSaving = true;
		
		Upload.upload({
			url: apiUrl+'admin/tk/timeclossing/processing.php',
			method: 'POST',
			file: file,
			data: {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.processing,
				'targetPath': '../../../admin/tk/timelink/timelogs/'	
			}
		}).progress(function(e) {
			if(e.lengthComputable) {
				var percent = ( e.loaded / e.total ) * 100;
				$("#progressbar").val(Math.round(percent));
			}
		}).then(function (response) {	
			$scope.isSaving = false;
			var data = response.data;
			$timeout(function () {						
				$("#progressbar").val("0");
			}, 100);
			$scope.isSaving = false;
			var data = response.data;
			$timeout(function () {						
				$("#progressbar").val("0");
			}, 100);
			if( data.status == "error" ){
				$rootScope.modalDanger();					
			}else if( data.status == "sdate" ){						
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "No Start Date Specified";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "fdate" ){						
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "No End Date Specified";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "invdates" ){						
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Dates Specified";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{
				$scope.file_ctr = data.headno;
				$("#progressbar").val("0");
				$timeout(function () {	
					$rootScope.currperiod = [];
					var urlData = {
						'accountid': $cookieStore.get('acct_id')
					}
					$http.post('/dbic/assets/php/admin/tk/setup/settings.php',urlData)
					.then( function (response, status){			
						
						var data = response.data;
						$rootScope.currperiod 	= data.period;	
						$cookieStore.put('pay_start',$rootScope.currperiod.pay_start);
						$cookieStore.put('pay_end',$rootScope.currperiod.pay_end);						
						$scope.processing = {
							sdate	: $cookieStore.get('pay_start'),
							fdate	: $cookieStore.get('pay_end'),
							classi	: ''
						};
						$scope.vwpayperiod();
						$scope.dashboard.setup();
					}, function(response) {
						$rootScope.modalDanger();
					});
				}, 1000);
				
			}
		}, function (response) {
			if (response.status > 0){
				$scope.isSaving = false;
				$rootScope.modalDanger();
			}
		});	
	}
	
	$scope.vwpayperiod = function(){
		$scope.zperiod = [];
		var urlData = {
			'accountid' : $scope.dashboard.values.accountid
		}
		$http.post(apiUrl+'admin/tk/timeclossing/counter2.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			$scope.zperiod = data;
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