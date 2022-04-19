app.controller('HRPromotionController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	//$cookieStore.remove('emailurl');

	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/hr/personnelaction/promotion/sidebar.html";
	$scope.footerTemplate="view/admin/footer/index.html";
	
	$scope.searchID = $location.search().req;
	
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
		window.location = '/dbic/assets/php/admin/hr/personnelaction/promotion/pix/download.php?file='+file;
	}
	
	$scope.currentTable = function(){
		$scope.search			= [];
		$scope.search.datecreate= ''; 
		$scope.search.effdate= '';
		$scope.search.acct		= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/hr/personnelaction/promotion/data.php',
				type: 'POST',
				data: function(d){
					d.searchID 	 = $scope.searchID;
					d.accountid  = $scope.dashboard.values.accountid,
					d.datecreate = $scope.search.datecreate,
					d.effdate	 = $scope.search.effdate,
					d.acct		 = $scope.search.acct
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
				if(data.date_created && data.time_created){
					var a = '<div>'+' '+data.empid+' '+data.empname+' </div>';
				}else{
					var a = '';
				}
				return a;
			}),
			DTColumnBuilder.newColumn('effectivedate').withTitle('Effective Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('createdby').withTitle('Created By').withClass('btnTD').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Date/Time Created').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.date_created && data.time_created){
					var a = '<div>'+' '+data.date_created+' ('+data.time_created+') </div>';
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
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
				}else if(data.pending=='2'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
				}else if(data.pending=='3'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
				}else if(data.pending=='4'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
				}else if(data.pending=='5'){
				   statusview = '<span class="label label-warning" style="font-size: 85%" >' + 'Pending Approver ' + data.pending + '</span>';
				}else if(data.pending=='6'){
					statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
				}else if(data.pending=='7'){
				   statusview = '<span class="label label-warning" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
			   }else if(data.pending=='8'){
					statusview = '<span class="label label-success" style="font-size: 85%">' + 'Pending Approver ' + data.pending + '</span>';
				}else{
					statusview = '';
				}
				return statusview;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
                    return '<button id="' + data.id + '" class="btn btn-flat btn-sm btn-success" data-target="#PromotionView" data-toggle="modal" onclick="angular.element(this).scope().getDataByIdCurrent(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> View</button>';
            }),
		];
		vm.dtInstance = {};
		$(document).ready(function () {
            $("div.buttons").html('		<button id="btn-refreshh" style="margin-right:3px;" class="btn btn-flat btn-success pull-right" ng-click="dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;" class="btn btn-flat btn-success pull-right" title="Search" data-toggle="modal" data-target="#modal-search"  ><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button>')

			   
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
			$scope.search.effdate= '';
			$scope.search.acct		= ''; 
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.getDataByIdCurrent = function(id){
			$scope.allDepartmentFunc();
			var urlData = {
				'accountid'	: $cookieStore.get('acct_id'),
				'id'		: id
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/getDataByIdCurrent.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.viewCurrent = [];
				}else{
					var aa = result.data[0].newimmediatesupervisor;
					
					$scope.viewCurrent = result.data[0];
					var newsection = result.data[0].newsection;
					$scope.editdepartment($scope.viewCurrent.newdeptname);
					$scope.viewCurrent.newsection = '' + newsection ;
					
					$scope.editsection($scope.viewCurrent.newsection);

					$scope.viewCurrent.currentbasepay 			= parseFloat($scope.viewCurrent.currentbasepay).toFixed(2);
					$scope.viewCurrent.currentbasepay 			= addCommas($scope.viewCurrent.currentbasepay);
					$scope.viewCurrent.currenttotalcashcomp 	= parseFloat($scope.viewCurrent.currenttotalcashcomp).toFixed(2);
					$scope.viewCurrent.currenttotalcashcomp 	= addCommas($scope.viewCurrent.currenttotalcashcomp);

					$scope.viewCurrent.newbasepay 				= addCommas($scope.viewCurrent.newbasepay);
					$scope.viewCurrent.newtotalcashcomp 		= addCommas($scope.viewCurrent.newtotalcashcomp);

					if($scope.viewCurrent.jobdescdoc==1){
						document.getElementById("iddoc1current").checked = true;
						$scope.viewCurrent.doc_job_desc = 1;
					}else{
						$scope.viewCurrent.doc_job_desc = 0;
					}

					if($scope.viewCurrent.perfapprdoc==1){
						document.getElementById("iddoc2current").checked = true;
						$scope.viewCurrent.doc_perf_appr = 1;
					}else{
						$scope.viewCurrent.doc_perf_appr = 0;
					}

					if($scope.viewCurrent.promdoc==1){
						document.getElementById("iddoc3current").checked = true;
						$scope.viewCurrent.doc_promotion = 1;
					}else{
						$scope.viewCurrent.doc_promotion = 0;
					}

					$timeout(function () {	
						$scope.viewCurrent.newimmediatesupervisor = aa;
					},100);

					$scope.picFile = 'assets/php/admin/hr/personnelaction/promotion/pix/'+$scope.viewCurrent.picFile;

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
				url: apiUrl+'admin/hr/personnelaction/promotion/dataArchive.php',
				type: 'POST',
				data: function(d){
					d.accountid 	= $scope.dashboard.values.accountid,
					d.datecreate 	= $scope.searchArchive.datecreate,
					d.effdate	 	= $scope.searchArchive.effdate,
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
				if(data.date_created && data.time_created){
					var a = '<div>'+' '+data.empid+' '+data.empname+' </div>';
				}else{
					var a = '';
				}
				return a;
			}),
			DTColumnBuilder.newColumn('effectivedate').withTitle('Effective Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('createdby').withTitle('Created By').withClass('btnTD').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Date/Time Created').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.date_created && data.time_created){
					var a = '<div>'+' '+data.date_created+' ('+data.time_created+') </div>';
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
					statusview = '<span class="label label-danger" style="font-size: 85%">' + 'Disapproved' + '</span>';
				}else if(data.idstatus=='4'){
					statusview = '<span class="label label-danger" style="font-size: 85%">' + 'Cancelled' + '</span>';
				}else{
					statusview = '';
				}
				return statusview;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
                    return '<button class="btn btn-flat btn-sm btn-success" data-target="#PromotionViewArchive" data-toggle="modal" onclick="angular.element(this).scope().getDataByIdArchive(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> View</button>';
            }),
		];
		vm.dtInstanceArchive = {};
		$(document).ready(function () {
            $("div.buttons").html('		<button id="btn-refresh-archive" style="margin-right:3px;" class="btn btn-flat btn-success pull-right" ng-click="dtInstanceArchive.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;" class="btn btn-flat btn-success pull-right" title="Search" data-toggle="modal" data-target="#modal-search-archive"  ><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button>')

			   
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
			$scope.searchArchive.datecreate= ''; 
			$scope.searchArchive.effdate= '';
			$scope.searchArchive.acct		= ''; 
			$timeout(function () {	
				$("#btn-refresh-archive").click();
			}, 100);
		}

		$scope.getDataByIdArchive = function(id){
			$scope.allDepartmentFunc();
			var urlData = {
				'accountid'	: $cookieStore.get('acct_id'),
				'id'		: id
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/getDataByIdArchive.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.viewArchive = [];
				}else{
					$scope.viewArchive = result.data[0];
					$scope.picFileArchive = 'assets/php/admin/hr/personnelaction/promotion/pix/'+$scope.viewArchive.picFile;

					if($scope.viewArchive.jobdescdoc==1){
						document.getElementById("iddoc1archive").checked = true;
						$scope.viewArchive.doc_job_desc = 1;
					}else{
						$scope.viewArchive.doc_job_desc = 0;
					}

					if($scope.viewArchive.perfapprdoc==1){
						document.getElementById("iddoc2archive").checked = true;
						$scope.viewArchive.doc_perf_appr = 1;
					}else{
						$scope.viewArchive.doc_perf_appr = 0;
					}

					if($scope.viewArchive.promdoc==1){
						document.getElementById("iddoc3archive").checked = true;
						$scope.viewArchive.doc_promotion = 1;
					}else{
						$scope.viewArchive.doc_promotion = 0;
					}

					$scope.viewArchive.currentbasepay 			= addCommas($scope.viewArchive.currentbasepay);
					$scope.viewArchive.currenttotalcashcomp 	= addCommas($scope.viewArchive.currenttotalcashcomp);

					$scope.viewArchive.newbasepay 				= addCommas($scope.viewArchive.newbasepay);
					$scope.viewArchive.newtotalcashcomp 		= addCommas($scope.viewArchive.newtotalcashcomp);

					//Makes the checkbox unclickable but not greyed out
					$("#iddoc1archive").click(function() { return false; });
					$("#iddoc2archive").click(function() { return false; });
					$("#iddoc3archive").click(function() { return false; });

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
				url: apiUrl+'admin/hr/personnelaction/promotion/dataApproverSetup.php',
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
				if(data.approver_type_1a==1){
					var a = '<div>'+' (1A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_1a==2||data.approver_type_1a==3){
					var a = '<div>'+' '+'(1A)'+' '+data.fullname1a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_1b==1){
					var b = '<div>'+' (1B) Direct Superior '+'</div>';
				}else if(data.approver_type_1b==2||data.approver_type_1b==3){
					var b = '<div>'+' '+'(1B)'+' '+data.fullname1b+'</div>';
				}else{
					var b = '';
				}
				return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 2').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_2a==1){
					var a = '<div>'+' (2A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_2a==2||data.approver_type_2a==3){
					var a = '<div>'+' '+'(2A)'+' '+data.fullname2a+'</div>';
				}else{
					var a = ''
				}

				if(data.approver_type_2b==1){
					var b = '<div>'+' (2B) Direct Superior '+'</div>';
				}else if(data.approver_type_2b==2||data.approver_type_2b==3){
					var b = '<div>'+' '+'(2B)'+' '+data.fullname2b+'</div>';
				}else{
					var b = ''
				}
                return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 3').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_3a==1){
					var a = '<div>'+' (3A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_3a==2||data.approver_type_3a==3){
					var a = '<div>'+' '+'(3A)'+' '+data.fullname3a+'</div>';
				}else{
					var a = ''
				}

				if(data.approver_type_3b==1){
					var b = '<div>'+' (3B) Direct Superior '+'</div>';
				}else if(data.approver_type_3b==2||data.approver_type_3b==3){
					var b = '<div>'+' '+'(3B)'+' '+data.fullname3b+'</div>';
				}else{
					var b = ''
				}
                return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 4').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_4a==1){
					var a = '<div>'+' (4A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_4a==2||data.approver_type_4a==3){
					var a = '<div>'+' '+'(4A)'+' '+data.fullname4a+'</div>';
				}else{
					var a = ''
				}

				if(data.approver_type_4b==1){
					var b = '<div>'+' (4B) Direct Superior '+'</div>';
				}else if(data.approver_type_4b==2||data.approver_type_4b==3){
					var b = '<div>'+' '+'(4B)'+' '+data.fullname4b+'</div>';
				}else{
					var b = ''
				}
                return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 5').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_5a==1){
					var a = '<div>'+' (5A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_5a==2||data.approver_type_5a==3){
					var a = '<div>'+' '+'(5A)'+' '+data.fullname5a+'</div>';
				}else{
					var a = ''
				}

				if(data.approver_type_5b==1){
					var b = '<div>'+' (5B) Direct Superior '+'</div>';
				}else if(data.approver_type_5b==2||data.approver_type_5b==3){
					var b = '<div>'+' '+'(5B)'+' '+data.fullname5b+'</div>';
				}else{
					var b = ''
				}
                return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 6').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_6a==1){
					var a = '<div>'+' (6A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_6a==2||data.approver_type_6a==3){
					var a = '<div>'+' '+'(6A)'+' '+data.fullname6a+'</div>';
				}else{
					var a = ''
				}


				if(data.approver_type_6b==1){
					var b = '<div>'+' (6B) Direct Superior '+'</div>';
				}else if(data.approver_type_6b==2||data.approver_type_6b==3){
					var b = '<div>'+' '+'(6B)'+' '+data.fullname6b+'</div>';
				}else{
					var b = ''
				}
                return a+b;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 7').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_7a==1){
					var a = '<div>'+' (7A) DIRECT SUPERIOR '+'</div>';
				}else if(data.approver_type_7a==2||data.approver_type_7a==3){
					var a = '<div>'+' '+'(7A)'+' '+data.fullname7a+'</div>';
				}else{
					var a = ''
				}

				if(data.approver_type_7b==1){
					var b = '<div>'+' Direct Superior '+'</div>';
				}else if(data.approver_type_7b==2||data.approver_type_7b==3){
					var b = '<div>'+' '+data.fullname7b+'</div>';
				}else{
					var b = ''
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
                    return '<button class="btn btn-flat btn-sm btn-success" data-target="#sequence" data-toggle="modal" onclick="angular.element(this).scope().getApproverList(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> Sequence</button>';
            }),
		];
		vm.dtInstanceApproverSetup = {};
		$(document).ready(function () {
            $("div.buttons").html('		<button id="btn-refreshh" style="margin-right:3px;" class="btn btn-flat btn-success pull-right" ng-click="dtInstanceApproverSetup.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button>')

			   
			$("#btn-refreshh").on('click', function () {
				vm.dtInstanceApproverSetup.reloadData();
			});
		});

		$scope.allApproverTypeFunction = function(){
			var urlData = {
				'accountid': $cookieStore.get('acct_id')
			}
	
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/allApproverType.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.allApproverType = [];
				}else{
					$scope.allApproverType = result.data;
				}
			},function(error){}).finally(function(){});
		}
		
		$scope.saveApproverSetup = function(){
			/**Approver 1A and 1B Trapping */
			if($scope.sequence.approvertype1a==null||$scope.sequence.approvertype1a==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 1A.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.sequence.approvertype1a==1 && $scope.sequence.approvertype1b==1){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 1.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.sequence.approvertype1a!=1 && $scope.sequence.approver1a==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 1A.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if(($scope.sequence.approvertype1b==2||$scope.sequence.approvertype1b==3) && $scope.sequence.approver1b==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 1B.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			/**Approver 1A and 1B Trapping */

			/**Approver 2A and 2B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 2 ){
				if($scope.sequence.approvertype2a==null || $scope.sequence.approvertype2a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 2A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype2a==1 && $scope.sequence.approvertype2b==1){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 2.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype2a!=1 && $scope.sequence.approver2a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 2A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approvertype2b==2||$scope.sequence.approvertype2b==3) && $scope.sequence.approver2b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 2B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 2A and 2B Trapping */

			/**Approver 3A and 3B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 3 ){
				if($scope.sequence.approvertype3a==null||$scope.sequence.approvertype3a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 3A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype3a==1 && $scope.sequence.approvertype3b==1){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 3.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype3a!=1 && $scope.sequence.approver3a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 3A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approvertype3b==2||$scope.sequence.approvertype3b==3) && $scope.sequence.approver3b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 3B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 3A and 3B Trapping */

			/**Approver 4A and 4B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 4 ){
				if($scope.sequence.approvertype4a==null||$scope.sequence.approvertype4a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 4A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype4a==1 && $scope.sequence.approvertype4b==1){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 4.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype4a!=1 && $scope.sequence.approver4a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 4A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approvertype4b==2||$scope.sequence.approvertype4b==3) && $scope.sequence.approver4b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 4B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 4A and 4B Trapping */

			/**Approver 5A and 5B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 5 ){
				if($scope.sequence.approvertype5a==null||$scope.sequence.approvertype5a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 5A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype5a==1 && $scope.sequence.approvertype5b==1){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 5.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype5a!=1 && $scope.sequence.approver5a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 5A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approvertype5b==2||$scope.sequence.approvertype5b==3) && $scope.sequence.approver5b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 5B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 5A and 5B Trapping */

			/**Approver 6A and 6B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 6 ){
				if($scope.sequence.approvertype6a==null||$scope.sequence.approvertype6a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 6A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype6a==1 && $scope.sequence.approvertype6b==1){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 6.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype6a!=1 && $scope.sequence.approver6a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 6A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approvertype6b==2||$scope.sequence.approvertype6b==3) && $scope.sequence.approver6b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 6B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 6A and 6B Trapping */

			/**Approver 7A and 7B Trapping */
			if( parseInt( $scope.sequence.ctr_approvers ) >= 7 ){
				if($scope.sequence.approvertype7a==null||$scope.sequence.approvertype7a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 7A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype7a==1 && $scope.sequence.approvertype7b==1){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 7.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype7a!=1 && $scope.sequence.approver7a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 7A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approvertype7b==2||$scope.sequence.approvertype7b==3) && $scope.sequence.approver7b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 7B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 7A and 7B Trapping */
			
			if($scope.sequence.approvertype1a==''){$scope.sequence.approver1a = '';}
			if($scope.sequence.approvertype1b==''){$scope.sequence.approver1b = '';}
			if($scope.sequence.approvertype2a==''){$scope.sequence.approver2a = '';}
			if($scope.sequence.approvertype2b==''){$scope.sequence.approver2b = '';}
			if($scope.sequence.approvertype3a==''){$scope.sequence.approver3a = '';}
			if($scope.sequence.approvertype3b==''){$scope.sequence.approver3b = '';}
			if($scope.sequence.approvertype4a==''){$scope.sequence.approver4a = '';}
			if($scope.sequence.approvertype4b==''){$scope.sequence.approver4b = '';}
			if($scope.sequence.approvertype5a==''){$scope.sequence.approver5a = '';}
			if($scope.sequence.approvertype5b==''){$scope.sequence.approver5b = '';}
			if($scope.sequence.approvertype6a==''){$scope.sequence.approver6a = '';}
			if($scope.sequence.approvertype6b==''){$scope.sequence.approver6b = '';}
			if($scope.sequence.approvertype7a==''){$scope.sequence.approver7a = '';}
			if($scope.sequence.approvertype7b==''){$scope.sequence.approver7b = '';}
			
			
            $scope.isSaving = true;
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'sequence': $scope.sequence
            }
            console.log(urlData);
            $http.post(apiUrl+'admin/hr/personnelaction/promotion/saveApproverSetup.php',urlData)
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
                    $rootScope.dymodalmsg  = "Account succesfully added";
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
			$scope.allApproverTypeFunction();
            $scope.isSaving = true;

            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'sequence': $scope.sequence,
                'id': id
            }
            $http.post(apiUrl+'admin/hr/personnelaction/promotion/getApprovers.php',urlData)
            .then( function (response, status){
                $scope.isSaving = false;		
                var data = response.data;
                $scope.sequence = data[0];
    
            }, function(response) {
                $rootScope.modalDanger();
            });
        }
	}
	
	$scope.autoFillEmpID = function(){
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
			'empid'		: $scope.entry.empid
		}
		$http.post(apiUrl+'admin/hr/personnelaction/promotion/autoFillEmpID.php', urlData)
		.then(function(data, status){
			$scope.entry.empname = data.data.fullname;
			$scope.entry.currentdeptname = data.data.departmentname;
			$scope.entry.currentimmediatesupervisor = data.data.immediatesupervisor;
			$scope.entry.currentempstatus = data.data.empstatus;
			$scope.entry.currentpositiontitle = data.data.positiontitle;
			$scope.entry.currentpaygroup = data.data.paygroup;
			$scope.entry.currentlabortype = data.data.labortype;
		});
	}
	
	
    $scope.showPromotionEntryModal = function(){
		//alert( $('.entryfrm').length );
		$scope.entry = [];
		var urlData = {
			'accountid': $scope.dashboard.values.accountid
		}
		$http.post(apiUrl+'admin/hr/personnelaction/promotion/newentryview.php',urlData)
		.then( function (response, status){		
			var data = response.data;
			$scope.entry = data;
			$scope.entry.actiontaken	= "Promotion";
			$scope.entry.effectivedate = "";
			//if( $('.entryfrm').length == 1 ){ $('#PromotionEntry').appendTo("body").modal('show'); }
		}, function(response) {
			$rootScope.modalDanger();
		});
	}

	$scope.autoFillEmpName = function(){
		if($scope.entry.effectivedate==''||$scope.entry.effectivedate==null){
			$('#efdate').focus();
		}
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'empname'		: $scope.entry.empname,
			'effectivedate'	: $scope.entry.effectivedate,
			'action'		: $scope.entry.actiontaken
		}
		$http.post(apiUrl+'admin/hr/personnelaction/promotion/autoFillEmpName.php', urlData)
		.then(function(data, status){
			$scope.entry  				= data.data;
			$scope.entry.empname		= urlData.empname;
			$scope.entry.effectivedate	= urlData.effectivedate;

			$scope.entry.currentbasepay = parseFloat($scope.entry.currentbasepay).toFixed(2);
			$scope.entry.currentbasepay = addCommas($scope.entry.currentbasepay);

			$scope.entry.currentriceallowance = parseFloat($scope.entry.currentriceallowance).toFixed(2);
			$scope.entry.currentriceallowance = addCommas($scope.entry.currentriceallowance);

			$scope.entry.currentclothingallowance = parseFloat($scope.entry.currentclothingallowance).toFixed(2);
			$scope.entry.currentclothingallowance = addCommas($scope.entry.currentclothingallowance);

			$scope.entry.currentlaundryallowance = parseFloat($scope.entry.currentlaundryallowance).toFixed(2);
			$scope.entry.currentlaundryallowance = addCommas($scope.entry.currentlaundryallowance);

			$scope.entry.currenttotalcashcomp = parseFloat($scope.entry.currenttotalcashcomp).toFixed(2);
			$scope.entry.currenttotalcashcomp = addCommas($scope.entry.currenttotalcashcomp);

			$scope.allDepartmentFunc();
		});
	}
	
	$scope.updateEntryPromotion= function( file ){

		if($scope.viewCurrent.newbasepay==''||$scope.viewCurrent.newbasepay==null){$scope.viewCurrent.newbasepay = '0.00';}
		
		if($scope.viewCurrent.doc_job_desc==''||$scope.viewCurrent.doc_job_desc==null||$scope.viewCurrent.doc_job_desc==0){file[0] = '';}
		if($scope.viewCurrent.doc_perf_appr==''||$scope.viewCurrent.doc_perf_appr==null||$scope.viewCurrent.doc_perf_appr==0){file[1] = '';}
		if($scope.viewCurrent.doc_promotion==''||$scope.viewCurrent.doc_promotion==null||$scope.viewCurrent.doc_promotion==0){file[2] = '';}

		if( ($scope.viewCurrent.jobdescfile==null||$scope.viewCurrent.jobdescfile=='') && $scope.viewCurrent.doc_job_desc=='1'&&(file[0]==null||file[0]=='')){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please attach file for Job Description document";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if( ($scope.viewCurrent.perfapprfile==null||$scope.viewCurrent.perfapprfile=='') && $scope.viewCurrent.doc_perf_appr=='1'&&(file[1]==null||file[1]=='')){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please attach file for Performance Appraisal document";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if( ($scope.viewCurrent.promfile==null||$scope.viewCurrent.promfile=='') && $scope.viewCurrent.doc_promotion=='1'&&(file[2]==null||file[2]=='')){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please attach file for Promotion Request document";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if( file[0]!=null && file[0].length != 0){
			if(file[0]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Job Description file must be lesser than 2MB";
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
				$rootScope.dymodalmsg  = "Performance Appraisal file must be lesser than 2MB";
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
				$rootScope.dymodalmsg  = "Promotion Request file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}
		
		if($scope.viewCurrent.empid==null || $scope.viewCurrent.empid=="" || $scope.viewCurrent.empid==0){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please enter Employee ID";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.viewCurrent.effectivedate == "" || typeof $scope.viewCurrent.effectivedate == "undefined" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select Effectivity Date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		$scope.viewCurrent.str_dept 	 =	$scope.viewCurrent.newdeptname != "" ? $( "#f1curr option:selected" ).text() : "" ;
		$scope.viewCurrent.str_mngr 	 =	$scope.viewCurrent.newdeptmanager != "" ? $( "#f2curr option:selected" ).text() : "" ;
		$scope.viewCurrent.str_section =	$scope.viewCurrent.newsection != "" ? $( "#f3curr option:selected" ).text() : "" ;
		$scope.viewCurrent.str_super 	 =	$scope.viewCurrent.newimmediatesupervisor != "" ? $( "#f4curr option:selected" ).text() : "" ;
		
		if( $scope.viewCurrent.str_dept == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Department Name";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.viewCurrent.newempstatus == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Employment Status";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.viewCurrent.newjobcode == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Job Code";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.viewCurrent.newjoblevel == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Job Level";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.viewCurrent.newpaygroup == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Pay Group";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.viewCurrent.newlabortype == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Labor Type";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if( $scope.viewCurrent.currentpositiontitle == $scope.viewCurrent.newpositiontitle ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Position Title";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		var a= $scope.viewCurrent.newbasepay;
		a=a.replace(/\,/g,'');

		var e= $scope.viewCurrent.newtotalcashcomp;
		e=e.replace(/\,/g,'');

		var f= $scope.viewCurrent.currentbasepay;
		f=f.replace(/\,/g,'');

		$scope.viewCurrent.newbasepay = a;
		$scope.viewCurrent.newbasepay = parseFloat($scope.viewCurrent.newbasepay).toFixed(2);

		if(parseFloat($scope.viewCurrent.newbasepay) <= parseFloat(f)){
			$scope.viewCurrent.newbasepay = '';
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "New base pay should not be less than or equals to the current base pay.";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		$scope.viewCurrent.allowance.forEach(function(item,index){
			var abc = item.new_amt ? item.new_amt : "0";
			if (abc.indexOf(',') > -1) { 
				abc=abc.replace(/\,/g,'');
			}
			item.new_amt = parseFloat(abc).toFixed(2);
		});


		$scope.viewCurrent.newtotalcashcomp = e;
		$scope.viewCurrent.newtotalcashcomp = parseFloat($scope.viewCurrent.newtotalcashcomp).toFixed(2);
		$scope.viewCurrent.currentbasepay = f;
		$scope.viewCurrent.currentbasepay = parseFloat($scope.viewCurrent.currentbasepay).toFixed(2);
		
		$scope.isSaving = true;
		Upload.upload({
			url: apiUrl+'admin/hr/personnelaction/promotion/editEntry.php',
			method: 'POST',
			file: file,
			data: {
				'accountid'	: 	$scope.dashboard.values.accountid,
				'form_id'	:	'1',
				'entry'		:	$scope.viewCurrent,
				'targetPath': 	'../../../../admin/hr/personnelaction/promotion/pix/'						
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
					if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
						$timeout(function () {
							$("#curr_page").click();
						}, 500);
					}else{
						$("#btn-refreshh").click();
					}
				}, 100);		
				$("#PromotionView").modal("hide");
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
	
	$scope.saveEntryPromotion= function( file ){

		if($scope.entry.newbasepay==''||$scope.entry.newbasepay==null){$scope.entry.newbasepay = '0.00';}
		
		if($scope.entry.doc_job_desc==''||$scope.entry.doc_job_desc==null||$scope.entry.doc_job_desc==0){file[0] = '';}
		if($scope.entry.doc_perf_appr==''||$scope.entry.doc_perf_appr==null||$scope.entry.doc_perf_appr==0){file[1] = '';}
		if($scope.entry.doc_promotion==''||$scope.entry.doc_promotion==null||$scope.entry.doc_promotion==0){file[2] = '';}

		if($scope.entry.doc_job_desc=='1'&&(file[0]==null||file[0]=='')){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please attach file for Job Description document";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.doc_perf_appr=='1'&&(file[1]==null||file[1]=='')){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please attach file for Performance Appraisal document";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if($scope.entry.doc_promotion=='1'&&(file[2]==null||file[2]=='')){
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "Please attach file for Promotion Request document";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if( file[0]!=null && file[0].length != 0){
			if(file[0]['size'] > 2097152){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Job Description file must be lesser than 2MB";
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
				$rootScope.dymodalmsg  = "Performance Appraisal file must be lesser than 2MB";
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
				$rootScope.dymodalmsg  = "Promotion Request file must be lesser than 2MB";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}
		
		if($scope.entry.empid==null || $scope.entry.empid=="" || $scope.entry.empid==0){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please enter Employee ID";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.entry.effectivedate == "" || typeof $scope.entry.effectivedate == "undefined" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select Effectivity Date";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		$scope.entry.str_dept 	 =	$scope.entry.newdeptname != "" ? $( "#f1 option:selected" ).text() : "" ;
		$scope.entry.str_mngr 	 =	$scope.entry.newdeptmanager != "" ? $( "#f2 option:selected" ).text() : "" ;
		$scope.entry.str_section =	$scope.entry.newsection != "" ? $( "#f3 option:selected" ).text() : "" ;
		$scope.entry.str_super 	 =	$scope.entry.newimmediatesupervisor != "" ? $( "#f4 option:selected" ).text() : "" ;
		
		if( $scope.entry.str_dept == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Department Name";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.entry.newempstatus == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Employment Status";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.entry.newjobcode == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Job Code";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.entry.newjoblevel == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Job Level";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.entry.newpaygroup == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Pay Group";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}
		
		if( $scope.entry.newlabortype == "" ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Labor Type";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		if( $scope.entry.currentpositiontitle == $scope.entry.newpositiontitle ){
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "Please select new Position Title";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		var a= $scope.entry.currentbasepay;
		a=a.replace(/\,/g,'');

		var e= $scope.entry.currenttotalcashcomp;
		e=e.replace(/\,/g,'');

		var f= $scope.entry.newtotalcashcomp;
		f=f.replace(/\,/g,'');

		if ($scope.entry.newbasepay.indexOf(',') > -1) { 
			var g= $scope.entry.newbasepay;
			g=g.replace(/\,/g,'');
		}else{
			var g= $scope.entry.newbasepay;
		}

		$scope.entry.newbasepay 			= parseFloat(g).toFixed(2);

		if(parseFloat($scope.entry.newbasepay) <= parseFloat(a)){
			$scope.entry.newbasepay = '';
			$scope.entry.newtotalcashcomp = '';
			$rootScope.dymodalstat 	= true;
			$rootScope.dymodaltitle	= "Warning!";
			$rootScope.dymodalmsg  	= "New base pay should not be less than or equals to the current base pay.";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon 	= "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
		}

		$scope.entry.allowance.forEach(function(item,index){
			var abc = item.new_amount ? item.new_amount : "0";
			if (abc.indexOf(',') > -1) { 
				abc=abc.replace(/\,/g,'');
			}
			item.new_amount = parseFloat(abc).toFixed(2);
		});
		
		$scope.entry.currentbasepay = a;
		$scope.entry.currentbasepay = parseFloat($scope.entry.currentbasepay).toFixed(2);
		$scope.entry.currenttotalcashcomp = e;
		$scope.entry.currenttotalcashcomp = parseFloat($scope.entry.currenttotalcashcomp).toFixed(2);
		$scope.entry.newtotalcashcomp = f;
		$scope.entry.newtotalcashcomp = parseFloat($scope.entry.newtotalcashcomp).toFixed(2);
		
		$scope.isSaving = true;
		Upload.upload({
			url: apiUrl+'admin/hr/personnelaction/promotion/saveEntry.php',
			method: 'POST',
			file: file,
			data: {
				'accountid'	: 	$scope.dashboard.values.accountid,
				'form_id'	:	'1',
				'entry'		:	$scope.entry,
				'targetPath': 	'../../../../admin/hr/personnelaction/promotion/pix/'						
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
				$scope.resetSelection();
				$("#PromotionEntry").modal("hide");
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
	
	$scope.allDepartmentFunc = function(){
		$scope.allDepartment = [];
		var urlData = {
			'accountid': $scope.dashboard.values.accountid
		}

		$http.post("/dbic/assets/php/allDepartment.php", urlData)
		.then(function(result){
			if(result.data.status == "empty"){
				$scope.allDepartment = [];
			}else{
				$scope.allDepartment = result.data;
			}
		},function(error){}).finally(function(){});
	}
	
	$scope.editdepartment = function( id ){
		var obj = $filter('filter')($scope.allDepartment, {id: id})[0];
		$scope.viewCurrent.newdeptmanager = "";
		$scope.generateManager( id );
		$scope.viewCurrent.newsection = "";
		$scope.generateSection( id );
		
		$timeout(function () {
			$scope.manger = false;
			if( obj && obj.idhead && id ){
				$scope.viewCurrent.newdeptmanager = obj.idhead;
				$scope.manger = true;
			}
		}, 100);
	}
	
	$scope.enewdepartment = function( id ){
		var obj = $filter('filter')($scope.allDepartment, {id: id})[0];
		$scope.viewCurrent.newdeptmanager = "";
		$scope.generateManager( id );
		$scope.viewCurrent.newsection = "";
		$scope.generateSection( id );
		$scope.generateJobCodeByDept(id); //Jerald 09072020
		
		$scope.viewCurrent.newimmediatesupervisor = "";
		$scope.viewCurrent.newjobcode			=	"";
		$scope.viewCurrent.newpositiontitle	=	"";
		
		$timeout(function () {
			$scope.manger = false;
			if( obj && obj.idhead && id ){
				$scope.viewCurrent.newdeptmanager = obj.idhead;
				$scope.manger = true;
			}
		}, 100);
	}
	
	$scope.newdepartment = function( id ){
		var obj = $filter('filter')($scope.allDepartment, {id: id})[0];
		$scope.entry.newdeptmanager = "";
		$scope.generateManager( id );
		$scope.entry.newsection = "";
		$scope.generateSection( id );
		$scope.generateJobCodeByDept(id); //Jerald 09072020
		
		$scope.entry.newimmediatesupervisor = "";
		$scope.entry.newjobcode			=	"";
		$scope.entry.newpositiontitle	=	"";
		
		$timeout(function () {
			$scope.manger = false;
			if( obj && obj.idhead && id ){
				$scope.entry.newdeptmanager = obj.idhead;
				$scope.manger = true;
			}
		}, 100);
	}
	
	$scope.editsection = function( id ){
		$scope.generateJobCodeByDept($scope.viewCurrent.newdeptname);
		// if($scope.viewCurrent.newsection==''){
		// 	$scope.generateJobCodeByDept($scope.viewCurrent.newdeptname); //Jerald 09072020
		// }else{
		// 	$scope.generateJobCodeBySect(id); //Jerald 09072020
		// }
		$scope.viewCurrent.newimmediatesupervisor = "";
		$scope.esuperior = []; 
		var urlData = {
			'accountid': $scope.dashboard.values.accountid,
			'idunder'  : id
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/accounts.php", urlData)
		.then(function(result){
			$scope.esuperior = result.data;
			$scope.supervisor = false;
			if( result.data.length == 1 ){
				$scope.viewCurrent.newimmediatesupervisor = $scope.esuperior[0].id;
				$scope.supervisor = true;
			}
		},function(error){}).finally(function(){});
	}
	
	$scope.newsection = function( id ){
		$scope.entry.newimmediatesupervisor = "";
		$scope.generateSeupervisor( id );
		$scope.generateJobCodeByDept($scope.entry.newdeptname);
		// if($scope.entry.newsection==''){
		// 	$scope.generateJobCodeByDept($scope.entry.newdeptname); //Jerald 09072020
		// }else{
		// 	$scope.generateJobCodeBySect(id); //Jerald 09072020
		// }
	}
	
	$scope.generateManager = function( id ){
		$scope.emanager = []; 
		var urlData = {
			'accountid' : $scope.dashboard.values.accountid,
			'id'  		: id
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/manager.php", urlData)
		.then(function(result){
			$scope.emanager = result.data;
		},function(error){}).finally(function(){});
	}
	
	$scope.generateSection = function( id ){
		$scope.esection = []; 
		var urlData = {
			'accountid': $scope.dashboard.values.accountid,
			'idunder'  : id
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/section.php", urlData)
		.then(function(result){
			$scope.esection = result.data;
		},function(error){}).finally(function(){});
	}
	
	$scope.generateSeupervisor = function( id ){
		$scope.esuperior = []; 
		var urlData = {
			'accountid': $scope.dashboard.values.accountid,
			'idunder'  : id
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/accounts.php", urlData)
		.then(function(result){
			$scope.esuperior = result.data;
			$scope.supervisor = false;
			if( result.data.length == 1 ){
				$scope.entry.newimmediatesupervisor = $scope.esuperior[0].id;
				$scope.supervisor = true;
			}
		},function(error){}).finally(function(){});
	}
	
	$scope.egeneratePosition = function( alias ){
		$scope.viewCurrent.newpositiontitle = "";
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
			'alias'  	: alias
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/position.php", urlData)
		.then(function(result){
			$scope.viewCurrent.newpositiontitle = result.data.name;
		},function(error){}).finally(function(){});
	}
	
	$scope.generatePosition = function( alias ){
		$scope.entry.newpositiontitle = "";
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
			'alias'  	: alias
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/position.php", urlData)
		.then(function(result){
			$scope.entry.newpositiontitle = result.data.name;
		},function(error){}).finally(function(){});
	}
	
	$scope.resetSelection = function(){
		$scope.allDepartment = [];
		$scope.generateManager("");
		$scope.generateSection("");
		$scope.generateSeupervisor("");
		$scope.entry = [];
		$scope.entry.actiontaken = "Promotion";
		$timeout(function () {
			if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
				$timeout(function () {
					$("#curr_page").click();
				}, 500);
			}
		}, 100);
	}

	//Jerald 09072020
	$scope.generateJobCodeByDept = function( id ){
		$scope.jcode = [];
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
			'id'  	: id
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/lateraltransfer/jobcodeByDept.php", urlData)
		.then(function(result){
			$scope.jcode = result.data;
		},function(error){}).finally(function(){});
	}

	//Jerald 09072020
	$scope.generateJobCodeBySect = function( id ){
		$scope.jcode = [];
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
			'id'  	: id
		}
		$http.post("/dbic/assets/php/admin/hr/personnelaction/lateraltransfer/jobcodeBySect.php", urlData)
		.then(function(result){
			$scope.jcode = result.data;
		},function(error){}).finally(function(){});
	}

	$scope.totalCashComp = function(){

		if ($scope.entry.newbasepay.indexOf(',') > -1) { 
			var a= $scope.entry.newbasepay;
			a=a.replace(/\,/g,'');
		}else{
			var a= $scope.entry.newbasepay;
		}

		// if ($scope.entry.newriceallowance.indexOf(',') > -1) { 
		// 	var b= $scope.entry.newriceallowance;
		// 	b=b.replace(/\,/g,'');
		// }else{
		// 	var b= $scope.entry.newriceallowance;
		// }

		// if ($scope.entry.newclothingallowance.indexOf(',') > -1) { 
		// 	var c= $scope.entry.newclothingallowance;
		// 	c=c.replace(/\,/g,'');
		// }else{
		// 	var c= $scope.entry.newclothingallowance;
		// }

		// if ($scope.entry.newlaundryallowance.indexOf(',') > -1) { 
		// 	var d= $scope.entry.newlaundryallowance;
		// 	d=d.replace(/\,/g,'');
		// }else{
		// 	var d= $scope.entry.newlaundryallowance;
		// }

		var total = 0;
		var b = 0;

		$scope.entry.allowance.forEach(function(item,index){
			var b = item.new_amount ? item.new_amount : "0";
			if (b.indexOf(',') > -1) { 
				b=b.replace(/\,/g,'');
			}
			total = Number(total) + Number(b);
		});
		

		$scope.entry.newtotalcashcomp = Number(a) + Number(total);

		$scope.entry.newtotalcashcomp = parseFloat($scope.entry.newtotalcashcomp).toFixed(2);
		$scope.entry.newtotalcashcomp = addCommas($scope.entry.newtotalcashcomp);
	}

	$scope.totalCashCompEdit = function(){
		if ($scope.viewCurrent.newbasepay.indexOf(',') > -1) { 
			var a= $scope.viewCurrent.newbasepay;
			a=a.replace(/\,/g,'');
		}else{
			var a= $scope.viewCurrent.newbasepay;
		}

		// if ($scope.viewCurrent.newriceallowance.indexOf(',') > -1) { 
		// 	var b= $scope.viewCurrent.newriceallowance;
		// 	b=b.replace(/\,/g,'');
		// }else{
		// 	var b= $scope.viewCurrent.newriceallowance;
		// }

		// if ($scope.viewCurrent.newclothingallowance.indexOf(',') > -1) { 
		// 	var c= $scope.viewCurrent.newclothingallowance;
		// 	c=c.replace(/\,/g,'');
		// }else{
		// 	var c= $scope.viewCurrent.newclothingallowance;
		// }

		// if ($scope.viewCurrent.newlaundryallowance.indexOf(',') > -1) { 
		// 	var d= $scope.viewCurrent.newlaundryallowance;
		// 	d=d.replace(/\,/g,'');
		// }else{
		// 	var d= $scope.viewCurrent.newlaundryallowance;
		// }

		var total = 0;
		var b = 0;

		$scope.viewCurrent.allowance.forEach(function(item,index){
			var b = item.new_amt ? item.new_amt : "0";
			if (b.indexOf(',') > -1) { 
				b=b.replace(/\,/g,'');
			}
			total = Number(total) + Number(b);
		});
		

		$scope.viewCurrent.newtotalcashcomp = Number(a) + Number(total);

		$scope.viewCurrent.newtotalcashcomp = parseFloat($scope.viewCurrent.newtotalcashcomp).toFixed(2);
		$scope.viewCurrent.newtotalcashcomp = addCommas($scope.viewCurrent.newtotalcashcomp);
	}
	
	//Jerald
	$scope.job_description_ngChange = function(){if($scope.entry.doc_job_desc==''||$scope.entry.doc_job_desc==null||$scope.entry.doc_job_desc==0){$scope.entry.picFile[0] = '';}}
	$scope.perf_appr_ngChange = function(){if($scope.entry.doc_perf_appr==''||$scope.entry.doc_perf_appr==null||$scope.entry.doc_perf_appr==0){$scope.entry.picFile[1] = '';}}
	$scope.prom_ngChange = function(){if($scope.entry.doc_promotion==''||$scope.entry.doc_promotion==null||$scope.entry.doc_promotion==0){$scope.entry.picFile[2] = '';}}

	//Jerald
	$scope.job_description_ngChangeview = function(){if($scope.viewCurrent.doc_job_desc==''||$scope.viewCurrent.doc_job_desc==null||$scope.viewCurrent.doc_job_desc==0){$scope.viewCurrent.picFile[0] = '';}}
	$scope.perf_appr_ngChangeview = function(){if($scope.viewCurrent.doc_perf_appr==''||$scope.viewCurrent.doc_perf_appr==null||$scope.viewCurrent.doc_perf_appr==0){$scope.viewCurrent.picFile[1] = '';}}
	$scope.prom_ngChangeview = function(){if($scope.viewCurrent.doc_promotion==''||$scope.viewCurrent.doc_promotion==null||$scope.viewCurrent.doc_promotion==0){$scope.viewCurrent.picFile[2] = '';}}
	
	$scope.approve1 = function(){
		var r = confirm("Are you sure you want to approve?");
		if (r == true) {			
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 2
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/approve1.php", urlData)
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
						if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
							$timeout(function () {
								$("#curr_page").click();
							}, 500);
						}else{
							$("#btn-refreshh").click();
						}
					}, 100);
					$("#PromotionView").modal("hide");
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
				'form_id'	: 2
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/disapprove1.php", urlData)
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
						if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
							$timeout(function () {
								$("#curr_page").click();
							}, 500);
						}else{
							$("#btn-refreshh").click();
						}
					}, 100);
					$("#PromotionView").modal("hide");
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
		var r = confirm("Are you sure you want to approve?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 2
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/approve2.php", urlData)
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
						if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
							$timeout(function () {
								$("#curr_page").click();
							}, 500);
						}else{
							$("#btn-refreshh").click();
						}
					}, 100);	
					$("#PromotionView").modal("hide");
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
				'form_id'	: 2
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/disapprove2.php", urlData)
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
						if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
							$timeout(function () {
								$("#curr_page").click();
							}, 500);
						}else{
							$("#btn-refreshh").click();
						}
					}, 100);	
					$("#PromotionView").modal("hide");
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
		var r = confirm("Are you sure you want to approve?");
		if (r == true) {
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'  	: $scope.viewCurrent,
				'form_id'	: 2
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/approve3.php", urlData)
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
						if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
							$timeout(function () {
								$("#curr_page").click();
							}, 500);
						}else{
							$("#btn-refreshh").click();
						}
					}, 100);	
					$("#PromotionView").modal("hide");
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
				'form_id'	: 2
			}
			$http.post("/dbic/assets/php/admin/hr/personnelaction/promotion/disapprove3.php", urlData)
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
						if($location.path() == '/promotion-and-upgradation---current---' && $routeParams.p!=undefined){
							$timeout(function () {
								$("#curr_page").click();
							}, 500);
						}else{
							$("#btn-refreshh").click();
						}
					}, 100);	
					$("#PromotionView").modal("hide");
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
		
	}
	$scope.disapprove4 = function(){
		
	}
	
	$scope.approve5 = function(){
		
	}
	$scope.disapprove5 = function(){
		
	}
	
	$scope.approve6 = function(){
		
	}
	$scope.disapprove6 = function(){
		
	}
	
	$scope.approve7 = function(){
		
	}
	$scope.disapprove7 = function(){
		
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
	$scope.allEmployeeFunc();
    $scope.entryModalTemplate="view/admin/hr/personnelaction/promotion/entry/index.html";
    
}]);