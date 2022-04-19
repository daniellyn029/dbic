app.controller('HRHomeController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager', '$templateRequest', '$sce', '$compile',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager, $templateRequest, $sce) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/hr/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";
		$scope.search_month='';
        $scope.search_year='';
		$scope.search_leave_month ='1';
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
                applications_data: [],
                bdates: [],
                dept_ctr: [],
                dept_choose: ''
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
						$scope.dashboard.values.department 	= data.departments;	
                        $scope.dashboard.values.joblocation = data.joblocation;
                        $scope.dashboard.values.daterange = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');

                        $("#picker1").daterangepicker({
                            startDate: moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY'),
                            endDate: moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY'),
                            locale: {
                                cancelLabel: 'Clear',
                                format: 'MM/DD/YYYY'
                            }
                        });
                        $("#picker1").on('apply.daterangepicker', function (ev, picker) {
                            $timeout(function () {
                                $scope.attendance_counter();
                                $scope.dept_attendance_ctr();
                                //$scope.applications_functions();
                                return;
                            }, 100);
                        });
                        $("#picker1").on('cancel.daterangepicker', function (ev, picker) {
                            $timeout(function () {
                                var dateText = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');
                                $("#picker1").val(dateText);
                                $scope.dashboard.values.daterange = dateText;
                                $scope.attendance_counter();
                                $scope.dept_attendance_ctr();
                                //$scope.applications_functions();
                                return;
                            }, 100);

                        });
                        $scope.attendance_counter();
                        $scope.birthdate_update();
                        $scope.dept_attendance_ctr();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }
		
		$scope.getTotalYTD = function(){
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/totalYTD.php', urlData)
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
                'accountid': $scope.dashboard.values.accountid,
                'search_year': $scope.search_year
            }
            
            $http.post(apiUrl + 'admin/hr/home/OTbyYEar.php', urlData)
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
                        // options: {
                        //     barValueSpacing: 20,
                        //     scales: {
                        //     	yAxes: [{
                        //     		ticks: {
                        //     			min: 0,
                        //     		}
                        //     	}]
                        //     }
                        // }
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
            $http.post(apiUrl + 'admin/hr/home/OTbyMonth.php', urlData)
            .then(function (response, status) {
                var data = response.data;
                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: data.depts,
                        datasets: [{
                            label: months[date.getMonth()],
                            backgroundColor: "#a4a0a0",
                            data: data.leaves
                        }],
                    
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'bar',
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
                    'accountid': $scope.dashboard.values.accountid,
                    'search_date' : $("#dtrange_ot").val(),
                    'dateFrom'  : moment(data_r[0]).format('YYYY-MM-DD'),
                    'dateTo'    : moment(data_r[1]).format('YYYY-MM-DD')
                }
                

               
                $http.post(apiUrl + 'admin/hr/home/piechart_VS.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;

                        // $scope.pie_pay_start = data.pay_start;
                        // $scope.pie_pay_end = data.pay_end;

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else {
                            $scope.pie_labels1 = data.lbl;
                            $scope.pie_data1 = data.ctr;
                            $scope.pie_colour1 = data.colour;
                            $scope.pie_sum1 = data.sum;
                            // $scope.pie_href = data.href;
                            // console.log(data);
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
                                                ele = ele + '<li class="plabels"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
            $http.post(apiUrl + 'admin/hr/home/OTbyTrans.php', urlData)
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
        
        $scope.barchartdivot = function () {
            var ctx = document.getElementById("bar1").getContext("2d");
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/OTbyYEar.php', urlData)
            .then(function (response, status) {
                var data = response.data;
                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: "OT",
                            backgroundColor: "#a4a0a0",
                            data: data.leaves
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
        
        $scope.totalempOT = function () {
            var urlData = {
                'accountid'  : $scope.dashboard.values.accountid,
                'deppt'      : $scope.department,
                'costcenter' : $scope.costcenter,
                'jobloc'     : $scope.jobloc
                
            }
            $http.post(apiUrl + 'admin/hr/home/totalempOT.php', urlData)
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
		
		$scope.getTotalLeaveYTD = function(){
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/leaves/totalLeaveYTD.php', urlData)
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

        $scope.headcount_functions_leave = function (){
            var ctx = document.getElementById("hbmLine23").getContext("2d");

            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
            }
            $http.post(apiUrl + 'admin/hr/home/leaves/rangeCountLeave.php', urlData)
            .then(function (response, status) {

                var data = response.data;

                var config = {
                    type: 'line',
                    data: {
                        labels: data.lbl,
                        datasets: [{
                            backgroundColor: 'rgb(255, 159, 64)',
                            borderColor: 'rgb(255, 159, 64)',
                            lineTension: 0,
                            data: data.data,
                            fill: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Department'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Value'
                                }
                            }]
                        }
                    }
                };
                var myLineChart = new Chart(ctx, config);
                    

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
            $http.post(apiUrl + 'admin/hr/home/leaves/LeavebyMonth.php', urlData)
            .then(function (response, status) {
                var data = response.data;


                if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else{
                    $scope.data = {
                        labels: data.depts,
                        datasets: [{
                            label: months[date.getMonth()],
                            backgroundColor: "#a4a0a0",
                            data: data.leaves
                        }],
                    
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'bar',
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
                'deppt'      : $scope.department,
                'costcenter' : $scope.costcenter,
                'jobloc'     : $scope.jobloc                
            }
            $http.post(apiUrl + 'admin/hr/home/leaves/totalEmpLeaves.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.totalemployeesEmpLeaves = data;
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
                $http.post(apiUrl + 'admin/hr/home/leaves/piechartLeave_VS.php', urlData)
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
                                                ele = ele + '<li class="plabels"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
		
		$scope.headcount_functions = {
			values: {
				totalhc		: 0,
				rangetot	: 0,
				datecurr	: moment().format('YYYY-MM-DD'),
				range		: ''
			},
			total_emp: function(){
				var urlData = {
                    'accountid'	: $scope.dashboard.values.accountid,
					'hdate'		: moment().format('YYYY-MM-DD')
                }
                $http.post(apiUrl + 'admin/hr/home/headcount/headcount.php', urlData)
				.then(function (response, status) {
					var data = response.data;
					$scope.headcount_functions.values.totalhc = data.total;
				}, function (response) {
					$rootScope.modalDanger();
				});
			},
			total_range: function(){
				var ctx = document.getElementById("hbmLine").getContext("2d");
				var startDate = $('#dtrangeLine').data('daterangepicker').startDate._d;
				var endDate = $('#dtrangeLine').data('daterangepicker').endDate._d;
				var urlData = {
					'accountid'	: $scope.dashboard.values.accountid,
					'dfrom'		: moment(startDate).format('YYYY-MM-DD'),
					'dto'		: moment(endDate).format('YYYY-MM-DD')
				}
				$http.post(apiUrl + 'admin/hr/home/headcount/rangecount.php', urlData)
				.then(function (response, status) {
					var data = response.data;
					$scope.headcount_functions.values.rangetot = data.total;
					var config = {
						type: 'line',
						data: {
							labels: data.lbl,
							datasets: [{
							  backgroundColor: 'rgb(255, 159, 64)',
							  borderColor: 'rgb(255, 159, 64)',
							  lineTension: 0,
							  data: data.data,
							  fill: false,
							}]
						},
						options: {
							responsive: true,
							scales: {
								xAxes: [{
									display: true,
									scaleLabel: {
										display: true,
										labelString: 'Department'
									}
								}],
								yAxes: [{
									display: true,
									scaleLabel: {
										display: true,
										labelString: 'Value'
									}
								}]
							}
						}
					};
					var myLineChart = new Chart(ctx, config);
					
				}, function (response) {
					$rootScope.modalDanger();
				});
			}
		}
		
        $scope.attendance_counter = function () {
            var dateRange = $scope.dashboard.values.daterange.split("-");
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'start_date': moment(dateRange[0]).format('YYYY-MM-DD'),
                'end_date': moment(dateRange[1]).format('YYYY-MM-DD')
            }
            $http.post(apiUrl + 'admin/hr/home/counter1.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.divisor = 0;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.divisor = (data.dayz * data.staff);
                        $scope.pie_labels = ["PRESENT", "ABSENT", "LATE", "VL", "SL", "LWOP"];
                        $scope.pie_data = [];
                        $timeout(function () {
                            $scope.pie_data = [data.present_ctr, data.absent_ctr, data.lte_ctr, data.vl_ctr, data.sl_ctr, data.lwop_ctr];
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
                                        padding: 5,
                                        fontStyle: 'italic',
                                        generateLabels: function (chart) {
                                            var bg = chart.data.datasets[0].backgroundColor
                                            var ele = "<ul class='legend-labels'>";
                                            chart.data.datasets[0].data.forEach(function (item, index) {
                                                var perc = ((item / $scope.divisor) * 100).toFixed(2);
                                                ele = ele + '<li><span style="font-weight:900;background-color:' + bg[index] + '">' + perc + '% </span>' + $scope.pie_labels[index] + '</li>';
                                            });
                                            ele = ele + "</ul>";
                                            $(".legend-scale").html(ele);
                                            return chart.generateLegend();
                                        }
                                    }
                                }
                            };
                        }, 100);
                        $timeout(function () {
                            $("#staff_data").text('' + data.staff);
                            $(".counter-count_set1").each(function () {
                                $(this).prop('Counter', 0).animate({
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
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }


        $scope.birthdate_update = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/birthdates.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.birthdays = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.dept_attendance_ctr = function () {
            var dateRange = $scope.dashboard.values.daterange.split("-");
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'start_date': moment(dateRange[0]).format('YYYY-MM-DD'),
                'end_date': moment(dateRange[1]).format('YYYY-MM-DD')
            }
            $http.post(apiUrl + 'admin/hr/home/counter2.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.dashboard.values.dept_ctr = [];
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.dashboard.values.dept_ctr = data;
                        $timeout(function () {
                            $("#row_" + data[0].idunit).click();
                        }, 100);
                        $scope.dept_chart(data[0]);
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.dept_chart = function (obj) {
            $scope.dashboard.values.dept_choose = obj.unit;
            $scope.bar_data = [];
            $scope.bar_labels = ['Present', 'Absent', 'Late', 'VL', 'SL', 'LWOP'];
            $scope.bar_data = [obj.present_ctr, obj.absent_ctr, obj.lte_ctr, obj.vl_ctr, obj.sl_ctr, obj.lwop_ctr];
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

        $scope.viewcontent = function (view) {
            if (view == 'headcount') {
                var content = $sce.getTrustedResourceUrl('view/admin/hr/home/headcount.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                    $("#dtrangeLine").daterangepicker({
						singleDatePicker	: false,
						showDropdowns		: true,
						minYear				: 1990,
						maxYear				: moment().format('YYYY'),
						startDate			: moment().format("MM/01/YYYY"),
						endDate				: moment().format("MM/" + moment().daysInMonth() + "/YYYY") 
					}, function(start, end, label) {
						$scope.headcount_functions.total_range();
					});
					$scope.headcount_functions.total_range();
                });
            }
            if (view == 'ovetime') {
                var content = $sce.getTrustedResourceUrl('view/admin/hr/home/overtime.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                    $("#dtrange_ot").daterangepicker();
                });
            }
            if (view == 'leaves') {
                var content = $sce.getTrustedResourceUrl('view/admin/hr/home/leaves.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                });
            }
            if (view == 'lates') {
                var content = $sce.getTrustedResourceUrl('view/admin/hr/home/lates.html');
                $templateRequest(content).then(function (template) {
                    $compile($("#content").html(template).contents())($scope);
                });
            }
        }
        $scope.today = new Date();

        $scope.headcountbymonth = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/headcount/department.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.hcdeparment = data;

                        $scope.chart = document.getElementById("hbm").getContext("2d");
                        $scope.data = {
                            labels: ["Jan", "Feb", "March"],

                            datasets: [{
                                label: "Jan",

                                borderColor: 'rgba(255, 99, 132, 1)',
                                data: [1, 6]
                            }, {
                                label: "Feb",

                                borderColor: 'rgba(255, 99, 132, 1)',
                                data: [4, 6]
                            }
                                , {
                                label: "Mar",

                                borderColor: 'rgba(255, 99, 132, 1)',
                                data: [6, 6]
                            }
                            ]
                        };

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });


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

        $scope.announcement = function () {
            $scope.announcelist = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/announcement.php', urlData)
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

        $scope.notifications = function () {
            $scope.announcelist = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/notifications.php', urlData)
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

        $scope.applicants = function () {
            $scope.announcelist = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/applicants.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.appli = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }


        $scope.viewfile = function (id) {
            var file = id;
            window.location = '/dbic/assets/php/admin/org/activity/file/download.php?file=' + file;
        }

        $scope.changeRequest = function(){
            $scope.changeRequestList = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/changeRequest.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.changeRequestList = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.viewCr = function (id){
            $scope.viewChangeReq = [];
            var urlData = {
                'id': id
            }
            $http.post(apiUrl + 'admin/hr/home/viewChangeRequest.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.viewChangeReq = data[0];
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.aprroved = function (id) {

            var urlData = {
                'accountid'     : $scope.dashboard.values.accountid,
                'approve'       : $scope.viewChangeReq,
                'id'            : id,
                'view'          : $scope.view
            }
            console.log(urlData);
            $http.post(apiUrl + 'admin/hr/home/approvedChangeReq.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    $scope.isSaving = false;
                    
                    if( data.status == "error" ){
                        $rootScope.modalDanger();
                        return;
                    }else{
						$("#myModal").modal("hide");
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Success!";
                        $rootScope.dymodalmsg  = "Approved successfully";
                        $rootScope.dymodalstyle = "btn-success";
                        $rootScope.dymodalicon = "fa fa-check";				
                        $("#dymodal").modal("show");
						$scope.changeRequest();
                    }	
                    			
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.disaprroved = function (id) {
            var urlData = {
                'accountid'     : $scope.dashboard.values.accountid,
                'approve'       : $scope.viewChangeReq,
                'id'            : id
            }
            console.log(urlData);
            $http.post(apiUrl + 'admin/hr/home/disapprovedChangeReq.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    $scope.isSaving = false;
                    
                    if( data.status == "error" ){
                        $rootScope.modalDanger();
                        return;
                    }else{
						$("#myModal").modal("hide");
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Success!";
                        $rootScope.dymodalmsg  = "Disapproved successfully";
                        $rootScope.dymodalstyle = "btn-success";
                        $rootScope.dymodalicon = "fa fa-check";				
                        $("#dymodal").modal("show");
						$scope.changeRequest();
                    }	
                    			
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

		$scope.getTotalMTD = function (){
            var ctx = document.getElementById("bar7").getContext("2d");
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/hr/home/tardiness/totalMTD.php', urlData)
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

        $scope.getAbsencesbyDept = function(){
            $timeout(function () {
                $scope.pie_sum1 = 0;
                $scope.pie_labels1 = [];
                $scope.pie_data1 = [];
                $scope.pie_colour1 = [];
                $scope.pie_options1 = {};
           
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                }
                
                $http.post(apiUrl + 'admin/hr/home/tardiness/byDept.php', urlData)
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
                                                ele = ele + '<li class="plabels"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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

        $scope.getLatesbyDept = function(){
            $timeout(function () {
                $scope.pie_sum1 = 0;
                $scope.pie_labels1 = [];
                $scope.pie_data1 = [];
                $scope.pie_colour1 = [];
                $scope.pie_options1 = {};
           
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                }
                
                $http.post(apiUrl + 'admin/hr/home/tardiness/byDeptLates.php', urlData)
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
                                      
                                            var ele = "<ul class='legend-labels1'>";
                                            chart.data.datasets[0].data.forEach(function (item, index) {
                                                var perc = ((item / $scope.divisor) * 100).toFixed(2);
                                                ele = ele + '<li class="plabels"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data1[index] + '</span>  ' + $scope.pie_labels1[index] + '</li></a>';
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
        $scope.dashboard.setup();
    }]);
