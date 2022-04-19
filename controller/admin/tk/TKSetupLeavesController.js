app.controller('TKSetupLeavesController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			leavetype:[]
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
				$scope.dashboard.values.leavetype 	= data.leavetype;			
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.setup_leaves_functions = function(){
		$scope.add 					= [];
		$scope.search				= [];
		$scope.edit					= [];
		$scope.search.name 			= ''; 
		$scope.search.type  		= '';
		$scope.search.convertible 	= ''; 
		$scope.search.active 		= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/setup/leaves/data.php',
				type: 'POST',
				data: function(d){
					d.name			= $scope.search.name,
					d.type			= $scope.search.type,
					d.convertible	= $scope.search.convertible,
					d.active		= $scope.search.active
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('name').withTitle('Name').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn('hours').withTitle('Max Hours').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('type').withTitle('Type').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('convertible').withTitle('Convertible').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('active').withTitle('Active').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				//btn 	+= ' <button class="btn btn-flat btn-sm btn-success" title="Assign" data-target="#assignModal" data-toggle="modal" onclick="angular.element(this).scope().assign_view(\'' + data.id + '\')" ><i class="fa fa-briefcase"></i> Assign</button>';
				return btn;
			})
		];
		vm.dtInstance = {};
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search				= [];
			$scope.search.name 			= ''; 
			$scope.search.type  		= '';
			$scope.search.convertible 	= '';
			$scope.search.active	 	= '';
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.resetCreateAcct = function(){			
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/setup/leaves/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.add = data;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.edit_view = function(id){
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/tk/setup/leaves/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.edit = data;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.editLeave = function(){
			
			if( $scope.edit.hours === undefined || parseInt($scope.edit.hours) == 0 || $scope.edit.hours.length == 0 ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Max hours shoul be greater than 0";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			$scope.isSaving = true;
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.edit
			}
			$http.post(apiUrl+'admin/tk/setup/leaves/edit.php',urlData)
			.then( function (response, status){		
				$scope.isSaving = false;
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
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
					$rootScope.dymodalmsg  = "Please specify leave Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "hours" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Max hours shoul be greater than 0";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idtype" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify if leave is Paid/Unpaid";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "isconvertible" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify if leave is convertible to cash";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "active" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify if leave status";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "exists" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Leave Name already taken";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else{
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 1000);
					$("#editModal").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Leave updated successfully";
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.addLeave = function(){
			
			if( $scope.add.hours === undefined || parseInt($scope.add.hours) == 0 || $scope.add.hours.length == 0 ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Max hours shoul be greater than 0";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			$scope.isSaving = true;
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.add
			}
			$http.post(apiUrl+'admin/tk/setup/leaves/create.php',urlData)
			.then( function (response, status){		
				$scope.isSaving = false;
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
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
					$rootScope.dymodalmsg  = "Please specify leave Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "hours" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Max hours shoul be greater than 0";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idtype" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify if leave is Paid/Unpaid";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "isconvertible" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify if leave is convertible to cash";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "active" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify if leave status";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "exists" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Leave Name already taken";
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