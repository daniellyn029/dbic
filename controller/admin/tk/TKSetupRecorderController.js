app.controller('TKSetupRecorderController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			holidaytypes:[]
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
				$scope.dashboard.values.holidaytypes 	= data.holidaytypes;			
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.setup_recorder_functions = function(){
		$scope.add 				= [];
		$scope.edit				= [];
		$scope.search			= [];
		$scope.search.alias 	= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/setup/recorder/data.php',
				type: 'POST',
				data: function(d){
					d.alias		= $scope.search.alias
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"buttons dataTables_filter">lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('alias').withTitle('ID').notSortable().withClass('btnTD idtd'),
			DTColumnBuilder.newColumn('descript').withTitle('Description').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn('note').withTitle('Device Location').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD actiontd')
			.renderWith(function(data, type, full, meta){
				var btn  = '<div class="col-lg-12"><button style="width:100px" class="btn btn-flat btn-sm btn-primary" title="Update" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button></div>';
				return btn;
			})
		];
		vm.dtInstance = {};
		$(document).ready(function () {
            $("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background: #337ab7; border: 1px solid #337ab7;width:100px" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;background: #337ab7; border: 1px solid #337ab7;width:100px" class="btn btn-flat btn-primary pull-right hidden" title="Search" data-toggle="modal" data-target="#modal-search" onclick="angular.element(this).scope().dashboard.setup()"><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button><button style="margin-right:3px;background: #337ab7;width:100px; border: 1px solid #337ab7;" class="btn btn-flat btn-primary pull-right" title="Create" data-toggle="modal" data-target="#modal-add" id="addempbtn" onclick="angular.element(this).scope().resetCreateAcct()"><i class="fa fa-plus-circle fa-sm" style="padding:3px"></i>Add </button>')
		});
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();		
		}
		
		$scope.resetSearch = function(){
			$scope.search			= [];
			$scope.search.alias 	= ''; 
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.resetCreateAcct = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/setup/recorder/add_view.php',urlData)
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
			$http.post(apiUrl+'admin/tk/setup/recorder/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.edit = data;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.addConfig = function(){
			$scope.isSaving = true;
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.add
			}
			$http.post(apiUrl+'admin/tk/setup/recorder/add.php',urlData)
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
					$rootScope.dymodalmsg  = "Please specify ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "dupname" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Duplicate ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "ain" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify In value";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "bin" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Break In value";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "bout" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Break Out value";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "aout" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Out value";
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
					$rootScope.dymodalmsg  = "Added successfully";
					$rootScope.dymodalstyle = "btn-primary";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.editConfig = function(){
			$scope.isSaving = true;
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.edit
			}
			$http.post(apiUrl+'admin/tk/setup/recorder/edit.php',urlData)
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
					$rootScope.dymodalmsg  = "Please specify ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "dupname" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Duplicate ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "ain" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify In value";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "aout" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Out value";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "bin" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Break In value";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "bout" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Break Out value";
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
					$rootScope.dymodalmsg  = "Updated successfully";
					$rootScope.dymodalstyle = "btn-primary";
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