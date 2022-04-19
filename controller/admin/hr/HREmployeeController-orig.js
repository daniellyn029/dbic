app.controller('HREmployeeController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/hr/sidebar/index.html";
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
			joblvl:[],
			department:[],
			locs:[],
			paygroups:[],
			paystat:[]
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
				$scope.dashboard.values.emptypes 	= data.emptypes;
				$scope.dashboard.values.accttype 	= data.acctypes;
				$scope.dashboard.values.civilstat 	= data.civilstat;	
				$scope.dashboard.values.joblvl 		= data.joblvl;	
				$scope.dashboard.values.department 	= data.departments;	
				$scope.dashboard.values.locs 		= data.locs;	
				$scope.dashboard.values.paygroups 	= data.paygroups;	
				$scope.dashboard.values.paystat 	= data.paystat;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}
	
	$scope.employees_functions = function(){
		$scope.add 				= [];
		$scope.edit				= [];
		$scope.view				= [];
		$scope.search			= [];
		$scope.search.empid 	= ''; 
		$scope.search.empname  	= '';
		$scope.search.utype 	= ''; 
		$scope.search.unit 		= '';
		$scope.search.idlvl 	= '';
		$scope.search.idloc 	= '';
		$scope.search.idpaygrp 	= '';
		$scope.search.idpaystat = '';
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/hr/employee/data.php',
				type: 'POST',
				data: function(d){
					d.empid		= $scope.search.empid,
					d.empname	= $scope.search.empname,
					d.type		= $scope.search.utype,
					d.unit		= $scope.search.unit,
					d.idlvl		= $scope.search.idlvl,
					d.idloc		= $scope.search.idloc,
					d.idpaygrp	= $scope.search.idpaygrp,
					d.idpaystat	= $scope.search.idpaystat
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
			DTColumnBuilder.newColumn(null).withTitle('Pic').notSortable().withClass('btnTD fixwidth')
			.renderWith(function(data, type, full, meta){
				var btn = '<img src="'+ data.pic +'" alt="" style="width:55px;cursor:pointer">';
				return btn;
			}),
		
			DTColumnBuilder.newColumn('empid').withTitle('Employee ID').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn('empname').withTitle('Name').withClass('btnTD'),
			DTColumnBuilder.newColumn('type').withTitle('Account Type').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('etype').withTitle('Account Status').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				var btn  = '<button class="btn btn-flat btn-sm btn-primary" title="Update" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				btn 	+= ' <button class="btn btn-flat btn-sm btn-success" title="Assign" data-target="#assignModal" data-toggle="modal" onclick="angular.element(this).scope().assign_view(\'' + data.id + '\')" ><i class="fa fa-briefcase"></i> Assign</button>';
				btn		+= ' <button class="btn btn-flat btn-sm btn-warning" title="View" data-target="#viewModal" data-toggle="modal" onclick="angular.element(this).scope().view_info(\'' + data.id + '\')" ><i class="fa fa-eye"></i> View</button>';
				return btn;
			})
		];
		vm.dtInstance = {};
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search			= [];
			$scope.search.empid 	= ''; 
			$scope.search.empname  	= '';
			$scope.search.utype 	= '';
			$scope.search.unit 		= '';
			$scope.search.idlvl 	= '';
			$scope.search.idloc 	= '';
			$scope.search.idpaygrp 	= '';
			$scope.search.idpaystat = '';
			$timeout(function () {	
				$(".select2-selection__rendered").text('');
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.resetCreateAcct = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/hr/employee/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.add = data;			
				$scope.add.password = {
					userPassword:''
				};
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.editEmployeeInfo = function( file ){
			$scope.edit.neb = ($('input[name^="neb[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nebschool = ($('input[name^="nebschool[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nebfrom = ($('input[name^="nebfrom[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nebto = ($('input[name^="nebto[]"]').map(function () { return $(this).val(); }).get());

			$scope.edit.nehcompany = ($('input[name^="nehcompany[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nehposition = ($('input[name^="nehposition[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nehfrom = ($('input[name^="nehfrom[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nehto = ($('input[name^="nehto[]"]').map(function () { return $(this).val(); }).get());

			$scope.edit.netexam = ($('input[name^="netexam[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.netlocation = ($('input[name^="netlocation[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.netdate = ($('input[name^="netdate[]"]').map(function () { return $(this).val(); }).get());

			$scope.edit.ntttraining = ($('input[name^="ntttraining[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nttlocation = ($('input[name^="nttlocation[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nttdate = ($('input[name^="nttdate[]"]').map(function () { return $(this).val(); }).get());
			
			var regex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&._])[A-Za-z\d$@$!%*#?&._]{6,}$/;		
			var x = ''+$scope.edit.password.userPassword;				
			if( x != '' ){
				if(!x.match(regex)){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Password Format";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			
			$scope.isSaving = true;
			Upload.upload({
				url		: apiUrl+'admin/hr/employee/update.php',
				method	: 'POST',
				file	: file,
				data	: {
					'accountid'	: $scope.dashboard.values.accountid,
					'info'		: $scope.edit,
					'pword'		: x,
					'targetPath': '../../../admin/hr/employee/pix/'							
				}
			}).then(function (response) {
				var data = response.data;
				$scope.isSaving = false;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if(data.status=='error-upload-type'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Only png, jpg, and jpeg files are accepted";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='noempid'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Employee ID";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='idexists'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Employee ID already taken";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='nofname'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify First Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='lname'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Last Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='mname'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Middle Name";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='sex'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Gender";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='idaccttype'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Account Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='idemptype'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Employee Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='address'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Address";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='cnumber'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Contact Number";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='bdate'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Birth Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='bplace'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Birth Place";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='citizenship'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Citizenship";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return; 
				}else if(data.status=='religion'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Religion";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='civilstat'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Civil Status";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='spouse'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Spouse";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='idtax'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Tax Exemption Code";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='email'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Email Format";
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
					$rootScope.dymodalmsg  = "Account updated successfully";
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
			},  function (response) {
					if (response.status > 0){
						$rootScope.modalDanger();
					}
				}
			);	
		}
		
		$scope.addEmployeeInfo = function( file ){
			$scope.add.eb = ($('input[name^="eb[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ebschool = ($('input[name^="ebschool[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ebfrom = ($('input[name^="ebfrom[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ebto = ($('input[name^="ebto[]"]').map(function () { return $(this).val(); }).get());


			$scope.add.ehcompany = ($('input[name^="ehcompany[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ehposition = ($('input[name^="ehposition[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ehfrom = ($('input[name^="ehfrom[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ehto = ($('input[name^="ehto[]"]').map(function () { return $(this).val(); }).get());

			$scope.add.etexam = ($('input[name^="etexam[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.etlocation = ($('input[name^="etlocation[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.etdate = ($('input[name^="etdate[]"]').map(function () { return $(this).val(); }).get());

			$scope.add.tttraining = ($('input[name^="tttraining[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ttlocation = ($('input[name^="ttlocation[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ttdate = ($('input[name^="ttdate[]"]').map(function () { return $(this).val(); }).get());
			
			var regex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&._])[A-Za-z\d$@$!%*#?&._]{6,}$/;		
			var x = ''+$scope.add.password.userPassword;	
			
			if(!x.match(regex)){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Password Format";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			$scope.isSaving = true;
			Upload.upload({
				url		: apiUrl+'admin/hr/employee/create.php',
				method	: 'POST',
				file	: file,
				data	: {
					'accountid'	: $scope.dashboard.values.accountid,
					'info'		: $scope.add,
					'pword'		: x,
					'targetPath': '../../../admin/hr/employee/pix/'							
				}
			}).then(function (response) {
					var data = response.data;
					$scope.isSaving = false;
					if( data.status == "error" ){
						$rootScope.modalDanger();
					}else if(data.status=='error-upload-type'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Only png, jpg, and jpeg files are accepted";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='noempid'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Employee ID";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='idexists'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Employee ID already taken";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='nopassword'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Password";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='nofname'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify First Name";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='lname'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Last Name";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='mname'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Middle Name";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='sex'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Gender";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='idaccttype'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Account Type";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='idemptype'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Employee Type";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='address'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Address";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='cnumber'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Contact Number";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='bdate'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Birth Date";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='bplace'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Birth Place";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='citizenship'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Citizenship";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return; 
					}else if(data.status=='religion'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Religion";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='civilstat'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Civil Status";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='spouse'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Spouse";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='idtax'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Tax Exemption Code";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if(data.status=='email'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Invalid Email Format";
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
						$rootScope.dymodalmsg  = "Account added successfully";
						$rootScope.dymodalstyle = "btn-success";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function (response) {
					if (response.status > 0){
						$rootScope.modalDanger();
					}
				}
			);	
		}
		
		$scope.view_info = function( id ){
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/hr/employee/view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.view = data;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	
		$scope.edit_view = function( id ){
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/hr/employee/edit_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.edit = data;				
				$scope.edit.password = {
					userPassword:''
				};				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.assign_view = function( id ){
			var urlData = {
				'id': id
			}
			$http.post(apiUrl+'admin/hr/employee/assign_view.php',urlData)
			.then( function (response, status){			
				var data 		= response.data;
				$scope.assign 	= data;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.assignEmployeeInfo = function(){
			var urlData = {
				'accountid'	: $scope.dashboard.values.accountid,
				'info'		: $scope.assign
			}
			$http.post(apiUrl+'admin/hr/employee/assign_update.php',urlData)
			.then( function (response, status){			
				var data 		= response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please log in";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idlabor" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Labor Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "empstat" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Employment Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idunit" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Business Unit";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idpos" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Position";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "wshift" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Work Shift";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "schedtype" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Shift Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idloc" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Job Location";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idsuperior" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Immediate Supperior";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idpaygrp" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Pay Group";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idpaystat" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Pay Status";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idrevenue" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Pay Revenue Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "idrelease" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Payment Release Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "dependent" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please select Dependent";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "salary" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Salary";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "hdate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Hire Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "errDate1" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Regularization Date should be greater than Hired Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "errDate2" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Seperation Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "errDate3" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Seperation Date should be greater than Regularization Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "errDate4" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Seperation Date should be greater than Hired Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "errLeave1" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Entitled leave hours entered";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else{
					
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 1000);
					$("#assignModal").modal("hide");
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Account updated successfully";
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-check";				
					$("#dymodal").modal("show");
				}
				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
	
	var options = {
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		yearRange: "-50:+10",
		clickInput: true,
	};

	$scope.addeb = function () {
		$("#eb").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="ea">Educational attainment</label><input type="text" class="form-control" name="eb[]" placeholder="Educational attainment"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="sn">School</label><input type="text" class="form-control" name="ebschool[]" placeholder="School"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="ebfrom[]">From</label><input type="text" class="form-control" name="ebfrom[]" placeholder="From"  autocomplete="off" required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="ebto[]">To</label><input type="text" class="form-control" name="ebto[]" placeholder="To"  autocomplete="off" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="ebfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="ebto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeeb = function () {
		$(".eeb").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="eea">Educational attainment</label><input type="text" class="form-control" name="neb[]" placeholder="Educational attainment"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="esn">School</label><input type="text" class="form-control" name="nebschool[]" placeholder="School"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="nebfrom[]">From</label><input type="text" class="form-control" name="nebfrom[]" autocomplete="off" placeholder="From" required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="nebto[]">To</label><input type="text" class="form-control"  name="nebto[]" autocomplete="off" placeholder="To"   required ng-disabled="isSaving" /></div> </div></div>');
		$('input[name^="nebfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="nebto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeh = function () {
		$("#eh").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="company[]">Company</label><input type="text" class="form-control" placeholder="Company" name="ehcompany[]"   ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="position[]">Position</label><input type="text" class="form-control" placeholder="Position" name="ehposition[]"   ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="cfrom[]">From</label><input type="text" class="form-control" placeholder="From"   name="ehfrom[]" required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="cto">To</label><input type="text" class="form-control" placeholder="To"   name="ehto[]" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="ehfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="ehto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeeh = function () {
		$(".eeh").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="ehcompany">Company</label><input type="text" class="form-control" name="nehcompany[]" placeholder="Company"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="ehposition">Position</label><input type="text" class="form-control" name="nehposition[]" placeholder="Position"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="eehfrom[]">From</label><input type="text" class="form-control" name="nehfrom[]" placeholder="From"   required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="eehto[]">To</label><input type="text" class="form-control" name="nehto[]" placeholder="To"   required ng-disabled="isSaving" /></div></div></div > ');
		$('input[name^="nehfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="nehto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addet = function () {
		$("#et").append('<div class="appended"><div class="col-md-4"><div class="form-group"><label>Exam</label><input type="text" class="form-control" placeholder="Exam" name="etexam[]"   ng-disabled="isSaving" /></div></div><div class="col-md-4"><div class="form-group"><label>Location</label><input type="text" class="form-control" placeholder="Location" name="etlocation[]"   ng-disabled="isSaving" /></div></div><div class="col-md-4"><div class="form-group"><label>Date</label><input type="text" class="form-control" placeholder="Date"   name="etdate[]" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="etdate[]"]').each(function () {
			$(this).datepicker(options);
		});

	}
	$scope.addeet = function () {
		$(".eet").append('<div class="appended"><div class="col-md-4"><div class="form-group"><label>Exam</label><input type="text" class="form-control" name="netexam[]" placeholder="Exam" ng-disabled="isSaving" required /></div ></div ><div class="col-md-4"><div class="form-group"><label>Location</label><input type="text" class="form-control" name="netlocation[]" placeholder="Location" ng-disabled="isSaving" required /></div></div><div class="col-md-4"><div class="form-group"><label>Date</label><input type="text" class="form-control" name="netdate[]" placeholder="Date"   required ng-disabled="isSaving" /></div></div></div > ');
		$('input[name^="netdate[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addtt = function () {
		$("#tt").append('<div class="appended"><div class="col-md-4"><div class="form-group"><label>Training</label><input type="text" class="form-control" placeholder="Training" name="tttraining[]"   ng-disabled="isSaving" /></div></div><div class="col-md-4"><div class="form-group"><label>Location</label><input type="text" class="form-control" placeholder="Location" name="ttlocation[]"   ng-disabled="isSaving" /></div></div><div class="col-md-4"><div class="form-group"><label>Date</label><input type="text" class="form-control" placeholder="Date"   name="ttdate[]" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="ttdate[]"]').each(function () {
			$(this).datepicker(options);
		});
	}

	$scope.addett = function () {
		$(".ett").append('<div class="appended"><div class="col-md-4"><div class="form-group"><label>Training</label><input type="text" class="form-control" name="ntttraining[]" placeholder="Training" ng-disabled="isSaving" required /></div></div><div class="col-md-4"><div class="form-group"><label>Location</label><input type="text" class="form-control" name="nttlocation[]" placeholder="Location"  ng-disabled="isSaving" required /></div></div><div class="col-md-4"><div class="form-group"><label>Date</label><input type="text" class="form-control" name="nttdate[]" placeholder="Date"  required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="nttdate[]"]').each(function () {
			$(this).datepicker(options);
		});
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
	
	$(document).keyup(function (e) {
		if (e.keyCode === 27) {
			$('.modal').modal('hide');
			$('.appended').remove();
		}
	});
		
	$scope.dashboard.setup();
}]);