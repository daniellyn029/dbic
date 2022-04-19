app.controller('HRageDistributionController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			accounts:[],
			leaves:[],
			period:[],
			daterange:'',
			late_tbl: [],
			absent_tbl:[],
			late_details:[],
			absent_details:[],
			present_tbl:[],
			present_details:[],
			leaves_tbl:[],
			applications_data:[],
			bdates:[],
			dept_ctr:[],
			dept_choose:'',
			pageSize:'10',
			ageDistributionPage:'1'
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
				$scope.dashboard.values.period		= data.period;
				$scope.dashboard.values.department 	= data.departments;
				
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}

	//getDepartmentSearchDropdown
	$scope.typeLimit = function( o ){
		return o.unittype != 1 && o.unittype != 6;
	}
	
	//Table Funtion
	$scope.ageDistributionReport = function (){

		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,

		}

		$http.post(apiUrl+'admin/hr/report/ageDistributionView.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			$scope.ageDistributionDate = data[0].date;
			$scope.ageDistributionTime = data[0].time;


			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.ageDistributionView = [];

			}else{
				$scope.ageDistributionView = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});


	}

	//Search Function
	$scope.searchAgeDistribution= function(){
		$scope.filter = '';
		var urlData = {
			'empid'				:$scope.emp,
			'birthdate_from'	:$scope.birthdate_from,
			'birthdate_to'		:$scope.birthdate_to,
			'search_age' 		:$scope.search_age,
			'department' 		:$scope.department,
		}
		$http.post(apiUrl+"admin/hr/report/searchAgeDistribution.php", urlData)
		.then( function (response, status){     
			var data = response.data;


			$scope.ageDistributionView = data;
			$scope.filter = '';
			//filtered By function
			if($scope.emp == '' || $scope.emp == null){
				$scope.filter = '';
			}else{
				$scope.filter = 'Employee Name/ID ';
			}

			if($scope.search_age == '' || $scope.search_age == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Age ';
				}else{
					$scope.filter = 'Age ';
				}
			}

			if($scope.department == '' || $scope.department == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Department Name ';
				}else{
					$scope.filter = 'Department Name ';
				}
			}

			if($scope.birthdate_from == '' || $scope.birthdate_from == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Birthdate From: ' + $scope.birthdate_from;
				}else{
					$scope.filter = 'Birthdate From: ' + $scope.birthdate_from;
				}
			}
			
			if($scope.birthdate_to == '' || $scope.birthdate_to == null){
				$scope.filter += '';
			}else{
				if( $scope.filter != '' ){
					$scope.filter += ' And Birthdate To: ' +$scope.birthdate_to;
				}else{
					$scope.filter = 'Birthdate To: ' +$scope.birthdate_to;
				}
			}

  
		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}

	//Refresh Page
	$scope.reloadData = function(){
		$scope.filter	 		='';
		$scope.emp       		='';
		$scope.department 		='';
		$scope.birthdate_from 	='';
		$scope.birthdate_to		='';
		$scope.search_age       ='';


		$scope.ageDistributionReport();

	}

	// //Reset Search
	$scope.resetsearch = function(){
		$scope.filter	 			='';
		$scope.emp       			='';
		$scope.department 			='';
		$scope.birthdate_from 		='';
		$scope.birthdate_to			='';
		$scope.search_age       	='';


		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);

	}

	//Search Dropdown and Group By for Employees Age
	$scope.allemployeeAgeFunc = function(){
		var urlData = {
			'accountid': $scope.dashboard.values.accountid
		}
		$http.post("/dbic/assets/php/admin/hr/report/allemployeeAge.php", urlData)
		.then(function(result){
			if(result.data.status == "empty"){
				$scope.allemployeeAge = [];
			}else{
				$scope.allemployeeAge = result.data;

			}
		},function(error){}).finally(function(){});
	}

	//EXPORT FUNCTION
	$scope.exportReportToExcel = function (eleID) {
		var urlData = {
			'accountid'	 	: $scope.dashboard.values.accountid,
			'empid' 		: $scope.emp,
			'birthdate_from': $scope.birthdate_from,
			'birthdate_to' 	: $scope.birthdate_to,
			'search_age' 	: $scope.search_age,
			'department' 	: $scope.department,



		}


		$http.post(apiUrl+'admin/hr/report/ageDistributionExport.php',urlData)
		.then( function (response, status){	
			var data = response.data;	
			if(data.status !='empty'){

				//PAGE HEADER
				var page_header = '';
					page_header +=  document.getElementById('age_company_name').innerText + '\r\n' +
									document.getElementById('age_report').innerText + '\r\n' +
									document.getElementById('age_filter').innerText + '\r\n' +
									document.getElementById('age_generated').innerText + '\r\n';
									
				var jsonData =data;
				var filteredGridData = JSON.parse(JSON.stringify(jsonData));
				var arrData = typeof filteredGridData != 'object' ? JSON.parse(filteredGridData) : filteredGridData;
				var CSV = '';    
				
				//for headers
				var row = "";
				var ctr = 5;
					for (var index in arrData[0]) {
						if(ctr >= 1 ){
							row += index.toUpperCase() + ',';
						}
						ctr=ctr-1;
					}
				row = row.slice(0, -1);
				CSV += row + '\r\n';
				
				//1st loop is to extract each row
				for (var i = 0; i < arrData.length; i++) {
					var row = "";
					//2nd loop will extract each column and convert it in string comma-seprated
					ctr = 5;
					for (var index in arrData[i]) {
						if(ctr >= 1 ){
							if( arrData[i][index] == null || arrData[i][index]==""){
								arrData[i][index] = "";
							}
							row += '"' + arrData[i][index] + '",';
						}
						ctr=ctr-1;
					}
					row.slice(0, row.length - 1);
					//add a line break after each row
					CSV += row + '\r\n';
				}

				if (CSV == '') {        
					alert("Invalid data");
					return;
				}
				
				var fileName = "AgeDistributionReport";			
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
					var IEwindow = window.open();
					IEwindow.document.write('sep=,\r\n' + CSV);
					IEwindow.document.close();
					IEwindow.document.execCommand('SaveAs', true, fileName + ".csv");
					IEwindow.close();
				} else {
					var csv = page_header + CSV;
					var link = document.createElement("a");
					link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv));
					link.setAttribute("download", "AgeDistributionReport.csv");
					link.click();
				}

			}




		}, function(response) {
			$rootScope.modalDanger();
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

	// //export to excel function
	// $scope.export = function () {
    
	// 	var emp   = typeof $scope.emp    === "undefined" ? '' : $scope.emp;
	// 	var department   = typeof $scope.department    === "undefined" ? '' : $scope.department;
	// 	var birthdate_from   = typeof $scope.birthdate_from    === "undefined" ? '' : $scope.birthdate_from;
	// 	var birthdate_to   = typeof $scope.birthdate_to    === "undefined" ? '' : $scope.birthdate_to;
	// 	var search_age   = typeof $scope.search_age    === "undefined" ? '' : $scope.search_age;
		
			
	// 	var url = apiUrl+"admin/hr/report/ageDistributionExport.php?empid="+emp+"&department="+department+"&birthdate_from="+birthdate_from+"&birthdate_to="+birthdate_to+"&search_age="+search_age;

	
	// 	// var url = apiUrl+"admin/hr/employee/report_export.php?department="+dept+"&position_title="+post_title+"&employee="+emp+"&pay_group="+pay_grp+"&pay_status="+pay_stat+"&employment_type="+emp_type+"&employment_status="+emp_stat;
	
	// 	var conf = confirm("Export user to CSV?");
	// 		  if(conf == true)
	// 		  {
	// 			  window.open(url, '_blank');
	// 		  }
	
	// } 


	$rootScope.getCompanyName();
	$rootScope.getAllEmployeeReportFunc();
	$rootScope.allEmployeeDepartmentNameFunc();
	$scope.allemployeeAgeFunc();
	
	$scope.dashboard.setup();
}]);
