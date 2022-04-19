app.controller('UploaderController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/org/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	
	$scope.template = "";
	$scope.picFile  = "";
	
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
			unitdept: [],
			template:[]
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
				'accountid': $scope.dashboard.values.accountid,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/uploader/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.template = data.templates;
				
				$scope.template = "1";
				$scope.picFile  = "";
				$scope.obj_file	= [];
				$scope.obj_err	= [];
				$scope.obj_ins	= [];
				
				$scope.setObj($scope.template);
				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}		
	}
	
	$scope.setObj = function( o ){
		$scope.obj_file	= [];
		$scope.obj_ins	= [];
		$scope.obj_err	= [];
		$scope.obj_file = $filter('filter')( $scope.dashboard.values.template , { id : ''+o })[0];
	}
	
	$scope.uploadfile = function( file ){
		if( file ){
			if( file.name == $scope.obj_file.file_name ){
				$scope.obj_err	= [];
				$scope.obj_ins	= [];
				$scope.isSaving = true;
				Upload.upload({
					url		: '/dbic/batch/'+ $scope.obj_file.folder_name + '/' + $scope.obj_file.php_name,
					method	: 'POST',
					file	: file,
					data	: {
						'accountid'			: $scope.dashboard.values.accountid,
						'info'				: $scope.obj_file,
						'targetPath'		: './',					
					}
				}).then(function (response) {
					var data = response.data;
					$scope.isSaving = false;
					$scope.obj_err	= data.errs;
					$scope.obj_ins	= data.ins;
				},  function (response) {
					if (response.status > 0){
						$rootScope.modalDanger();
					}
				});	
			}else{
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid File";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}else{
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "No File to upload";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
	}
	
	$scope.upload_ins = function(){
		if( $scope.obj_ins.length > 0 ){
			$scope.isSaving = true;
			var urlData = {
				'accountid'			: $scope.dashboard.values.accountid,
				'info'				: $scope.obj_file,
			}
			$http.post('/dbic/batch/'+ $scope.obj_file.folder_name + '/' + $scope.obj_file.php_ins,)
			.then( function (response, status){			
				var data = response.data;
				$scope.isSaving = false;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					$scope.obj_err	= [];
					$scope.obj_ins	= [];
					$scope.resetFields();
				}
			}, function(response) {
				$rootScope.modalDanger();
			});
		}else{
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "No Records To Insert";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
	}
	
	$scope.files2 = function(){
		var file = $scope.obj_file.file_name;
		window.location = '/dbic/batch/temps/download.php?file='+file;
	}
	
	$scope.resetFields = function(){
		$scope.template = "";
		$scope.picFile  = "";
		$scope.obj_file	= [];
	}
	
	$scope.dashboard.setup();
}]);