app.controller('MNGHomeController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/mng/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";
		$scope.today = new Date();
		$scope.date = new Date(); 
        $scope.dashboard = {
            values: {
                loggedid: $cookieStore.get('acct_id'),
                accountid: $cookieStore.get('acct_id'),
                accteid: $cookieStore.get('acct_eid'),
                accouttype: $cookieStore.get('acct_type'),
                accoutfname: $cookieStore.get('acct_fname'),
                accoutlname: $cookieStore.get('acct_lname'),
                acct_loc: $cookieStore.get('acct_loc'),
                userInformation: null,
                accounts: [],
                leaves: [],
                period: [],
                daterange: '',
                late_tbl: [],
                absent_tbl: [],
                late_details: [],
                absent_details: [],
                present_tbl: [],
                present_details: [],
                leaves_tbl: [],
                applications_data: []
            },
            active: function () {
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl + 'tmsmems/loggedinuser.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        if (data.status == 'error') {
                            $rootScope.modalDanger();
                        } else {
                            $scope.dashboard.values.userInformation = data;
                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            },
            setup: function () {
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl + 'admin/tk/setup/settings.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.dashboard.values.accounts = data.accounts;
                        $scope.dashboard.values.leaves = data.leaves;
                        $scope.dashboard.values.period = data.period;
                        $scope.dashboard.values.daterange = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');
					}, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        

        $scope.piechartdiv = function () {
            $scope.pie_sum = 0;
            $scope.pie_labels = [];
            $scope.pie_data = [];
            $scope.pie_colour = [];
            $scope.pie_options = {};
            
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
				'loc': $scope.dashboard.values.acct_loc,
				'units': $cookieStore.get('dptmtrx'),
            }
            $http.post(apiUrl + 'admin/mng/home/piechart.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    $scope.pie_pay_start = data.pay_start;
                    $scope.pie_pay_end = data.pay_end;

                    if (data.status == "error") {
                        $rootScope.modalDanger();
                    } else {
                        $scope.pie_labels = data.lbl;
                        $scope.pie_data = data.ctr;
                        $scope.pie_colour = data.colour;
                        $scope.pie_sum = data.sum;
                        $scope.pie_href = data.href;
                        console.log(data);
                        $scope.pie_options = {
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
                                    padding: -50,
                                    fontStyle: 'italic',
                                    generateLabels: function (chart) {
                                        var bg = chart.data.datasets[0].backgroundColor
                                        var ele = "<ul class='legend-labels'>";
                                        chart.data.datasets[0].data.forEach(function (item, index) {
                                            var perc = ((item / $scope.divisor) * 100).toFixed(2);
                                            ele = ele + '<a href="' + $scope.pie_href[index] + '"><li class="plabels"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data[index] + '</span>  ' + $scope.pie_labels[index] + '</li></a>';
                                        });
                                        ele = ele + "</ul>";
                                        $(".legend-scale").html(ele);
                                        return chart.generateLegend();
                                    }
                                }
                            }
                        };
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

		
        $scope.notifications = function () {
            $scope.announcelist = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/notifications.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.noti = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.resolutions = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/resolution.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.reso = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }
        
        $scope.barchartdiv = function () {
            var ctx = document.getElementById("bar").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/yeartodate.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					$scope.data = {
						labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
						datasets: [{
							label: "Late",
							backgroundColor: "rgba(151,187,205,1)",
							data: data.late
						}, {
							label: "Undertime",
							backgroundColor: "red",
							data: data.ut
						}, {
							label: "Absent",
							backgroundColor: "green",
							data: data.absent
						},{
							label: "Overtime",
							backgroundColor: "yellow",
							data: data.ot
						},{
							label: "Leaves",
							backgroundColor: "orange",
							data: data.leaves1
						},{
							label: "Attendance Adjustment",
							backgroundColor: "lightblue",
							data: data.aa
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'bar',
						data: $scope.data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
        }
		
		$scope.uttop5 = function(){
			var ctx = document.getElementById("ut5").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/toput.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					
					var data = {
						labels: data.name,
						datasets: [{
							backgroundColor: "rgba(151,187,205,1)",
							data: data.data
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.lvtop5 = function(){
			var ctx = document.getElementById("lv5").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/toplv.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					
					var data = {
						labels: data.name,
						datasets: [{
							backgroundColor: "rgba(151,187,205,1)",
							data: data.data
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.ottop5 = function(){
			var ctx = document.getElementById("ot5").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/topot.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					
					var data = {
						labels: data.name,
						datasets: [{
							backgroundColor: "rgba(151,187,205,1)",
							data: data.data
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.aatop5 = function(){
			var ctx = document.getElementById("aa5").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/topaa.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					
					var data = {
						labels: data.name,
						datasets: [{
							backgroundColor: "rgba(151,187,205,1)",
							data: data.data
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.absenttop5 = function(){
			var ctx = document.getElementById("absent5").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/topabsent.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					
					var data = {
						labels: data.name,
						datasets: [{
							backgroundColor: "rgba(151,187,205,1)",
							data: data.data
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.latetop5 = function(){
			var ctx = document.getElementById("lates5").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/toplate.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					
					var data = {
						labels: data.name,
						datasets: [{
							backgroundColor: "rgba(151,187,205,1)",
							data: data.data
						}]
					};
					var myBarChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: data,
						options: {
							barValueSpacing: 20,
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
									}
								}]
							}
						}
					});
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
		}
		
        //Attendance Today
        $scope.myteam = function () {
			$scope.teamfilter='';
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'search': $scope.teamfilter,
            }
            $http.post(apiUrl + 'admin/mng/home/myteam.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.team = data;
                        $scope.length = $scope.team.length;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.announcement = function () {
            $scope.announcelist = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/announcement.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.announcelist = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.dashboard.setup();
    }]);
