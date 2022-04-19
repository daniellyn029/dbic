app.controller('MatrixController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/org/sidebar/index.html";
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
			typeList:null,
			statusList:null,
			unitdept: []
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
					$rootScope.global_branch = $cookieStore.get('global_branch');
					var  a = $filter('filter')( data.dblist , { id : ''+$cookieStore.get('global_branch') })[0];	
					$scope.dashboard.values.userInformation.dbcompany = a.company;
				}				
			}, function(response) {
				$rootScope.modalDanger();
			});	
		},
		setup: function(){
			var urlData = {
				'accountid': $scope.dashboard.values.accountid,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/tk/setup/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.unitdept = data.departments;	
			}, function(response) {
				$rootScope.modalDanger();
			});
		}		
	} 
	
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}

	$scope.matrix_functions = function(){
		var urlData = {
			'accountid': $scope.dashboard.values.accountid,
			'conn'	   : $cookieStore.get('global_branch')
		}
		$http.post(apiUrl+'admin/org/matrix/data.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			//$scope.dashboard.values.unitdept = data.departments;	
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	$scope.matrix_table = function(){
		$scope.search			= [];
		$scope.search.empid 	= ''; 
		$scope.search.empname  	= '';
		$scope.search.type 		= ''; 
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/org/matrix/approversetup.php',
				type: 'POST',
				data: function(d){
					d.accountid = $scope.dashboard.values.accountid,
					d.conn	= $cookieStore.get('global_branch')
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
			DTColumnBuilder.newColumn('bunit').withTitle('Classification').notSortable().withClass('btnTD'),
            DTColumnBuilder.newColumn('unit_type').withTitle('Type').notSortable().withClass('btnTD'),
			DTColumnBuilder.newColumn(null).withTitle('Approver 1').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_1a==1){
					var a = '<div> Direct Superior </div>';
				}else if(data.approver_type_1a==2||data.approver_type_1a==3){
					var a = '<div>'+' '+'(1A)'+' '+data.approvername_1a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_1b==1){
					var b = '<div>'+' (1B) Head Of '+ data.unit_1b +'</div>';
				}else if(data.approver_type_1b==2||data.approver_type_1b==3){
					var b = '<div>'+' '+'(1B)'+' '+data.approvername_1b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_1c==1){
					var c = '<div>'+' (1C) Head Of '+ data.unit_1c +'</div>';
				}else if(data.approver_type_1c==2||data.approver_type_1c==3){
					var c = '<div>'+' '+'(1C)'+' '+data.approvername_1c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 2').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_2a==1){
					var a = '<div>'+' (2A) Head Of '+ data.unit_2a +'</div>';
				}else if(data.approver_type_2a==2||data.approver_type_2a==3){
					var a = '<div>'+' '+'(2A)'+' '+data.approvername_2a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_2b==1){
					var b = '<div>'+' (2B) Head Of '+ data.unit_2b +'</div>';
				}else if(data.approver_type_2b==2||data.approver_type_2b==3){
					var b = '<div>'+' '+'(2B)'+' '+data.approvername_2b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_2c==1){
					var c = '<div>'+' (2C) Head Of '+ data.unit_2c +'</div>';
				}else if(data.approver_type_2c==2||data.approver_type_2c==3){
					var c = '<div>'+' '+'(2C)'+' '+data.approvername_2c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 3').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_3a==1){
					var a = '<div>'+' (3A) Head Of '+ data.unit_3a +'</div>';
				}else if(data.approver_type_3a==2||data.approver_type_3a==3){
					var a = '<div>'+' '+'(3A)'+' '+data.approvername_3a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_3b==1){
					var b = '<div>'+' (3B) Head Of '+ data.unit_3b +'</div>';
				}else if(data.approver_type_3b==2||data.approver_type_3b==3){
					var b = '<div>'+' '+'(3B)'+' '+data.approvername_3b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_3c==1){
					var c = '<div>'+' (3C) Head Of '+ data.unit_3c +'</div>';
				}else if(data.approver_type_3c==2||data.approver_type_3c==3){
					var c = '<div>'+' '+'(3C)'+' '+data.approvername_3c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 4').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_4a==1){
					var a = '<div>'+' (4A) Head Of '+ data.unit_4a +'</div>';
				}else if(data.approver_type_4a==2||data.approver_type_4a==3){
					var a = '<div>'+' '+'(4A)'+' '+data.approvername_4a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_4b==1){
					var b = '<div>'+' (4B) Head Of '+ data.unit_4b +'</div>';
				}else if(data.approver_type_4b==2||data.approver_type_4b==3){
					var b = '<div>'+' '+'(4B)'+' '+data.approvername_4b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_4c==1){
					var c = '<div>'+' (4C) Head Of '+ data.unit_4c +'</div>';
				}else if(data.approver_type_4c==2||data.approver_type_4c==3){
					var c = '<div>'+' '+'(4C)'+' '+data.approvername_4c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 5').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_5a==1){
					var a = '<div>'+' (5A) Head Of '+ data.unit_5a +'</div>';
				}else if(data.approver_type_5a==2||data.approver_type_5a==3){
					var a = '<div>'+' '+'(5A)'+' '+data.approvername_5a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_5b==1){
					var b = '<div>'+' (5B) Head Of '+ data.unit_5b +'</div>';
				}else if(data.approver_type_5b==2||data.approver_type_5b==3){
					var b = '<div>'+' '+'(5B)'+' '+data.approvername_5b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_5c==1){
					var c = '<div>'+' (5C) Head Of '+ data.unit_5c +'</div>';
				}else if(data.approver_type_5c==2||data.approver_type_5c==3){
					var c = '<div>'+' '+'(5C)'+' '+data.approvername_5c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 6').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_6a==1){
					var a = '<div>'+' (6A) Head Of '+ data.unit_6a +'</div>';
				}else if(data.approver_type_6a==2||data.approver_type_6a==3){
					var a = '<div>'+' '+'(6A)'+' '+data.approvername_6a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_6b==1){
					var b = '<div>'+' (6B) Head Of '+ data.unit_6b +'</div>';
				}else if(data.approver_type_6b==2||data.approver_type_6b==3){
					var b = '<div>'+' '+'(6B)'+' '+data.approvername_6b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_6c==1){
					var c = '<div>'+' (6C) Head Of '+ data.unit_6c +'</div>';
				}else if(data.approver_type_6c==2||data.approver_type_6c==3){
					var c = '<div>'+' '+'(6C)'+' '+data.approvername_6c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 7').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_7a==1){
					var a = '<div>'+' (7A) Head Of '+ data.unit_7a +'</div>';
				}else if(data.approver_type_7a==2||data.approver_type_7a==3){
					var a = '<div>'+' '+'(7A)'+' '+data.approvername_7a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_7b==1){
					var b = '<div>'+' (7B) Head Of '+ data.unit_7b +'</div>';
				}else if(data.approver_type_7b==2||data.approver_type_7b==3){
					var b = '<div>'+' '+'(7B)'+' '+data.approvername_7b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_7c==1){
					var c = '<div>'+' (7C) Head Of '+ data.unit_7c +'</div>';
				}else if(data.approver_type_7c==2||data.approver_type_7c==3){
					var c = '<div>'+' '+'(7C)'+' '+data.approvername_7c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Approver 8').notSortable().withClass('btnTD')
            .renderWith(function(data, type, full, meta){
				if(data.approver_type_8a==1){
					var a = '<div>'+' (8A) Head Of '+ data.unit_8a +'</div>';
				}else if(data.approver_type_8a==2||data.approver_type_8a==3){
					var a = '<div>'+' '+'(8A)'+' '+data.approvername_8a+'</div>';
				}else{
					var a = '';
				}

				if(data.approver_type_8b==1){
					var b = '<div>'+' (8B) Head Of '+ data.unit_8b +'</div>';
				}else if(data.approver_type_8b==2||data.approver_type_8b==3){
					var b = '<div>'+' '+'(8B)'+' '+data.approvername_8b+'</div>';
				}else{
					var b = '';
				}
				
				if(data.approver_type_8c==1){
					var c = '<div>'+' (8C) Head Of '+ data.unit_8c +'</div>';
				}else if(data.approver_type_8c==2||data.approver_type_8c==3){
					var c = '<div>'+' '+'(8C)'+' '+data.approvername_8c+'</div>';
				}else{
					var c = '';
				}
				return a+b+c;
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
                    return '<button class="btn btn-flat btn-sm btn-primary" style="background: #e47365; border: 1px solid #e47365;" data-target="#sequence" data-toggle="modal" onclick="angular.element(this).scope().getApproverList(\'' +data.id+ '\')"><i class="fa fa-pencil-square-o fa-xs"></i> Sequence</button>';
            }),
		];
		vm.dtInstanceApproverSetup = {};
		$(document).ready(function () {
            $("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background: #e47365; border: 1px solid #e47365;width:100px" class="btn btn-flat btn-primary pull-right" ng-click="dtInstanceApproverSetup.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button>')
			   
			$("#btn-refreshh").on('click', function () {
				vm.dtInstanceApproverSetup.reloadData();
			});
		});
		
		$scope.allApproverTypeFunction = function(){
			var urlData = {
				'accountid': $cookieStore.get('acct_id'),
				'conn'	   : $cookieStore.get('global_branch')
			}
	
			$http.post("/dbic/assets/php/admin/hr/personnelaction/lateraltransfer/allApproverType.php", urlData)
			.then(function(result){
				if(result.data.status == "empty"){
					$scope.allApproverType = [];
				}else{
					$scope.allApproverType = result.data;
				}
			},function(error){}).finally(function(){});
		}
		
		$scope.getApproverList = function(id){
			$scope.isSaving = true;
			$scope.allApproverTypeFunction();
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'sequence': $scope.sequence,
                'id': id,
				'conn'	   : $cookieStore.get('global_branch')
            }
            $http.post(apiUrl+'admin/org/matrix/getApprovers.php',urlData)
            .then( function (response, status){
                $scope.isSaving = false;		
                var data = response.data;
                $scope.sequence = data;
				$timeout(function () {	
					$("#approver_1b").val($scope.sequence.approver_1b).trigger("change");
					$("#approver_unit_1b").val($scope.sequence.approver_unit_1b).trigger("change");
					$("#approver_1c").val($scope.sequence.approver_1c).trigger("change");
					$("#approver_unit_1c").val($scope.sequence.approver_unit_1c).trigger("change");
					$("#approver_2a").val($scope.sequence.approver_2a).trigger("change");
					$("#approver_unit_2a").val($scope.sequence.approver_unit_2a).trigger("change");
					$("#approver_2b").val($scope.sequence.approver_2b).trigger("change");
					$("#approver_unit_2b").val($scope.sequence.approver_unit_2b).trigger("change");
					$("#approver_2c").val($scope.sequence.approver_2c).trigger("change");
					$("#approver_unit_2c").val($scope.sequence.approver_unit_2c).trigger("change");
				}, 100);
            }, function(response) {
                $rootScope.modalDanger();
            });
        }
		
		$scope.saveApproverSetup = function(){
			/**Approver 1A and 1B and 1C Trapping */
			if($scope.sequence.approver_type_1a==null||$scope.sequence.approver_type_1a==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 1A.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.sequence.approver_type_1a==1 && ( $scope.sequence.approver_type_1b==1 || $scope.sequence.approver_type_1c==1 ) ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 1.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if($scope.sequence.approver_type_1a!=1 && $scope.sequence.approver_1a==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 1A.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( ( $scope.sequence.approver_type_1b==2 || $scope.sequence.approver_type_1b==3 ) && $scope.sequence.approver_1b==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 1B.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( ( $scope.sequence.approver_type_1c==2 || $scope.sequence.approver_type_1c==3 ) && $scope.sequence.approver_1c==""){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 1C.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.sequence.approver_type_1a == 1 && $scope.sequence.approver_unit_1a == "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 1A.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.sequence.approver_type_1b == 1 && $scope.sequence.approver_unit_1b == "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 1B.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.sequence.approver_type_1c == 1 && $scope.sequence.approver_unit_1c == "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 1C.";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			/**Approver 1A and 1B Trapping */

			/**Approver 2A and 2B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 2 ){
				if($scope.sequence.approver_type_2a==null||$scope.sequence.approver_type_2a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 2A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_2a==1 && ( $scope.sequence.approver_type_2b==1 || $scope.sequence.approver_type_2c==1 ) ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 2.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_2a!=1 && $scope.sequence.approver_2a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 2A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_2b==2||$scope.sequence.approver_type_2b==3) && $scope.sequence.approver_2b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 2B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_2c==2||$scope.sequence.approver_type_2c==3) && $scope.sequence.approver_2c==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 2C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_2a == 1 && $scope.sequence.approver_unit_2a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 2A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_2b == 1 && $scope.sequence.approver_unit_2b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 2B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_2c == 1 && $scope.sequence.approver_unit_2c == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 2C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 2A and 2B Trapping */

			/**Approver 3A and 3B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 3 ){
				if($scope.sequence.approver_type_3a==null||$scope.sequence.approver_type_3a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 3A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_3a==1 && ( $scope.sequence.approver_type_3b==1 || $scope.sequence.approver_type_3c==1 ) ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 3.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_3a!=1 && $scope.sequence.approver_3a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 3A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_3b==2||$scope.sequence.approver_type_3b==3) && $scope.sequence.approver_3b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 3B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_3c==2||$scope.sequence.approver_type_3c==3) && $scope.sequence.approver_3c==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 3C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_3a == 1 && $scope.sequence.approver_unit_3a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 3A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_3b == 1 && $scope.sequence.approver_unit_3b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 3B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_3c == 1 && $scope.sequence.approver_unit_3c == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 3C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 3A and 3B Trapping */

			/**Approver 4A and 4B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 4 ){
				if($scope.sequence.approver_type_4a==null||$scope.sequence.approver_type_4a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 4A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_4a==1 && ( $scope.sequence.approver_type_4b==1 || $scope.sequence.approver_type_4c==1 ) ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 4.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_4a!=1 && $scope.sequence.approver_4a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 4A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_4b==2||$scope.sequence.approver_type_4b==3) && $scope.sequence.approver_4b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 4B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_4a == 1 && $scope.sequence.approver_unit_4a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 4A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_4b == 1 && $scope.sequence.approver_unit_4b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 4B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 4A and 4B Trapping */

			/**Approver 5A and 5B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 5 ){
				if($scope.sequence.approver_type_5a==null||$scope.sequence.approver_type_5a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 5A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_5a==1 && ( $scope.sequence.approver_type_5b==1 || $scope.sequence.approver_type_5c==1 ) ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 5.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_5a!=1 && $scope.sequence.approver_5a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 5A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_5b==2||$scope.sequence.approver_type_5b==3) && $scope.sequence.approver_5b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 5B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_5c==2||$scope.sequence.approver_type_5c==3) && $scope.sequence.approver_5c==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 5C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_5a == 1 && $scope.sequence.approver_unit_5a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 5A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_5b == 1 && $scope.sequence.approver_unit_5b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 5B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_5c == 1 && $scope.sequence.approver_unit_5c == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 5C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 5A and 5B Trapping */

			/**Approver 6A and 6B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 6 ){
				if($scope.sequence.approver_type_6a==null||$scope.sequence.approver_type_6a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 6A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_6a==1 && ( $scope.sequence.approver_type_6b==1 || $scope.sequence.approver_type_6c==1 ) ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 6.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_6a!=1 && $scope.sequence.approver_6a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 6A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_6b==2||$scope.sequence.approver_type_6b==3) && $scope.sequence.approver_6b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 6B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_6c==2||$scope.sequence.approver_type_6c==3) && $scope.sequence.approver_6c==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 6C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_6a == 1 && $scope.sequence.approver_unit_6a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 6A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_6b == 1 && $scope.sequence.approver_unit_6b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 6B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_6c == 1 && $scope.sequence.approver_unit_6c == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 6C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 6A and 6B Trapping */

			/**Approver 7A and 7B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 7 ){
				if($scope.sequence.approver_type_7a==null||$scope.sequence.approver_type_7a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 7A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_7a==1 && ( $scope.sequence.approver_type_7b==1 || $scope.sequence.approver_type_7c==1 ) ){
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
				if(($scope.sequence.approver_type_7b==2||$scope.sequence.approver_type_7b==3) && $scope.sequence.approver_7b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 7B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_7c==2||$scope.sequence.approver_type_7c==3) && $scope.sequence.approver_7c==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 7C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_7a == 1 && $scope.sequence.approver_unit_7a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 7A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_7b == 1 && $scope.sequence.approver_unit_7b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 7B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_7c == 1 && $scope.sequence.approver_unit_7c == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 7C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 7A and 7B Trapping */
			
			/**Approver 8A and 8B Trapping */
			if( parseInt( $scope.sequence.ctr_approver ) >= 8 ){
				if($scope.sequence.approver_type_8a==null||$scope.sequence.approver_type_8a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You must assign at least (1) one approver each level, kindly select on Approver 8A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approver_type_8a==1 && ( $scope.sequence.approver_type_8b==1 || $scope.sequence.approver_type_8c==1 ) ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Direct superior was already assigned in Approver 8.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if($scope.sequence.approvertype8a!=1 && $scope.sequence.approver8a==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 8A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_8b==2||$scope.sequence.approver_type_8b==3) && $scope.sequence.approver_8b==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 8B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if(($scope.sequence.approver_type_8c==2||$scope.sequence.approver_type_8c==3) && $scope.sequence.approver_8c==""){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please assign specific or corporate approver on Approver 8C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_8a == 1 && $scope.sequence.approver_unit_8a == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 8A.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_8b == 1 && $scope.sequence.approver_unit_8b == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 8B.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
				if( $scope.sequence.approver_type_8c == 1 && $scope.sequence.approver_unit_8c == "" ){
					$rootScope.dymodalstat = true;
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Need to specify Business Unit in Approver 8C.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
				}
			}
			/**Approver 8A and 8B Trapping */

            $scope.isSaving = true;
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'sequence': $scope.sequence,
				'conn'	   : $cookieStore.get('global_branch')
            }
            console.log(urlData);
            $http.post(apiUrl+'admin/org/matrix/saveApproverSetup.php',urlData)
            .then( function (response, status){		
                var data = response.data;
                $scope.isSaving = false;
                //Validation
                if(data.status=='empty'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "You are not logged in";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }else if( data.status == "invdate" ){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Invalid Date entered";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }else if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else if(data.status=='success'){
                    $("#sequence").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Approvers updated";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    vm.dtInstanceApproverSetup.reloadData();
                }
            }, function(response) {
                $rootScope.modalDanger();
            });
        }
		
	}
	
	$scope.allEmployeeFunc = function(){
		var urlData = {
			'accountid': $scope.dashboard.values.accountid,
			'conn'	   : $cookieStore.get('global_branch')
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
	
	
	$scope.dashboard.setup();
	$scope.matrix_functions();
	$scope.allEmployeeFunc();
}]);