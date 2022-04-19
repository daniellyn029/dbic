app.controller('TKSetupPreferencesController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
	
	$scope.setup_preferences_functions = function(){
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
			 DTColumnBuilder.newColumn('value').withTitle('Value').withClass('btnTD').notSortable()
		 ];
		 vm.dtInstance = {};
		 $(document).ready(function () {
            $("div.buttons").html(`
				<button id="btn-refreshh" style="margin-right:3px;background: #337ab7; border: 1px solid #337ab7;width:100px" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button>
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