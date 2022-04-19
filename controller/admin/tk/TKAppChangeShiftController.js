app.controller('TKAppChangeShiftController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
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
			accounts:[]
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
				$scope.dashboard.values.accounts 	= data.accounts;		
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.app_change_functions = function(){
		$scope.search_acct 		= '';
		$scope.search_dfrom 	= '';
		$scope.search_dto 		= '';

		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/app/shift/new_data.php',
				type: 'POST',
				data: function(d){
                    d.acct			= $scope.search_acct,
					d.dfrom			= $scope.search_dfrom,
					d.dto			= $scope.search_dto					
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"cutoff dataTables_length"><"toolbar dataTables_length"><"toolbuttons dataTables_filter"><"cutoffinfo dataTables_length"><"title_table">t<"foot_con"<"buttons dataTables_info">p>')
        .withOption('order', [1, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('count').withTitle('#').withClass('btnTDC'),
			DTColumnBuilder.newColumn('empname').withTitle('Employee Name').withClass('btnTD'),
			DTColumnBuilder.newColumn('business_unit').withTitle('Department/Section').withClass('btnTD'),
			DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTDC'),			
			DTColumnBuilder.newColumn('oldshift').withTitle('Current Shift').withClass('btnTDC').notSortable(),
			DTColumnBuilder.newColumn('newshift').withTitle('Change Shift').withClass('btnTDC').notSortable(),
			DTColumnBuilder.newColumn('remarks').withTitle('Reason').withClass('btnTDR').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTDC').renderWith(function (data, type, full, meta) {
				var btn = '';
				if (data.shift_status == "APPROVED") {
					btn = '<span style="font-weight:600 !important; color: green !important"> APPROVED </span>';
				} else if (data.shift_status == "DECLINED") {
					btn = '<span style="font-weight:600 !important; color: red !important"> ' + data.shift_status + ' </span>';
				} else {
					btn = '<span style="font-weight:600 !important; color: #ffc000 !important"> ' + data.shift_status + ' </span>';
				}
				return btn;
			})
		];
		vm.dtInstance = {};

		$(document).ready(function () {
			// $("div.cutoff").html('<div class="btn-group"><button id="cnext" onclick="angular.element(this).scope().cutoffData(\'1\')" ><<</button><button onclick="angular.element(this).scope().cutoffData(\'0\')" >CutOff Period</button><button id="cprev" onclick="angular.element(this).scope().cutoffData(\'2\')" >>></button></div>');

			$("div.toolbuttons").html('<button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().export()"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#modal-search" ><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refreshh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().dtInstance.reloadData()"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>');

			var str_div = '<div style="width: 100%; text-align: center; background: #2E5090; font-size: 22pt; color: white;">Change Shift</div>';
			$("div.title_table").html(str_div);

		});
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
        }
        
		$scope.resetSearch = function(){
			$scope.search_acct 		= ''; 
			$scope.search_dfrom 	= ''; 
			$scope.search_dto 		= ''; 
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
        
        //Export
		$scope.export = function () {
			var search_acct		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
			var _from		= typeof $scope._from === "undefined" ? '' : $scope._from  ;
			var _to			= typeof $scope._to === "undefined" ? '' : $scope._to  ;
			var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
			var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
			var url = apiUrl+"admin/tk/app/shift/export.php?datenow=" + datenow + "&company=" + company + "&_from=" + _from + "&search_acct=" + search_acct + "&_to=" + _to ;
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