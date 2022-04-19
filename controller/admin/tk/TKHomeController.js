app.controller('TKHomeController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
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
				$scope.dashboard.values.department 	= data.departments;
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
							$scope.home_functions();
							$scope.applications_functions();
							$scope.leaves_count_function();
							return;
						}, 100);
					});
					$("#picker1").on('cancel.daterangepicker', function(ev, picker) {
						$timeout(function () {	
							var dateText = moment( $scope.dashboard.values.period.pay_start ).format('MM/DD/YYYY') + ' - ' + moment( $scope.dashboard.values.period.pay_end ).format('MM/DD/YYYY');
							$("#picker1").val(dateText);	
							$scope.dashboard.values.daterange	= dateText;
							$scope.home_functions();
							$scope.applications_functions();
							$scope.leaves_count_function();
							return;
						}, 100);
					});
					// $scope.home_functions();
					// $scope.applications_functions();
					// $scope.leaves_count_function();
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}

$scope.display_ct = function(){	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var radius = canvas.height / 2;
	ctx.translate(radius, radius);
	radius = radius * 0.90
	var timerID = setInterval(drawClock, 1000);
	
	function drawClock() {
		var element =  document.getElementById('ct');
		if (typeof(element) != 'undefined' && element != null){ 
			drawFace(ctx, radius);
			drawNumbers(ctx, radius);
			drawTime(ctx, radius);
		}else{
			console.log('stop');
			clearInterval(timerID);
		}
	}
	
	function drawFace(ctx, radius) {
	  var grad;
	  ctx.beginPath();
	  ctx.arc(0, 0, radius, 0, 2*Math.PI);
	  ctx.fillStyle = 'white';
	  ctx.fill();
	  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
	  grad.addColorStop(0, '#333');
	  grad.addColorStop(0.5, 'white');
	  grad.addColorStop(1, '#333');
	  ctx.strokeStyle = grad;
	  ctx.lineWidth = radius*0.1;
	  ctx.stroke();
	  ctx.beginPath();
	  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
	  ctx.fillStyle = '#333';
	  ctx.fill();
	}
	
	function drawNumbers(ctx, radius) {
	  var ang;
	  var num;
	  ctx.font = radius*0.15 + "px arial";
	  ctx.textBaseline="middle";
	  ctx.textAlign="center";
	  for(num = 1; num < 13; num++){
		ang = num * Math.PI / 6;
		ctx.rotate(ang);
		ctx.translate(0, -radius*0.85);
		ctx.rotate(-ang);
		ctx.fillText(num.toString(), 0, 0);
		ctx.rotate(ang);
		ctx.translate(0, radius*0.85);
		ctx.rotate(-ang);
	  }
	}
	
	function drawTime(ctx, radius){
		var now = new Date();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		//hour
		hour=hour%12;
		
		
		var x1 = ('0' + hour).slice(-2) + ":";
		
		
		
		// document.getElementById("hourclock").innerHTML=('0' + hour).slice(-2);
		hour=(hour*Math.PI/6)+
		(minute*Math.PI/(6*60))+
		(second*Math.PI/(360*60));

		//Digital Clock add 0 in left
		x1 = x1 + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
		var element =  document.getElementById('ct');
		if (typeof(element) != 'undefined' && element != null){ 
			document.getElementById('ct').innerHTML = x1;
		}
		// document.getElementById("minclock").innerHTML=('0' + minute).slice(-2);
		// document.getElementById("secclock").innerHTML=('0' + second).slice(-2);
		//End

		drawHand(ctx, hour, radius*0.5, radius*0.07);
		//minute
		minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
		drawHand(ctx, minute, radius*0.8, radius*0.07);
		// second
		second=(second*Math.PI/30);
		drawHand(ctx, second, radius*0.9, radius*0.02);
		
	}
	
	function drawHand(ctx, pos, length, width) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.lineCap = "round";
		ctx.moveTo(0,0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.rotate(-pos);
	}
	
	
	
}	
$scope.reminders_func = function(){

	$scope.current_time = new Date();

	//Get Attendance Today DAte
	var today = new Date();
	var dd = today.getDate();

	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	if(dd<10) 
	{
		dd='0'+dd;
	} 

	if(mm<10) 
	{
		mm='0'+mm;
	} 

	var date = yyyy+'-'+mm+'-'+dd;
	//END
	
	$scope.today = date;
	
}
$scope.totalemp = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/hr/home/totalemp.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totalemployees = data;

			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.days_process = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalDaysProcessingView.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.days_process = data;

			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.total_ob = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalOB.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totalob = data;
				// $scope.lengthsss = $scope.totalob.length;
				$scope.total_pendings();
			}
		}, function (response) {
			$rootScope.modalDanger();
		});
	
}
$scope.total_aa = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalAA.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totalaa = data;
				$scope.total_pendings();
			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.total_ot = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalOT.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totalot = data;
				$scope.total_pendings();
			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.total_leaves = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalLeaves.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totalleaves = data;
				$scope.total_pendings();

			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.total_CS = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalCS.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totalcs = data;
				$scope.total_pendings();
			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.total_duty_roster = function () {
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/totalDutyRoster.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.totaldutyroster = data;
				$scope.total_pendings();

			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
//Count All Pendings
$scope.total_pendings = function (){
	$scope.totalpending_length =0;
	$scope.totalpending_length = (typeof($scope.totalob) != 'undefined' ? parseInt($scope.totalob.total) : 0) + 
	(typeof($scope.totalaa) != 'undefined' ?parseInt($scope.totalaa.total) : 0) +
	(typeof($scope.totalot) != 'undefined' ?parseInt($scope.totalot.total) : 0) +
	(typeof($scope.totalleaves) != 'undefined' ?parseInt($scope.totalleaves.total) : 0) +
	(typeof($scope.totalcs) != 'undefined' ?parseInt($scope.totalcs.total) : 0) +
	(typeof($scope.totaldutyroster) != 'undefined' ?parseInt($scope.totaldutyroster.total) : 0) ;
	
}
$scope.resolution = function () {
	
	var urlData = {
		'accountid': $scope.dashboard.values.accountid,
		'dept'	   : $scope.department
		
	}
	$http.post(apiUrl + 'admin/tk/home/resolution.php', urlData)
		.then(function (response, status) {
			var data = response.data;
			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.noti = data;
				$scope.noti_length = $scope.noti.length;
			}
		}, function (response) {
			$rootScope.modalDanger();
		});
}
$scope.barchartdiv = function () {
	var ctx = document.getElementById("bar23").getContext("2d");
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/monthlyAppStatistic.php', urlData)
	.then(function (response, status) {
		var data = response.data;
		if( data.status == "error" ){
			$rootScope.modalDanger();
		}else{
			$scope.data = {
				labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				datasets: [{
					label: "OB",
					backgroundColor: "#44a3c0",
					data: data.ob
				}, {
					label: "AA",
					backgroundColor: "#c55a11",
					data: data.aa
				}, {
					label: "OT",
					backgroundColor: "#a4a0a0",
					data: data.ot
				},{
					label: "LV",
					backgroundColor: "#ffc000",
					data: data.leaves
				},{
					label: "CS",
					backgroundColor: "#4472c4",
					data: data.cs
				},{
					label: "DR",
					backgroundColor: "#70ad47",
					data: data.dr
				}]
			};
			var myBarChart = new Chart(ctx, {
				type: 'bar',
				data: $scope.data,
				options: {
					legend: {
						display: true,
						position:'bottom',
						labels: {
							fontColor: 'black',
							
						}
					}
					// barValueSpacing: 20,
					// scales: {
					// 	yAxes: [{
					// 		ticks: {
					// 			min: 0,
					// 		}
					// 	}]
					// }
				}
			});
		}
	}, function (response) {
		$rootScope.modalDanger();
	});
}

$scope.notification = function(){
	var urlData = {
		'accountid': $scope.dashboard.values.accountid
	}
	$http.post(apiUrl + 'admin/tk/home/notification.php', urlData)
		.then(function (response, status) {
			var data = response.data;

			if (data.status == 'error') {
				$rootScope.modalDanger();
			} else {
				$scope.notif = data;
			}
		}, function (response) {
			$rootScope.modalDanger();
		});



}

	//  $scope.home_functions = function(){
	//  	var dateRange = $scope.dashboard.values.daterange.split("-");
	//  	var urlData = {
	//  		'accountid'		: $scope.dashboard.values.accountid,
	//  		'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
	//  		'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
	//  	}
	//  	$http.post(apiUrl+'admin/tk/home/counter1.php',urlData)
	//  	.then( function (response, status){			
	//  		var data = response.data;			
	//  		if(data.status=='error'){	
	//  			$rootScope.modalDanger();
	//  		}else{
	//  			$timeout(function () {
	//  				$scope.dashboard.values.late_tbl	= [];
	//  				$scope.dashboard.values.late_tbl	= data;
	//  			}, 100);
	//  		}					
	//  	}, function(response) {
	//  		$rootScope.modalDanger();
	//  	});	
	//  }
	// //  Variables For AA and OT Applications 
	//  $scope.applications_functions = function(){
	//  	var dateRange = $scope.dashboard.values.daterange.split("-");
	//  	var urlData = {
	//  		'accountid'		: $scope.dashboard.values.accountid,
	//  		'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
	//  		'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
	//  	}
	//  	$http.post(apiUrl+'admin/tk/home/counter2.php',urlData)
	//  	.then( function (response, status){			
	//  		var data = response.data;	
	//  		$scope.dashboard.values.applications_data	= [];
	//  		$scope.dashboard.values.applications_data	= data;
	//  		$timeout(function () {
	//  			$("#aa_pending").text( ''+data.aa.pending );
	//  			$("#aa_approve").text( ''+data.aa.approved );
	//  			$("#aa_decline").text( ''+data.aa.declined );
	//  			$("#aa_cancel").text( ''+data.aa.canceled );
	//  			$("#aa_total").text( ''+data.aa_total );	
	//  			$("#ot_pending").text( ''+data.ot.pending );
	//  			$("#ot_approve").text( ''+data.ot.approved );
	//  			$("#ot_decline").text( ''+data.ot.declined );
	//  			$("#ot_cancel").text( ''+data.ot.canceled );
	//  			$("#ot_total").text( ''+data.ot_total );
	//  			$(".counter-count_set2").each(function () {
	//  				$(this).prop('Counter',0).animate({
	//  					Counter: $(this).text()
	//  				}, {
	//  					duration: 2000,
	//  					easing: 'swing',
	//  					step: function (now) {
	//  						$(this).text(Math.ceil(now));							
	//  					}
	//  				});
	//  			});
	//  		}, 100);
					
	//  	}, function(response) {
	//  		$rootScope.modalDanger();
	//  	});	
	//  }



	//  Variables for Leaves Chart 
	//  $scope.leaves_count_function = function(){
	//  	$scope.line_series	= ['Pending','Approved','Declined'];
	//  	$scope.line_colors	= ['#f39c12','#0073b7','#dd4b39'];
	//  	$scope.line_data 	= [];
	//  	$scope.line_labels	= [];
	//  	var dateRange = $scope.dashboard.values.daterange.split("-");
	//  	var urlData = {
	//  		'accountid'		: $scope.dashboard.values.accountid,
	//  		'start_date'	: moment( dateRange[0] ).format('YYYY-MM-DD'),
	//  		'end_date'		: moment( dateRange[1] ).format('YYYY-MM-DD')
	//  	}
	//  	$http.post(apiUrl+'admin/tk/home/counter3.php',urlData)
	//  	.then( function (response, status){			
	//  		var data = response.data;			
	//  		if(data.status=='error'){	
	//  			$rootScope.modalDanger();
	//  		}else{
	//  			$timeout(function () {
	//  				var arr_pending = [];
	//  				var arr_approve = [];
	//  				var arr_decline = [];		
	//  				$scope.dashboard.values.leaves_tbl	= [];
	//  				$scope.dashboard.values.leaves_tbl	= data;
	//  				data.forEach(function(item,key){
	//  					$scope.line_labels.push(data[key]['name']);	
	//  					arr_pending.push(data[key]['pending']);	
	//  					arr_approve.push(data[key]['approve']);						
	//  					arr_decline.push(data[key]['decline']);
	//  				});
	//  				$scope.line_data = [ arr_pending,arr_approve,arr_decline ]; 
	//  				$scope.line_options = {
	//  					scales: {
	//  						xAxes: [{
	//  							ticks: {
	//  								fontSize: 10
	//  							}
	//  						}]
	//  					}
	//  				}
	//  			}, 100);
	//  		}					
	//  	}, function(response) {
	//  		$rootScope.modalDanger();
	//  	});
	//  }
	
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
	$scope.dashboard.setup();
}]);
