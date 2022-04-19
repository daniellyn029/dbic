app.controller('TKReportController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";

	$scope.dashboard = {
		values: {
			loggedid: $cookieStore.get('acct_id'),
			accountid: $cookieStore.get('acct_id'),
			// accountid: 1,
			accouttype: $cookieStore.get('acct_type'),  
			accoutfname: $cookieStore.get('acct_fname'),
			accoutlname: $cookieStore.get('acct_lname'),
			accoutemail: $cookieStore.get('acct_email'),
			userInformation: null,
			accounts:[],
			getAllEmployeeSearch: [],
			getAllDepartment: [],
			getAllPosition: [],
			getAllJobLocation: [],
			getAllPaygroup: [],
			getAllLaborType: []
		},
		active: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'tmsmems/loggedinuser.php',urlData)
			.then( function (response, status){     
				var data = response.data;
				$scope.dashboard.values.userInformation = data;           
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
				$scope.dashboard.values.accounts  				= data.accounts;   
				$scope.dashboard.values.getAllEmployeeSearch	= data.accounts; 
				$scope.dashboard.values.getAllDepartment		= data.departments;
				$scope.dashboard.values.getAllPosition			= data.positions;
				$scope.dashboard.values.getAllJobLocation		= data.joblocation;
				$scope.dashboard.values.getAllPaygroup			= data.paygroup;
				$scope.dashboard.values.getAllLaborType			= data.labortype;
				$scope.dashboard.values.department 				= data.departments;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
		
	$scope.tkreporttbl = function(){
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
		  .withOption('ajax', {
			url: apiUrl+'admin/tk/setup/reports/tkreports_view.php',
			type: 'POST',
			data: function(d){
				d.search_acct 	= $scope.search_acct,
				d.department 	= $scope.department,
				d.tkdatefrom 	= $scope.tkdatefrom,
				d.tkdateto 		= $scope.tkdateto
				// d.allemployee 	= $scope.allemployee,
				// d.alldepartment = $scope.alldepartment,
				// d.tkgender 		= $scope.tkgender,
				// d.position 		= $scope.tkposition,
				// d.joblocation 	= $scope.joblocation,
				// d.paygroup 		= $scope.paygroup,
				// d.labortype 	= $scope.labortype,
				
			}
		}) 
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"buttons dataTables_filter">lrtip')
		.withOption('lengthMenu',[10,25,50,100])//length sa entries
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('empid').withTitle('EmployeeID').withClass('btnTD'),
			DTColumnBuilder.newColumn('empname').withTitle('Name').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('deptname').withTitle('Department').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('positiontitle').withTitle('Position').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('workdate').withTitle('WorkDate').withClass('btnTD'),
			DTColumnBuilder.newColumn('idshift').withTitle('IDShift').withClass('btnTD').notSortable(),	
			DTColumnBuilder.newColumn('shiftstatus').withTitle('ShiftStatus').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('shiftin').withTitle('ShiftIn').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('shiftout').withTitle('ShiftOut').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('in').withTitle('IN').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('out').withTitle('OUT').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('reghrs').withTitle('RegularHrs').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('absent').withTitle('Absent').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('late').withTitle('Late').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('ut').withTitle('UT').withClass('btnTD').notSortable(),	
			DTColumnBuilder.newColumn('regot').withTitle('RegularOT').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('rdot').withTitle('RestDayOT').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclhol').withTitle('SpecialHoliday').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('legalhol').withTitle('LegalHoliday').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclrd').withTitle('SpecialRestDay').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('legalrd').withTitle('LegalRestDay').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('regot8').withTitle('RegularOT8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('rdot8').withTitle('RestDayOT8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclhol8').withTitle('SpecialHoliday8').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('legalhol8').withTitle('LegalHoliday8').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('spclrd8').withTitle('SpecialRestDay8').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('legalrd8').withTitle('LegalRestDay8').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('regnp').withTitle('RegularNightPremium').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('legalnp').withTitle('LegalNightPremium').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('rdnp').withTitle('RestDayNightPremium').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('spclrdnp').withTitle('SpecialRestDayNightPremium').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('legalrdnp').withTitle('LegalResDayNightPremium').withClass('btnTD').notSortable(),	
			// DTColumnBuilder.newColumn('vlhrs').withTitle('VacationLeave').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('slhrs').withTitle('SickLeave').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('lwphrs').withTitle('LeaveWithoutPay').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('sphrs').withTitle('SoloParentLeave').withClass('btnTD').notSortable(),
			// DTColumnBuilder.newColumn('leavetype').withTitle('LeaveType').withClass('btnTD').notSortable(),
		];
		vm.dtInstancerep = {};
		$(document).ready(function () {
			$("div.buttons").html('<button id="btn-export" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" ng-click="export123()" title="Export to Excel"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#myModal" title="Search"><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refresh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" ng-click="dtInstancerep.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>')

			$("#btn-refresh").on('click', function () {
			vm.dtInstancerep.reloadData();
			});

			$("#btn-export").on('click', function () {
				$scope.export123();
			});

		});
		
		//reload table
		$scope.search123 = function(){
			vm.dtInstancerep.reloadData();
			$('#myModal').modal('hide');
		}

	}
	
	//Reset Search
	$scope.resetSearch = function(){
		  $scope.search_acct  = '';
		  $scope.department   = '';
		  $scope.tkdatefrom   = '';
		  $scope.tkdateto	  = '';

		  $timeout(function () {	
			$("#btn-refresh").click();
		}, 100);
	}
	//   $scope.tkselect = '';
    //   $scope.allemployee = '';
    //   $scope.alldepartment = '';
    //   $scope.tkgender = '';
    //   $scope.tkposition = '';
    //   $scope.joblocation = '';
    //   $scope.paygroup = '';
    //   $scope.labortype = '';
    //   $scope.tkdatefrom = '';
    //   $scope.tkdateto = '';

    //   $timeout(function () {				
    //     $('#idSelect').val( $scope.tkselect).trigger("change");			
    //     $('#allemp').val( $scope.allemployee).trigger("change");
    //     $('#alldept').val( $scope.alldepartment).trigger("change");
    //     $('#gender').val( $scope.tkgender).trigger("change");
    //     $('#post').val( $scope.tkposition).trigger("change");
    //     $('#jobloc').val( $scope.joblocation).trigger("change");
    //     $('#pygrp').val( $scope.paygroup).trigger("change");
    //     $('#lbrtyp').val( $scope.labortype).trigger("change");
    //     $('#datefrom').val( $scope.tkdatefrom).trigger("change");
    //     $('#dateto').val( $scope.tkdateto).trigger("change");
	
    //     $('#clickHere').click();
    //   }, 100);
	

	// //ng-change
	// $scope.myFunc = function(){
	// 	$scope.allemployee 		= '';
	// 	$scope.alldepartment 	= '';
	// 	$scope.tkgender 		= '';
	// 	$scope.tkposition 		= '';
	// 	$scope.joblocation 		= '';
	// 	$scope.paygroup 		= '';
	// 	$scope.labortype 		= '';
	// 	$scope.tkdatefrom 		= '';
	// 	$scope.tkdateto 		= '';
	// 	$timeout(function () {				
	// 	  $('#idSelect').val( $scope.tkselect).trigger("change");			
	// 	  $('#allemp').val( $scope.allemployee).trigger("change");
	// 	  $('#alldept').val( $scope.alldepartment).trigger("change");
	// 	  $('#gender').val( $scope.tkgender).trigger("change");
	// 	  $('#post').val( $scope.tkposition).trigger("change");
	// 	  $('#jobloc').val( $scope.joblocation).trigger("change");
	// 	  $('#pygrp').val( $scope.paygroup).trigger("change");
	// 	  $('#lbrtyp').val( $scope.labortype).trigger("change");
	// 	  $('#datefrom').val( $scope.tkdatefrom).trigger("change");
	// 	  $('#dateto').val( $scope.tkdateto).trigger("change");
	// 	}, 100);
	// }

	// //Export
	$scope.export123 = function () {
		var search_acct	= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		var department		= typeof $scope.department === "undefined" ? '' : $scope.department  ;
		var tkdatefrom		= typeof $scope.tkdatefrom === "undefined" ? '' : $scope.tkdatefrom  ;
		var tkdateto			= typeof $scope.tkdateto === "undefined" ? '' : $scope.tkdateto  ;
		var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/tk/setup/reports/tkreports_export.php?datenow=" + datenow + "&company=" + company + "&search_acct=" + search_acct + "&department=" + department + "&tkdatefrom=" + tkdatefrom + "&tkdateto=" + tkdateto;
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
	$rootScope.getAllEmployeeReportFunc();
	$scope.dashboard.setup();

}]);