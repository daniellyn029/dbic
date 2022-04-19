app.controller('BusinessUnitsController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/org/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	
	$scope.lbl = "Organization Under";

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
			unittypes:[],
			unithead:[],
			unitdept:[]
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
			$http.post(apiUrl+'admin/org/units/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.unittypes 	= data.unittypes;	
				$scope.dashboard.values.unithead 	= data.unithead;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}		
	}

	$scope.typeLimit = function( o ){
		return o.id != 1 && o.id != 6;
	}
	
	$scope.business_units_functions = function(){
		$scope.add 		= [];
		$scope.edit		= [];
		$scope.search	= [];
		$scope.search.alias = ''; 
		$scope.search.name  = '';
		$scope.search.utype = ''; 
		$scope.search.stat  = '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'admin/org/units/data.php',
			 type: 'POST',
			 data: function(d){
				d.alias	= $scope.search.alias,
				d.name	= $scope.search.name,
				d.utype	= $scope.search.utype,
				d.stat	= $scope.search.stat,
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
			 DTColumnBuilder.newColumn('stype').withTitle('Type').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('name').withTitle('Classification').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('shead').withTitle('Head').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('stat').withTitle('Status').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD actiontd')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button class="btn btn-flat btn-sm btn-primary" style="background: #e47365; border: 1px solid #e47365;" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				btn 	+= ' <button class="btn btn-flat btn-sm btn-danger hidden" title="Delete" onclick="angular.element(this).scope().del_process(\'' + data.id + '\')" ><i class="fa fa-trash"></i> Delete</button>';
				return btn;
			})
		 ];
		 vm.dtInstance = {};
		 $(document).ready(function () {
            $("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background: #e47365; border: 1px solid #e47365;width:100px" class="btn btn-flat btn-primary pull-right" ng-click="dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;background: #e47365; border: 1px solid #e47365;width:100px" class="btn btn-flat btn-primary pull-right" title="Search" data-toggle="modal" data-target="#modal-search"><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button><button style="margin-right:3px;background: #e47365;width:100px; border: 1px solid #e47365;" class="btn btn-flat btn-primary pull-right" title="Create" data-toggle="modal" data-target="#modal-add" id="addempbtn" ng-click="resetCreateAcct()"><i class="fa fa-plus-circle fa-sm" style="padding:3px"></i>Add </button>')
			
			$("#addempbtn").on('click', function () {
				$scope.resetCreateAcct();
			});
			   
			$("#btn-refreshh").on('click', function () {
				vm.dtInstance.reloadData();
			});
		});
		 
		 
		$scope.unitSearch = function(){		 
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search	= [];
			$scope.search.alias = ''; 
			$scope.search.name  = '';
			$scope.search.utype = ''; 
			$scope.search.stat  = '';
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}

		$scope.resetCreateAcct = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/units/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.unitdept = [];
				$scope.add = data;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}

		$scope.edit_view = function( id ){
			var urlData = {
				'id'	: id,
				'conn'	: $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/units/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.addUnitType( data.utype, id );
				$scope.edit = data;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}

		$scope.del_process = function( id ){
			var r = confirm("Are you sure you want to delete?");
			if (r == true) {
				spinnerService.show('form01spinner');
				var urlData = {
					'id': id,
					'conn'	: $cookieStore.get('global_branch')
				}
				$http.post(apiUrl+'admin/org/units/delete_process.php',urlData)
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
						$rootScope.dymodalmsg  = "Business Unit deleted";
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

		$scope.addUnitType = function( o, id ){
			
			var obj = $filter('filter')($scope.dashboard.values.unittypes, { id: parseInt(o) } )[0];
			var urlData = {
				'id'	: id,
				'idtype': obj.under,
				'conn'	: $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/units/vw_dept.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.unitdept = data;
				if( data.length > 0 ){
					$scope.lbl = data[0].unit_type + " Under";
				}else{
					var aa = parseInt(o) - 1;
					if( parseInt(aa) == 6 ){ aa = aa - 1; }
					
					var  a = $filter('filter')( $scope.dashboard.values.unittypes , { id : ''+ aa })[0];
					console.log( a );
					$scope.lbl = a.type + " Under";
				}
				
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
					'conn'		: 	$cookieStore.get('global_branch')
				}
				$http.post(apiUrl+'admin/org/units/add_process.php',urlData)
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
						$rootScope.dymodalmsg  = "Please enter Name";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "notype" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please select Type";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "nodept" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please select Entity Under";
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
					}else if( data.status == "error_duplicate" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Duplicate Entry";
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
						$rootScope.dymodalmsg  = "New Business Unit added";
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
					'conn'		: 	$cookieStore.get('global_branch')
				}
				$http.post(apiUrl+'admin/org/units/edit_process.php',urlData)
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
					}else if( data.status == "invupdate" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Invalid Update";
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
						$rootScope.dymodalmsg  = "Please enter Name";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "notype" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please select Type";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "nodept" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please select Entity Under";
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
						$rootScope.dymodalmsg  = "Business Unit updated";
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
	}

	$scope.dashboard.setup();
}]);