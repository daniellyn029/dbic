app.controller('EPAppOvertimeController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
		$scope.add 					= [];
		$scope.edit					= [];
		$scope.search				= [];		
		$scope.search.acct 			= $scope.dashboard.values.accountid; 
		$scope.search.docu 			= '';
		$scope.search.datefrom 		= '';
		$scope.search.dateto 		= '';
		$scope.search.appstat		= '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/app/overtime/data.php',
				type: 'POST',
				data: function(d){
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
		.withDOM('lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('date').withTitle('Overtime Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('docnumber').withTitle('Document No.').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('empname').withTitle('Employee').withClass('btnTD').notSortable(),			
			DTColumnBuilder.newColumn('start_time').withTitle('Start').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('end_time').withTitle('End').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('ot_status').withTitle('Status').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				return btn;
			})
		];
		vm.dtInstance = {};
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search				= [];
			$scope.search.acct 			= $scope.dashboard.values.accountid; 
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
			$http.post(apiUrl+'admin/tk/app/overtime/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;				
				$scope.add = data;
				$scope.add.acct = $scope.dashboard.values.accountid;
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
				return acct.id == $scope.dashboard.values.accountid;
			}
		}
		
		$scope.edit_view = function( id ){
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/mng/overtime/edit_view.php',urlData)
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
				$http.post(apiUrl+'admin/emp/overtime/edit.php',urlData)
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