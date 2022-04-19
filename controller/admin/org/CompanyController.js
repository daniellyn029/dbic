app.controller('CompanyController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/org/sidebar/index.html";
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
			typeList:null,
			statusList:null,
			comptypes:[],
			compsize:[],
			compind:[]
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
					$rootScope.global_branch = $cookieStore.get('global_branch');
					var  a = $filter('filter')( data.dblist , { id : ''+$cookieStore.get('global_branch') })[0];	
					$scope.dashboard.values.userInformation.dbcompany = a.company;
				}			
			}, function(response) {
				$rootScope.modalDanger();
			});	
		},
		setup: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/org/company/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.comptypes 	= data.comptypes;	
				$scope.dashboard.values.compsize 	= data.compsize;	
				$scope.dashboard.values.compind 	= data.compind;								
			}, function(response) {
				$rootScope.modalDanger();
			});
		},
		profile: function(){
			$scope.company =[];
			var urlData = {
				'accountid': $scope.dashboard.values.accountid,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/company/data.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.company = data;				
			}, function(response) {
				$rootScope.modalDanger();
			});	
		},
		save: function( file ){
			if(file['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "File must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}

			Upload.upload({
				url: apiUrl+'admin/org/company/save.php',
				method: 'POST',
				file: file,
				data: {
					'accountid'		: $scope.dashboard.values.accountid,
					'info'			: $scope.company,
					'conn'	   		: $cookieStore.get('global_branch'),
					'targetPath' 	: '../../../admin/org/company/'
				}
			}).then(function (response) {
				var data = response.data;
				if( data.status=="noacct" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You are not logged in";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noid" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter Short ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noname" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter Company Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="nophone" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter Phone Number";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidtype" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidsize" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Size";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidind" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Industry";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidbir" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter BIR ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidsss" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter SSS ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidibig" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter PAG-IBIG ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="noidhealth" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please enter PHIL-HEALTH ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="error-upload-type" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Only .jpg, .png, and .jpeg are accepted";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status=="error" ){
					$rootScope.modalDanger();
				}else if( data.status=="success" ){	
					window.location.reload();
				}
			}, function (response) {
				if (response.status > 0){
					$rootScope.modalDanger();
				}
			});	
		}		
	}

	const tx = document.getElementsByTagName('textarea');
	for (let i = 0; i < tx.length; i++) {
	tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight + 10) + 'px;overflow-y:hidden;');
	tx[i].addEventListener("input", OnInput, false);
	}

	function OnInput() {
	this.style.height = 'auto';
	this.style.height = (this.scrollHeight) + 'px';
	}

	$scope.dashboard.setup();
	$scope.dashboard.profile();	
		
}]);