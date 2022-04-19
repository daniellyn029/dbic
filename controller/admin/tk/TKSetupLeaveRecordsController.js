app.controller('TKSetupLeaveRecordsController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
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
			shifttypes:[],
			accounts:[],
			leaves:[],
            pageSize:'10',
			recordsPage:'1'
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
				$scope.dashboard.values.shifttypes 	= data.shifttypes;
				$scope.dashboard.values.leaves 		= data.leaves;
				$scope.dashboard.values.joblocation = data.joblocation;
				$scope.dashboard.values.accounts 	= data.accounts;
				$scope.dashboard.values.department 	= data.departments;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    }
    
    	//Table Function
	$scope.leave_records_function = function(){
		
		$scope.leave_records_view = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/tk/setup/leaverecords/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.leave_records_view = [];

			}else{
				$scope.leave_records_view = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
    }
    
    $scope.addLeave = function (){
		$scope.isSaving = true;
        var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'add_acct'  	: $scope.add_acct,
			'add_leavetype' : $scope.add_leavetype,
			'add_entitlement':$scope.add_entitlement,
		}
		$http.post(apiUrl+'admin/tk/setup/leaverecords/create.php',urlData)
		.then( function (response, status){
			$scope.isSaving = false;
			var data 		= response.data;

			if(data.status=="error"){
				$rootScope.modalDanger();
				// $scope.leave_records_view = [];

			}else if( data.status == "notloggedin" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "You are not logged in";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "name" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please enter Employee Name";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "entitle" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please enter Leave Type Entitlement";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "idtype" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Leave Type";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "exists1" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Leave Type already taken";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{
				$timeout(function () {	
					$("#btn-refreshh").click();
				}, 1000);
				$("#modal-add").modal("hide");
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Success!";
				$rootScope.dymodalmsg  = "Leave added successfully";
				$rootScope.dymodalstyle = "btn-success";
				$rootScope.dymodalicon = "fa fa-check";				
				$("#dymodal").modal("show");
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});

	}

	$scope.search123 = function (){

		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'search_acct'  	: $scope.search_acct,
			'search_dept'   : $scope.search_dept,
		}
		$http.post(apiUrl+"admin/tk/setup/leaverecords/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.leave_records_view = data;
			
  
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	$scope.edit_view = function(id){
		var urlData = {
			'idss': id
		}
		$http.post(apiUrl+'admin/tk/setup/leaverecords/edit_view.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			
			$scope.edit_view = data;
			

			$timeout(function () {
				//for select2 function only in html
				$("#acct").val($scope.edit_view.idacct).trigger('change');
				$("#depart").val($scope.edit_view.idunit).trigger('change');
				$("#edit_leavetype").val($scope.edit_view.tl_id).trigger('change');
				
			}, 100);
			
		}, function(response) {
			$rootScope.modalDanger();
		});
	}

	$scope.edit123 = function(){
		$scope.isSaving = true;
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
			'info'		: $scope.edit_view
		}
		$http.post(apiUrl+'admin/tk/setup/leaverecords/edit.php',urlData)
		.then( function (response, status){
			$scope.isSaving = false;
			var data 		= response.data;

			if(data.status=="error"){
				$rootScope.modalDanger();
				// $scope.leave_records_view = [];

			}else if( data.status == "notloggedin" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "You are not logged in";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "name" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please enter Employee Name";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{
				$timeout(function () {	
					$("#btn-refreshh").click();
				}, 1000);
				$("#modal-add").modal("hide");
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Success!";
				$rootScope.dymodalmsg  = "Holiday added successfully";
				$rootScope.dymodalstyle = "btn-success";
				$rootScope.dymodalicon = "fa fa-check";				
				$("#dymodal").modal("show");
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	//Refresh Page
	$scope.resetSearch = function(){
		$scope.add_acct	 		='';
		$scope.add_leavetype     ='';
		$scope.add_entitlement   ='';
		$scope.search_acct	 	 ='';
		$scope.search_dept	 	 ='';

		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);

	}

	//Refresh Page
	$scope.reloadData = function(){
		$scope.add_acct	 		 ='';
		$scope.add_leavetype     ='';
		$scope.add_entitlement   ='';
		$scope.search_acct	 	 ='';
		$scope.search_dept	 	 ='';

		$scope.leave_records_function();

	}

	// //Export
	$scope.export = function () {
		var search_acct	= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		var search_dept	= typeof $scope.search_dept === "undefined" ? '' : $scope.search_dept  ;
		var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/tk/setup/leaverecords/export.php?datenow=" + datenow + "&company=" + company + "&search_dept=" + search_dept + "&search_acct=" + search_acct;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
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
	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);