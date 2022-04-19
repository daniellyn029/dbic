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
			paystat:[],
			accounts: [],
			
			salutation:[],
			suffix:[],
			religion:[],
			citizenship:[],
			bloodtype:[],
			eyecolor:[],
			haircolor:[],
			skincolor:[],
			buildtype:[],
			banks:[],
			docs:[],
			paytype:[],
			govpaytype:[],
			cbatype:[],
			allmethod:[],
			allregion:[],
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
			$http.post(apiUrl+'admin/hr/employee/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.accounts 	= data.accounts;
				$scope.dashboard.values.emptypes 	= data.emptypes;
				$scope.dashboard.values.accttype 	= data.acctypes;
				$scope.dashboard.values.civilstat 	= data.civilstat;	
				$scope.dashboard.values.joblvl 		= data.joblvl;	
				$scope.dashboard.values.department 	= data.departments;	
				$scope.dashboard.values.locs 		= data.locs;	
				$scope.dashboard.values.paygroups 	= data.paygroups;	
				$scope.dashboard.values.paystat 	= data.paystat;	
				$scope.dashboard.values.salutation 	= data.salutation;	
				$scope.dashboard.values.suffix 		= data.suffix;
				$scope.dashboard.values.religion 	= data.religion;
				$scope.dashboard.values.citizenship = data.citizenship;
				$scope.dashboard.values.bloodtype 	= data.bloodtype;
				$scope.dashboard.values.eyecolor 	= data.eyecolor;
				$scope.dashboard.values.haircolor 	= data.haircolor;
				$scope.dashboard.values.skincolor 	= data.skincolor;
				$scope.dashboard.values.buildtype 	= data.buildtype;
				$scope.dashboard.values.banks 		= data.banks;
				$scope.dashboard.values.docs 		= data.docs;
				$scope.dashboard.values.paytype 	= data.paytype;
				$scope.dashboard.values.govpaytype 	= data.govpaytype
				$scope.dashboard.values.cbatype 	= data.cbatype;
				$scope.dashboard.values.allmethod 	= data.allmethod;
				$scope.dashboard.values.allregion 	= data.allregion;
				$scope.dashboard.values.period 		= data.period;
				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.manualcontri = function(a,data){
		if( parseInt(a)==1 ){
			$scope.edit.sss_amt = '0.00';
		}else if( parseInt(a)==2 ){
			$scope.edit.ibig_amt = '0.00';
		}else if( parseInt(a)==3 ){
			$scope.edit.health_amt = '0.00';
		}
	}
	
	$scope.setIDHead = function( idunit ){
		var urlData = {
			'accountid' : $scope.dashboard.values.accountid,
			'idunit'	: idunit
		}
		$http.post(apiUrl+'admin/hr/employee/setHead.php',urlData)
		.then( function (response, status){	
			$scope.edit.idsuperior = response.data.idhead;
			$timeout(function () {	
				$("#supperior").val($scope.edit.idsuperior).trigger("change");
			}, 100);
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	$scope.showDependents = function( noChild ){
		if( parseInt( noChild ) > 0 ){
			$("#modal-dependent").modal("show");
		}
	}
	
	$scope.empmngr = function( supperiors ){
		return supperiors.idaccttype == 2 || supperiors.idaccttype == 1;
	}
	
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}
	
	$scope.generateRegion = function( o ){
		var  a = $filter('filter')( $scope.edit.locs , { id : ''+o })[0];	
		$scope.edit.region =  a.region;
	}
	
	$scope.changeLeaveId = function( obj ){
		$scope.edit.leaves[ obj.key ].id = "";
		$scope.edit.allleaves.forEach(function(item, index){
			if( item.name == obj.name ){
				$scope.edit.leaves[ obj.key ].id 			= item.id;
				$scope.edit.leaves[ obj.key ].hours			= item.hours;
				$scope.edit.leaves[ obj.key ].idtype		= item.idtype;	
				$scope.edit.leaves[ obj.key ].isconvertible	= item.isconvertible;	
				$scope.edit.leaves[ obj.key ].type			= item.type;	
				return;				
			}
		});
	}
	
	$scope.employees_functions = function(){
		$scope.add 				= [];
		$scope.edit				= [];
		$scope.view				= [];
		$scope.search			= [];
		$scope.search.empid 	= ''; 
		$scope.search.empname  	= '';
		$scope.search.type 		= ''; 
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
		.withDOM('<"buttons dataTables_filter">lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [2, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn(null).withTitle('Pic').notSortable().withClass('btnTD fixwidth')
			.renderWith(function(data, type, full, meta){
				var btn = '<img src="'+ data.pic +'" alt="" style="width:35px;cursor:pointer">';
				return btn;
			}),
		
			DTColumnBuilder.newColumn('empid').withTitle('Employee ID').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn('empname').withTitle('Name').withClass('btnTD'),
			DTColumnBuilder.newColumn('type').withTitle('Account Type').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('etype').withTitle('Account Status').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD actiontd')
			.renderWith(function(data, type, full, meta){
				/*var btn  = '<button style="width:100px; margin-left:3px;" class="btn btn-flat btn-sm btn-warning pull-right" title="View" data-target="#viewModal" data-toggle="modal" onclick="angular.element(this).scope().view_info(\'' + data.id + '\')" ><i class="fa fa-eye"></i> View</button>';
				btn		+= ' <button style="width:100px; margin-left:3px;" class="btn btn-flat btn-sm btn-danger pull-right" title="Delete" onclick="angular.element(this).scope().delete_info(\'' + data.id + '\')" ><i class="fa fa-trash"></i> Delete</button>';
				btn		+= ' <button style="width:100px" class="btn btn-flat btn-sm btn-success pull-right" title="Update" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
				return btn;*/
				var btn  = '<div class="col-lg-4"><button style="width:100px" class="btn btn-flat btn-sm btn-success" title="Update" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button></div>';
				btn		+= '<div class="col-lg-4"><button style="width:100px" class="btn btn-flat btn-sm btn-danger" title="Delete" onclick="angular.element(this).scope().delete_info(\'' + data.id + '\')" ><i class="fa fa-trash"></i> Delete</button></div>';
				btn		+= '<div class="col-lg-4"><button style="width:100px" class="btn btn-flat btn-sm btn-warning" title="View" data-target="#viewModal" data-toggle="modal" onclick="angular.element(this).scope().view_info(\'' + data.id + '\')" ><i class="fa fa-eye"></i> View</button></div>';
				
				return btn;
			})
		];
		vm.dtInstance = {};
		$(document).ready(function () {
            $("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;width:100px" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button><button style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;width:100px" class="btn btn-flat btn-primary pull-right" title="Search" data-toggle="modal" data-target="#modal-search" onclick="angular.element(this).scope().dashboard.setup()"><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button><button style="margin-right:3px;background: #00a65a;width:100px; border: 1px solid #00a65a;" class="btn btn-flat btn-primary pull-right" title="Create" data-toggle="modal" data-target="#modal-add" id="addempbtn" onclick="angular.element(this).scope().resetCreateAcct()"><i class="fa fa-plus-circle fa-sm" style="padding:3px"></i>Add </button>')
		});
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();		
		}
	
		$scope.files2 = function(file){
			window.location = '/dbic/assets/php/admin/hr/employee/attachments/download.php?file='+file;
		}
		
		$scope.resetSearch = function(){
			$scope.search			= [];
			$scope.search.empid 	= ''; 
			$scope.search.empname  	= '';
			$scope.search.type 		= '';
			$scope.search.unit 		= '';
			$scope.search.idlvl 	= '';
			$scope.search.idloc 	= '';
			$scope.search.idpaygrp 	= '';
			$scope.search.idpaystat = '';
			$timeout(function () {	
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
				$('.appended').remove();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.setprofimageAdd = function(){
			if( !$scope.add.picFile ){
				$scope.add.prof_pic = 'assets/images/undefined.jpg?'+Math.floor(Date.now() / 1000); 
			}else{
				$scope.add.picFile = '';
			}
		}
		
		$scope.setprofimage = function(){
			if( !$scope.edit.epicFile ){
				$scope.edit.eprof_pic = 'assets/images/undefined.jpg?'+Math.floor(Date.now() / 1000); 
			}else{
				$scope.edit.epicFile = '';
			}
		}
		
		$scope.resetSpouse = function( obj ){
			if( parseInt( obj ) == 1 || parseInt( obj ) == 3 || obj == '' ){
				$scope.add.spouse = '';
			}
		}
		$scope.resetSpouse2 = function( obj ){
			//$scope.edit.spouse = $scope.edit.ospouse;
			if( parseInt( obj ) == 1 || parseInt( obj ) == 3 || obj == '' ){
				$scope.edit.spouse = '';
			}
		}
		
		$scope.delete_info = function( idacct ){
			var r = confirm("Are you sure you want to delete record?");
			if (r == true) {
				var urlData = {
					'idacct': idacct
				}
				$http.post(apiUrl+'admin/hr/employee/delete.php',urlData)
				.then( function (response, status){			
					var data = response.data;
					if( data.status == "error" ){
						$rootScope.modalDanger();
					}else if(data.status=='invalid'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Could not delete because there is already existing records";
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
						$rootScope.dymodalmsg  = "Account deleted successfully";
						$rootScope.dymodalstyle = "btn-success";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
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
			$scope.edit.netorg = ($('input[name^="netorg[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.netfac = ($('input[name^="netfac[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.netlocation = ($('input[name^="netlocation[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.netdate = ($('input[name^="netdate[]"]').map(function () { return $(this).val(); }).get());

			$scope.edit.ntttraining = ($('input[name^="ntttraining[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nttorg = ($('input[name^="nttorg[]"]').map(function () { return $(this).val(); }).get());
			$scope.edit.nttfac = ($('input[name^="nttfac[]"]').map(function () { return $(this).val(); }).get());
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
			
			var attachment_type = [];
			var attachment_files= [];
			
			$.each($scope.edit.docs,function (key , val){ 
				if( $scope.edit.docs.hasOwnProperty(key) ){
					attachment_type.push( val );
				}else{
					attachment_type.push( null );
				}
			});
			$.each($scope.edit.epicFile,function (key , val){ 
				if( $scope.edit.epicFile.hasOwnProperty(key) && key > 0 ){
					attachment_files.push( val );
				}else if( key > 0 ){
					attachment_files.push( null );
				}
			});
			
			$scope.isSaving = true;
			Upload.upload({
				url		: apiUrl+'admin/hr/employee/update.php',
				method	: 'POST',
				file	: file,
				data	: {
					'accountid'			: $scope.dashboard.values.accountid,
					'info'				: $scope.edit,
					'attachment_type'	: attachment_type,
					'attachment_files'	: attachment_files,
					'period_id'			: $scope.dashboard.values.period.id,
					'pword'				: x,
					'targetPath'		: '../../../admin/hr/employee/pix/',
					'docPath'			: '../../../admin/hr/employee/attachments/'						
				}
			}).then(function (response) {
				var data = response.data;
				$scope.isSaving = false;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else if(data.status=='duplicate_attachment'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Duplicate attachments";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='invaccttype'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Classification selected already has a Manager assigned";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='invemptype'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Employment Type";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='duplicate_leaves'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Duplicate Leaves selected";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='invsuperior'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You can not set your account as own superior";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='nobir2316'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please attach BIR Form No. 2316";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if(data.status=='duplicate_allowance'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Duplicate Allowance selected";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
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
				}else if(data.status=='idlvlscale'){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Job Level Scalling";
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
				}else if( data.status == "nordate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Regularization Date";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}else if( data.status == "noupdate" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Employment Type selected.";
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
		
		$scope.addpa = function(){
			var index = $scope.add.pa.length;
			$scope.add.pa[index] = {
				"equi_tools" 	: '',
				"serial"	 	: '',
				"quantity"	 	: '',
				"date_issued"	: '',
				"date_returned"	: ''
			};
		}
		$scope.editpa = function(){
			var index = $scope.edit.pa.length;
			$scope.edit.pa[index] = {
				"id"			: '',
				"equi_tools" 	: '',
				"serial"	 	: '',
				"quantity"	 	: '',
				"date_issued"	: '',
				"date_returned"	: ''
			};
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
			$scope.add.etorg = ($('input[name^="etorg[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.etfac = ($('input[name^="etfac[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.etlocation = ($('input[name^="etlocation[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.etdate = ($('input[name^="etdate[]"]').map(function () { return $(this).val(); }).get());

			$scope.add.tttraining = ($('input[name^="tttraining[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ttorg = ($('input[name^="ttorg[]"]').map(function () { return $(this).val(); }).get());
			$scope.add.ttfac = ($('input[name^="ttfac[]"]').map(function () { return $(this).val(); }).get());
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
			
			var attachment_type = [];
			var attachment_files= [];
			
			$.each($scope.add.docs,function (key , val){ 
				if( $scope.add.docs.hasOwnProperty(key) ){
					attachment_type.push( val );
				}
			});
			$.each($scope.add.picFile,function (key , val){ 
				if( $scope.add.picFile.hasOwnProperty(key) ){
					attachment_files.push( val );
				}
			});
			
			$scope.isSaving = true;
			Upload.upload({
				url		: apiUrl+'admin/hr/employee/create.php',
				method	: 'POST',
				file	: file,
				data	: {
					'accountid'			: $scope.dashboard.values.accountid,
					'info'				: $scope.add,
					'attachment_type'	: attachment_type,
					'attachment_files'	: attachment_files,
					'pword'				: x,
					'targetPath'		: '../../../admin/hr/employee/pix/',
					'docPath'			: '../../../admin/hr/employee/attachments/'						
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
					}else if(data.status=='duplicate_attachment'){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Duplicate attachments";
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
				$timeout(function () {	
					$("#position").val($scope.edit.idpos).trigger("change");
					$("#businessunit").val($scope.edit.idunit).trigger("change");
					$("#supperior").val($scope.edit.idsuperior).trigger("change");
					$('input[name^="neb[]"]').val('');
					$('input[name^="nebschool[]"]').val('');
					$('input[name^="nebfrom[]"]').val('');
					$('input[name^="nebto[]"]').val('');
					
					$('input[name^="nehcompany[]"]').val('');
					$('input[name^="nehposition[]"]').val('');
					$('input[name^="nehfrom[]"]').val('');
					$('input[name^="nehto[]"]').val('');
					
					$('input[name^="netexam[]"]').val('');
					$('input[name^="netlocation[]"]').val('');
					$('input[name^="netdate[]"]').val('');
					
					$('input[name^="ntttraining[]"]').val('');
					$('input[name^="nttlocation[]"]').val('');
					$('input[name^="nttdate[]"]').val('');
					
					$('.appended').remove();
				}, 100);
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
		
		$scope.releaseFunc = function(){
			if( typeof($scope.edit.idbank) == 'undefined' || $scope.edit.idbank.length == 0 || ( $scope.edit.idbank.length > 0 && $scope.edit.idpayroll.length == 0) ){
				$scope.edit.idrelease  = "1";
				$scope.edit.payrelease = "Cash";
			}else{
				$scope.edit.idrelease  = "2";
				$scope.edit.payrelease = "Bank";
			}
		}
		
		$scope.prevEmployee = function(){
			if( $scope.edit.isprevemp.checked == true ){
				$("#modal-isprev").modal("show");
			}
		}
		
		/*$scope.assignEmployeeInfo = function(){
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
		}*/
	}
	var options = {
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		yearRange: "-50:+10",
		clickInput: true,
	};
	
	$scope.addeb = function () {
		$("#eb").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="ea">Educational attainment</label><input type="text" class="form-control" name="eb[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="sn">School</label><input type="text" class="form-control" name="ebschool[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="ebfrom[]">From</label><input type="text" class="form-control" id="ebfrom[]" name="ebfrom[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"   required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="ebto[]">To</label><input type="text" class="form-control" id="ebto[]" name="ebto[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"   required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="ebfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="ebto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeeb = function () {
		$(".eeb").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="eea">Educational attainment</label><input type="text" class="form-control" name="neb[]" ng-model="eb.attainment" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="esn">School</label><input type="text" class="form-control" name="nebschool[]" ng-model="eb.school" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"   ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="nebfrom[]">From</label><input type="text" class="form-control" name="nebfrom[]" autocomplete="off" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="nebto[]">To</label><input type="text" class="form-control" id="nebto[]" name="nebto[]" ng-model="eb.dto" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  required ng-disabled="isSaving" /></div> </div></div>');
		$('input[name^="nebfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="nebto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeh = function () {
		$("#eh").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="company[]">Company</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="ehcompany[]"   ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="position[]">Position</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="ehposition[]"   ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="cfrom[]">From</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  name="ehfrom[]" required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="cto">To</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  name="ehto[]" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="ehfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="ehto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeeh = function () {
		$(".eeh").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label for="ehcompany">Company</label><input type="text" class="form-control" name="nehcompany[]" ng-model="eh.company" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="ehposition">Position</label><input type="text" class="form-control" name="nehposition[]" ng-model="eh.position" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  ng-disabled="isSaving" required /></div></div><div class="col-md-3"><div class="form-group"><label for="eehfrom[]">From</label><input type="text" class="form-control" name="nehfrom[]" ng-model="eh.dfrom" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  required ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label for="eehto[]">To</label><input type="text" class="form-control" name="nehto[]" ng-model="eh.dto" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  required ng-disabled="isSaving" /></div></div></div > ');
		$('input[name^="nehfrom[]"]').each(function () {
			$(this).datepicker(options);
		});
		$('input[name^="nehto[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addet = function () {
		$("#et").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label>Exam</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="etexam[]"   ng-disabled="isSaving" /></div></div>  <div class="col-md-2"><div class="form-group"><label class="visible-lg">Issuing&nbsp;Organization</label><label class="hidden-lg">Organization</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="etorg[]"   ng-disabled="isSaving" /></div></div><div class="col-md-3"><div class="form-group"><label>Facilitator</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="etfac[]"   ng-disabled="isSaving" /></div></div>  <div class="col-md-2"><div class="form-group"><label>Location</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="etlocation[]"   ng-disabled="isSaving" /></div></div><div class="col-md-2"><div class="form-group"><label>Date</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"   name="etdate[]" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="etdate[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addeet = function () {
		$(".eet").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label>Exam</label><input type="text" class="form-control" name="netexam[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" ng-disabled="isSaving" required /></div ></div ><div class="col-md-2"><div class="form-group"><label class="visible-lg">Issuing&nbsp;Organization</label><label class="hidden-lg">Organization</label><input type="text" class="form-control" name="netorg[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" ng-disabled="isSaving" required /></div></div>  <div class="col-md-3"><div class="form-group"><label>Facilitator</label><input type="text" class="form-control" name="netfac[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" ng-disabled="isSaving" required /></div></div>  <div class="col-md-2"><div class="form-group"><label>Location</label><input type="text" class="form-control" name="netlocation[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" ng-disabled="isSaving" required /></div></div><div class="col-md-2"><div class="form-group"><label>Date</label><input type="text" class="form-control" name="netdate[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  required ng-disabled="isSaving" /></div></div></div > ');
		$('input[name^="netdate[]"]').each(function () {
			$(this).datepicker(options);
		});
	}
	$scope.addtt = function () {
		$("#tt").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label>Training</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="tttraining[]"   ng-disabled="isSaving" /></div></div> <div class="col-md-2"><div class="form-group"><label class="visible-lg">Issuing&nbsp;Organization</label><label class="hidden-lg">Organization</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="ttorg[]"   ng-disabled="isSaving" /></div></div> <div class="col-md-3"><div class="form-group"><label>Facilitator</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="ttfac[]"   ng-disabled="isSaving" /></div></div> <div class="col-md-2"><div class="form-group"><label>Location</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" name="ttlocation[]"   ng-disabled="isSaving" /></div></div><div class="col-md-2"><div class="form-group"><label>Date</label><input type="text" class="form-control" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  name="ttdate[]" required ng-disabled="isSaving" /></div></div></div>');
		$('input[name^="ttdate[]"]').each(function () {
			$(this).datepicker(options);
		});
	}

	$scope.addett = function () {
		$(".ett").append('<div class="appended"><div class="col-md-3"><div class="form-group"><label>Training</label><input type="text" class="form-control" name="ntttraining[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" ng-disabled="isSaving" required /></div></div>    <div class="col-md-2"><div class="form-group"><label class="visible-lg">Issuing&nbsp;Organization</label><label class="hidden-lg">Organization</label><input type="text" class="form-control" name="nttorg[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  ng-disabled="isSaving" required /></div></div> <div class="col-md-3"><div class="form-group"><label>Facilitator</label><input type="text" class="form-control" name="nttfac[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  ng-disabled="isSaving" required /></div></div>  <div class="col-md-2"><div class="form-group"><label>Location</label><input type="text" class="form-control" name="nttlocation[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;"  ng-disabled="isSaving" required /></div></div><div class="col-md-2"><div class="form-group"><label>Date</label><input type="text" class="form-control" name="nttdate[]" style="border:none;border-bottom: 1px black solid;width:100%;height: 30px;background: white;    padding-top: 0px;padding-bottom: 0px;" required ng-disabled="isSaving" /></div></div></div>');
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