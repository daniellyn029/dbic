app.controller('MNGAppOvertimeController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/mng/sidebar/index.html";
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
			accounts:[],
			period:[]
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
				$scope.dashboard.values.period		= data.period;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.app_overtime_functions = function(){
		$scope.add 					= [];
		$scope.edit					= [];
		$scope.search				= [];		
		$scope.search.acct 			= ''; 
		$scope.search.docu 			= '';
		if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 		
			$scope.search.datefrom 		= $rootScope.currperiod.pay_start;
			$scope.search.dateto 		= $rootScope.currperiod.pay_end;
			$scope.search.appstat		= '';
		}else{ 
			$scope.search.datefrom 		= $location.search().df; 
			$scope.search.dateto 		= $location.search().dt; 
			$scope.search.appstat		= $location.search().st;
		}
		
		if( typeof($scope.search.datefrom)==='undefined' ||
			typeof($scope.search.dateto)==='undefined' ){ 
			$scope.search.datefrom 		= $cookieStore.get('pay_start');
			$scope.search.dateto 		= $cookieStore.get('pay_end');
		}
		
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/app/overtime/data.php',
				type: 'POST',
				data: function(d){
					d.idsuperior	= $scope.dashboard.values.accountid,
					d.units			= $cookieStore.get('dptmtrx'),
					d.acct			= $scope.search.acct,
					d.docu			= $scope.search.docu,
					d.from			= $scope.search.datefrom,
					d.to			= $scope.search.dateto	,
					d.appstat		= $scope.search.appstat				
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
        .withOption('autoWidth',false)
		.withDOM('<"cutoff dataTables_length"><"toolbar dataTables_length"><"toolbuttons dataTables_filter"><"cutoffinfo dataTables_length"><"title_table">t<"foot_con"<"buttons dataTables_info">p>')
		.withOption('fnRowCallback', function( nRow, aData, iDisplayIndex, iDisplayIndexFull ){
			$(".circlCheck").prop("checked", false);
		})
		.withOption('order', [1, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn(null).withTitle('').notSortable().withClass('btnTD checkcircle')
			.renderWith(function(data, type, full, meta){
				var btn = '';
				if( data.ot_status == "Pending" ) {
					btn  = '<input ng-disabled="isSaving" type="checkbox" class="circlCheck2" value="'+ data.id +'">';
				}
				return btn;
			}),
			DTColumnBuilder.newColumn('empname').withTitle('Employee').withClass('btnTD'),
			DTColumnBuilder.newColumn('date').withTitle('Overtime Date').withClass('btnTD'),
			
			DTColumnBuilder.newColumn(null).withTitle('OT Application').withClass('btnTD').notSortable().renderWith(function(data, type, full, meta){
				btn  = '<span style="font-weight:600 !important; color: green !important"> ' + data.ot_app + ' </span>';
				return btn;
			}),
			
			DTColumnBuilder.newColumn(null).withTitle('Planned Units').withClass('btnTD').notSortable().renderWith(function(data, type, full, meta){
				if( data.ot_status == "Pending" && data.appr_hour_stat == "1" ) {
					btn  = '<span style="font-weight:600 !important; color: green !important"> ' + data.units2 + ' </span>';
				}else if( data.appr_hour_stat == "1" ){
					btn  = '<span style="font-weight:600 !important; color: green !important"> ' + data.units2 + ' </span>';
				}else{
					btn  = '<span style="font-weight:600 !important; color: red !important"> ' + data.units2 + ' </span>';
				}
				return btn;
			}),
			
			DTColumnBuilder.newColumn(null).withTitle('Actual Units').withClass('btnTD').notSortable().renderWith(function(data, type, full, meta){
				if( data.ot_status == "Pending" && data.appr_hour_stat == "2" ) {
					btn  = '<span style="font-weight:600 !important; color: green !important"> ' + data.units + ' </span>';
				}else if( data.appr_hour_stat == "2" ){
					btn  = '<span style="font-weight:600 !important; color: green !important"> ' + data.units + ' </span>';
				}else{
					btn  = '<span style="font-weight:600 !important; color: red !important"> ' + data.units + ' </span>';
				}
				return btn;
			}),
			
			
			DTColumnBuilder.newColumn('remarks').withTitle('Reason').withClass('btnTDR').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTD').renderWith(function(data, type, full, meta){
				var btn = '';
				if( data.ot_status == "Approved" ) {
					btn  = '<span style="font-weight:600 !important; color: green !important"> Approved </span>';
				}else{
					btn  = '<span style="font-weight:600 !important; color: red !important"> ' + data.ot_status + ' </span>';
				}
				return btn;
			})
		];
		vm.dtInstance = {};
		$(document).ready(function () {
			$("div.cutoff").html('<div class="btn-group"><button id="cnext" onclick="angular.element(this).scope().cutoffData(\'1\')" ><<</button><button onclick="angular.element(this).scope().cutoffData(\'0\')" >CutOff Period</button><button id="cprev" onclick="angular.element(this).scope().cutoffData(\'2\')" >>></button></div>');
			
			$("div.toolbuttons").html('<button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().xport()"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#modal-search" ><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().dtInstance.reloadData()" id="btn-refreshh" ><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>');
			
			var str_div = '<div style="width: 100%; text-align: center; background: #353331; font-size: 22pt; color: white;">Overtime</div>';
			$("div.title_table").html(str_div);
			
			var buttom  = '<div> <button type="button" class="btn btn-primary" style="margin-right:5px;width:100px;border: 1px solid white;background:#353331" data-toggle="modal" data-target="#modal-approved" onclick="angular.element(this).scope().edit_view()" >Approve</button> <button type="button" class="btn btn-danger"  style="width:100px;border: 1px solid white;background:#353331" data-toggle="modal" data-target="#modal-disapproved" onclick="angular.element(this).scope().edit_view()">Disapprove</button> </div>';
			$("div.buttons").html(buttom);
			$("div.cutoffinfo").html(`<div ng-show=" dashboard.values.period.pay_start == search.datefrom && dashboard.values.period.pay_end == search.dateto "><span style="font-weight:600 !important; color: green !important">Cutoff Period: </span><span ng-bind="dashboard.values.period.pay_start" style="font-weight:600 !important;" ></span> <span ng-show="dashboard.values.period.pay_start" style="font-weight:600 !important;" >to</span> <span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_end" ></span>
									  <span style="font-weight:600 !important; color: green !important;margin-left:15px;">Payroll Period: </span><span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_date" ></span></div>`);
			
			
			$(".checkcircle").html('<input class="circlCheck" type="checkbox" title="Approve all">');
			$(".circlCheck").click(function() {
				var ele = $(".circlCheck");
				if ($(ele).is(':checked')){
					$(".circlCheck2").prop("checked", true);
				}else{
					$(".circlCheck2").prop("checked", false);
				}
			});
			
			$("div.toolbar").html(`<button disabled style="color:white;background-color: green; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </button> 
                
				<input type="text" placeholder="Date from" readonly searchdatepickers2 ng-model="search.datefrom" maxlength="10" id="search_dfrom" name="search_dfrom"  required  />
				<input type="text" placeholder="Date To"   readonly searchdatepickers2 ng-model="search.dateto"   maxlength="10" id="search_dto"   name="search_dto"    required  />
				
				 
                <button onclick="angular.element(this).scope().unitSearch()" style="color : white;background-color: green; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);
			
			$compile($("div.cutoffinfo"))($scope);
			$compile($("div.toolbar"))($scope);
			
		});
		
		$scope.xport = function () {			
			var idsuperior	= typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid  ;
			var acct		= typeof $scope.search.acct === "undefined" ? '' : $scope.search.acct  ;
			var docu		= typeof $scope.search.docu === "undefined" ? '' : $scope.search.docu  ;
			var from		= typeof $scope.search.datefrom === "undefined" ? '' : $scope.search.datefrom  ;
			var to			= typeof $scope.search.dateto === "undefined" ? '' : $scope.search.dateto  ;
			var appstat		= typeof $scope.search.appstat === "undefined" ? '' : $scope.search.appstat  ;
			var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
			var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
			
			var units		= $cookieStore.get('dptmtrx');
			var url = apiUrl+"admin/tk/app/overtime/xport.php?units="+units+"&datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&acct=" + acct + "&docu=" + docu + "&from=" + from + "&to=" + to + "&appstat=" + appstat;
			var conf = confirm("Export to CSV?");
			if(conf == true){
				window.open(url, '_blank');
			}
		}
		
		$scope.cutoffData = function( f ){
			if( parseInt( f ) == 0 ){
				$scope.dashboard.setup();
				$scope.search.datefrom 		= $cookieStore.get('pay_start');
				$scope.search.dateto 		= $cookieStore.get('pay_end');
				$scope.unitSearch();
			}else{
				var urlData = {
					'idperiod'  : $scope.dashboard.values.period.id,
					'f'		 	: f
				}
				$http.post(apiUrl+'payperiod.php',urlData)
				.then( function (response, status){			
					var data = response.data;				
					if( data.length == 0 ){
						$scope.dashboard.setup();
						$scope.search.datefrom 		= $cookieStore.get('pay_start');
						$scope.search.dateto 		= $cookieStore.get('pay_end');
						$scope.unitSearch();
					}else{
						$scope.search.datefrom 		= data.pay_start;
						$scope.search.dateto 		= data.pay_end;
						$scope.dashboard.values.period = data;
					}
					$scope.unitSearch();
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
		}
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 
				//$scope.search				= [];
				$scope.search.acct 			= ''; 
				$scope.search.docu 			= '';
				//$scope.search.datefrom 		= '';
				//$scope.search.dateto 		= '';
				$scope.search.appstat		= '';
				$timeout(function () {	
					$("#btn-refreshh").click();
				}, 100);
			}else{ 
				$timeout(function () {	
					$(".modal-backdrop").remove();
				}, 100);
				$timeout(function () {	
					$window.location.href="#/admin/mng/app/overtimeapp";
				}, 1000);
			};
		}
		
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
		
		$scope.filterAcct = function(acct){
			if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
				return acct.id != '0';
			}else{
				if( $cookieStore.get('dptmtrx').length > 0 ){
					return acct.idsuperior == $cookieStore.get('dptmtrx') || ( Array.isArray($cookieStore.get('dptmtrx')) && $cookieStore.get('dptmtrx').indexOf(acct.idsuperior) );
				}else{
					return acct.idsuperior == $scope.dashboard.values.accountid;
				}
			}
		}
		
		$scope.edit_view = function( id ){
			var arr_id = [];
			$(".circlCheck2").each(function(){
				var val = $(this).val();
				if( $(this).is(':checked') ){
					arr_id.push( val );
				}
			});
			
			if( arr_id.length > 0 ){
				$scope.edit = [];
				var urlData = {
					'id': arr_id
				}
				$http.post(apiUrl+'admin/mng/overtime/edit_view.php',urlData)
				.then( function (response, status){			
					var data = response.data;
					$scope.edit = data;	
					if( $scope.edit.ctr_1 > 0 && $scope.edit.ctr_2 > 0 ){
						$(".modal").modal("hide");
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Invalid selection. Selected requests has different Status";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( $scope.edit.ctr_1 > 0 && $scope.edit.ctr_2 == 0 ){
						$scope.edit.curr_appr = "1";
					}else if( $scope.edit.ctr_1 == 0 && $scope.edit.ctr_2 > 0 ){
						$scope.edit.curr_appr = "2";
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}else{
				$scope.edit = [];
			}
		}
		
		$scope.resetReason = function(){
			$scope.edit.reason = '';
		}
		
		$scope.editreq = function(o,hour){			
			if (typeof($scope.edit.data)==='undefined'){ 		
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "No request selected";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			if( $scope.edit.data.length > 0 ){
				$scope.edit.stat 		= o;
				$scope.edit.approve_hr	= hour;
				
				console.log( $scope.edit );
				
				$scope.isSaving = true;
				var urlData = {
					'accountid'	: $scope.dashboard.values.accountid,
					'info'		: $scope.edit
				}
				$http.post(apiUrl+'admin/mng/overtime/edit.php',urlData)
				.then( function (response, status){
					$scope.isSaving = false;
					var data = response.data;
					if( data.status == "error" ){
						$rootScope.modalDanger();
					}else if( data.status == "noreason" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify your reason for not approving.";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "notapprover1" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not Approver 1";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "notapprover2" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not Approver 2";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "noactual_hrs" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You can not approve actual hours.";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "noid" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No request selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else{
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 1000);
						$(".modal").modal("hide");
						if( data.err.length > 0 ){
							var msg="Warning found:<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> NAME </th> <th> REASON </th> </tr></thead> <tbody>";
							var trow = "";
							data.err.forEach(function(item, index){
								trow = trow + "<tr><td>"+item.date+"</td><td>"+item.name+"</td><td>"+item.err+"</td></tr>";						
							});
							trow = trow + "</tbody></table>";
							$rootScope.dymodalmsg  = msg + trow;
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
						}else{
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Success!";
							$rootScope.dymodalmsg  = "Request updated successfully";
							$rootScope.dymodalstyle = "btn-success";
							$rootScope.dymodalicon = "fa fa-check";				
							$("#dymodal").modal("show");
						}
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}else{
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "No request selected";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}
	}
	
	$scope.dashboard.setup();
	$rootScope.getCompanyName();
}]);