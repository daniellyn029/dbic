app.controller('MNGHomeController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/mng/sidebar/index.html";
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
			applications_data:[]
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
				$scope.dashboard.values.daterange	= moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY') + ' - ' + moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY');
				
				$("#picker1").daterangepicker({
					startDate: moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY'),
					endDate: moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY'),
					locale: {
					  cancelLabel: 'Clear',
					  format: 'MM/DD/YYYY'
					}
				});
				$("#picker1").on('apply.daterangepicker', function(ev, picker) {
					$timeout(function () {	
						$scope.present_counter();
						$scope.home_functions();
						$scope.leaves_count_function();
						$scope.applications_functions();
						return;
					}, 100);
				});
				$("#picker1").on('cancel.daterangepicker', function(ev, picker) {
					$timeout(function () {	
						var dateText = moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY') + ' - ' + moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY');
						$("#picker1").val(dateText);	
						$scope.dashboard.values.daterange	= dateText;
						$scope.present_counter();
						$scope.home_functions();
						$scope.leaves_count_function();
						$scope.applications_functions();
						return;
					}, 100);
					
				});
				$scope.present_counter();
				$scope.home_functions();
				$scope.leaves_count_function();
				$scope.applications_functions();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
	
	/* Variables for Present Chart */
	$scope.present_counter = function(){
		$scope.labels 	= [];
		$scope.data 	= [];	
		$scope.colour	= [];
		var dateRange = $scope.dashboard.values.daterange.split("-");
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
			'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
		}
		$http.post(apiUrl+'admin/mng/home/counter2.php',urlData)
		.then( function (response, status){			
			var data = response.data;			
			if(data.status=='error'){	
				$rootScope.modalDanger();
			}else{
				$scope.dashboard.values.present_tbl	= [];
				$timeout(function () {
					$scope.options= { 						
						legend: { 
							labels: {
								generateLabels: function(chart){
								  $rootScope.bg = chart.data.datasets[0].backgroundColor;
								  return chart.generateLegend();
								}
							} 
						} 
					};
					data.forEach(function(item,key){
						$scope.labels.push(data[key]['date']);	
						$scope.data.push(data[key]['present']);	
					});
				}, 100);
				
				$timeout(function () {
					$scope.dashboard.values.present_tbl	= data;	
					$scope.dashboard.values.present_tbl.forEach(function(item,key){
						$scope.dashboard.values.present_tbl[key].colour = item.present > 0 ? $rootScope.bg[key] : "" ;
					});
				}, 1000);
			}					
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	$scope.view_present = function(o){
		$scope.dashboard.values.present_details = [];
		if( parseInt(o.present) > 0 ){
			$scope.present_details_page = 1;
			$scope.dashboard.values.present_details = o;
			$("#present_box").modal("show");
		}
	}
	
	/* Late Table Filter */
	$scope.late_data_search = function(late_data){
		return parseInt(late_data.lte_ctr)  > 0;
	}
	/* ABSENT Table Filter */
	$scope.absent_data_search = function(absent_data){
		return parseInt(absent_data.absent_ctr)  > 0;
	}
	$scope.home_functions = function(){
		var dateRange = $scope.dashboard.values.daterange.split("-");
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
			'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
		}
		$http.post(apiUrl+'admin/mng/home/counter1.php',urlData)
		.then( function (response, status){			
			var data = response.data;			
			if(data.status=='error'){	
				$rootScope.modalDanger();
			}else{
				$timeout(function () {
					$scope.dashboard.values.late_tbl	= [];
					$scope.dashboard.values.absent_tbl	= [];
					$scope.dashboard.values.late_tbl	= data;
					$scope.dashboard.values.absent_tbl	= data;
					$("#late_data").text( ''+data[0].total_late_ctr );
					$("#absent_data").text( ''+data[0].total_absent_ctr );
					$(".counter-count_set1").each(function () {
						$(this).prop('Counter',0).animate({
							Counter: $(this).text()
						}, {
							duration: 2000,
							easing: 'swing',
							step: function (now) {
								$(this).text(Math.ceil(now));
							}
						});
					});
				}, 100);
			}					
		}, function(response) {
			$rootScope.modalDanger();
		});	
	}
	$scope.view_lates = function(o){
		$scope.dashboard.values.late_details = [];
		$scope.dashboard.values.late_details = o;	
		$("#late_box").modal("show");
	}
	$scope.view_absent = function(o){
		$scope.dashboard.values.absent_details = [];	
		$scope.dashboard.values.absent_details = o;	
		$("#absent_box").modal("show");
	}
	
	/* Variables for Leaves Chart */
	$scope.leaves_count_function = function(){
		$scope.line_series	= ['Pending','Approved','Declined'];
		$scope.line_colors	= ['#f39c12','#0073b7','#dd4b39'];
		$scope.line_data 	= [];
		$scope.line_labels	= [];
		var dateRange = $scope.dashboard.values.daterange.split("-");
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
			'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
		}
		$http.post(apiUrl+'admin/mng/home/counter3.php',urlData)
		.then( function (response, status){			
			var data = response.data;			
			if(data.status=='error'){	
				$rootScope.modalDanger();
			}else{
				$timeout(function () {
					var arr_pending = [];
					var arr_approve = [];
					var arr_decline = [];		
					$scope.dashboard.values.leaves_tbl	= [];
					$scope.dashboard.values.leaves_tbl	= data;
					data.forEach(function(item,key){
						$scope.line_labels.push(data[key]['name']);	
						arr_pending.push(data[key]['pending']);	
						arr_approve.push(data[key]['approve']);						
						arr_decline.push(data[key]['decline']);
					});
					$scope.line_data = [ arr_pending,arr_approve,arr_decline ]; 
					$scope.line_options = {
						scales: {
							xAxes: [{
								ticks: {
									fontSize: 10
								}
							}]
						}
					}
				}, 100);
			}					
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	/* Variables For AA and OT Applications */
	$scope.applications_functions = function(){
		var dateRange = $scope.dashboard.values.daterange.split("-");
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
			'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
		}
		$http.post(apiUrl+'admin/mng/home/counter4.php',urlData)
		.then( function (response, status){			
			var data = response.data;	
			$scope.dashboard.values.applications_data	= [];
			$scope.dashboard.values.applications_data	= data;
			$timeout(function () {
				$("#aa_pending").text( ''+data.aa.pending );
				$("#aa_approve").text( ''+data.aa.approved );
				$("#aa_decline").text( ''+data.aa.declined );
				$("#aa_cancel").text( ''+data.aa.canceled );
				$("#aa_total").text( ''+data.aa_total );	
				$("#ot_pending").text( ''+data.ot.pending );
				$("#ot_approve").text( ''+data.ot.approved );
				$("#ot_decline").text( ''+data.ot.declined );
				$("#ot_cancel").text( ''+data.ot.canceled );
				$("#ot_total").text( ''+data.ot_total );
				$(".counter-count_set2").each(function () {
					$(this).prop('Counter',0).animate({
						Counter: $(this).text()
					}, {
						duration: 2000,
						easing: 'swing',
						step: function (now) {
							$(this).text(Math.ceil(now));							
						}
					});
				});
			}, 100);
							
		}, function(response) {
			$rootScope.modalDanger();
		});	
	}
	
	
	$scope.dashboard.setup();
}]);
