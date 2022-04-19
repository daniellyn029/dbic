app.controller('TKTimesheetController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			accounts:[],
			period:[],
			shifttypes:[]
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
				$scope.dashboard.values.period 		= data.period;
				$scope.dashboard.values.shifttypes 	= data.shifttypes;
				$scope.dashboard.values.department 	= data.departments;

				$scope.search_dfrom = $scope.dashboard.values.period.pay_start;
				$scope.search_dto = $scope.dashboard.values.period.pay_end;

				if($scope.search_dfrom!='' && $scope.search_dto!=''){
					$scope.timesheet_details_func();
				}

			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 

	//Table Function
	$scope.timesheet_details_func = function(){
			
		$scope.timesheet_view = [];
		
		var urlData = {
			'dfrom'	: $scope.search_dfrom,
			'dto'	: $scope.search_dto,
			'department':$scope.department,
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/tk/timesheet/view.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;
			
			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.timesheet_view = [];

			}else{
				$scope.timesheet_view = data;

				//GET TOTAL WORK HOURS
				$scope.timesheet_view.forEach(function(item,index){
					var ctr = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr += parseFloat(item1.work_hours);
					})
					$scope.timesheet_view[index].twh=ctr;
				})

				//GET THE TOTAL OF THE TOTAL WORK HOURS
				$scope.timesheet_view.forEach(function(item,index){
					var ctr1 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr1 += parseFloat(item1.total_work_hours);
					})
					$scope.timesheet_view[index].totalwh=ctr1;
				})

				//GET TOTAL EXCESS WORK HOURS
				$scope.timesheet_view.forEach(function(item,index){
					var ctr2 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr2 += parseFloat(item1.excess_work_hours);
					})
					$scope.timesheet_view[index].totalewh=ctr2;
				})

				//GET TOTAL LATE
				$scope.timesheet_view.forEach(function(item,index){
					var ctr3 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr3 += parseFloat(item1.late);
					})
					$scope.timesheet_view[index].totallate=ctr3;
				})

				//GET TOTAL UNDERTIME
				$scope.timesheet_view.forEach(function(item,index){
					var ctr4 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr4 += parseFloat(item1.undertime);
					})
					$scope.timesheet_view[index].totalut=ctr4;
				})

				//GET TOTAL ABSENT
				$scope.timesheet_view.forEach(function(item,index){
					var ctr5 = 0.00;
					item.getVwTimesheet.forEach(function(item1,index1){
						ctr5 += parseFloat(item1.absent);
					})
					$scope.timesheet_view[index].totalabsent=ctr5;
				})

		
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
	}

	//Refresh Page
	$scope.reloadData = function(){

		$scope.timesheet_details_func();

	}

	//Reset Search
	$scope.resetsearch = function(){
		$scope.search_acct	='';
		$scope.search_post 	='';
		$scope.department ='';
	
		
		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);
	}

	//Search Function
	$scope.unitSearch= function(){

		$scope.filter='';

		var urlData = {
			'idsuperior'	: $scope.dashboard.values.accountid,
			'dfrom'			: $scope.search_dfrom,
			'dto'			: $scope.search_dto,
			'search_acct'	: $scope.search_acct,
			'search_post'	: $scope.search_post,
			'department'	: $scope.department
			
		}
		$http.post(apiUrl+"admin/tk/timesheet/search.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.timesheet_view = data;
			$scope.filter = '';
			
			//filtered By function
			$timeout(function () {

				if($scope.search_post == '' || $scope.search_post == null){
					$scope.filter = '';
				}else{
					$scope.filter = $("#select2-search_post-container").text();
				}

				if($scope.department == '' || $scope.department == null){
					$scope.filter = '';
				}else{
					$scope.filter = $("#select2-short3unit-container").text();
				}


				
			}, 100);
			

		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	// //Export
	$scope.export = function () {
		var idsuperior	= typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid;
		var search_acct	= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
		var search_post	= typeof $scope.search_post === "undefined" ? '' : $scope.search_post  ;
		var search_dfrom= typeof $scope.search_dfrom === "undefined" ? '' : $scope.search_dfrom  ;
		var search_dto	= typeof $scope.search_dto === "undefined" ? '' : $scope.search_dto  ;
		var department	= typeof $scope.department === "undefined" ? '' : $scope.department  ;
		var company		= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		var url = apiUrl+"admin/tk/timesheet/export.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&search_post=" + search_post + "&search_acct=" + search_acct + "&search_dfrom=" + search_dfrom + "&search_dto=" + search_dto + "&department=" + department;
		var conf = confirm("Export to CSV?");
		if(conf == true){
			window.open(url, '_blank');
		}
	}
	

	//CutOff Period next and previous button function
	$scope.cutoffData = function( f ){
		if( parseInt( f ) == 0 ){
			$scope.dashboard.setup();
			$scope.search_dfrom 	= $cookieStore.get('pay_start');
			$scope.search_dto 		= $cookieStore.get('pay_end');
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
					$scope.search_dfrom 	= $cookieStore.get('pay_start');
					$scope.search_dto 		= $cookieStore.get('pay_end');
					$scope.unitSearch();
				}else{
					$scope.search_dfrom 		= data.pay_start;
					$scope.search_dto 			= data.pay_end;
					$scope.dashboard.values.period = data;
				}
				$scope.unitSearch();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}




	// OLD -->
	// $scope.setup_timesheet_functions = function(){
	// 	$scope.search				= [];
	// 	$scope.edit					= [];	
	// 	$scope.sumhrs				= [];
	// 	$scope.search.acct			= '';
	// 	$scope.search.datefrom		= $rootScope.currperiod.pay_start; 
	// 	$scope.search.dateto  		= $rootScope.currperiod.pay_end;		
	// 	var vm = this;
	// 	$scope.vm = vm;
	// 	vm.dtOptions = DTOptionsBuilder.newOptions()
	// 		.withOption('ajax', {
	// 			url: apiUrl+'admin/tk/timesheet/data.php',
	// 			type: 'POST',
	// 			data: function(d){
	// 				d.acct			= $scope.search.acct,
	// 				d.dfrom			= $scope.search.datefrom,
	// 				d.dto			= $scope.search.dateto
	// 			}
	// 	})		
	// 	.withDataProp('data')
	// 	.withOption('processing', true)
	// 	.withOption('serverSide', true)
	// 	.withPaginationType('full_numbers')
	// 	.withOption('responsive',true)
	// 	.withOption('autoWidth',false)
	// 	.withDOM('lrtip')
	// 	.withOption('order', [0, 'asc'])
	// 	.withOption('drawCallback', function (settings) {
	// 		var api = this.api();
	// 		$timeout(function () {					
	// 			if (settings.aoData.length > 0) {
	// 				$scope.sumhrs = api.rows().data()[0].total;	
	// 			}else{
	// 				$scope.sumhrs = {late:0,ut:0,absent:0,leave:0,ot:0,reg:0};
	// 			}
	// 		}, 0);			
	// 	});
	// 	vm.dtColumns = [
	// 		DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('shift').withTitle('Shift').withClass('btnTD').notSortable(),			
	// 		DTColumnBuilder.newColumn('in').withTitle('In').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('out').withTitle('Out').withClass('btnTD').notSortable(),			
	// 		DTColumnBuilder.newColumn('late').withTitle('Late').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('ut').withTitle('Under Time').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('absent').withTitle('Absent').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('leavehrs').withTitle('Leave').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('othrs').withTitle('Over Time').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('reghrs').withTitle('Reg Hrs').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn('application').withTitle('Applications').withClass('btnTD').notSortable(),
	// 		DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
	// 		.renderWith(function(data, type, full, meta){	
	// 			var btn	 = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.idacct + '\', \'' + data.work_date + '\')" ><i class="fa fa-eye"></i> View</button>';
	// 			return btn;
	// 		})
	// 	];		
	// 	vm.dtInstance = {};
		
	// 	$scope.unitSearch = function(){	
	// 		if( $scope.search.acct.length < 1 || $scope.search.datefrom.length < 1 || $scope.search.dateto.length < 1 ){ 
	// 			$rootScope.dymodalstat = true;
	// 			$rootScope.dymodaltitle= "Warning!";
	// 			$rootScope.dymodalmsg  = "All fields are required!";
	// 			$rootScope.dymodalstyle = "btn-warning";
	// 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 			$("#dymodal").modal("show");
	// 			return;
	// 		}			
	// 		vm.dtInstance.reloadData();			
	// 	}

	// 	$scope.resetSearch = function(){
	// 		$scope.search				= [];
	// 		$scope.search.acct			= '';
	// 		$scope.search.datefrom		= $rootScope.currperiod.pay_start; 
	// 		$scope.search.dateto  		= $rootScope.currperiod.pay_end;
	// 		$scope.sumhrs				= [];
	// 		$timeout(function () {	
	// 			$("#btn-refreshh").click();
	// 		}, 100);
	// 	}
		
	// 	$scope.setPayPeriod = function(){
	// 		$scope.search.datefrom		= $scope.dashboard.values.period.pay_start; 
	// 		$scope.search.dateto  		= $scope.dashboard.values.period.pay_end;
	// 	}
		
	// 	$scope.edit_view = function( idacct, workdate ){
	// 		$scope.edit	= [];
	// 		var urlData = {
	// 			'accountid'	: $scope.dashboard.values.accountid,
	// 			'idacct'	: idacct,
	// 			'workdate'	: workdate
	// 		}
	// 		$http.post(apiUrl+'admin/tk/timesheet/edit_view.php',urlData)
	// 		.then( function (response, status){			
	// 			var data = response.data;
	// 			if( data.status == "error" ){
	// 				$rootScope.modalDanger();
	// 			}else if( data.status == "notloggedin" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "You are not logged in";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "idacct" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No employee selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "workdate" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No work date selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "empty" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No data returned";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else{
	// 				$scope.edit	= data;
	// 				$scope.edit.orig_idshift= $scope.edit.idshift;
	// 				$scope.edit.orig_datein = $scope.edit.date_in;
	// 				$scope.edit.orig_dateout= $scope.edit.date_out;
	// 				$scope.edit.orig_timein = $scope.edit.in;
	// 				$scope.edit.orig_timeout= $scope.edit.out;
	// 			}				
	// 		}, function(response) {
	// 			$rootScope.modalDanger();
	// 		});
	// 	}
		
	// 	$scope.updateShift = function( data ){
	// 		if( data != '' ){
	// 			if( data != $scope.edit.orig_idshift ){
	// 				$scope.edit.in 		= '';
	// 				$scope.edit.out 	= '';
	// 			}
	// 		}
	// 	}
		
	// 	$scope.editTimeSheet = function( obj ){
	// 		var urlData = {
	// 			'accountid'	: $scope.dashboard.values.accountid,
	// 			'info'		: obj
	// 		}
	// 		$http.post(apiUrl+'admin/tk/timesheet/edit.php',urlData)
	// 		.then( function (response, status){			
	// 			var data = response.data;
	// 			if( data.status == "error" ){
	// 				$rootScope.modalDanger();
	// 			}else if( data.status == "notloggedin" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "You are not logged in";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "idshift" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No Shift selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "date_in" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No Date In selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "date_out" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No Date Out selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "in" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No Time In selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "out" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "No Time Out selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "notcovered" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "Work Date is not covered in the current Pay Period";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "invaliddate" ){
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "Invalid Date Time In or Date Time Out";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "val-err6" ){						
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "Needs to CANCEL/DECLINE LEAVE application";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "val-err7" ){						
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "Needs to CANCEL/DECLINE ATTENDANCE ADJUSTMENT";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "val-err8" ){						
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "Needs to CANCEL/DECLINE OT application";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "invduty" ){						
	// 				$rootScope.dymodalstat = true;
	// 				$rootScope.dymodaltitle= "Warning!";
	// 				$rootScope.dymodalmsg  = "Invalid Shift Schedule selected";
	// 				$rootScope.dymodalstyle = "btn-warning";
	// 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
	// 				$("#dymodal").modal("show");
	// 				return;
	// 			}else if( data.status == "success" ){
	// 				$timeout(function () {	
	// 					$("#btn-refreshh").click();
	// 				}, 1000);
	// 				$("#editModal").modal("hide");	
	// 			}
	// 		}, function(response) {
	// 			$rootScope.modalDanger();
	// 		});
	// 	}
	// }
	
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