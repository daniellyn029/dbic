app.controller('TKTimelinkController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	$scope.link = {
		sdate	: $cookieStore.get('pay_start'),
		fdate	: $cookieStore.get('pay_end'),
		picfile : '',
		classi	: '',
		batchid	: '',
		machid	: ''
	};
	$scope.swipeclassi = '';
	$scope.file_ctr = 0;
	
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
			period:[],
			depts:[],
			conf:[]
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
				$scope.dashboard.values.period 	= data.period;	
				$scope.dashboard.values.depts 	= data.departments;
				$scope.dashboard.values.conf 	= data.timeconf;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.recentlyPaired = function(){
		$scope.search	= [];
		$scope.search.alias = ''; 
		$scope.search.name  = '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'admin/tk/timelink/pair.php',
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
			 DTColumnBuilder.newColumn('empid').withTitle('ID').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('empname').withTitle('Name').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('unit').withTitle('Classification').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('shift').withTitle('Shift').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('work_date').withTitle('Date').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('date_in1').withTitle('1st Date In').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('time_in1').withTitle('1st Time In').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('date_out1').withTitle('1st Date Out').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('time_out1').withTitle('1st Time Out').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('date_in2').withTitle('2nd Date In').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('time_in2').withTitle('2nd Time In').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('date_out2').withTitle('2nd Date Out').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('time_out2').withTitle('2nd Time Out').withClass('btnTD').notSortable()
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
	
	$scope.resetBar = function(){
		$("#progressbar").val(0);
		//$("#progstatus").text( "Analyzing 0%" );
	}
	
	$scope.recentlyUploadedCtr = function(){
		$scope.unit_ctr = [];
		var urlData = {
			'accountid': $scope.dashboard.values.accountid
		}
		$http.post(apiUrl+'admin/tk/timelink/counter1.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			$scope.unit_ctr = data;
			$scope.file_ctr = data[0].sum;
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	$scope.recentlyUploadedSwipe = function( id = '' ){
		$scope.swipe_ctr = [];
		var urlData = {
			'accountid': $scope.dashboard.values.accountid,
			'idunit'   : id
		}
		$http.post(apiUrl+'admin/tk/timelink/counter2.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			$scope.swipe_ctr = data;
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	$scope.process=function( file ){
		if( file ){
			$scope.isSaving = true;
			Upload.upload({
				url: apiUrl+'admin/tk/timelink/process.php',
				method: 'POST',
				file: file,
				data: {
					'accountid'	: $scope.dashboard.values.accountid,
					'info'		: $scope.link,
					'targetPath': '../../../admin/tk/timelink/timelogs/'	
				}
			}).progress(function(e) {
				if(e.lengthComputable) {
					var percent = ( e.loaded / e.total ) * 100;
					$("#progressbar").val(Math.round(percent));
					//$("#progstatus").text( "Analyzing " + Math.round(percent) + "%" );
				}
			}).then(function (response) {	
				$scope.isSaving = false;
				var data = response.data;
				$timeout(function () {						
					//$("#progstatus").text( "Analyzed 100%" );
					$("#progressbar").val("0");
				}, 100);
				if( data.status == "error" ){
					$rootScope.modalDanger();					
				}else if( data.status == "error-upload-type" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid file format. Only .txt files are allowed.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;						
				}else if( data.status == "err_format" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid file format found.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;						
				}else if( data.status == "nofile" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "No Time Logs Uploaded";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "sdate" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "No Start Date Specified";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "fdate" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "No End Date Specified";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "batchid" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "No Batch ID Specified";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "dupbatchid" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Duplicate Batch ID Specified";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "machid" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "No Machine ID Specified";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "invdates" ){						
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Dates Specified";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else{	
					$timeout(function () {			
						$("#progressbar").val("0");
						//$("#progstatus").text( "Analyzed 0%" );
						$scope.link = {
							sdate	: $cookieStore.get('pay_start'),
							fdate	: $cookieStore.get('pay_end'),
							picfile : '',
							classi	: '',
							batchid	: '',
							machid	: ''
						};
						$scope.swipeclassi = '';
						$("#classi").val($scope.link.classi).trigger("change");
						$("#machid").val($scope.link.machid).trigger("change");
						$scope.recentlyUploadedCtr();
						$scope.recentlyUploadedSwipe();
						$("#btn-refreshh").click();
					}, 100);
				}
			}, function (response) {
				if (response.status > 0){
					$scope.isSaving = false;
					$rootScope.modalDanger();
				}
			});	
		}else{
			$rootScope.dymodalstat = true;
			$rootScope.dymodaltitle= "Warning!";
			$rootScope.dymodalmsg  = "No Time Logs Uploaded";
			$rootScope.dymodalstyle = "btn-warning";
			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			$("#dymodal").modal("show");
			return;
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