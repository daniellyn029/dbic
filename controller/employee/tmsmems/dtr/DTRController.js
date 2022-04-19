app.controller('DashboardController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/portal/header/index.html";
	$scope.leftNavigationTemplate="view/portal/sidebar/index.html";
	$scope.footerTemplate="view/portal/footer/index.html";
	
	$scope.acct_search_status   = "-1";
	$scope.acct_search_id 		= null;
	$scope.acct_search_fname	= null;
	$scope.acct_search_lname	= null;
	$scope.acct_search_email	= null;
	$scope.acct_search_type		= null;
	$scope.acct_search_stat		= null;
	$scope.acct_newUser = {
		userPassword:''
	};
	$scope.acct_fname 		= null;
	$scope.acct_lname 		= null;
	$scope.acct_email 		= null;
	$scope.acct_type		= null;
	$scope.myVar			=null;

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
			typeList:null,
			statusList:null
		},
		active: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'portal/loggedinuser.php',urlData)
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
		types: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'types.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.typeList = data;					
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.applications_functions = function(application_page_filter){
		
		var vm = this;
		$scope.vm = vm;	
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/applications/data.php',
			 type: 'POST',
			 data: function(d){
				d.accountid 	= $scope.dashboard.values.accountid;
				d.acct_type		= $scope.dashboard.values.accouttype;
				d.active		= "" + application_page_filter;
				d.job			= $scope.acct_search_job;
				d.dept			= $scope.acct_search_dept;
				d.staff			= $scope.acct_search_fname;
				d.email			= $scope.acct_search_email;
				d.applied1		= $scope.ddfrom;	
				d.applied2		= $scope.ddto;
				d.job_stat		= $scope.acct_search_status;
				
				d.job_desc		= $scope.acct_search_job_desc;
				d.gender		= $scope.acct_search_sex;
				d.priority		= $scope.acct_search_priority;
				d.salary1		= $scope.acct_search_sal1;
				d.salary2		= $scope.acct_search_sal2;
				d.age1			= $scope.acct_search_age1;
				d.age2			= $scope.acct_search_age2;
				d.exp1			= $scope.acct_search_exp1;
				d.exp2			= $scope.acct_search_exp2;				
			 }
		 })		
		 .withDataProp('data')
		 .withDOM('lrtip')
		 .withOption('processing', true)
		 .withOption('serverSide', true)
		 .withPaginationType('full_numbers')
		 .withOption('responsive',true)
		 .withOption('autoWidth',false)
		 //.withOption('lengthMenu',[2,4,6,8])
		 .withOption('order', [0, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('id').withTitle('ID').withClass('btnTD').notVisible(),
			 DTColumnBuilder.newColumn('job').withTitle('Job').withClass('btnTD'),
			 DTColumnBuilder.newColumn('name').withTitle('Applicant'),
			 DTColumnBuilder.newColumn('email').withTitle('Email'),
			 DTColumnBuilder.newColumn('number').withTitle('Contact No.').withClass('btnTD').notSortable(),			 			 
			 DTColumnBuilder.newColumn('salary').withTitle('Salary').withClass('btnTD'),
			 DTColumnBuilder.newColumn('date_applied').withTitle('Applied Date').withClass('btnTD'),
			 DTColumnBuilder.newColumn('job_stat').withTitle('Status').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			 .renderWith(function(data, type, full, meta){
				var btn1 = '<button class="btn btn-flat btn-sm btn-primary" title="Résumé" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().cv_view(\'' + data.id_person + '\', \'' + data.id_job + '\')" >Résumé</button>';
				if( data.priority == 'N' && application_page_filter == '0' ){
					btn1 = btn1 + '&nbsp; <button class="btn btn-flat btn-sm btn-primary" title="Short List" onclick="angular.element(this).scope().set_priority(\'' + data.id_person + '\', \'' + data.id_job + '\')" >Short List</button>';
				}
				return btn1;
			 })
		 ];
		 vm.dtInstance = {};	
		 
		 $scope.acctSearch = function(){			 
			 vm.dtInstance.reloadData();
		 }
		 
		 $scope.resetAcct = function(){
			 $scope.acct_search_status = "-1";
			 $scope.acct_search_job		= null;
			 $scope.acct_search_dept	= null;
			 $scope.acct_search_fname	= null;
			 $scope.acct_search_email	= null;
			 $scope.ddfrom				= null;
			 $scope.ddto				= null;		 
			 
			 $scope.acct_search_job_desc= null;
			 $scope.acct_search_priority= null;
			 $scope.acct_search_sex		= null;
			 $scope.acct_search_sal1	= null;
			 $scope.acct_search_sal2	= null;			 
			 $scope.acct_search_age1	= null;
			 $scope.acct_search_age2	= null;
			 $scope.acct_search_exp1	= null;
			 $scope.acct_search_exp2	= null;
			 
			 vm.dtInstance.rerender();
		 }
		 
		 $scope.setReassignedTo = function( o ){
			$scope.applicants_info.job_assigned = ''; 
			$("#reassignedModal").modal("show");
		 }
		 $scope.getReassignedTo = function( o ){
			$("#reassignedModal").modal("hide");
			$scope.EditStatusForm();		
		 }

		 $scope.EditStatusForm = function(){

			var r = confirm("Are you sure you want to update status?");
			if (r == true) {

				if( $scope.applicants_info.job_status == "" ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please choose application status";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}

				if( parseInt($scope.applicants_info.job_status) == 7 && $scope.applicants_info.job_assigned == "" ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please choose Job to reassign application to.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}

				$scope.isSaving=true;
				var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'id_job'	: $scope.applicants_info.id_job,
					'id_person'	: $scope.applicants_info.id,
					'info'		: $scope.applicants_info,
					'type'		: 1
				}
				$http.post(apiUrl+"portal/applications/editstatus.php",urlData)
				.then( function (response, status){
					$scope.isSaving=false;
					var data = response.data;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="nojobid"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Job selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="notassigned"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please choose Job to reassign application to.";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="noname"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Applicant selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="donesubmit" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Already has application for this job!";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="noapply" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Applicant already hired by this company!!";
						$rootScope.dymodalstyle= "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="success"){
						$("#editModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Application Status Update is a success, please refresh the page!";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}

				}, function(response) {
					$rootScope.modalDanger();
				});	
			}
		 }

		 $scope.UpdateForm = function(){			 
			 var r = confirm("Are you sure you want to hire this person?");
			 if (r == true) {
				
				if( $scope.applicants_info.job_status == "" ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please choose application status";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				

				var person = prompt("Enter EMPLOYEE ID to enroll in HRIS, otherwise leave it blank");				
				if( person === null ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You have cancelled the process";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}				
				if ( person == "") {
					$scope.applicants_info.hris_id = null;
				} else {
					$scope.applicants_info.hris_id = person;
				}

				
				
				var regex_int  =/^[0-9]+$/;
				var x = ''+$scope.applicants_info.hris_id;
				if( x.trim()!= 'null' && x.trim()!='' && !x.match(regex_int) ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Employee ID entered. Please try again";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				
				if( $scope.applicants_info.hris_id !== null && isNaN(parseFloat($scope.applicants_info.hris_id))  ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Employee ID entered. Please try again";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}

				
				$scope.isSaving=true;
				var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'id_job'	: $scope.applicants_info.id_job,
					'id_person'	: $scope.applicants_info.id,
					'info'		: $scope.applicants_info,
					'type'		: 1
				}
				$http.post(apiUrl+"portal/applications/edit.php",urlData)
				.then( function (response, status){
					var data = response.data;
					$scope.isSaving=false;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="exists"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "This applicant is already hired!";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="nojobid"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Job selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="noname"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Applicant selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="error"){
						$rootScope.modalDanger();
					}else if( data.status=="idlength"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Employee ID should have a maximum of 4 characters";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="idexists"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Employee ID already exists";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="success"){
						$("#editModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						if( data.enroll==false){
							$rootScope.dymodalmsg  = "Update is a success but not yet enrolled in HRIS, please refresh the page!";
						}else if( data.enroll==true){
							$rootScope.dymodalmsg  = "Update is a success and enrolled in HRIS, please refresh the page!";
						}
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function(response) {
					$rootScope.modalDanger();
				});				
			 }
		 }
		 
		$scope.cv_view = function( id, id_job ){			 
			$scope.applicants_info = [];
			//alert('this is under applications_functions');
			var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'id'		: id,
					'id_job'	: id_job
				}
				$http.post(apiUrl+"portal/applicants/view.php",urlData)
				.then( function (response, status){	
					var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
				}else if( data.status == "notaccount" ){
					$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Applicant selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
				}else if( data.status == "notfound" ){
					$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Record not found in database";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
				}else{
					$scope.applicants_info = data;
					$scope.applicants_info.id_job = id_job;
				}
			}, function(response) {
				$rootScope.modalDanger();
			});			 
		}
		
		$scope.set_priority = function( id, id_job ){
			var r = confirm("Are you sure you want to short list this applicant?");
			if (r == true) {
				var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'id'		: id,
					'id_job'	: id_job,
					'type'		: '1'
				}
				$http.post(apiUrl+"portal/applications/priority.php",urlData)
				.then( function (response, status){	
					var data = response.data;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "notaccount" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Applicant selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "list_full" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Short List for this job already full";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "error" ){
						$rootScope.modalDanger();
					}else{
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Applicant added to short list";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
		}
		 
	}
	
	$scope.hired_functions = function(){
		var vm = this;
		$scope.vm = vm;	
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/hired/data.php',
			 type: 'POST',
			 data: function(d){
				d.accountid 	= $scope.dashboard.values.accountid;
				d.acct_type		= $scope.dashboard.values.accouttype;
				d.job			= $scope.acct_search_job;
				d.job_desc		= $scope.acct_search_job_desc;
				d.staff			= $scope.acct_search_fname;
				d.email			= $scope.acct_search_email;
				d.applied1		= $scope.ddfrom;	
				d.applied2		= $scope.ddto;
				d.hired1		= $scope.ddfrom1;	
				d.hired2		= $scope.ddto1;
				d.hiredby		= $scope.acct_search_by;
				d.enrolled		= $scope.acct_search_enroll;
				d.salary1		= $scope.acct_search_sal1;
				d.salary2		= $scope.acct_search_sal2;
				d.gender		= $scope.acct_search_sex;
				d.age1			= $scope.acct_search_age1	;
				d.age2			= $scope.acct_search_age2	;
				d.exp1			= $scope.acct_search_exp1	;
				d.exp2			= $scope.acct_search_exp2	;
			 }
		 })		
		 .withDataProp('data')
		 .withDOM('lrtip')
		 .withOption('processing', true)
		 .withOption('serverSide', true)
		 .withPaginationType('full_numbers')
		 .withOption('responsive',true)
		 .withOption('autoWidth',false)
		 //.withOption('lengthMenu',[2,4,6,8])
		 .withOption('order', [0, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('id').withTitle('ID').withClass('btnTD').notVisible(),
			 DTColumnBuilder.newColumn('hris_id').withTitle('ID').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('name').withTitle('Job'),
			 DTColumnBuilder.newColumn('staff').withTitle('Name'),
			 DTColumnBuilder.newColumn('email').withTitle('Email'),
			 DTColumnBuilder.newColumn('number').withTitle('Contact No.').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('salary').withTitle('Salary').withClass('btnTD'),
			 DTColumnBuilder.newColumn('date_applied').withTitle('Date Applied').withClass('btnTD'),
			 DTColumnBuilder.newColumn('date_hired').withTitle('Date Hired').withClass('btnTD'),	 
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			 .renderWith(function(data, type, full, meta){
				 return '<button style="margin-left:3px;" class="btn btn-flat btn-sm btn-primary" title="Details" data-target="#histModal" data-toggle="modal" onclick="angular.element(this).scope().hist_view(\'' + data.id + '\',\'' + data.hris_id + '\')" >Details</button>';
			 })
		 ];
		 vm.dtInstance = {};		 
		 
		 $scope.hist_view = function(id, hris_id){
			$scope.applicants_info = [];
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'id'		: id,
				'id_hris'	: hris_id
		 	}
		 	$http.post(apiUrl+"portal/applicants/hist.php",urlData)
		 	.then( function (response, status){	
		 		var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notaccount" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Applicant selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notfound" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Record not found in database";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.applicants_info = data;
				}
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});	
		 }
		 $scope.acctSearch = function(){			 
			 vm.dtInstance.reloadData();
		 }
		 
		 $scope.resetAcct = function(){
			 $scope.acct_search_job		= null;
			 $scope.acct_search_job_desc= null;
			 $scope.acct_search_fname	= null;
			 $scope.acct_search_email	= null;
			 $scope.ddfrom				= null;
			 $scope.ddto				= null;			 
			 $scope.ddfrom1				= null;	
			 $scope.ddto1				= null;
			 $scope.acct_search_by		= null;
			 $scope.acct_search_enroll  = null;
			 $scope.acct_search_sal1	= null;
			 $scope.acct_search_sal2	= null;
			 $scope.acct_search_sex		= null;
			 $scope.acct_search_age1	= null;
			 $scope.acct_search_age2	= null;
			 $scope.acct_search_exp1	= null;
			 $scope.acct_search_exp2	= null;			 
			 vm.dtInstance.rerender();
		 }

		$scope.unhire = function(){
			var r = confirm("Are you sure you want to unhire this person?");
			if (r == true) {
				var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'info'		: $scope.applicants_info
				}
				$http.post(apiUrl+"portal/hired/unhire.php",urlData)
				.then( function (response, status){	
					var data = response.data;
					if( data.status == "success" ){
						$("#histModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Successfuly unhired applicant!";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}else{
						$rootScope.modalDanger();
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
		}
		
		$scope.enroll = function(){
			var r = confirm("Are you sure you want to enroll this person to HRIS?");
			if (r == true) {
				
				var person = prompt("Enter EMPLOYEE ID to enroll in HRIS");
				if (person == null || person == "") {
					$scope.applicants_info.hris_id = null;
				} else {
					$scope.applicants_info.hris_id = person;
				}
				
				if( isNaN(parseFloat($scope.applicants_info.hris_id))  ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Employee ID entered. Please try again";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}				
				
				var regex_int  =/^[0-9]+$/;
				var x = ''+$scope.applicants_info.hris_id;
				if( x.trim()!= 'null' && x.trim()!='' && !x.match(regex_int) ){
					$scope.applicants_info.hris_id = null;
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Invalid Employee ID entered. Please try again";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				
				
				var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'id_job'	: $scope.applicants_info.job.id_job,
					'id_person'	: $scope.applicants_info.id,
					'info'		: $scope.applicants_info
				}
				$http.post(apiUrl+"portal/hired/enroll.php",urlData)
				.then( function (response, status){	
					var data = response.data;
					if( data.status == "success" ){
						$("#histModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Successfuly enrolled to HRIS!";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}else if( data.status=="idlength"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Employee ID should have a maximum of 4 characters";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="idexists"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Employee ID already exists";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else{
						$rootScope.modalDanger();
					}
				}, function(response) {
					$rootScope.modalDanger();
				});
			}	
		}
	}
	
	$scope.applicants_functions = function(){
		var vm = this;
		$scope.vm = vm;	
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/applicants/data.php',
			 type: 'POST',
			 data: function(d){
				d.accountid 	= $scope.dashboard.values.accountid;
				d.acct_type		= $scope.dashboard.values.accouttype;
			 }
		 })		
		 .withDataProp('data')
		 //.withDOM('lrtip')
		 .withOption('processing', true)
		 .withOption('serverSide', true)
		 .withPaginationType('full_numbers')
		 .withOption('responsive',true)
		 .withOption('autoWidth',false)
		 //.withOption('lengthMenu',[2,4,6,8])
		 .withOption('order', [0, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('id').withTitle('ID').withClass('btnTD'),
			 DTColumnBuilder.newColumn('name').withTitle('Applicant'),
			 DTColumnBuilder.newColumn('email').withTitle('Email'),
			 DTColumnBuilder.newColumn('number').withTitle('Contact No.').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('status').withTitle('Hired?').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			 .renderWith(function(data, type, full, meta){
				 if( data.status == 'NO' ){
					 return '<button class="btn btn-flat btn-sm btn-primary" title="Résumé" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().cv_view(\'' + data.id + '\')" >Résumé</button>';
				 }else{
					return '<button class="btn btn-flat btn-sm btn-primary" title="Résumé" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().cv_view(\'' + data.id + '\')" >Résumé</button>'
						+ '<button style="margin-left:3px;" class="btn btn-flat btn-sm btn-warning" title="Details" data-target="#histModal" data-toggle="modal" onclick="angular.element(this).scope().hist_view(\'' + data.id + '\')" >Details</button>';
				 }
			 })
		 ];
		 vm.dtInstance = {};		 
		 
		 $scope.hist_view = function(id){
			$scope.applicants_info = [];
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'id'		: id
		 	}
		 	$http.post(apiUrl+"portal/applicants/hist.php",urlData)
		 	.then( function (response, status){	
		 		var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notaccount" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Applicant selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notfound" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Record not found in database";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.applicants_info = data;
				}
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});	
		 }
		 
		 $scope.cv_view = function( id ){			 
			$scope.applicants_info = [];
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'id'		: id
		 	}
		 	$http.post(apiUrl+"portal/applicants/view.php",urlData)
		 	.then( function (response, status){	
		 		var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notaccount" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Applicant selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notfound" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Record not found in database";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.applicants_info = data;
				}
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});			 
		 }		 
	}
	
	$scope.vacancy_functions = function(){
		//$scope.remarks('0');

		var vm = this;
		$scope.vm = vm;	
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/jobs/data.php',
			 type: 'POST',
			 data: function(d){
				d.accountid 	= $scope.dashboard.values.accountid;
				d.acct_type		= $scope.dashboard.values.accouttype;
				d.job			= $scope.acct_search_job_name;
				d.dept			= $scope.acct_search_job_dept;
				d.as			= $scope.acct_search_as;
				d.js			= $scope.acct_search_js;
			 }
		 })		
		 .withDataProp('data')
		 .withDOM('lrtip')
		 .withOption('processing', true)
		 .withOption('serverSide', true)
		 .withPaginationType('full_numbers')
		 .withOption('responsive',true)
		 .withOption('autoWidth',false)
		 //.withOption('lengthMenu',[2,4,6,8])
		 .withOption('order', [0, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('id').withTitle('ID').withClass('btnTD'),
			 DTColumnBuilder.newColumn('name').withTitle('Job Title'),
			 DTColumnBuilder.newColumn('description').withTitle('Description').notSortable().renderWith(function(data, type, row){
				 if( data != null ){
					return data.length > 185 ? data.substr( 0, 185 ) +'…' : data;
				 }else{
					 return null;
				 }
			 }),
			  DTColumnBuilder.newColumn('requirements').withTitle('Qualifications').notSortable().renderWith(function(data, type, row){
				 if( data != null ){
					return data.length > 80 ? data.substr( 0, 80 ) +'…' : data;
				 }else{
					 return null;
				 }
			 }),
			 
			 DTColumnBuilder.newColumn('creator_name').withTitle('Creator').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('approver1').withTitle('Approver').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('approver2').withTitle('Approver').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('approval_stat').withTitle('Status').withClass('btnTD'),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				var btn1 = '&nbsp;<button class="btn btn-flat btn-sm btn-primary wbtn" title="Edit" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().job_view(\'' + data.id + '\')" >Edit</button>';
					btn1 = btn1 + '&nbsp;<button class="btn btn-flat btn-sm btn-primary wbtn" title="List" data-target="#viewList" data-toggle="modal" onclick="angular.element(this).scope().set_list(\'' + data.id + '\')" >List</button>';
				return btn1;
			})
		 ];
		 vm.dtInstance = {};
		 
		 $scope.acctSearch = function(){			 
			 vm.dtInstance.reloadData();
		 }
		 
		 $scope.resetAcct = function(){
			 $scope.acct_search_job_name= null;
			 $scope.acct_search_job_dept= null;
			 $scope.acct_search_job_id  = null;
			 $scope.acct_search_as		= null;
			 $scope.acct_search_js		= null;			 
			 vm.dtInstance.rerender(); 
		 }
		 
		 $scope.resetCreateJob = function(){
			 $scope.job_name = null;
			 $scope.job_dept = null;
			 $scope.job_desc = null;
			 $scope.job_stat = null;
			 $scope.job_reqs = null;
		 }
		 
		 $scope.job_view = function(id){
			$scope.job_info = [];
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'id'		: id
		 	}
		 	$http.post(apiUrl+"portal/jobs/view.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "nolvlid" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Job selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notfound" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Record not found in database";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.job_info = data;
					var url = $location.url();
					if( (url.indexOf("portal/job")) >= 0 ){
						$scope.remarks('1');
					}
				}
				
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});
		 }

		 $scope.sendMsg = function(){
			var msg = $scope.form01_newmsg;
			if(msg!=""){
				$scope.isSaving=true;
				var urlData = {
					'accountid'		: $scope.dashboard.values.accountid,
					'job'			: $scope.job_info.name,
					'department'	: $scope.job_info.dept,
					'creator'		: $scope.job_info.creator,
					'id_voucher'	: $scope.job_info.id,									
					'msg'			: $scope.form01_newmsg,
					'eform_id'		: 'form2'
				}				
				$http.post(apiUrl+"portal/jobs/remarks.php",urlData)		 	
				.then( function (response, status){	
					var data = response.data;
					$scope.isSaving  = false;
					$scope.form01_newmsg=null;
					if(data[0].status == 'success'){							
						$scope.messageList=data[0].remarks;	
						var objDiv = document.getElementById("comment-box");
						objDiv.scrollTop = objDiv.scrollHeight;
					}
				});
			}
		 }

		 $scope.remarks = function(o){
			$scope.messageList			=[];
			if(o=="1"){
				var objDiv = document.getElementById("comment-box");
				objDiv.scrollTop = objDiv.scrollHeight;
				$scope.remarksInterval();
				$scope.myVar = setInterval(function(){ 
					var objDiv = document.getElementById("comment-box");
					$scope.remarksInterval(); 
				}, 3000);
			}else{
				clearInterval($scope.myVar);					
			}
		 }

		 $scope.remarksInterval = function(){
			var urlData = {
				'accountid'		: $scope.dashboard.values.accountid,
				'id_voucher'	: $scope.job_info.id,						
				'msg'			: '',
				'eform_id'		: 'form2'
			}
			$http.post(apiUrl+"portal/jobs/remarks.php",urlData)
			.then( function (response, status){	
				var data = response.data;
				if(data[0].status=="success"){
					$scope.messageList=data[0].remarks;							
				}
			});
		 }
		 
		 $scope.UpdateForm = function(){
			 var idstat = null;
			 if( $scope.job_info.stat == 'OPEN' ){
				 idstat = 1;
			 }else{
				 idstat = 0;
			 }
			 
			var job_desc = $("#job_desc_edit").text();			 
			job_desc = job_desc.trim();			
			if( job_desc.length > 0 ){
				job_desc = $scope.job_info.description;
			}else{
				$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please specify Job Description";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
			}
			
			var job_reqs = $("#job_reqs_edit").text();			
			job_reqs = job_reqs.trim();			
			if( job_reqs.length > 0 ){
				job_reqs = $scope.job_info.requirements;
			}else{
				$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please specify Job Qualifications";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
			}
			
			 var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
				'type'		: $scope.dashboard.values.accouttype,
				'id'		: $scope.job_info.id,
				'name'		: $scope.job_info.name,
				'department': $scope.job_info.dept, 
				'desc'		: job_desc,
				'req'		: job_reqs,
				'job_max'	: $scope.job_info.job_max,
				'stat'		: $scope.job_info.stat,
				'idstat'	: idstat
		 	}
		 	$http.post(apiUrl+"portal/jobs/edit.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notlogedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please specify Job Title";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="nodept" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Department";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
				}else if( data.status=="nojobid" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Job selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status == "exists" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Job Title already exists";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "inprogress" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Could not update Job since approval process is on going";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "alreadydeclined" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Could not update Job since this is already declined";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					clearInterval($scope.myVar);
					$("#editModal").modal("hide");
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);					
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Success!";
		 			$rootScope.dymodalmsg  = "Job Info updated, please refresh the page!";
		 			$rootScope.dymodalstyle = "btn-info";
		 			$rootScope.dymodalicon = "fa fa-check";				
		 			$("#dymodal").modal("show");
				}
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});			
		 }
		 
		 $scope.SignUpForm = function(){			 
			var job_desc = $("#job_desc").text();
			job_desc = job_desc.trim();			
			if( job_desc.length > 0 ){
				job_desc = $scope.job_desc;
			}else{
				$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please specify Job Description";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
			}
			
			var job_reqs = $("#job_reqs").text();
			job_reqs = job_reqs.trim();			
			if( job_reqs.length > 0 ){
				job_reqs = $scope.job_reqs;
			}else{
				$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please specify Job Qualifications";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
			}
			
			
			if( $scope.job_stat == '' ){
		 		$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please select a Status";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
		 	}
			var urlData = {
				'acct'		: $scope.dashboard.values.accountid,
				'type'		: $scope.dashboard.values.accouttype,
				'name'		: $scope.job_name,
				'department': $scope.job_dept,
				'desc'		: job_desc,
				'req'		: job_reqs,
				'job_max'	: $scope.job_max,
		 		'stat'		: $scope.job_stat
		 	}				
			$http.post(apiUrl+"portal/jobs/create.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notlogedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please specify Job Title";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="nodept" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please specify Department";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
				}else if( data.status=="nodesc" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please specify Job Description";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noreq" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please specify Job Qualifications";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="error" ){
		 			$rootScope.modalDanger();
		 		}else if( data.status == "exists" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Job Title already exists";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.resetCreateJob();
		 			$("#addModal").modal("hide");
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);					
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Success!";
		 			$rootScope.dymodalmsg  = "New Job Title created, please refresh the page!";
		 			$rootScope.dymodalstyle = "btn-info";
		 			$rootScope.dymodalicon = "fa fa-check";				
		 			$("#dymodal").modal("show");
				}
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});
		 }
		 
		 //start code of sub data table
		 $('#viewList').on('shown.bs.modal', function() {
			var dataTable= $('#modalTbl').DataTable();
			dataTable.columns.adjust().responsive.recalc();
		});
		 
		 $scope.set_list = function(str){			
			if( str != '0' ){
				$scope.acct_search_job_id = str;
			}
			$scope.vm2.dtInstance2.reloadData();			
		 }
		 
		 $scope.list_view = function(){			 
			var vm2 = this;
			$scope.vm2 = vm2;	
			vm2.dtOptions = DTOptionsBuilder.newOptions()
				.withOption('ajax', {
				 url: apiUrl+'portal/applications/data.php',
				 type: 'POST',
				 data: function(d){
					d.accountid 	= $scope.dashboard.values.accountid;
					d.acct_type		= $scope.dashboard.values.accouttype;
					d.active		= "0";
					d.id_job		= $scope.acct_search_job_id;
					d.job			= $scope.acct_search_job;
					d.staff			= $scope.acct_search_fname;
					d.email			= $scope.acct_search_email;
					d.applied1		= $scope.ddfrom;	
					d.applied2		= $scope.ddto;
					d.job_stat		= "-1";
					
					d.job_desc		= $scope.acct_search_job_desc;
					d.gender		= $scope.acct_search_sex;
					d.priority		= "Y";
					d.salary1		= $scope.acct_search_sal1;
					d.salary2		= $scope.acct_search_sal2;
					d.age1			= $scope.acct_search_age1;
					d.age2			= $scope.acct_search_age2;
					d.exp1			= $scope.acct_search_exp1;
					d.exp2			= $scope.acct_search_exp2;
					
				 }
			 })		
			 .withDataProp('data')
			 .withDOM('lrtip')
			 .withOption('processing', true)
			 .withOption('serverSide', true)
			 .withPaginationType('full_numbers')
			 .withOption('responsive',true)
			 .withOption('autoWidth',false)
			 //.withOption('lengthMenu',[2,4,6,8])
			 .withOption('order', [0, 'asc']);
			 vm2.dtColumns = [		
				 DTColumnBuilder.newColumn('name').withTitle('Applicant').notSortable(),				
				 DTColumnBuilder.newColumn('number').withTitle('Contact No.').withClass('btnTD').notSortable(),		
				 DTColumnBuilder.newColumn('salary').withTitle('Salary').withClass('btnTD'),
				 DTColumnBuilder.newColumn('job_stat').withTitle('Status').notSortable().withClass('btnTD'),
				 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
				 .renderWith(function(data, type, full, meta){
					var btn1 = '<button class="btn btn-flat btn-xs btn-primary" title="Résumé" data-target="#cvModal" data-toggle="modal" onclick="angular.element(this).scope().cv_view(\'' + data.id_person + '\', \'' + data.id_job + '\')" >Résumé</button>';
						btn1 = btn1 + '&nbsp;<button class="btn btn-flat btn-xs btn-warning" title="Remove" onclick="angular.element(this).scope().set_priority(\'' + data.id_person + '\', \'' + data.id_job + '\')" >Remove</button>';
					return btn1;
				 })
			 ];
			 vm2.dtInstance2 = {};
			 
			 $scope.set_priority = function( id, id_job ){
			 	var r = confirm("Are you sure you want to remove applicant from short list?");
			 	if (r == true) {
			 		var urlData = {
			 			'acct'		: $scope.dashboard.values.accountid,
			 			'id'		: id,
			 			'id_job'	: id_job,
			 			'type'		: '2'
			 		}
			 		$http.post(apiUrl+"portal/applications/priority.php",urlData)
			 		.then( function (response, status){	
			 			var data = response.data;
			 			if( data.status == "notloggedin" ){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "You are not logged in";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if( data.status == "notaccount" ){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "No Applicant selected";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if( data.status == "list_full" ){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "Short List for this job already full";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if( data.status == "error" ){
			 				$rootScope.modalDanger();
			 			}else{
							clearInterval($scope.myVar);
			 				$timeout(function () {	
			 					$scope.vm2.dtInstance2.reloadData();
			 				}, 100);					
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Success!";
			 				$rootScope.dymodalmsg  = "Applicant removed from short list";
			 				$rootScope.dymodalstyle = "btn-info";
			 				$rootScope.dymodalicon = "fa fa-check";				
			 				$("#dymodal").modal("show");
			 			}
			 		}, function(response) {
			 			$rootScope.modalDanger();
			 		});
			 	}
			 }
			 
			 $scope.cv_view = function( id, id_job ){			 
			 	$scope.applicants_info = [];
			 	var urlData = {
			 		'acct'		: $scope.dashboard.values.accountid,
			 		'id'		: id,
					'id_job'	: id_job
			 	}
			 	$http.post(apiUrl+"portal/applicants/view.php",urlData)
			 	.then( function (response, status){	
			 		var data = response.data;
			 		if( data.status == "notloggedin" ){
			 			$rootScope.dymodalstat = true;
			 			$rootScope.dymodaltitle= "Warning!";
			 			$rootScope.dymodalmsg  = "You are not logged in";
			 			$rootScope.dymodalstyle = "btn-warning";
			 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 			$("#dymodal").modal("show");
			 		}else if( data.status == "notaccount" ){
			 			$rootScope.dymodalstat = true;
			 			$rootScope.dymodaltitle= "Warning!";
			 			$rootScope.dymodalmsg  = "No Applicant selected";
			 			$rootScope.dymodalstyle = "btn-warning";
			 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 			$("#dymodal").modal("show");
			 		}else if( data.status == "notfound" ){
			 			$rootScope.dymodalstat = true;
			 			$rootScope.dymodaltitle= "Warning!";
			 			$rootScope.dymodalmsg  = "Record not found in database";
			 			$rootScope.dymodalstyle = "btn-warning";
			 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 			$("#dymodal").modal("show");
			 		}else{
			 			$scope.applicants_info = data;
			 			$scope.applicants_info.id_job = id_job;
			 		}
			 	}, function(response) {
			 		$rootScope.modalDanger();
			 	});			 
			 }

			 $scope.updateStatusForm = function(){

				var r = confirm("Are you sure you want to update status?");
				if (r == true) {
	
					if( $scope.applicants_info.job_status == "" ){
						$scope.applicants_info.hris_id = null;
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please choose application status";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}
	
					$scope.isSaving=true;
					var urlData = {
						'acct'		: $scope.dashboard.values.accountid,
						'id_job'	: $scope.applicants_info.id_job,
						'id_person'	: $scope.applicants_info.id,
						'info'		: $scope.applicants_info,
						'type'		: 2
					}
					$http.post(apiUrl+"portal/applications/editstatus.php",urlData)
					.then( function (response, status){
						$scope.isSaving=false;
						var data = response.data;
						if( data.status == "notloggedin" ){
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "You are not logged in";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
						}else if(data.status=="nojobid"){
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "No Job selected";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
						}else if(data.status=="notassigned"){
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "Please choose Job to reassign application to.";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
						}else if(data.status=="noname"){
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "No Applicant selected";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
						}else if( data.status=="success"){
							$(".modal").modal("hide");
							clearInterval($scope.myVar);
			 				$timeout(function () {	
			 					$("#btn-refreshh").click();
			 				}, 100);					
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Success!";
			 				$rootScope.dymodalmsg  = "Application Status Update is a success, please refresh the page!";
			 				$rootScope.dymodalstyle = "btn-info";
			 				$rootScope.dymodalicon = "fa fa-check";				
			 				$("#dymodal").modal("show");
						}
	
					}, function(response) {
						$rootScope.modalDanger();
					});	
				}
			 }

			 $scope.hireForm = function(){			 
			 	var r = confirm("Are you sure you want to hire this person?");
			 	if (r == true) {

					if( $scope.applicants_info.job_status == "" ){
						$scope.applicants_info.hris_id = null;
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please choose application status";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}

					var person = prompt("Enter EMPLOYEE ID to enroll in HRIS, otherwise leave it blank");				
					if( person === null ){
						$scope.applicants_info.hris_id = null;
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You have cancelled the process";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}				
					if ( person == "") {
						$scope.applicants_info.hris_id = null;
					} else {
						$scope.applicants_info.hris_id = person;
					}
			 		
			 		var regex_int  =/^[0-9]+$/;
			 		var x = ''+$scope.applicants_info.hris_id;
			 		if( x.trim()!= 'null' && x.trim()!='' && !x.match(regex_int) ){
			 			$scope.applicants_info.hris_id = null;
			 			$rootScope.dymodalstat = true;
			 			$rootScope.dymodaltitle= "Warning!";
			 			$rootScope.dymodalmsg  = "Invalid Employee ID entered. Please try again";
			 			$rootScope.dymodalstyle = "btn-warning";
			 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 			$("#dymodal").modal("show");
			 			return;
			 		}
			 		
			 		if( $scope.applicants_info.hris_id !== null && isNaN(parseFloat($scope.applicants_info.hris_id))  ){
			 			$scope.applicants_info.hris_id = null;
			 			$rootScope.dymodalstat = true;
			 			$rootScope.dymodaltitle= "Warning!";
			 			$rootScope.dymodalmsg  = "Invalid Employee ID entered. Please try again";
			 			$rootScope.dymodalstyle = "btn-warning";
			 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 			$("#dymodal").modal("show");
			 			return;
			 		}
			 		
			 		var urlData = {
			 			'acct'		: $scope.dashboard.values.accountid,
			 			'id_job'	: $scope.applicants_info.id_job,
			 			'id_person'	: $scope.applicants_info.id,
						'info'		: $scope.applicants_info,
						'type'		: 2 
			 		}					
			 		
			 		$http.post(apiUrl+"portal/applications/edit.php",urlData)
			 		.then( function (response, status){
			 			var data = response.data;
			 			if( data.status == "notloggedin" ){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "You are not logged in";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if(data.status=="exists"){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "This applicant is already hired!";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if(data.status=="nojobid"){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "No Job selected";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if(data.status=="noname"){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "No Applicant selected";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if( data.status=="error"){
			 				$rootScope.modalDanger();
			 			}else if( data.status=="idlength"){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "Employee ID should have a maximum of 4 characters";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if( data.status=="idexists"){
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Warning!";
			 				$rootScope.dymodalmsg  = "Employee ID already exists";
			 				$rootScope.dymodalstyle = "btn-warning";
			 				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
			 				$("#dymodal").modal("show");
			 			}else if( data.status=="success"){
							$(".modal").modal("hide");
							 clearInterval($scope.myVar);
			 				$timeout(function () {	
			 					$("#btn-refreshh").click();
			 				}, 100);					
			 				$rootScope.dymodalstat = true;
			 				$rootScope.dymodaltitle= "Success!";
			 				if( data.enroll==false){
			 					$rootScope.dymodalmsg  = "Update is a success but not yet enrolled in HRIS, please refresh the page!";
			 				}else if( data.enroll==true){
			 					$rootScope.dymodalmsg  = "Update is a success and enrolled in HRIS, please refresh the page!";
			 				}
			 				$rootScope.dymodalstyle = "btn-info";
			 				$rootScope.dymodalicon = "fa fa-check";				
			 				$("#dymodal").modal("show");
			 			}
			 		}, function(response) {
			 			$rootScope.modalDanger();
			 		});				
			 	}
			 }
		 }
		 
		 $scope.recallForm = function( id_job ){
			 var r = confirm("Are you sure you want to recall request?");
			 if (r == true) {
				 $scope.isSaving = true;
				var urlData = {
			 		'acct'			: $scope.dashboard.values.accountid,
			 		'id_job'		: id_job
			 	}
			 	$http.post(apiUrl+"portal/jobs/recall.php",urlData)
			 	.then( function (response, status){
					$scope.isSaving = false;
					var data = response.data;
					if( data.status == "success" ){
						$scope.verifyForm('1','1',1);
					}else{
						$rootScope.modalDanger();
					}					
				}, function(response) {
			 		$rootScope.modalDanger();
			 	});	
			 }
		 }
		 
		 $scope.verifyForm = function( verify_type, verify_rank, f ){
			 if( verify_type == 1 ){
				 var type = "Approve";
			 }else if( verify_type == 2 ){
				 var type = "Decline";
			 }
			 if( f == 0 ){
				var r = confirm("Are you sure you want to "+ type +" request?");
			 }else if( f == 1 ){
				 var r = true;
			 }
			 if (r == true ) {
				$scope.isSaving = true;
				var urlData = {
			 		'acct'			: $scope.dashboard.values.accountid,
			 		'id_job'		: $scope.job_info.id,
					'verify_rank'	: verify_rank,
					'verify_type'	: verify_type
			 	}
			 	$http.post(apiUrl+"portal/jobs/verify.php",urlData)
			 	.then( function (response, status){
					$scope.isSaving = false;
			 		var data = response.data;
					if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="nojobid"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Job selected";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="notapprover1"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Your account is not assigned as Approver 1";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if(data.status=="notapprover2"){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Your account is not assigned as Approver 2";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="error"){
						$rootScope.modalDanger();
					}else if( data.status=="success"){
						clearInterval($scope.myVar);	
						$("#editModal").modal("hide");
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);					
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Update is a success";
						$rootScope.dymodalstyle = "btn-info";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
			 	}, function(response) {
			 		$rootScope.modalDanger();
			 	});	
			 }
		 }
	}
	
	$scope.education_lvl_functions = function(){
		var vm = this;
		$scope.vm = vm;	
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/edu/data.php',
			 type: 'POST',
			 data: function(d){
				d.accountid 	= $scope.dashboard.values.accountid;
			 }
		 })		
		 .withDataProp('data')
		 .withOption('processing', true)
		 .withOption('serverSide', true)
		 .withPaginationType('full_numbers')
		 .withOption('responsive',true)
		 .withOption('autoWidth',false)
		 //.withOption('lengthMenu',[2,4,6,8])
		 .withOption('order', [1, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('id').withTitle('ID').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('description').withTitle('Level'),
			 DTColumnBuilder.newColumn('stat').withTitle('Status').withClass('btnTD'),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				return '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().lvl_view(\'' + data.id + '\')" >Edit</button>';
			})
		 ];
		 vm.dtInstance = {};
		 
		 $scope.UpdateForm = function(){
			 
			 var idstat = null;
			 if( $scope.lvl_info.stat == 'ACTIVE' ){
				 idstat = 1;
			 }else{
				 idstat = 0;
			 }
			 
			 var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
				'id'		: $scope.lvl_info.id,
		 		'lvl'		: $scope.lvl_info.description,
				'stat'		: $scope.lvl_info.stat,
				'idstat'	: idstat
		 	}
		 	$http.post(apiUrl+"portal/edu/edit.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "nolvlid" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Education Level selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "noname" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please enter Education Level";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "exists" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Education Level already exists";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					$("#editModal").modal("hide");
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);					
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Success!";
		 			$rootScope.dymodalmsg  = "Education Level updated, please refresh the page!";
		 			$rootScope.dymodalstyle = "btn-info";
		 			$rootScope.dymodalicon = "fa fa-check";				
		 			$("#dymodal").modal("show");
				}
				
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});
		 }
		 
		 $scope.lvl_view = function( id ){
			$scope.lvl_info = [];
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'lvlid'		: id
		 	}
		 	$http.post(apiUrl+"portal/edu/view.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status == "notloggedin" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "nolvlid" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Education Level selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else if( data.status == "notfound" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Record not found in database";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.lvl_info = data;
				}
				
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});
		 }
		 
		 $scope.SignUpForm = function(){
			if( $scope.lvl_stat == '' ){
		 		$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please select a Status";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
		 	}
		 	
		 	var urlData = {
				'acct'		: $scope.dashboard.values.accountid,
		 		'name'		: $scope.lvl_name,
		 		'stat'		: $scope.lvl_stat
		 	}
			$http.post(apiUrl+"portal/edu/create.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notlogedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please specify Education Level";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="error" ){
		 			$rootScope.modalDanger();
		 		}else if( data.status == "exists" ){
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Education Level already exists";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}else{
					$scope.resetCreateLvl();
		 			$("#addModal").modal("hide");
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);					
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Success!";
		 			$rootScope.dymodalmsg  = "New Education Level created, please refresh the page!";
		 			$rootScope.dymodalstyle = "btn-info";
		 			$rootScope.dymodalicon = "fa fa-check";				
		 			$("#dymodal").modal("show");
				}
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});
		 }
		 
		 $scope.resetCreateLvl = function(){
			 $scope.lvl_name = null;
			 $scope.lvl_stat = null;
		 }
	}
	
	$scope.accounts_page_functions = function(){
		 var vm = this;
		 $scope.vm = vm;	
		 vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/accts/data.php',
			 type: 'POST',
			 data: function(d){
				d.log_type		= $scope.dashboard.values.accouttype;
				d.acct_type		= $scope.dashboard.values.accouttype; 
				d.accountid 	= $scope.acct_search_id;
				d.accountfname 	= $scope.acct_search_fname;
				d.accountlname 	= $scope.acct_search_lname;
				d.accountemail	= $scope.acct_search_email;
				d.accounttype	= $scope.acct_search_type;
				d.accountstat	= $scope.acct_search_stat;
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
		 .withOption('order', [1, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('id').withTitle('ACCT ID').notSortable().withClass('btnTD'),
			 DTColumnBuilder.newColumn('firstName').withTitle('First name'),
			 DTColumnBuilder.newColumn('lastName').withTitle('Last name'),
			 DTColumnBuilder.newColumn('email').withTitle('Email'),
			 DTColumnBuilder.newColumn('type').withTitle('Type').withClass('btnTD'),
			 DTColumnBuilder.newColumn('stat').withTitle('Status').withClass('btnTD'),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				return '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().accts_view(\'' + data.id + '\')" >Edit</button>';
			})
		 ];
		 vm.dtInstance = {};
		 
		 $scope.acctSearch = function(){			 
			 vm.dtInstance.reloadData();
		 }
		 
		 $scope.resetAcct = function(){
			 $scope.acct_search_id 		= null;
			 $scope.acct_search_fname	= null;
			 $scope.acct_search_lname	= null;
			 $scope.acct_search_email	= null;
			 $scope.acct_search_type	= null;
			 $scope.acct_search_stat	= null;
			 vm.dtInstance.rerender();
		 }		
		 $scope.resetCreateAcct = function(){			 
			$scope.acct_fname 		= null;
			$scope.acct_lname 		= null;
			$scope.acct_email 		= null;
			$scope.acct_type		= null;
			$scope.acct_newUser = {
				userPassword:''
			};		 
		 }
		 
		 $scope.accts_types = function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid,
				'account_type': $scope.dashboard.values.accouttype
			}
			$http.post(apiUrl+'types.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.acct_types = data;					
			}, function(response) {
				$rootScope.modalDanger();
			});
		 }		
		
		 $scope.SignUpForm = function(){
			var regex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&._])[A-Za-z\d$@$!%*#?&._]{6,}$/;		
		 	var x = ''+$scope.acct_newUser.userPassword;				
		 	if(!x.match(regex)){
		 		$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Invalid Password Format";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
		 	}
		 	
		 	if( $scope.acct_type == '' ){
		 		$rootScope.dymodalstat = true;
		 		$rootScope.dymodaltitle= "Warning!";
		 		$rootScope.dymodalmsg  = "Please select an Account Type";
		 		$rootScope.dymodalstyle = "btn-warning";
		 		$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 		$("#dymodal").modal("show");
		 		return;
		 	}
		 	
		 	var urlData = {
		 		'fname'		: $scope.acct_fname,
		 		'lname'		: $scope.acct_lname,
		 		'email'		: $scope.acct_email,
		 		'pass'		: $scope.acct_newUser.userPassword,
		 		'idtype'	: $scope.acct_type,
		 		'verified'	: 1
		 	}
		 	$http.post(apiUrl+"login/create.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
		 		//console.log(data);
		 		if( data.status=="nofname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please enter your First Name";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="nolname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please enter your Last Name";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noemail" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please enter your Email Address";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="invalidemail" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You provided an invalid Email Address";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="nopass" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please enter your Password";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="emailexist" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Email Address already exists";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="success" ){
		 			$scope.resetCreateAcct();
		 			$("#addModal").modal("hide");	
					
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);
					
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Success!";
		 			$rootScope.dymodalmsg  = "Account created successfuly, please refresh the page!";
		 			$rootScope.dymodalstyle = "btn-info";
		 			$rootScope.dymodalicon = "fa fa-check";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="error" ){
		 			$rootScope.modalDanger();
		 		}
		 	}, function(response) {
		 		$rootScope.modalDanger();
		 	});	
		 }
		 
		 $scope.accts_view = function( acctid ){
			 $scope.accts_info = [];
			 $scope.acct_newUser = {
				userPassword:''
			};
			
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'empid'		: acctid
		 	}
		 	$http.post(apiUrl+"portal/accts/view.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notloggedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="notaccount" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No account was selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="notfound" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Account not found";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else{
					$scope.accts_info = data;
					$scope.accts_info.idtype = $scope.acct_types[ data.idtype - 1];
					//console.log( $scope.accts_info );
					$scope.picFile = null;
				}				
			 }, function(response) {
		 		$rootScope.modalDanger();
		 	});				 
		 }
		 
		 $scope.UpdateForm = function(){
			
			var regex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&._])[A-Za-z\d$@$!%*#?&._]{6,}$/;		
		 	var x = ''+$scope.acct_newUser.userPassword;
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
			 
			 
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'id'		: $scope.accts_info.id,
				'fname'		: $scope.accts_info.fname,
				'lname'		: $scope.accts_info.lname,
				'email'		: $scope.accts_info.email,
				'idtype'	: $scope.accts_info.idtype.id,
				'stat'		: $scope.accts_info.stat,
				'pass'		: x
		 	}
			$http.post(apiUrl+"portal/accts/edit.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notloggedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noaccount" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "No Account selected";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="nofname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please provide First Name detail";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="nolname" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please provide Last Name detail";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="noemail" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Please provide Email Address detail";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="invalidemail" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Invalid Email Address format";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="emailexist" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "Email Address already exists";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="error" ){
		 			$rootScope.modalDanger();
		 		}else if( data.status=="success" ){
					$("#editModal").modal("hide");
					$timeout(function () {	
						$("#btn-refreshh").click();
					}, 100);
					$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Success!";
		 			$rootScope.dymodalmsg  = "Account successfuly updated, kindly refresh the page";
		 			$rootScope.dymodalstyle = "btn-info";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
				}
				
			}, function(response) {
		 		$rootScope.modalDanger();
		 	});	
		 }
		 
		 $scope.changeType = function(a){
			 $scope.accts_info.idtype = $scope.acct_types[ a - 1];
		 }

		 $scope.signature = function( file ){
			if(file==null){
				alert('Please choose an image first');
			}else{
				var r = confirm("Are you sure you want to upload this signature?");
				if (r == true) {						
					file.upload = Upload.upload({
						url: apiUrl+'portal/accts/signature.php',
						method: 'POST',
						file: file,
						data: {
							'linkid'	 : $scope.accts_info.id,
							'targetPath' : '../../../images/signatures/'
						}
					}).then(function (response) {
						if( response.data.status == "success" ){
							$("#uploadSignature").modal("hide");
							$scope.accts_view(  $scope.accts_info.id );
						}else if( response.data.status == "nopofile" ){
							alert('File uploaded maybe corrupted. Please try another image');							
						}else if( response.data.status == "notimage" ){
							alert('Only image of PNG file type are allowed.');							
						}
					}, function (response) {
						if (response.status > 0){
							alert('Something Went Wrong! Please Reload The Page.');	
						}
					});
				}
			}
		 }
		 
	}
	
	$scope.approvers_page_functions = function(){
		var vm = this;
		 $scope.vm = vm;	
		 vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
			 url: apiUrl+'portal/approver/data.php',
			 type: 'POST',
			 data: function(d){
				d.log_type		= $scope.dashboard.values.accouttype;
				d.acct_type		= $scope.dashboard.values.accouttype; 
				d.accountid 	= $scope.acct_search_id;
				d.accountfname 	= $scope.acct_search_fname;
				d.accountlname 	= $scope.acct_search_lname;
				d.accountemail	= $scope.acct_search_email;
				d.accounttype	= $scope.acct_search_type;
				d.accountstat	= $scope.acct_search_stat;
			 }
		 })		
		 .withDataProp('data')
		 .withOption('processing', true)
		 .withOption('serverSide', true)
		 .withPaginationType('full_numbers')
		 .withOption('responsive',true)
		 .withOption('autoWidth',false)
		 .withDOM('rft')
		 //.withOption('lengthMenu',[2,4,6,8])
		 .withOption('order', [1, 'asc']);
		 vm.dtColumns = [
			 DTColumnBuilder.newColumn('process').withTitle('Process').withClass('btnTD').notSortable(),
			 DTColumnBuilder.newColumn('approver1').withTitle('Approver 1').withClass('btnTD'),
			 DTColumnBuilder.newColumn('approver2').withTitle('Approver 2').withClass('btnTD'),
			 DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
				return '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().approvers_view(\'' + data.id + '\')" >Edit</button>';
			})
		 ];
		 vm.dtInstance = {};	
		 
		 $scope.approvers_view = function( id ){
			$scope.approvers_info = [];	
			
			$scope.approver1_acct  = [];
			$scope.approver1_id  = [];
			
			$scope.approver2_acct  = [];
			$scope.approver2_id  = [];
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid,
		 		'process'	: id
		 	}
		 	$http.post(apiUrl+"portal/approver/view.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notloggedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="error" ){
		 			$rootScope.modalDanger();
		 		}else{
					$scope.approvers_info = data;
					$scope.approvers_info.approver1.forEach(function(item,key){						
						$scope.approver1_id.push( $scope.approvers_info.approver1[key]['id'] );
						$scope.approver1_acct.push( $scope.approvers_info.approver1[key]['id_acct'] );						
					});
					$scope.approvers_info.approver2.forEach(function(item,key){						
						$scope.approver2_id.push( $scope.approvers_info.approver2[key]['id'] );
						$scope.approver2_acct.push( $scope.approvers_info.approver2[key]['id_acct'] );						
					});
				}				
			 }, function(response) {
		 		$rootScope.modalDanger();
		 	});	
		 }
		 
		 $scope.accounts = function(){
			$scope.accounts_info = [];			
			var urlData = {
		 		'acct'		: $scope.dashboard.values.accountid
		 	}
		 	$http.post(apiUrl+"portal/approver/accounts.php",urlData)
		 	.then( function (response, status){		
		 		var data = response.data;
				if( data.status=="notloggedin" ){
		 			$rootScope.dymodalstat = true;
		 			$rootScope.dymodaltitle= "Warning!";
		 			$rootScope.dymodalmsg  = "You are not logged in";
		 			$rootScope.dymodalstyle = "btn-warning";
		 			$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
		 			$("#dymodal").modal("show");
		 		}else if( data.status=="error" ){
		 			$rootScope.modalDanger();
		 		}else{
					$scope.accounts_info = data;
				}				
			 }, function(response) {
		 		$rootScope.modalDanger();
		 	});	
		 }
		 
		 $scope.approvers_save = function( rank, id, value ){			 
			 var r = confirm("Are you sure you want to update approver?");
			 if (r == true) {
				var urlData = {
					'acct'		: $scope.dashboard.values.accountid,
					'id'		: id,
					'rank'		: rank,
					'id_acct'	: value
				}
				$http.post(apiUrl+"portal/approver/save.php",urlData)
				.then( function (response, status){		
					var data = response.data;
					if( data.status=="notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="noid" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "No Approver id present";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="norank" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Could not determine Approver rank";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
					}else if( data.status=="error" ){
						$rootScope.modalDanger();
					}else{
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 100);
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						$rootScope.dymodalmsg  = "Approvers updated!";
						$rootScope.dymodalstyle = "btn-success";
						$rootScope.dymodalicon = "fa fa-check-circle-o";				
						$("#dymodal").modal("show");
					}				
				 }, function(response) {
					$rootScope.modalDanger();
				});
			 }
		 }		 
		 $scope.accounts();
	}	
	
	$scope.acctz = function (employeeType) { 
	   if( parseInt($scope.dashboard.values.accouttype)==1 ){
		   return employeeType.id == '1' || 	   
		   employeeType.id == '2' ||
		   employeeType.id == '3' || 	   
		   employeeType.id == '4' || 	   
		   employeeType.id == '5' || 	   
		   employeeType.id == '6';
	   }else if( parseInt($scope.dashboard.values.accouttype)==2 ){
		   return employeeType.id == '2' ;
	   }else if( parseInt($scope.dashboard.values.accouttype)==4 ){
		   return employeeType.id == '4' || 	   
		   employeeType.id == '2'
	   }
	   
	};
	
	
}]);