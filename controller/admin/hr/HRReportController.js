app.controller('HRReportController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			emptypes:[]
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
					$scope.dashboard.values.userInformation.datenow = moment().format('MM/D/YYYY hh:mm:00 A');
				}				
			}, function(response) {
				$rootScope.modalDanger();
			});	
		},
	}
	
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}
	
//table function
$scope.tablefunc = function(){
  $scope.dept       ='';
  $scope.post_title ='';
  $scope.emp        ='';
  $scope.pay_grp    ='';
  $scope.pay_stat   ='';
  $scope.emp_type   ='';
  $scope.emp_stat   ='';
  $scope.filter		='';
    var vm = this;
    $scope.vm = vm;
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('ajax', {
        url: apiUrl+'admin/hr/employee/report_view.php',
        type: 'POST',
        data: function(d){
        //Input in search / d. is from php
         d.department           = $scope.dept,
         d.position_title      = $scope.post_title,
         d.employee             = $scope.emp,
         d.pay_group            = $scope.pay_grp,
         d.pay_status           = $scope.pay_stat,
         d.employment_type      = $scope.emp_type,
         d.employment_status    = $scope.emp_stat
        }
    }) 
    //default ni, sa dtoptions nga table gkn sa html   
    .withDataProp('data')
    .withOption('processing', true)
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withOption('responsive',true)
    .withOption('autoWidth',false)
    .withDOM('<"buttons dataTables_filter">lrtip')
    .withOption('lengthMenu',[10,20,30,40])//length sa entries
    .withOption('order', [0, 'asc']);//ang 0 fname mao ang nka highlight nga mo sort
    vm.dtColumns = [

    //default, ang di ra ky ang .newcolumn('') gkn sa php, withTitle('ID') sa column name sa table, nya data table funtion n
      DTColumnBuilder.newColumn('employeeid').withTitle('EmployeeID').withClass('btnTD'),
      DTColumnBuilder.newColumn('lastname').withTitle('LastName').withClass('btnTDs'),
      DTColumnBuilder.newColumn('firstname').withTitle('FirstName').withClass('btnTDs'),
      DTColumnBuilder.newColumn('namesuffix').withTitle('NameSuffix').withClass('btnTDs'),
      DTColumnBuilder.newColumn('middlename').withTitle('MiddleName').withClass('btnTDs'),
      DTColumnBuilder.newColumn('name').withTitle('Name').withClass('btnTDs'),
      DTColumnBuilder.newColumn('nickname').withTitle('Nickname').withClass('btnTDs'),
      DTColumnBuilder.newColumn('positioncode').withTitle('PositionCode').withClass('btnTD'),
      DTColumnBuilder.newColumn('positiontitle').withTitle('PositionTitle').withClass('btnTDs'),
      DTColumnBuilder.newColumn('joblvl').withTitle('JobLevel').withClass('btnTDs'),
      DTColumnBuilder.newColumn('paygroup').withTitle('PayGroup').withClass('btnTDs'),
      DTColumnBuilder.newColumn('paystatus').withTitle('PayStatus').withClass('btnTDs'),
      DTColumnBuilder.newColumn('labortype').withTitle('LaborType').withClass('btnTDs'),
      DTColumnBuilder.newColumn('hiredate').withTitle('HireDate').withClass('btnTD'),
      DTColumnBuilder.newColumn('regdate').withTitle('RegDate').withClass('btnTD'),
      DTColumnBuilder.newColumn('separationdate').withTitle('SeparationDate').withClass('btnTD'),
      DTColumnBuilder.newColumn('no_yrs').withTitle('YearsInService').withClass('btnTDs'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('Organization').withClass('btnTD'),
      DTColumnBuilder.newColumn('businessunit').withTitle('Department').withClass('btnTDs'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('DepCode').withClass('btnTD'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('Section').withClass('btnTD'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('Subsection').withClass('btnTD'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('Unit').withClass('btnTD'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('SubUnit').withClass('btnTD'),
      // DTColumnBuilder.newColumn('OOOOOO').withTitle('Line').withClass('btnTD'),
      DTColumnBuilder.newColumn('manager').withTitle('Manager').withClass('btnTDs'),
      DTColumnBuilder.newColumn('shift').withTitle('Shift').withClass('btnTDs'),
      DTColumnBuilder.newColumn('exemptcode').withTitle('ExemptCode').withClass('btnTDs'),
      DTColumnBuilder.newColumn('sssno').withTitle('SSSNo').withClass('btnTD'),
      DTColumnBuilder.newColumn('pagibigno').withTitle('PagibigNo').withClass('btnTD'),
      DTColumnBuilder.newColumn('tin').withTitle('TIN').withClass('btnTD'),
      DTColumnBuilder.newColumn('philhealthno').withTitle('PhilhealthNo').withClass('btnTD'),
      DTColumnBuilder.newColumn('payrollaccount').withTitle('PayrollAccount').withClass('btnTD'),
      DTColumnBuilder.newColumn('gender').withTitle('Gender').withClass('btnTDs'),
      DTColumnBuilder.newColumn('employmenttype').withTitle('EmploymentType').withClass('btnTDs'),
      DTColumnBuilder.newColumn('employmentstatus').withTitle('EmploymentStatus').withClass('btnTDs'),

    ];
	vm.dtOptions.drawCallback = function( settings ) {
		var api = this.api();
		$("#compensation_benefits_report").text("");
		if( api.context[0].json.filter != "" ){
			$("#compensation_benefits_report").text( "Filtered per - " + api.context[0].json.filter.toString().trim() );
		}
		$("#compensation_date").text("Report Generated on " + moment().format('MM/D/YYYY hh:mm:00 A') );
	};
    vm.dtInstance = {};
	$(document).ready(function () {
		$("div.buttons").html('<button id="btn-refreshh" style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button> <button class="btn-primary btn btn-flat btn-primary pull-right" data-toggle="modal" data-target="#myModal" style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;" title="Search"> <i class="fa fa-search fa-sm"></i> Filter </button><button id="btn-export" style="margin-right:3px;background: #00a65a; border: 1px solid #00a65a;" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().export()" title="Export to Excel"><i class="fa fa-file-excel-o fa-sm" style="padding:3px"></i>Export</button>');
	});
  //reload table
	$scope.search12 = function(){ 
        vm.dtInstance.reloadData(); 
	}

}

  $scope.resetsearch = function(){
      $scope.dept       ='';
      $scope.post_title ='';
      $scope.emp        ='';
      $scope.pay_grp    ='';
      $scope.pay_stat   ='';
      $scope.emp_type   ='';
      $scope.emp_stat   ='';
      $timeout(function () {  
        $("#btn-refreshh").click();
      }, 100);
  }
  

	  //export to excel function
	$scope.export = function () {
		var dept 	    	= typeof $scope.dept === "undefined" ? '' : $scope.dept  ;
		var emp    		    = typeof $scope.emp    === "undefined" ? '' : $scope.emp;
		var post_title 		= typeof $scope.post_title === "undefined" ? '' : $scope.post_title;
		var pay_grp    		= typeof $scope.pay_grp    === "undefined" ? '' : $scope.pay_grp;
		var pay_stat      	= typeof $scope.pay_stat    === "undefined" ? '' : $scope.pay_stat;
		var emp_type 		= typeof $scope.emp_type === "undefined" ? '' : $scope.emp_type;
		var emp_stat 	    = typeof $scope.emp_stat === "undefined" ? '' : $scope.emp_stat;
		var company			= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
		var filterby		= typeof $("#compensation_benefits_report").text() === "undefined" ? '' : $("#compensation_benefits_report").text();
		var datenow			= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
		
		
		
		var url = apiUrl+"admin/hr/employee/report_export.php?datenow="+datenow+"&filterby="+filterby+"&company="+company+"&department="+dept+"&position_title="+post_title+"&employee="+emp+"&pay_group="+pay_grp+"&pay_status="+pay_stat+"&employment_type="+emp_type+"&employment_status="+emp_stat;
		var conf = confirm("Export user to CSV?");
		if(conf == true){
			window.open(url, '_blank');
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


  $rootScope.allEmployeeDepartmentNameFunc();
  $rootScope.getAllEmployeeReportFunc();
  $rootScope.allEmployeePositionTitleFunc();
  $rootScope.allEmploymentStatusFunc();
  $rootScope.getCompanyName();



}]);