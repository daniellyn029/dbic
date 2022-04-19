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
				
			}
		})
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',false)
		.withOption('autoWidth',false)
		.withDOM('<"buttons dataTables_filter">lrtip')
		.withOption('lengthMenu',[10,25,50,100])//length sa entries
		.withOption('order', [0, 'asc'])
		.withOption('drawCallback', function (settings) {
			
			$scope.total_acthrs 	= settings.json.data[settings.json.data.length - 1].total_acthrs;
			$scope.total_late 	    = settings.json.data[settings.json.data.length - 1].total_late;
			$scope.total_ut 		= settings.json.data[settings.json.data.length - 1].total_ut;
			$scope.total_absent 	= settings.json.data[settings.json.data.length - 1].total_absent;
			$scope.total_regot 		= settings.json.data[settings.json.data.length - 1].total_regot;
			$scope.total_rdot 		= settings.json.data[settings.json.data.length - 1].total_rdot;
			$scope.total_spcl_hol 	= settings.json.data[settings.json.data.length - 1].total_spcl_hol;
			$scope.total_spcl_rd  	= settings.json.data[settings.json.data.length - 1].total_spcl_rd;
			$scope.total_legal_hol 	= settings.json.data[settings.json.data.length - 1].total_legal_hol;
			$scope.total_legal_rd 	= settings.json.data[settings.json.data.length - 1].total_legal_rd;
			$scope.total_reg_np 	= settings.json.data[settings.json.data.length - 1].total_reg_np;	
			$scope.total_rd_np 		= settings.json.data[settings.json.data.length - 1].total_rd_np;
			$scope.total_spcl_rd_np = settings.json.data[settings.json.data.length - 1].total_spcl_rd_np;	
			$scope.total_spcl_np 	= settings.json.data[settings.json.data.length - 1].total_spcl_np;	
			$scope.total_legal_np 	= settings.json.data[settings.json.data.length - 1].total_legal_np;
			$scope.total_rd_ot8 	= settings.json.data[settings.json.data.length - 1].total_rd_ot8;	
			$scope.total_spcl_rd8 	= settings.json.data[settings.json.data.length - 1].total_spcl_rd8;
			$scope.total_legal_rd8 	= settings.json.data[settings.json.data.length - 1].total_legal_rd8;
			$scope.total_spcl_hol8 	= settings.json.data[settings.json.data.length - 1].total_spcl_hol8;
			$scope.total_legal_hol8 = settings.json.data[settings.json.data.length - 1].total_legal_hol8;	
			$scope.total_totcompen 	= settings.json.data[settings.json.data.length - 1].total_totcompen;
			$scope.total_totsl 		= settings.json.data[settings.json.data.length - 1].total_totsl;
			$scope.total_totvl 		= settings.json.data[settings.json.data.length - 1].total_totvl;
			$scope.total_totemer 	= settings.json.data[settings.json.data.length - 1].total_totemer;	
			$scope.total_totmagnacar= settings.json.data[settings.json.data.length - 1].total_totmagnacar;
			$scope.total_totpater 	= settings.json.data[settings.json.data.length - 1].total_totpater;
			$scope.total_totsolo 	= settings.json.data[settings.json.data.length - 1].total_totsolo;	
			$scope.total_totbereav 	= settings.json.data[settings.json.data.length - 1].total_totbereav;
			$scope.total_totmater 	= settings.json.data[settings.json.data.length - 1].total_totmater;

			$('#acthrsid').html($scope.total_acthrs);
			$('#lateid').html($scope.total_late);
			$('#utid').html($scope.total_ut);
			$('#absentid').html($scope.total_absent);
			$('#regotid').html($scope.total_regot);
			$('#rdotid').html($scope.total_rdot);	
			$('#spcl_holid').html($scope.total_spcl_hol);
			$('#spcl_rdid').html($scope.total_spcl_rd);	
			$('#legal_holid').html($scope.total_legal_hol); 	
			$('#legal_rdid').html($scope.total_legal_rd);
			$('#reg_npid').html($scope.total_reg_np);
			$('#rd_npid').html($scope.total_rd_np);	
			$('#spcl_rd_npid').html($scope.total_spcl_rd_np);
			$('#spcl_npid').html($scope.total_spcl_np);
			$('#legal_npid').html($scope.total_legal_np);	
			$('#rd_ot8id').html($scope.total_rd_ot8);
			$('#spcl_rd8id').html($scope.total_spcl_rd8); 	
			$('#legal_rd8id').html($scope.total_legal_rd8);	
			$('#spcl_hol8id').html($scope.total_spcl_hol8);
			$('#legal_hol8id').html($scope.total_legal_hol8);
			$('#totcompenid').html($scope.total_totcompen);
			$('#totslid').html($scope.total_totsl);
			$('#totvlid').html($scope.total_totvl);	
			$('#totemerid').html($scope.total_totemer); 	
			$('#totmagnacarid').html($scope.total_totmagnacar);
			$('#totpaterid').html($scope.total_totpater);
			$('#totsoloid').html($scope.total_totsolo);
			$('#totbereavid').html($scope.total_totbereav); 	
			$('#totmaterid').html($scope.total_totmater);
						
		});
		vm.dtColumns = [
			DTColumnBuilder.newColumn('empid').withTitle('EmployeeID').withClass('btnTD'),
			DTColumnBuilder.newColumn('empname').withTitle('Name').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('deptname').withTitle('Department').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('positiontitle').withTitle('Position').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('hdate').withTitle('DateHired').withClass('btnTD'),
			DTColumnBuilder.newColumn('pay_grp').withTitle('PayGroup').withClass('btnTD'),	
			DTColumnBuilder.newColumn('acthrs').withTitle('Actual Hours Work').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('late').withTitle('Lates').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('ut').withTitle('Undertime').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('absent').withTitle('Absent').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('regot').withTitle('Regular Overtime').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('rdot').withTitle('RestDay Overtime').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclhol').withTitle('SpecialHoliday Overtime').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclrd').withTitle('RestDay Overtime SpecialHoliday').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('legalhol').withTitle('LegalHoliday').withClass('btnTD').notSortable(),	
			DTColumnBuilder.newColumn('legalrd').withTitle('RestDay Overtime LegalHoliday').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('regnp').withTitle('RegularND').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('rdnp').withTitle('RestDayND').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclrdnp').withTitle('SpecialRestDayND').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclnp').withTitle('SpecialHolidayND').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('legalnp').withTitle('LegalHolidayND').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('rdot8').withTitle('RestDayDuty8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclrd8').withTitle('RestDayDuty+SpecialHoliday8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('legalrd8').withTitle('RestDayDuty+LegalHoliday8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('spclhol8').withTitle('SpecialHoliday8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('legalhol8').withTitle('LegalHoliday8').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totcompen').withTitle('CompensatoryLeave').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totvl').withTitle('VacationLeave').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totsl').withTitle('SickLeave').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totemer').withTitle('EmergencyLeave').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totmagnacar').withTitle('MagnaCarta').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totpater').withTitle('PaternityLeave').withClass('btnTD').notSortable(),	
			DTColumnBuilder.newColumn('totsolo').withTitle('SoloParent').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totbereav').withTitle('BereavementLeave').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('totmater').withTitle('MaternirtyLeave').withClass('btnTD').notSortable()
		];
		vm.dtInstancerep = {};
		$(document).ready(function () {
			// $("div.buttons").html('<button id="btn-export" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" ng-click="export123()" title="Export to Excel"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#myModal" title="Search"><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refresh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" ng-click="dtInstancerep.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>')

			$("#btn-refreshh").on('click', function () {
			vm.dtInstancerep.reloadData();
			});

			// $("#btn-export").on('click', function () {
			// 	$scope.export123();
			// });

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