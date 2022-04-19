app.controller('LaborTypesController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			statusList:null
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
		}		
	}
	
	$scope.labor_types_functions = function(){
		$scope.add 		= [];
		$scope.edit		= [];
		$scope.search	= [];
		$scope.search.alias = ''; 
		$scope.search.name  = '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'admin/org/labor/data.php',
			 type: 'POST',
			 data: function(d){
				d.alias	= $scope.search.alias,
				d.name	= $scope.search.name,
				d.conn	= $cookieStore.get('global_branch')
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
			 DTColumnBuilder.newColumn('alias').withTitle('ID').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('name').withTitle('Labor').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD actiontd')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button style="background: #e47365; border: 1px solid #e47365;" class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				btn 	+= ' <button class="btn btn-flat btn-sm btn-danger hidden" title="Delete" onclick="angular.element(this).scope().del_process(\'' + data.id + '\')" ><i class="fa fa-trash"></i> Delete</button>';
				return btn;
			})
		 ];
		vm.dtInstance = {};
		$(document).ready(function () {
            $("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background: #e47365; border: 1px solid #e47365;width:100px" class="btn btn-flat btn-primary pull-right" ng-click="dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;background: #e47365; border: 1px solid #e47365;width:100px" class="btn btn-flat btn-primary pull-right" title="Search" data-toggle="modal" data-target="#modal-search"><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button><button style="margin-right:3px;background: #e47365;width:100px; border: 1px solid #e47365;" class="btn btn-flat btn-primary pull-right" title="Create" data-toggle="modal" data-target="#modal-add" id="addempbtn" ng-click="resetCreateLabor()"><i class="fa fa-plus-circle fa-sm" style="padding:3px"></i>Add </button>')
			
			$("#addempbtn").on('click', function () {
				$scope.resetCreateLabor();
			});
			   
			$("#btn-refreshh").on('click', function () {
				vm.dtInstance.reloadData();
			});
		});

		$scope.laborSearch = function(){		 
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search	= [];
			$scope.search.alias = ''; 
			$scope.search.name  = '';
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}

		$scope.resetCreateLabor = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/labor/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.add = data;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}

		$scope.edit_view = function( id ){
			var urlData = {
				'id': id,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/labor/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.edit = data;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}

		$scope.addUnitProcess = function(){
			var r = confirm("Are you sure you want to add?");
			if (r == true) {
				spinnerService.show('form01spinner');
				$scope.isSaving=true;
				var urlData = {
					'accountid'	:	$scope.dashboard.values.accountid,
					'info'		:	$scope.add,
					'conn'	   : $cookieStore.get('global_branch')
				}
				$http.post(apiUrl+'admin/org/labor/add_process.php',urlData)
				.then( function (response, status){		
					spinnerService.hide('form01spinner');
					$scope.isSaving=false;
					var data = response.data;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "noid" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please enter Short ID";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "noname" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please enter Labor Type";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "dupalias" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Short ID already registered";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "error" ){
						$rootScope.modalDanger();
					}else{
						$("#modal-add").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "New Labor Type added";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function(response) {
					spinnerService.hide('form01spinner');
					$scope.isSaving=false;
					$rootScope.modalDanger();
				});
			}
		}

		$scope.editUnitProcess = function(){
			var r = confirm("Are you sure you want to update?");
			if (r == true) {
				spinnerService.show('form01spinner');
				$scope.isSaving=true;
				var urlData = {
					'accountid'	:	$scope.dashboard.values.accountid,
					'info'		:	$scope.edit,
					'conn'	   : $cookieStore.get('global_branch')
				}
				$http.post(apiUrl+'admin/org/labor/edit_process.php',urlData)
				.then( function (response, status){	
					spinnerService.hide('form01spinner');
					$scope.isSaving=false;	
					var data = response.data;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "noid" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please enter Short ID";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "noname" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please enter Labor Type";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "dupalias" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Short ID already registered";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "error" ){
						$rootScope.modalDanger();
					}else{
						$("#editModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Labor Type updated";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function(response) {
					spinnerService.hide('form01spinner');
					$scope.isSaving=false;
					$rootScope.modalDanger();
				});
			}
		}

		$scope.del_process = function( id ){
			var r = confirm("Are you sure you want to delete?");
			if (r == true) {
				spinnerService.show('form01spinner');
				var urlData = {
					'id': id,
					'conn'	   : $cookieStore.get('global_branch')
				}
				$http.post(apiUrl+'admin/org/labor/delete_process.php',urlData)
				.then( function (response, status){		
					spinnerService.hide('form01spinner');	
					var data = response.data;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "notvalid" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You can not delete this unit because it is already assigned to an account.";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "error" ){
						$rootScope.modalDanger();
					}else{	
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Labor Type deleted";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}					
				}, function(response) {
					spinnerService.hide('form01spinner');
					$rootScope.modalDanger();
				});
			}
		}
	}

}]);