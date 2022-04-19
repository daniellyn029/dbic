app.controller('MNGHomeController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager', '$templateRequest', '$sce',
function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager, $templateRequest, $sce) {

 

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/mng/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";
		$scope.today = new Date();
		$scope.date = new Date(); 
        $scope.search_leave_month ='1';
        $scope.search_year='';
        $scope.search_month='';
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
						$scope.dashboard.values.joblocation = data.joblocation;
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
		
		$scope.viewcontent = function (view) {
            // if (view == 'headcount') {
            //     var content = $sce.getTrustedResourceUrl('view/admin/hr/home/headcount.html');
            //     $templateRequest(content).then(function (template) {
            //         $compile($("#content").html(template).contents())($scope);
            //         $("#dtrangeLine").daterangepicker({
			// 			singleDatePicker	: false,
			// 			showDropdowns		: true,
			// 			minYear				: 1990,
			// 			maxYear				: moment().format('YYYY'),
			// 			startDate			: moment().format("MM/01/YYYY"),
			// 			endDate				: moment().format("MM/" + moment().daysInMonth() + "/YYYY") 
			// 		}, function(start, end, label) {
			// 			$scope.headcount_functions.total_range();
			// 		});
			// 		$scope.headcount_functions.total_range();
            //     });
            // }    
            if (view == 'leaves') {
                var content = $sce.getTrustedResourceUrl('view/admin/mng/home/leaves.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                });
            }
            if (view == 'overtime') {
                var content = $sce.getTrustedResourceUrl('view/admin/mng/home/overtime.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                    $("#dtrange_ot").daterangepicker();
                });
            }
            if (view == 'lates') {
                var content = $sce.getTrustedResourceUrl('view/admin/mng/home/lates.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                });
            }
		}
		
		//Filter Employee/ Managers Under
		$scope.filterAcct = function(acct){
			if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
				return acct.id != '0';
			}else{				
				return acct.idsuperior == $scope.dashboard.values.accountid;
			}
			
		}

		//Leaves
		$scope.getTotalLeaveYTD = function(){
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/leaves/totalLeaveYTD.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.totalemployeesLeaveYTD = data;

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });

        }

		$scope.barchartdivLeaveMonth = function () {
            var ctx = document.getElementById("bar23").getContext("2d");
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var date = new Date();

            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'search_leave_month' :$scope.search_leave_month,
            }
            $http.post(apiUrl + 'admin/mng/home/leaves/LeavebyMonth.php', urlData)
            .then(function (response, status) {
                var data = response.data;


                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
						labels: data.emps,						
                        datasets: [{
                            label: months[date.getMonth()],
                            backgroundColor: "#a4a0a0",
							data: data.countleaves
                        }],
                    
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'line',
                        data: $scope.data,
                        options: {
                            legend: {
                                display: false,
                                position:'bottom',
                                labels: {
                                    fontColor: 'black',
                                    
                                }
                            }
                        }
                    });
                }
            }, function (response) {
                $rootScope.modalDanger();
            });
		}
		
		$scope.totalEmpLeaves = function () {
            var urlData = {
                'accountid'  : $scope.dashboard.values.accountid,
                // 'deppt'      : $scope.department,
                'costcenter' : $scope.costcenter,
                'jobloc'     : $scope.jobloc                
            }
            $http.post(apiUrl + 'admin/mng/home/leaves/totalEmpLeaves.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
						$scope.totalemployeesEmpLeaves = data;
					// 	console.log($scope.totalemployeesEmpLeaves[0].getEmpjobLoc);
					// return;
					}
					
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

		$scope.piechartdivsLeaves = function () {
            $timeout(function () {
                $scope.pie_sum1 = 0;
                $scope.pie_labels1 = [];
                $scope.pie_data1 = [];
                $scope.pie_colour1 = [];
                $scope.pie_options1 = {};
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl + 'admin/mng/home/leaves/piechartLeave_VS.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else {
                            $scope.pie_labels1 = data.lbl;
                            $scope.pie_data1 = data.ctr;
                            $scope.pie_colour1 = data.colour;
                            $scope.pie_sum1 = data.sum;
                            $scope.pie_options1 = {
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
                                                ele = ele + '<li class="plabels1"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
            }, 1000);
        }

        //Overtime	
		$scope.getTotalYTD = function(){
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/overtime/totalYTD.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.totalemployeesYTD = data;

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });

        }

        $scope.barchartdivyear = function () {
            var ctx = document.getElementById("bar1").getContext("2d");
            var urlData = {
                'accountid'  : $scope.dashboard.values.accountid,
                'search_year' : $scope.search_year
            }
            
            $http.post(apiUrl + 'admin/mng/home/overtime/OTbyYEar.php', urlData)
            .then(function (response, status) {
                var data = response.data;

                $scope.yearss = data.yearss;
             
                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: new Date().getFullYear(),
                            backgroundColor: "#a4a0a0",
                            data: data.OTyear
                        }]
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'bar',
                        // responsive: false,
                        data: $scope.data,
                        options: {
                            legend: {
                                display: false,
                                position:'bottom',
                                labels: {
                                    fontColor: 'black',
                                    
                                }
                            }
                        }
                    });
                }
            }, function (response) {
                $rootScope.modalDanger();
            });
        }
		
        $scope.barchartdivmonth = function () {
            var ctx = document.getElementById("bar2").getContext("2d");
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var date = new Date();
            
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'search_month' :$scope.search_month,
            }
            $http.post(apiUrl + 'admin/mng/home/overtime/OTbyMonth.php', urlData)
            .then(function (response, status) {
                var data = response.data;
                
                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: data.emps,
                        datasets: [{
                            label: months[date.getMonth()],
                            backgroundColor: "#a4a0a0",
                            data: data.overtime
                        }],
                    
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'line',
                        data: $scope.data,
                        options: {
                            legend: {
                                display: false,
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
        
        $scope.piechartdivs = function () {
            $timeout(function () {
                $scope.pie_sum1 = 0;
                $scope.pie_labels1 = [];
                $scope.pie_data1 = [];
                $scope.pie_colour1 = [];
                $scope.pie_options1 = {};
           
                var data_r = $("#dtrange_ot").val().split(" - ");
           
                var urlData = {
                    'accountid'   : $scope.dashboard.values.accountid,
                    'search_date' : $("#dtrange_ot").val(),
                    'dateFrom'    : moment(data_r[0]).format('YYYY-MM-DD'),
                    'dateTo'      : moment(data_r[1]).format('YYYY-MM-DD')
                }
                

               
                $http.post(apiUrl + 'admin/mng/home/overtime/piechart_VS.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else {
                            $scope.pie_labels1 = data.lbl;
                            $scope.pie_data1   = data.ctr;
                            $scope.pie_colour1 = data.colour;
                            $scope.pie_sum1    = data.sum;
                            // $scope.pie_href = data.href;
                            $scope.pie_options1 = {
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
                                                ele = ele + '<li class="plabels1"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
            }, 1000);
        }

        $scope.barchartdivsOTbyTrans = function () {
            var ctx = document.getElementById("bar3").getContext("2d");
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/overtime/OTbyTrans.php', urlData)
            .then(function (response, status) {
                var data = response.data;
                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: "REGOT",
                            backgroundColor: "#44a3c0",
                            data: data.regot
                        }, {
                            label: "REGOT>8",
                            backgroundColor: "#c55a11",
                            data: data.regotg8
                        }, {
                            label: "SHWDOT",
                            backgroundColor: "#a4a0a0",
                            data: data.swhdot
                        },{
                            label: "SHWDOT>8",
                            backgroundColor: "#ffc000",
                            data: data.swhdotg8
                        },{
                            label: "LHWDOT",
                            backgroundColor: "#4472c4",
                            data: data.lhwdot
                        },{
                            label: "LHWDOT>8",
                            backgroundColor: "#70ad47",
                            data: data.lhwdotg8
                        },{
                            label: "RDOT",
                            backgroundColor: "#FF5733",
                            data: data.arr_rdot
                        },{
                            label: "RDOT>8",
                            backgroundColor: "#FFDD33",
                            data: data.arr_rdotg8
                        },{
                            label: "LHRDOT",
                            backgroundColor: "#3349FF",
                            data: data.arr_lhrdot
                        },{
                            label: "LHRDOT>8",
                            backgroundColor: "#7A33FF",
                            data: data.arr_lhrdotg8
                        },{
                            label: "SHRDOT",
                            backgroundColor: "#FF33F3",
                            data: data.arr_shrdot
                        },{
                            label: "SHRDOT>8",
                            backgroundColor: "#FF3342",
                            data: data.arr_shrdotg8
                        },{
                            label: "LSHOT",
                            backgroundColor: "#33FF39",
                            data: data.arr_lshot
                        },{
                            label: "LSHOT>8",
                            backgroundColor: "#FF8633",
                            data: data.arr_lshotg8
                        }]
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'bar',
                        data: $scope.data,
                        options: {
                            legend: {
                                display: true,
                                position:'top',
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

        $scope.totalempOT = function () {
            var urlData = {
                'accountid'  : $scope.dashboard.values.accountid,
                'deppt'      : $scope.department,
                'costcenter' : $scope.costcenter,
                'jobloc'     : $scope.jobloc
                
            }
            $http.post(apiUrl + 'admin/mng/home/overtime/totalempOT.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.totalemployeesOT = data;

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        //Lates
        $scope.getTotalMTD = function (){
            var ctx = document.getElementById("bar7").getContext("2d");
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/mng/home/tardiness/totalMTD.php', urlData)
            .then(function (response, status) {
                var data = response.data;

                $scope.totalMTD = data.getTotalsMTD;

                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: "LATES",
                            backgroundColor: "#FFA500",
                            data: data.late
                        }, {
                            label: "ABSENCES",
                            backgroundColor: "#44a3c0",
                            data: data.absent
                        }, {
                            label: "UNDERTIME",
                            backgroundColor: "#c55a11",
                            data: data.undertime
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
                        }
                    });
                }
            }, function (response) {
                $rootScope.modalDanger();
            });
        }

        $scope.getAbsences = function(){
            $timeout(function () {
                $scope.pie_sum1 = 0;
                $scope.pie_labels1 = [];
                $scope.pie_data1 = [];
                $scope.pie_colour1 = [];
                $scope.pie_options1 = {};
           
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                }
                
                $http.post(apiUrl + 'admin/mng/home/tardiness/byAbsences.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else {
                            $scope.pie_labels1 = data.lbl;
                            $scope.pie_data1 = data.ctr;
                            $scope.pie_colour1 = data.colour;
                            $scope.pie_sum1 = data.sum;
                            $scope.pie_options1 = {
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
                                                ele = ele + '<li class="plabels1"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
            }, 1000);
        }

        $scope.getLates = function(){
            $timeout(function () {
                $scope.pie_sum1 = 0;
                $scope.pie_labels1 = [];
                $scope.pie_data1 = [];
                $scope.pie_colour1 = [];
                $scope.pie_options1 = {};
           
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                }
                
                $http.post(apiUrl + 'admin/mng/home/tardiness/byLates.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else {
                            $scope.pie_labels1 = data.lbl;
                            $scope.pie_data1   = data.ctr;
                            $scope.pie_colour1 = data.colour;
                            $scope.pie_sum1    = data.sum;
                            $scope.pie_options1 = {
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
                                      
                                            var ele = "<ul class='legend-labels1'>";
                                            chart.data.datasets[0].data.forEach(function (item, index) {
                                                var perc = ((item / $scope.divisor) * 100).toFixed(2);
                                                ele = ele + '<li class="plabels1"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
            }, 1000);
        }


		$rootScope.getCompanyName();
		$scope.dashboard.setup();
		
}]);
