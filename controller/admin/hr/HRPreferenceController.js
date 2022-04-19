app.controller('HRPreferenceController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/hr/sidebar/index.html";
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
			accttype:[],
			civilstat:[],
			emptypes:[],
			measures:[]
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
					$scope.dashboard.values.userInformation.datenow = moment().format('MM/D/YYYY hh:mm:00 A');
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
				$scope.dashboard.values.measures = data.measures;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}	
	}
	
	
	$scope.preference_func = function(){
		$scope.add 		= [];
		$scope.edit 	= [];
		$scope.search	= [];
		$scope.search.alias = ''; 
		$scope.search.name  = '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'admin/hr/setup/data.php',
			 type: 'POST',
			 data: function(d){
				d.alias	= $scope.search.alias,
				d.name	= $scope.search.name
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
			 DTColumnBuilder.newColumn('preference').withTitle('Name').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('remarks').withTitle('Remarks').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('measure').withTitle('Measure').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('value').withTitle('Value').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD actiontd')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button style="background: #00a65a; border: 1px solid #00a65a;" class="btn btn-flat btn-sm btn-primary" title="Update" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				return btn;
			})
		 ];
		 vm.dtInstance = {};
		 $(document).ready(function () {
            $("div.buttons").html(`
				<button id="btn-refreshh" style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;width:100px" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button>
				<button style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;width:100px" class="btn btn-flat btn-primary pull-right hidden" title="Search" data-toggle="modal" data-target="#modal-search"><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button>
				<button style="margin-right:3px;background: #00a65a;width:100px; border: 1px solid #00a65a;" class="btn btn-flat btn-primary pull-right hidden" title="Create" data-toggle="modal" data-target="#modal-add" id="addempbtn" onclick="angular.element(this).scope().resetCreatePos()"><i class="fa fa-plus-circle fa-sm" style="padding:3px"></i>Add </button>`
			);
		});
		
		$scope.posiSearch = function(){		 
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
		
		$scope.resetCreatePos = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/hr/setup/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.add = data;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.edit_view = function( id ){
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/hr/setup/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.edit = data;									
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.editUnitProcess = function(){
			var r = confirm("Are you sure you want to update?");
			if (r == true) {
				spinnerService.show('form01spinner');
				$scope.isSaving=true;
				var urlData = {
					'accountid'	:	$scope.dashboard.values.accountid,
					'info'		:	$scope.edit
				}
				$http.post(apiUrl+'admin/hr/setup/edit_process.php',urlData)
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
						$rootScope.dymodalmsg  = "Please enter ID";
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
					}else if( data.status == "nomeasure" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please select Measure";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "noval" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please enter Value";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else{
						$("#editModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "New Preference added";
						$rootScope.dymodalstyle = "btn-success";
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
		
		$scope.addUnitProcess = function(){
			var r = confirm("Are you sure you want to add?");
			if (r == true) {
				spinnerService.show('form01spinner');
				$scope.isSaving=true;
				var urlData = {
					'accountid'	:	$scope.dashboard.values.accountid,
					'info'		:	$scope.add
				}
				$http.post(apiUrl+'admin/hr/setup/add_process.php',urlData)
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
						$rootScope.dymodalmsg  = "Please enter ID";
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
					}else if( data.status == "nomeasure" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please select Measure";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "noval" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please enter Value";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else{
						$("#modal-add").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "New Preference added";
						$rootScope.dymodalstyle = "btn-success";
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