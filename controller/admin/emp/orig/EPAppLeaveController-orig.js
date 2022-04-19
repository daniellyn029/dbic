app.controller('EPAppLeaveController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/emp/sidebar/index.html";
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
			leaves:[]
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
				$scope.dashboard.values.leaves		= data.leaves;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.app_leaves_functions = function(){
		$scope.add 					= [];
		$scope.edit					= [];
		$scope.search				= [];		
		$scope.search.acct 			= $scope.dashboard.values.accountid;
		$scope.search.leave 		= ''; 
		$scope.search.docu 			= '';
		$scope.search.datefrom 		= '';
		$scope.search.dateto 		= '';
		$scope.search.appstat		= '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/app/leaves/data.php',
				type: 'POST',
				data: function(d){
					d.acct			= $scope.search.acct,
					d.docu			= $scope.search.docu,
					d.leave			= $scope.search.leave,
					d.from			= $scope.search.datefrom,
					d.to			= $scope.search.dateto,
					d.appstat		= $scope.search.appstat
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('date').withTitle('Leave Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('docnumber').withTitle('Document No.').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leave_name').withTitle('Leave Name').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leave_type').withTitle('Leave Type').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('empname').withTitle('Employee').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('hrs').withTitle('Total Hours').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leave_status').withTitle('Status').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				return btn;
			})
		];
		vm.dtInstance = {};

		if( $rootScope.idleave != '' ){
			$timeout(function () {	
				$scope.isSaving=false;
				var urlData = {
					'accountid': $scope.dashboard.values.accountid
				}
				$http.post(apiUrl+'admin/tk/app/leaves/add_view.php',urlData)
				.then( function (response, status){			
					var data = response.data;				
					$scope.add = data;
					$scope.add.acct = $scope.dashboard.values.accountid;
					$scope.add.idleave = $rootScope.idleave;
					$rootScope.idleave = '';
					$("#modal-add").modal("show");
				}, function(response) {
					$rootScope.modalDanger();
				});
			}, 100);
		}
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search				= [];
			$scope.search.acct 			= $scope.dashboard.values.accountid;
			$scope.search.leave 		= ''; 
			$scope.search.docu 			= '';
			$scope.search.datefrom 		= '';
			$scope.search.dateto 		= '';
			$scope.search.appstat		= '';
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.resetCreateAcct = function(){	
			$scope.isSaving=false;
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/app/leaves/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;				
				$scope.add = data;
				$scope.add.acct = $scope.dashboard.values.accountid;
				$rootScope.idleave = '';
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.addLeave = function( file ){			
			if( $scope.add.leave_dates.length > 0 ){					
				if( file!=null && file.length != 0){
					for( var key in file ){
						if(file[key]['size'] > 2097152){ 
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "Each file must be lesser than 2MB";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
							return;
						}
					}
				}
				
				spinnerService.show('form01spinner');
				$scope.isSaving2 = true;
				
				Upload.upload({
					url: apiUrl+'admin/tk/app/leaves/create.php',
					method: 'POST',
					file: file,
					data: {
						'accountid' : $scope.dashboard.values.accountid,
						'info'		: $scope.add,
						'targetPath': '../../../admin/tk/app/leaves/file/'					
					}
				}).then(function (response) {
					var data = response.data;
					$scope.isSaving  = false;
					$scope.isSaving2 = false;
					
					spinnerService.hide('form01spinner');
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
					}else if( data.status == "idleave" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Leave Name";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "datefrom" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Date From";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "dateto" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Date To";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "invdate" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Invalid Dates entered";
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
					}else{
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 1000);
						$("#modal-add").modal("hide");
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						
						if( data.reject.length == 0 ){
							$rootScope.dymodalmsg  = "Leaves created successfully";
						}else{
							var msg="Below request(s) are not applied<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> REASON </th> </tr></thead> <tbody>";
							var trow = "";
							data.reject.forEach(function(item, index){
								trow = trow + "<tr><td>"+item.date+"</td><td>"+item.msg+"</td></tr>";						
							});
							trow = trow + "</tbody></table>";
							$rootScope.dymodalmsg  = msg + trow;
						}
						
						$rootScope.dymodalstyle = "btn-success";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}

					
				}, function (response) {
					if (response.status > 0){
						$rootScope.modalDanger();
					}
				});	
			}else{
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please generate leave dates";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
		}
		
		$scope.calcLeavehrs = function(hrs, id, ndex){
			var total = 0;
			$scope.add.leave_dates[ndex]['drop'].forEach(function(item, index){
				if( item.id == id ){
					if( hrs == 8 ){
						$scope.add.leave_dates[ndex]['hrs'] = hrs - item.hr;
					}else if( hrs == 4  ){
						$scope.add.leave_dates[ndex]['hrs'] = item.hr;
					}					
				}				
			});
			$scope.add.leave_dates.forEach(function(item, index){
				total = total + 	item.hrs;	
			});
			$scope.total_units = total;
		}
		
		$scope.generateTbl = function(){
			var dfrom = new Date('' + $scope.add.datefrom);
			var dto   = new Date('' + $scope.add.dateto);	
			$scope.isSaving=true;
			if( dfrom > dto ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Date From should be less than Date To";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( $scope.add.datefrom.length <= 1 || $scope.add.dateto.length <= 1 ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Dates entered";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( $scope.add.acct == '' ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please select account";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( $scope.add.idleave == '' ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please select Leave Name";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{
				var urlData = {
					'acct'		: $scope.add.acct,
					'idleave'	: $scope.add.idleave,
					'from'		: $scope.add.datefrom,
					'to'		: $scope.add.dateto					
				}
				$http.post(apiUrl+'admin/tk/app/leaves/add_dates.php',urlData)
				.then( function (response, status){			
					var data = response.data;
					$scope.add.leave_dates = data;
					$scope.total_units = $scope.add.leave_dates[ ($scope.add.leave_dates.length - 1) ]["unit"];
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
		}
		
		$scope.filterAcct = function(acct){
			if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
				return acct.id != '0';
			}else{				
				return acct.id == $scope.dashboard.values.accountid;
			}
		}
		
		$scope.edit_view = function( id ){
			
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/mng/leave/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.edit = data;	
				$scope.edit.stat='';
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.resetReason = function(){
			$scope.edit.reason = '';
		}
		
		$scope.editreq = function(){
			var r = confirm("Are you sure you want to update request?");
			if (r == true) {
				$scope.isSaving = true;
				
				var urlData = {
					'accountid'	: $scope.dashboard.values.accountid,
					'info'		: $scope.edit
				}
				$http.post(apiUrl+'admin/emp/leave/edit.php',urlData)
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
					}else if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
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
					}else if( data.status == "inv" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Invalid status selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else{
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 1000);
						$("#editModal").modal("hide");
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Request updated successfully";
						$rootScope.dymodalstyle = "btn-success";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
		}
	}
	
	$scope.dashboard.setup();
}]);