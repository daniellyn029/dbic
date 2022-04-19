app.controller('TKSetupHolidayController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
				$scope.dashboard.values.holidays 	= data.holidays;			
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.setup_holiday_functions = function(){		
		$scope.add 					= [];
		$scope.search				= [];
		$scope.edit					= [];
		$scope.search.name 			= ''; 
		$scope.search.alias  		= '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/setup/holiday/data.php',
				type: 'POST',
				data: function(d){
					d.name			= $scope.search.name,
					d.alias			= $scope.search.alias
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"toolbuttons dataTables_filter">lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('name').withTitle('Name').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('date').withTitle('Holiday Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('type').withTitle('Holiday Type').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				//btn 	+= ' <button class="btn btn-flat btn-sm btn-success" title="Assign" data-target="#assignModal" data-toggle="modal" onclick="angular.element(this).scope().assign_view(\'' + data.id + '\')" ><i class="fa fa-briefcase"></i> Assign</button>';
				return btn;
			})
		];
		vm.dtInstance = {};

		$(document).ready(function () {
			$("div.toolbuttons").html('<button style="width:100px;margin: 0 3px 3px 0;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" data-toggle="modal" data-target="#modal-add" onclick="angular.element(this).scope().resetCreateAcct()"><i class="fa fa-plus-circle fa-sm"></i>&nbsp;&nbsp;&nbsp;Add</button> <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().export()"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button> <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#searchModal" ><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refreshh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().dtInstance.reloadData()"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>');

		});

		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search				= [];
			$scope.search.name 			= ''; 
			$scope.search.alias  		= '';
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.resetCreateAcct = function(){			
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/setup/holiday/add_view.php',urlData)
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
			$http.post(apiUrl+'admin/tk/setup/holiday/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				
				$scope.edit = data;	
				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.addHoliday = function(){
			$scope.isSaving = true;
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.add
			}
			$http.post(apiUrl+'admin/tk/setup/holiday/create.php',urlData)
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
					$rootScope.dymodalmsg  = "Please specify Holiday Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "date" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Holiday Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idtype" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Holiday Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "exists1" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Holiday Name already taken";
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
		
		$scope.editHoliday = function(){
			$scope.isSaving = true;
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.edit
			}
			$http.post(apiUrl+'admin/tk/setup/holiday/edit.php',urlData)
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
					$rootScope.dymodalmsg  = "Please specify Holiday Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "date" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Holiday Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idtype" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Holiday Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "exists1" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Holiday Name already taken";
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
					$rootScope.dymodalmsg  = "Holiday updated successfully";
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}

		// //Export
		$scope.export = function () {
			var name		= typeof $scope.search.name === "undefined" ? '' : $scope.search.name  ;
			var alias		= typeof $scope.search.alias === "undefined" ? '' : $scope.search.alias  ;
			var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
			var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
			var url = apiUrl+"admin/tk/setup/holiday/export.php?datenow=" + datenow + "&company=" + company + "&name=" + name + "&alias=" + alias ;
			var conf = confirm("Export to CSV?");
			if(conf == true){
				window.open(url, '_blank');
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

	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);