app.controller('TKAppOvertimeController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
	
	$scope.app_overtime_functions = function(){
		// $scope.add 					= [];
		// $scope.edit					= [];
		// $scope.search				= [];		
		$scope.search_acct 			= '';
		$scope.search_dfrom 			= '';
		$scope.search_dto 			= '';
		// if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 
		// 	$scope.search.datefrom 		= '';
		// 	$scope.search.dateto 		= '';
		// 	$scope.search.appstat		= '';
		// }else{ 
		// 	$scope.search.datefrom 		= $location.search().df; 
		// 	$scope.search.dateto 		= $location.search().dt; 
		// 	$scope.search.appstat		= $location.search().st;
		// };
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/app/overtime/new_data.php',
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
		.withDOM('lrtip')
		.withDOM('<"cutoff dataTables_length"><"toolbar dataTables_length"><"toolbuttons dataTables_filter"><"cutoffinfo dataTables_length"><"title_table">t<"foot_con"<"buttons dataTables_info">p>')
        .withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('count').withTitle('#').withClass('btnTDC'),
			DTColumnBuilder.newColumn('empname').withTitle('Employee').withClass('btnTD'),			
			DTColumnBuilder.newColumn('business_unit').withTitle('Department/Section').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTDC'),
			DTColumnBuilder.newColumn('app_time').withTitle('OT Application').withClass('btnTDC').notSortable(),
			DTColumnBuilder.newColumn('units2').withTitle('Units').withClass('btnTDC'),
			DTColumnBuilder.newColumn('remarks').withTitle('Reason').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTDC').renderWith(function (data, type, full, meta) {
				var btn = '';
				if (data.ot_status == "APPROVED") {
					btn = '<span style="font-weight:600 !important; color: green !important"> APPROVED </span>';
				} else if (data.ot_status == "DECLINED") {
					btn = '<span style="font-weight:600 !important; color: red !important"> ' + data.ot_status + ' </span>';
				} else {
					btn = '<span style="font-weight:600 !important; color: #ffc000 !important"> ' + data.ot_status + ' </span>';
				}
				return btn;
			})



		];
		vm.dtInstance = {};
		$(document).ready(function () {
			// $("div.cutoff").html('<div class="btn-group"><button id="cnext" onclick="angular.element(this).scope().cutoffData(\'1\')" ><<</button><button onclick="angular.element(this).scope().cutoffData(\'0\')" >CutOff Period</button><button id="cprev" onclick="angular.element(this).scope().cutoffData(\'2\')" >>></button></div>');

			$("div.toolbuttons").html('<button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().export()"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#modal-search" ><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refreshh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().dtInstance.reloadData()"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>');

			var str_div = '<div style="width: 100%; text-align: center; background: #696969; font-size: 22pt; color: white;">Overtime</div>';
			$("div.title_table").html(str_div);

			// var buttom = '<div> <button type="button" class="btn btn-primary" style="margin-right:5px;width:100px;border: 1px solid white;background:#c48813" data-toggle="modal" data-target="#modal-approved"  >Approve</button> <button type="button" class="btn btn-danger"  style="width:100px;border: 1px solid white;background:#c48813" data-toggle="modal" data-target="#modal-disapproved" onclick="angular.element(this).scope().edit_view()">Disapprove</button> </div>';
			// $("div.buttons").html(buttom);
			// $("div.cutoffinfo").html(`<span style="font-weight:600 !important; color: green !important">Cutoff Period: </span><span ng-bind="dashboard.values.period.pay_start" style="font-weight:600 !important;" ></span> <span ng-show="dashboard.values.period.pay_start" style="font-weight:600 !important;" >to</span> <span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_end" ></span>
			// 						  <span style="font-weight:600 !important; color: green !important;margin-left:15px;">Payroll Period: </span><span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_date" ></span>`);


			// $(".checkcircle").html('<input class="circlCheck" type="checkbox" title="Approve all">');
			// $(".circlCheck").click(function () {
			// 	var ele = $(".circlCheck");
			// 	if ($(ele).is(':checked')) {
			// 		$(".circlCheck2").prop("checked", true);
			// 	} else {
			// 		$(".circlCheck2").prop("checked", false);
			// 	}
			// });

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

		// //Export
		$scope.export = function () {
			var acct		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
			var dfrom		= typeof $scope.search_dfrom === "undefined" ? '' : $scope.search_dfrom  ;
			var dto			= typeof $scope.search_dto === "undefined" ? '' : $scope.search_dto  ;
			var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
			var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
			var url = apiUrl+"admin/tk/app/overtime/export.php?datenow=" + datenow + "&company=" + company + "&dfrom=" + dfrom + "&acct=" + acct + "&dto=" + dto ;
			var conf = confirm("Export to CSV?");
			if(conf == true){
				window.open(url, '_blank');
			}
		}


		// $scope.resetSearch = function(){
		// 	if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 
		// 		$scope.search				= [];
		// 		$scope.search.acct 			= ''; 
		// 		$scope.search.docu 			= '';
		// 		$scope.search.datefrom 		= '';
		// 		$scope.search.dateto 		= '';
		// 		$scope.search.appstat		= '';
		// 		$timeout(function () {	
		// 			$("#btn-refreshh").click();
		// 		}, 100);
		// 	}else{ 
		// 		$timeout(function () {	
		// 			$(".modal-backdrop").remove();
		// 		}, 100);
		// 		$timeout(function () {	
		// 			$window.location.href="#/admin/tk/app/overtimeapp";
		// 		}, 1000);
		// 	};
		// }
		
		$scope.resetCreateAcct = function(){	
			$scope.isSaving=false;
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/app/overtime/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;				
				$scope.add = data;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.changeOTEnd = function(){
			$scope.add.otfdate  = '';
			$scope.add.end_time	= '';
		}
		$scope.changeOTStart = function(){
			$scope.add.otsdate  = '';
			$scope.add.start_time	= '';
			$scope.add.otfdate  = '';
			$scope.add.end_time	= '';
		}
		
		$scope.addOt = function(){
			spinnerService.show('form01spinner');
			$scope.isSaving = true;
			
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.add
			}
			$http.post(apiUrl+'admin/tk/app/overtime/create.php',urlData)
			.then( function (response, status){	
				$scope.isSaving  = false;
				spinnerService.hide('form01spinner');
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
				}else if( data.status == "acct" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify employee";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "shiftdate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Shift Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "startdate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Start Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "enddate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify End Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "starttime" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Start Time";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "endtime" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify End Time";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "invdate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Start/End Dates entered";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "invtime" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = data.msg;
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "plantime" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = data.msg;
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "err1" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = data.msg;
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
					$rootScope.dymodalmsg  = "Overtime created successfully";					
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
	
	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);