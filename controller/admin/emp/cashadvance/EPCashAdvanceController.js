app.controller('EPCashAdvanceController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/emp/cashadvance/sidebar.html";
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
			empstatus:[],
			joblvl:[],
			positions: [],
			labors:[],
			accounts:[],
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
			$http.post(apiUrl+'admin/hr/employee/settings.php',urlData)
			.then( function (response, status){			
				
				var data = response.data;
				$scope.dashboard.values.accounts 	= data.accounts;	
				$scope.dashboard.values.emptypes 	= data.emptypes;
				$scope.dashboard.values.accttype 	= data.acctypes;
				$scope.dashboard.values.civilstat 	= data.civilstat;
				$scope.dashboard.values.empstatus	= data.empstatus;
				$scope.dashboard.values.joblvl		= data.joblvl;
				$scope.dashboard.values.positions	= data.positions;
				$scope.dashboard.values.paygrps		= data.paygrps;
				$scope.dashboard.values.labors		= data.labors;
				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
    }
	
	$scope.files2 = function(id){
		var file = id;
		window.location = '/dbic/assets/php/admin/emp/cashadvance/attachments/download.php?file='+file;
	}
	
	$scope.currentTable = function(){
		$scope.search			= [];
		$scope.search.datecreate= ''; 
		$scope.search.effectdate= '';
		$scope.search.acct		= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/emp/cashadvance/data.php',
				type: 'POST',
				data: function(d){
					d.accountid  	= $scope.dashboard.values.accountid,
					d.accteid  		= $scope.dashboard.values.accteid,
					d.datecreate 	= $scope.search.datecreate,
					d.docid	 		= $scope.search.docid,
					d.acct		 	= $scope.search.acct
				}
		})
		.withOption('drawCallback', function(settings) {
			//var url = $location.url();
			var idValue = $location.search().req; 		
			$('#'+idValue).click();
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"buttons dataTables_filter">lrtip')
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('refferenceno').withTitle('Document ID').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn(null).withTitle('Employee Name').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.datecreated && data.timecreated){
					var a = '<div>'+' '+data.empid+' '+data.empname+' </div>';
				}else{
					var a = '';
				}
				return a;
			}),
            DTColumnBuilder.newColumn(null).withTitle('Date/Time Created').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.datecreated && data.timecreated){
					var a = '<div>'+' '+data.datecreated+' ('+data.timecreated+') </div>';
				}else{
					var a = '';
				}
				return a;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTD').notSortable()
			.renderWith(function(data, type, full, meta){
				var statusview=''; // Status
				//Status Icons
				if(data.pending=='1'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending HR' + '</span>';
				}else if(data.pending=='2'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Accounting' + '</span>';
				}else if(data.pending=='3'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Employee Confirmation' + '</span>';
				}else if(data.pending=='4'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending General Manager' + '</span>';
				}else if(data.pending=='5'){
				   statusview = '<span class="label label-warning" style="font-size: 85%" >' + 'For Deposit' + '</span>';
				}else{
					statusview = '';
				}
				return statusview;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
                    return '<button id="' + data.id + '" class="btn btn-flat btn-sm btn-success" style="background-color:#f39c12;border-color:white;" data-target="#CashAdvanceView" data-toggle="modal" onclick="angular.element(this).scope().getDataByIdCurrent(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> View</button>';
            }),
		];
		vm.dtInstance = {};
		$(document).ready(function () {
            $("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background-color:#f39c12;color:white" class="btn btn-flat pull-right" ng-click="dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;background-color:#f39c12;color:white" class="btn btn-flat pull-right" title="Search" data-toggle="modal" data-target="#modal-search"  ><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button>')

			   
			$("#btn-refreshh").on('click', function () {
				vm.dtInstance.reloadData();
			});
		});

		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search			= [];
			$scope.search.datecreate= ''; 
			$scope.search.effectdate= '';
			$scope.search.acct		= ''; 
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.getDataByIdCurrent = function(id){
			var urlData = {
				'accountid'	: $cookieStore.get('acct_id'),
				'form_id'	: '4',
				'id'		: id
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/getDataByIdCurrent.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.viewCurrent = [];
				}else{
					$scope.viewCurrent = result.data[0];
					$scope.viewCurrent.loanamount = addCommas($scope.viewCurrent.loanamount);
				}
			},function(error){}).finally(function(){});
		}
	}
	
	$scope.archiveTable = function(){
		$scope.searchArchive			= [];
		$scope.searchArchive.datecreate	= ''; 
		$scope.searchArchive.effdate	= '';
		$scope.searchArchive.acct		= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/emp/cashadvance/dataArchive.php',
				type: 'POST',
				data: function(d){
					d.accountid 	= $scope.dashboard.values.accountid,
					d.accteid  		= $scope.dashboard.values.accteid,
					d.datecreate 	= $scope.searchArchive.datecreate,
					d.docid	 		= $scope.searchArchive.docid,
					d.acct		 	= $scope.searchArchive.acct
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"buttons dataTables_filter">lrtip')
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('refferenceno').withTitle('Document ID').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn(null).withTitle('Employee Name').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.datecreated && data.timecreated){
					var a = '<div>'+' '+data.empid+' '+data.empname+' </div>';
				}else{
					var a = '';
				}
				return a;
			}),
            DTColumnBuilder.newColumn(null).withTitle('Date/Time Created').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.datecreated && data.timecreated){
					var a = '<div>'+' '+data.datecreated+' ('+data.timecreated+') </div>';
				}else{
					var a = '';
				}
				return a;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTD').notSortable()
			.renderWith(function(data, type, full, meta){
				var statusview=''; // Status
				if(data.idstatus=='1'){
					statusview = '<span class="label label-success" style="font-size: 85%">' + 'Approved' + '</span>';
				}else if(data.idstatus=='2'){
					if(data.pending=='4'){
						statusview = '<span class="label label-danger" style="font-size: 85%">' + 'Declined' + '</span>';
					}else{
						statusview = '<span class="label label-danger" style="font-size: 85%">' + 'Disapproved' + '</span>';
					}
				}else if(data.idstatus=='4'){
					statusview = '<span class="label label-danger" style="font-size: 85%">' + 'Cancelled' + '</span>';
				}else{
					statusview = '';
				}
				return statusview;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
                    return '<button id="' + data.id + '" class="btn btn-flat btn-sm btn-success" style="background-color:#f39c12;border-color:white;" data-target="#CashAdvanceViewArchive" data-toggle="modal" onclick="angular.element(this).scope().getDataByIdArchive(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> View</button>';
            }),
		];
		vm.dtInstanceArchive = {};
		$(document).ready(function () {
            $("div.buttons").html('		<button id="btn-refresh-archive" style="margin-right:3px;background-color:#f39c12;border-color:white;" class="btn btn-flat btn-success pull-right" ng-click="dtInstanceArchive.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;background-color:#f39c12;border-color:white;" class="btn btn-flat btn-success pull-right" title="Search" data-toggle="modal" data-target="#modal-search-archive"  ><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button>')

			   
			$("#btn-refresh-archive").on('click', function () {
				vm.dtInstanceArchive.reloadData();
			});
		});

		$scope.unitSearchArchive = function(){	
			vm.dtInstanceArchive.reloadData();
			$("#modal-search-archive").modal("hide");		
		}

		$scope.resetSearchArchive = function(){
			$scope.searchArchive			= [];
			$scope.searchArchive.datecreate	= ''; 
			$scope.searchArchive.docid		= '';
			$scope.searchArchive.acct		= ''; 
			$timeout(function () {	
				$("#btn-refresh-archive").click();
			}, 100);
		}

		$scope.getDataByIdArchive = function(id){
			$scope.viewArchive = [];
			var urlData = {
				'accountid'	: $cookieStore.get('acct_id'),
				'form_id'	: '4',
				'id'		: id
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/getDataByIdCurrent.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.viewArchive = [];
				}else{
					$scope.viewArchive = result.data[0];

					//Makes the checkbox/radio unclickable but not greyed out
					$("#medcert2").click(function() { return false; });
					$("#docpresc2").click(function() { return false; });
					$("#ormeddoc2").click(function() { return false; });
					$("#assessform2").click(function() { return false; });
					$("#billstate2").click(function() { return false; });
					$("#orsch2").click(function() { return false; });
					$("#pbsor2").click(function() { return false; });
					$("#hospmedcert2").click(function() { return false; });

					// $(':radio:not(:checked)').attr('disabled', true);

					// if($scope.viewArchive.reason=='Health/Sickness/Medication'){
					// 	$('#educ2').attr('disabled', true);
					// 	$('#hosp2').attr('disabled', true);
					// }

					// if($scope.viewArchive.reason=='Education'){
					// 	$('#health2').attr('disabled', true);
					// 	$('#hosp2').attr('disabled', true);
					// }

					// if($scope.viewArchive.reason=='Hospitalization'){
					// 	$('#health2').attr('disabled', true);
					// 	$('#educ2').attr('disabled', true);
					// }



					$scope.viewArchive.loanamount = addCommas($scope.viewArchive.loanamount);

				}
			},function(error){}).finally(function(){});
		}
	}
	
	$scope.approversetupTable = function(){
		$scope.search			= [];
		$scope.search.empid 	= ''; 
		$scope.search.empname  	= '';
		$scope.search.type 		= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/emp/cashadvance/dataApproverSetup.php',
				type: 'POST',
				data: function(d){
					d.accountid = $scope.dashboard.values.accountid
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
            DTColumnBuilder.newColumn(null).withTitle('Approver 1').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.fullname1a!=' '){
					var a='<div>'+' '+'(1A)'+' '+data.fullname1a+'</div>';
				}else{
					var a='';
				}
				if(data.fullname1b!=' '){
					var b='<div>'+' '+'(1B)'+' '+data.fullname1b+'</div>';
				}else{
					var b='';
				}
				return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 2').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.fullname2a!=' '){
					var a='<div>'+' '+'(2A)'+' '+data.fullname2a+'</div>';
				}else{
					var a='';
				}
				if(data.fullname2b!=' '){
					var b='<div>'+' '+'(2B)'+' '+data.fullname2b+'</div>';
				}else{
					var b='';
				}
				return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 3').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				var a = 'Employee Confirmation'
                return a;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 4').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.fullname4a!=' '){
					var a='<div>'+' '+'(4A)'+' '+data.fullname4a+'</div>';
				}else{
					var a='';
				}
				if(data.fullname4b!=' '){
					var b='<div>'+' '+'(4B)'+' '+data.fullname4b+'</div>';
				}else{
					var b='';
				}
				return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 5').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.fullname5a!=' '){
					var a='<div>'+' '+'(5A)'+' '+data.fullname5a+'</div>';
				}else{
					var a='';
				}
				if(data.fullname5b!=' '){
					var b='<div>'+' '+'(5B)'+' '+data.fullname5b+'</div>';
				}else{
					var b='';
				}
				return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTD').notSortable()
            .renderWith(function(data, type, full, meta){
                var statusview=''; // Status
                
                //Status Icons
                if(data.status=='ACTIVE'){
                    statusview = '<span class="label label-primary" style="font-size: 80%">' + data.status + '</span>';
                }else if(data.status=='BLOCK'){
					statusview = '<span class="label label-danger" style="font-size: 80%">' + data.status + '</span>';
				}else if(data.status=='INACTIVE'){
					statusview = '<span class="label label-warning" style="font-size: 80%">' + data.status + '</span>';
				}else{
                    statusview = '';
                }
                
                return statusview;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
                    return '<button class="btn btn-flat btn-sm btn-success" style="background-color:#f39c12;border-color:white" data-target="#sequence" data-toggle="modal" onclick="angular.element(this).scope().getApproverList(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> Sequence</button>';
            }),
		];
		vm.dtInstanceApproverSetup = {};
		$(document).ready(function () {
            $("div.buttons").html('		<button id="btn-refreshh" style="margin-right:3px;background-color:#f39c12;border-color:white" class="btn btn-flat btn-success pull-right" ng-click="dtInstanceApproverSetup.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button>')

			   
			$("#btn-refreshh").on('click', function () {
				vm.dtInstanceApproverSetup.reloadData();
			});
		});

		$scope.allEmployeeFunc = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post("/dbic/assets/php/allEmployee.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.allEmployee = [];
				}else{
					$scope.allEmployee = result.data;
				}
			},function(error){}).finally(function(){});
		}
		
		$scope.saveApproverSetup = function(){
			/**Approver 1A and 1B Trapping */
			if($scope.sequence.approver1a==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please assign account on Approver 1A.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			// if($scope.sequence.approver1b==""){
			// 	$rootScope.dymodalstat = true;
			// 	$rootScope.dymodaltitle= "Warning!";
			// 	$rootScope.dymodalmsg  = "Please assign account on Approver 1B.";
			// 	$rootScope.dymodalstyle = "btn-warning";
			// 	$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			// 	$("#dymodal").modal("show");
			// 	return;
			// }
			/**Approver 1A and 1B Trapping */

			/**Approver 2A and 2B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 2 ){
				if($scope.sequence.approver2a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign account on Approver 2A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				// if($scope.sequence.approver2b==""){
				// 	$rootScope.dymodalstat = true;
				// 	$rootScope.dymodaltitle= "Warning!";
				// 	$rootScope.dymodalmsg  = "Please assign account on Approver 2B.";
				// 	$rootScope.dymodalstyle = "btn-warning";
				// 	$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				// 	$("#dymodal").modal("show");
				// 	return;
				// }
			}
			/**Approver 2A and 2B Trapping */

			/**Approver 4A and 4B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 4 ){
				if($scope.sequence.approver4a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign account on Approver 4A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				// if($scope.sequence.approver3b==""){
				// 	$rootScope.dymodalstat = true;
				// 	$rootScope.dymodaltitle= "Warning!";
				// 	$rootScope.dymodalmsg  = "Please assign account on Approver 3B.";
				// 	$rootScope.dymodalstyle = "btn-warning";
				// 	$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				// 	$("#dymodal").modal("show");
				// 	return;
				// }
			}
			/**Approver 3A and 3B Trapping */

			/**Approver 5A and 5B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 5 ){
				if($scope.sequence.approver5a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign account on Approver 5A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				// if($scope.sequence.approver5b==""){
				// 	$rootScope.dymodalstat = true;
				// 	$rootScope.dymodaltitle= "Warning!";
				// 	$rootScope.dymodalmsg  = "Please assign account on Approver 5B.";
				// 	$rootScope.dymodalstyle = "btn-warning";
				// 	$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				// 	$("#dymodal").modal("show");
				// 	return;
				// }
			}
			/**Approver 5A and 5B Trapping */
			
            $scope.isSaving = true;
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'sequence': $scope.sequence
            }
            console.log(urlData);
            $http.post(apiUrl+'admin/emp/cashadvance/saveApproverSetup.php',urlData)
            .then( function (response, status){		
                var data = response.data;
                $scope.isSaving = false;
                //Validation
                if(data.status=='empty'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "You are not logged in";
                    $rootScope.dymodalstyle = "";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }else if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else if(data.status=='success'){
                    $("#sequence").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Updated succesfully";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    vm.dtInstanceApproverSetup.reloadData();
                }
            }, function(response) {
                $rootScope.modalDanger();
            });
        }

        $scope.getApproverList = function(id){
			$scope.allEmployeeFunc();
            $scope.isSaving = true;

            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'sequence': $scope.sequence,
                'id': id
            }
            $http.post(apiUrl+'admin/emp/cashadvance/getApprovers.php',urlData)
            .then( function (response, status){
                $scope.isSaving = false;		
                var data = response.data;
                $scope.sequence = data[0];
    
            }, function(response) {
                $rootScope.modalDanger();
            });
        }
	}
	
    $scope.showCashAdvanceEntryModal = function(){
		$scope.entry = [];
		var urlData = {
			'accountid': $scope.dashboard.values.accountid
		}
		$http.post(apiUrl+'admin/emp/cashadvance/newentryview.php',urlData)
		.then( function (response, status){		
			var data = response.data;
			$scope.entry = data;
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	$scope.updateEntryCashAdvance= function( file ){

		var today = new Date();
		var dd = today.getDate();

		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		if(dd<10) 
		{
			dd='0'+dd;
		} 

		if(mm<10) 
		{
			mm='0'+mm;
		} 

		var date = yyyy+'-'+mm+'-'+dd;

		if(date >= $scope.viewCurrent.payabledate){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Payabale date must be beyond today's date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if($scope.viewCurrent.reason==''||$scope.viewCurrent.reason==null){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please select reason for salary advance";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.viewCurrent.reason=='Health/Sickness/Medication'){
			if($scope.viewCurrent.medcert==0&&$scope.viewCurrent.docpresc==0&&$scope.viewCurrent.ormeddoc==0){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Attachment/s required for <b>Health/Sickness/Medication</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.medcert==1&&($scope.viewCurrent.aFile[0]==''||$scope.viewCurrent.aFile[0]==null)&&($scope.viewCurrent.medcertfile==''||$scope.viewCurrent.medcertfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Medical Certificate</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.docpresc==1&&($scope.viewCurrent.aFile[1]==''||$scope.viewCurrent.aFile[1]==null)&&($scope.viewCurrent.docprescfile==''||$scope.viewCurrent.docprescfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Doctor's Prescription</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.ormeddoc==1&&($scope.viewCurrent.aFile[2]==''||$scope.viewCurrent.aFile[2]==null)&&($scope.viewCurrent.ormeddocfile==''||$scope.viewCurrent.ormeddocfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Official receipt (Medicine/Doctor's Fee)</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if($scope.viewCurrent.reason=='Education'){
			if($scope.viewCurrent.assessform==0&&$scope.viewCurrent.billstate==0&&$scope.viewCurrent.orsch==0){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Attachment/s required for <b>Education</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.assessform==1&&($scope.viewCurrent.aFile[3]==''||$scope.viewCurrent.aFile[3]==null)&&($scope.viewCurrent.assessformfile==''||$scope.viewCurrent.assessformfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Assessment Form</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.billstate==1&&($scope.viewCurrent.aFile[4]==''||$scope.viewCurrent.aFile[4]==null)&&($scope.viewCurrent.billstatefile==''||$scope.viewCurrent.billstatefile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Billing Statement</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.orsch==1&&($scope.viewCurrent.aFile[5]==''||$scope.viewCurrent.aFile[5]==null)&&($scope.viewCurrent.orschfile==''||$scope.viewCurrent.orschfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Official receipt (School Fee)</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if($scope.viewCurrent.reason=='Hospitalization'){
			if($scope.viewCurrent.pbsor==0&&$scope.viewCurrent.hospmedcert==0){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Attachment/s required for <b>Hospitalization</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.pbsor==1&&($scope.viewCurrent.aFile[6]==''||$scope.viewCurrent.aFile[6]==null)&&($scope.viewCurrent.pbsorfile==''||$scope.viewCurrent.pbsorfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Partial Billing Statement or Official Receipt</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.viewCurrent.hospmedcert==1&&($scope.viewCurrent.aFile[7]==''||$scope.viewCurrent.aFile[7]==null)&&($scope.viewCurrent.hospmedcertfile==''||$scope.viewCurrent.hospmedcertfile==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Medical Certificate</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[0]!=null && file[0].length != 0){
			if(file[0]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Medical Certificate</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[1]!=null && file[1].length != 0){
			if(file[1]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Doctor's Prescription</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[2]!=null && file[2].length != 0){
			if(file[2]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Official receipt (Medicine/Doctor's Fee)</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[3]!=null && file[3].length != 0){
			if(file[3]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Assessment Form</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[4]!=null && file[4].length != 0){
			if(file[4]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Billing Statement</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[5]!=null && file[5].length != 0){
			if(file[5]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Official receipt (School Fee)</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[6]!=null && file[6].length != 0){
			if(file[6]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Partial Billing Statement or Official Receipt</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[7]!=null && file[7].length != 0){
			if(file[7]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Medican Certificate</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if($scope.viewCurrent.explanation==''||$scope.viewCurrent.explanation==null){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Explanation is required";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.viewCurrent.loanamount==''||$scope.viewCurrent.loanamount==null||$scope.viewCurrent.loanamount==0){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please input cash advance loan amount";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.viewCurrent.payabledate==''||$scope.viewCurrent.payabledate==null){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please input payable payroll date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.viewCurrent.terms==''||$scope.viewCurrent.terms==null||$scope.viewCurrent.terms==0){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please input repay term/s";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if ($scope.viewCurrent.loanamount.indexOf(',') > -1) { 
			var a= $scope.viewCurrent.loanamount;
			a=a.replace(/\,/g,'');
		}else{
			var a= $scope.viewCurrent.loanamount;
		}

		$scope.viewCurrent.loanamount = parseFloat(a).toFixed(2);
		
		$scope.isSaving = true;
		Upload.upload({
			url: apiUrl+'admin/emp/cashadvance/editEntry.php',
			method: 'POST',
			file: file,
			data: {
				'accountid'	: 	$scope.dashboard.values.accountid,
				'form_id'	:	'4',
				'entry'		:	$scope.viewCurrent,
				'targetPath': 	'../../../admin/emp/cashadvance/attachments/'						
			}
		}).then(function (response) {
			var data = response.data;
			$scope.isSaving = false;
			if( data.status == "error" ){
				$rootScope.modalDanger();
				return;
			}else if( data.status == "notloggedin" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "You are not logged in";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "error-prog" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Already in progress";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "entryExists" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Entry already exists";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "tblfull" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Records already reached limit. Please contact system admin/creator";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='error-upload-type'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Only png, jpg, pdf, and jpeg files are accepted";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='error-iddoc'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "No file uploaded or you forgot to choose type of document uploaded";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='haspending'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Employee has pending request";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='invdate'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Effective Date";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{	
				$timeout(function () {	
					$("#btn-refreshh").click();
				}, 100);				
				$("#CashAdvanceView").modal("hide");
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Success!";
				$rootScope.dymodalmsg  = "Request updated successfully with refference no. " +data.refno ;
				$rootScope.dymodalstyle = "btn-success";
				$rootScope.dymodalicon = "fa fa-check";				
				$("#dymodal").modal("show");
			}							
		}, function (response) {
			if (response.status > 0){
				$rootScope.modalDanger();
			}
		});
		
	}
	
	$scope.saveEntryCashAdvance= function( file ){

		var today = new Date();
		var dd = today.getDate();

		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		if(dd<10) 
		{
			dd='0'+dd;
		} 

		if(mm<10) 
		{
			mm='0'+mm;
		} 

		var date = yyyy+'-'+mm+'-'+dd;

		if(date >= $scope.entry.payabledate){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Payabale date must be beyond today's date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.reason==''||$scope.entry.reason==null){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please select reason for salary advance";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.reason=='Health/Sickness/Medication'){
			if($scope.entry.medcert==0&&$scope.entry.docpresc==0&&$scope.entry.ormeddoc==0){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Attachment/s required for <b>Health/Sickness/Medication</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.medcert==1&&($scope.entry.aFile[0]==''||$scope.entry.aFile[0]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Medical Certificate</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.docpresc==1&&($scope.entry.aFile[1]==''||$scope.entry.aFile[1]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Doctor's Prescription</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.ormeddoc==1&&($scope.entry.aFile[2]==''||$scope.entry.aFile[2]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Official receipt (Medicine/Doctor's Fee)</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if($scope.entry.reason=='Education'){
			if($scope.entry.assessform==0&&$scope.entry.billstate==0&&$scope.entry.orsch==0){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Attachment/s required for <b>Education</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.assessform==1&&($scope.entry.aFile[3]==''||$scope.entry.aFile[3]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Assessment Form</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.billstate==1&&($scope.entry.aFile[4]==''||$scope.entry.aFile[4]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Billing Statement</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.orsch==1&&($scope.entry.aFile[5]==''||$scope.entry.aFile[5]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Official receipt (School Fee)</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if($scope.entry.reason=='Hospitalization'){
			if($scope.entry.pbsor==0&&$scope.entry.hospmedcert==0){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Attachment/s required for <b>Hospitalization</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.pbsor==1&&($scope.entry.aFile[6]==''||$scope.entry.aFile[6]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Partial Billing Statement or Official Receipt</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.entry.hospmedcert==1&&($scope.entry.aFile[7]==''||$scope.entry.aFile[7]==null)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please attach file for <b>Medical Certificate</b>";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[0]!=null && file[0].length != 0){
			if(file[0]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Medical Certificate</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[1]!=null && file[1].length != 0){
			if(file[1]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Doctor's Prescription</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[2]!=null && file[2].length != 0){
			if(file[2]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Official receipt (Medicine/Doctor's Fee)</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[3]!=null && file[3].length != 0){
			if(file[3]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Assessment Form</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[4]!=null && file[4].length != 0){
			if(file[4]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Billing Statement</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[5]!=null && file[5].length != 0){
			if(file[5]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Official receipt (School Fee)</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[6]!=null && file[6].length != 0){
			if(file[6]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Partial Billing Statement or Official Receipt</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if( file[7]!=null && file[7].length != 0){
			if(file[7]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "<b>Medican Certificate</b> document file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}

		if($scope.entry.explanation==''||$scope.entry.explanation==null){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Explanation is required";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.loanamount==''||$scope.entry.loanamount==null||$scope.entry.loanamount==0){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please input cash advance loan amount";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.payabledate==''||$scope.entry.payabledate==null){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please input payable payroll date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.terms==''||$scope.entry.terms==null||$scope.entry.terms==0){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please input repay term/s";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

	

		if ($scope.entry.loanamount.indexOf(',') > -1) { 
			var a= $scope.entry.loanamount;
			a=a.replace(/\,/g,'');
		}else{
			var a= $scope.entry.loanamount;
		}

		$scope.entry.loanamount = parseFloat(a).toFixed(2);

		// console.log($scope.entry);return;
		
		$scope.isSaving = true;
		Upload.upload({
			url: apiUrl+'admin/emp/cashadvance/saveEntry.php',
			method: 'POST',
			file: file,
			data: {
				'accountid'	: 	$scope.dashboard.values.accountid,
				'form_id'	:	'4',
				'entry'		:	$scope.entry,
				'targetPath': 	'../../../admin/emp/cashadvance/attachments/'						
			}
		}).then(function (response) {
			var data = response.data;
			$scope.isSaving = false;
			if( data.status == "error" ){
				$rootScope.modalDanger();
				return;
			}else if( data.status == "notloggedin" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "You are not logged in";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "entryExists" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Entry already exists";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( data.status == "tblfull" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Records already reached limit. Please contact system admin/creator";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='error-upload-type'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Only png, jpg, pdf, and jpeg files are accepted";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='error-iddoc'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "No file uploaded or you forgot to choose type of document uploaded";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='haspending'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Employee has pending request";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if(data.status=='invdate'){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Effective Date";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{	
				$timeout(function () {	
					$("#btn-refreshh").click();
				}, 100);
				$("#CashAdvanceEntry").modal("hide");
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Success!";
				$rootScope.dymodalmsg  = "Request added successfully with refference no. " +data.refno ;
				$rootScope.dymodalstyle = "btn-success";
				$rootScope.dymodalicon = "fa fa-check";				
				$("#dymodal").modal("show");
			}							
		}, function (response) {
			if (response.status > 0){
				$rootScope.modalDanger();
			}
		});
	}
	
	$scope.approve1 = function(){
		var r = confirm("Are you sure you want to approve?");
		if (r == true) {			
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/approve1.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request approved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	$scope.disapprove1 = function(){
		var r = confirm("Are you sure you want to disapprove?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/disapprove1.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request disapproved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	
	$scope.approve2 = function(){
		var today = new Date();
		var dd = today.getDate();

		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		if(dd<10) 
		{
			dd='0'+dd;
		} 

		if(mm<10) 
		{
			mm='0'+mm;
		} 

		var date = yyyy+'-'+mm+'-'+dd;
		if((date >= $scope.viewCurrent.newpayabledate) && ($scope.viewCurrent.newpayabledate!=''&&$scope.viewCurrent.newpayabledate!=null)){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "First payment date must be beyond today's date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		var r = confirm("Are you sure you want to approve?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/approve2.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request approved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	$scope.disapprove2 = function(){
		var r = confirm("Are you sure you want to disapprove?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/disapprove2.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request disapproved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	
	$scope.approve3 = function(){
		var r = confirm("Are you sure you want to confirm?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/approve3.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request approved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	$scope.disapprove3 = function(){
		var r = confirm("Are you sure you want to disapprove?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/disapprove3.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request disapproved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	
	$scope.approve4 = function(){
		var r = confirm("Are you sure you want to confirm?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/approve4.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request approved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	$scope.disapprove4 = function(){
		var r = confirm("Are you sure you want to disapprove?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/disapprove4.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request disapproved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	
	$scope.approve5 = function(){
		var r = confirm("Are you sure you want to confirm?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/approve5.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request approved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}
	$scope.disapprove5 = function(){
		var r = confirm("Are you sure you want to disapprove?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 4
			}
			$http.post("/dbic/assets/php/admin/emp/cashadvance/disapprove5.php", urlData)
			.then(function(result){
				var data = result.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "Requestalreadyapprovedordeclined" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Request already in progress";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "success" ){
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);	
					$("#CashAdvanceView").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Request disapproved successfully with refference no. " +data.refno ;
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},function(error){}).finally(function(){});
		}
	}

	$scope.reasonChange = function(){
		$scope.entry.aFile = [];
		$scope.entry.medcert = 0;
		$scope.entry.docpresc = 0;
		$scope.entry.ormeddoc = 0;
		$scope.entry.assessform = 0;
		$scope.entry.billstate = 0;
		$scope.entry.orsch = 0;
		$scope.entry.pbsor = 0;
		$scope.entry.hospmedcert = 0;
	}

	$scope.reasonChangeView = function(){
		$scope.viewCurrent.aFile = [];
		$scope.viewCurrent.medcert = 0;
		$scope.viewCurrent.docpresc = 0;
		$scope.viewCurrent.ormeddoc = 0;
		$scope.viewCurrent.assessform = 0;
		$scope.viewCurrent.billstate = 0;
		$scope.viewCurrent.orsch = 0;
		$scope.viewCurrent.pbsor = 0;
		$scope.viewCurrent.hospmedcert = 0;
	}

	function addCommas(num) {
		var str = num.toString().split('.');
		if (str[0].length >= 4) {
			//add comma every 3 digits befor decimal
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		/* Optional formating for decimal places
		if (str[1] && str[1].length >= 4) {
			//add space every 3 digits after decimal
			str[1] = str[1].replace(/(\d{3})/g, '$1 ');
		}*/
		return str.join('.');
	}

	$scope.dashboard.setup();
    $scope.entryModalTemplate="view/admin/emp/cashadvance/entry/index.html";
    
}]);