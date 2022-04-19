app.controller('HRdisciplinaryActionsController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			joblvl:[],
			dept_choose:'',
			pageSize:'10',
			disciplinaryActionsPage:'1'
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
				$scope.dashboard.values.joblvl 		= data.joblvl;
				$scope.dashboard.values.department 	= data.departments;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
	//Costumized Department Dropdown Filter
	// $scope.typeLimit = function( o ){
	// 	return o.unittype != 1 && o.unittype != 6;
	// }
	//Table Function
	$scope.viewDisciplinaryActionsReport = function(){
		
		$scope.disciplinaryActionsView = [];
		
		var urlData = {
			'accountid'	: $scope.dashboard.values.accountid,
		}
		$http.post(apiUrl+'admin/hr/report/viewDisciplinaryActions.php',urlData)
		.then( function (response, status){		
				
			var data 		= response.data;

			$scope.disciplinaryActionsDate = data[0].date;
			$scope.disciplinaryActionsTime = data[0].time;


			if(data.status=="error"){
				$rootScope.modalDanger();
				$scope.disciplinaryActionsView = [];

			}else{
				$scope.disciplinaryActionsView = data;
			}
			
		}, function(response) {
			$rootScope.modalDanger();
		});
		
	}

	//Search Function
	$scope.search = function(){
		$scope.filter = '';
		var urlData = {
			'empid'			 		:$scope.emp,
			'department' 			:$scope.department,
			'emp_action' 			:$scope.emp_action,
		}
		$http.post(apiUrl+"admin/hr/report/searchDisciplinaryAction.php", urlData)
		.then( function (response, status){     
			var data = response.data;

			$scope.disciplinaryActionsView = data;

			//filtered By function
			if($scope.emp == '' || $scope.emp == null){
				$scope.filter = '';
			}else{
				$scope.filter = 'Employee Name';
			}

			if($scope.department == '' || $scope.department == null){
				$scope.filter += '';
			}else{

				var dept_id = $( "#dept_id option:selected" ).text();

				if($scope.filter!=''){
					$scope.filter += ' And Department '+dept_id;
				}else{
					$scope.filter = 'Department '+dept_id;
				}
			}

			if($scope.emp_action == '' || $scope.emp_action == null){
				$scope.filter += '';
			}else{

				if($scope.filter!=''){
					$scope.filter += ' And Employee Action '+$scope.emp_action;
				}else{
					$scope.filter = 'Employee Action '+$scope.emp_action;
				}
			}

		}, function(response) {
			$rootScope.modalDanger();
		}); 

	}


	//Reset Search
	$scope.resetSearch = function(){
		$scope.filter	 			='';
		$scope.emp      			='';
		$scope.department 			='';
		$scope.emp_action 			='';

		

		$timeout(function () {  
			$("#btn-refreshh").click();
		}, 100);
	}

	//Refresh Page
	$scope.reloadData = function(){
		$scope.filter	 			='';
		$scope.emp      			='';
		$scope.department 			='';
		$scope.emp_action 			='';

		$scope.viewDisciplinaryActionsReport();

	}

	//EXPORT FUNCTION
	$scope.exportReportToExcel = function (eleID) {
		var urlData = {
			'accountid'			: $scope.dashboard.values.accountid,
			'empid'			 	:$scope.emp,
			'department'		:$scope.department,		
			'emp_action'		:$scope.emp_action,
			
		}

		$http.post(apiUrl+'admin/hr/report/exportDisciplinaryAction.php',urlData)
		.then( function (response, status){	
			var data = response.data;	
			if(data.status !='empty'){

				//PAGE HEADER
				var page_header = '';
					page_header +=  document.getElementById('disactions_companyName').innerText + '\r\n' +
									document.getElementById('disactions_txt').innerText + '\r\n' +
									document.getElementById('disactions_report').innerText + '\r\n' +
									document.getElementById('disactions_date').innerText + '\r\n';

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
				
				var fileName = "DisciplinaryActionReport";			
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
					link.setAttribute("download", "DisciplinaryActionReport.csv");
					link.click();
				
				}

			}

		}, function(response) {
			$rootScope.modalDanger();
		});


	}


	//Sidebar ScrollBar
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
	
	$rootScope.getCompanyName();
	$rootScope.getAllEmployeeReportFunc();
	$scope.dashboard.setup();
}]);
