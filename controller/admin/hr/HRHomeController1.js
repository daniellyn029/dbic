app.controller('HRHomeController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
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
			dept_choose:''
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
							$scope.attendance_counter();
							$scope.dept_attendance_ctr();
							//$scope.applications_functions();
							return;
						}, 100);
					});
					$("#picker1").on('cancel.daterangepicker', function(ev, picker) {
						$timeout(function () {	
							var dateText = moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY') + ' - ' + moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY');
							$("#picker1").val(dateText);	
							$scope.dashboard.values.daterange	= dateText;
							$scope.attendance_counter();
							$scope.dept_attendance_ctr();
							//$scope.applications_functions();
							return;
						}, 100);
						
					});
					$scope.attendance_counter();
					$scope.birthdate_update();
					$scope.dept_attendance_ctr();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}
	
	$scope.attendance_counter = function(){
		var dateRange = $scope.dashboard.values.daterange.split("-");
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,
			'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
			'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
		}
		$http.post(apiUrl+'admin/hr/home/counter1.php',urlData)
		.then( function (response, status){			
			var data = response.data;	
			$scope.divisor = 0;
			if(data.status=='error'){	
				$rootScope.modalDanger();
			}else{
				$scope.divisor    = (data.dayz * data.staff);
				$scope.pie_labels = ["PRESENT", "ABSENT", "LATE", "VL", "SL", "LWOP"];
				$scope.pie_data   = [];
					$timeout(function () {
						$scope.pie_data   = [ data.present_ctr , data.absent_ctr, data.lte_ctr,  data.vl_ctr, data.sl_ctr, data.lwop_ctr];
						$scope.pie_options= { 	
							tooltips: {
								enabled: true
							},
							legend: { 
								display: true, 
								position: "bottom",  
								labels: {
									boxWidth: 15,
									fontSize: 10, 
									fontColor: 'rgb(255, 99, 132)',
									padding: 5,
									fontStyle: 'italic',
									generateLabels: function(chart){
									  var bg = chart.data.datasets[0].backgroundColor
									  var ele = "<ul class='legend-labels'>";
									  chart.data.datasets[0].data.forEach(function(item, index){
										  var perc = (( item / $scope.divisor ) * 100).toFixed(2);									  
										  ele = ele  + '<li><span style="font-weight:900;background-color:'+bg[index]+'">'+ perc +'% </span>'+ $scope.pie_labels[index] +'</li>';
									  });
									  ele = ele  + "</ul>";
									  $(".legend-scale").html(ele);
									  return chart.generateLegend();
									}
								} 
							} 
						};
					}, 100);						
					$timeout(function () {	
						$("#staff_data").text( '' + data.staff );
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
	
	
	$scope.birthdate_update = function(){
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid
		}
		$http.post(apiUrl+'admin/hr/home/birthdates.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			if(data.status=='error'){	
				$rootScope.modalDanger();
			}else{				
				$scope.events = data;
				$scope.calendarOptions = {
					eventLimit: true,
					eventLimitText: 'birthdays',
					views: {
						agenda: {
						  eventLimit: 1
						}
					},
					eventRender: function (event, element, view) { 
						$(element).each(function () { 
							$(this).attr('date-num', event.start.format('YYYY-MM-DD')); 
						});
					},
					eventAfterAllRender: function(view){
						for( cDay = view.start.clone(); cDay.isBefore(view.end) ; cDay.add(1, 'day') ){
							var dateNum = cDay.format('YYYY-MM-DD');
							var dayEl = $('.fc-day[data-date="' + dateNum + '"]');
							var eventCount = $('.fc-event[date-num="' + dateNum + '"]').length;
							if(eventCount){
								var eleAlter = $('.fc-day-grid-event[date-num="' + dateNum + '"').closest('td').next().children().first();
								if (typeof(eleAlter.children().first()[0]) !== 'undefined') {
									eleAlter.children().first()[0].text = "+" + (eventCount-1) + ' birthdays';
								}
								
							}
						}
					},
					eventLimitClick: function(cellInfo, jsEvent){
						cellInfo.segs.shift();
						return "popover";
					},
					viewRender: function(view, element) {
						var b = $('.calendar').fullCalendar('getDate');
						var urlData = {
							'accountid'		: $scope.dashboard.values.accountid,
							'dstart'		: b.format('YYYY-MM-DD')
						}
						$http.post(apiUrl+'admin/hr/home/birthdates.php',urlData)
						.then( function (response, status){			
							var data = response.data;
							if(data.status=='error'){	
								$("#tr_bdays").html('<tr><td style="text-align:center;" colspan="2"> No Birthday For this Month </td></tr>');
							}else{
								$("#tr_bdays").html();
								var tbody = "";
								data.forEach(function(item, index){
									if(item.title.length > 0 ){
									  var dummy_arr = moment(item.start).format('ll').split(",");
									  
									  var tr="<tr>";
									  var td = td  + '<td style="text-align:center;">'+ dummy_arr[0] +'</td>';
									  td = td  + '<td style="text-align:center;">'+ item.title +'</td>';
									  tr=tr+td+"</tr>";
									  
									  tbody = tbody + tr;
									}
								});
								$("#tr_bdays").html(tbody);
							}
						}, function(response) {
							$rootScope.modalDanger();
						});	
					}
				};
			}					
		}, function(response) {
			$rootScope.modalDanger();
		});	
	}
	
	$scope.dept_attendance_ctr = function(){
		var dateRange = $scope.dashboard.values.daterange.split("-");
		var urlData = {
			'accountid'		: $scope.dashboard.values.accountid,			
			'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
			'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
		}
		$http.post(apiUrl+'admin/hr/home/counter2.php',urlData)
		.then( function (response, status){			
			var data = response.data;	
			$scope.dashboard.values.dept_ctr = [];
			if(data.status=='error'){	
				$rootScope.modalDanger();
			}else{
				$scope.dashboard.values.dept_ctr    = data;
				$timeout(function () {	
					$( "#row_" + data[0].idunit ).click();
				}, 100);
				$scope.dept_chart( data[0] );
			}					
		}, function(response) {
			$rootScope.modalDanger();
		});
	}
	
	$scope.dept_chart = function( obj ){
		$scope.dashboard.values.dept_choose = obj.unit;
		$scope.bar_data 	= [];
		$scope.bar_labels	= ['Present','Absent','Late', 'VL', 'SL', 'LWOP'];
		$scope.bar_data 	= [ obj.present_ctr, obj.absent_ctr, obj.lte_ctr, obj.vl_ctr, obj.sl_ctr, obj.lwop_ctr ]; 
		$scope.bar_options = {
			scales: {
				xAxes: [{
					ticks: {
						fontSize: 10
					}
				}]
			}
		};
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
	
	$scope.dashboard.setup();
}]);
