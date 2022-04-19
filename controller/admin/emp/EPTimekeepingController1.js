app.controller('EPTimekeepingController', ['$scope', '$compile', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $compile, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/emp/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";

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
                daterange: ''

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

        $scope.piechartdiv = function ( date ) {
			$scope.pie_sum		= 0;
			$scope.pie_labels 	= [];
			$scope.pie_data 	= [];
			$scope.pie_colour	= [];
			$scope.pie_options	= {};
			var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'date': date
            }
            $http.post(apiUrl + 'admin/emp/timesheet/caleave.php', urlData)
			.then(function (response, status) {
				var data = response.data;
				
				if( data.status == "error" ){
					$rootScope.modalDanger();
				}else{
					$scope.pie_labels = data.lbl;
					$scope.pie_data   = data.ctr;
					$scope.pie_colour = data.colour;
					$scope.pie_sum	  = data.sum;
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
										ele = ele + '<li class="plabels"><span class="boxl" style="background-color:' + bg[index] + ';color:white">' + $scope.pie_data[index] + '</span>  ' + $scope.pie_labels[index] + '</li>';
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

        $scope.barchartdiv = function () {
            var ctx = document.getElementById("bar").getContext("2d");
			var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/emp/timesheet/caltardy.php', urlData)
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

        $scope.cancelapp = function () {
            var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
            var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
            $scope.timekeepingapplications(newdate);
        }
        $scope.overtimecount = 0;
        $scope.attendancecount = 0;
        $scope.changeshiftcount = 0;
        $scope.obcount = 0;

        $scope.timekeepingapplications = function (date) {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'date': date
            }
            $http.post(apiUrl + 'admin/tk/app/timekeeping/events.php', urlData)
                .then(function (response, status) {
                    $('#calendartimekeeping').fullCalendar('removeEvents');
                    $('#calendartimekeeping').fullCalendar('addEventSource', response.data);
                    $('#calendarleave').fullCalendar('rerenderEvents');
                });
        };

        $scope.shifts = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/tk/app/shift/shifts.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.shiftlist = data;

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.timekeepingcalendarOptions = {
            header: {
                left: ' today prev,next title',
                center: '',
                right: ''
            },
            selectable: true,
            eventLimit: true,
            eventLimitText: 'Plan',
            editable: true,
            droppable: true,
            eventResizableFromStart: false,
            eventReceive: function (event, delta, revertFunc, jsEvent, ui, view) {
                $scope.isSaving2 = true;
                $scope.$digest();
                var id = event.id;

                if (event.type == 'attendance') {
                    var d = new Date();

                    if (event.start > d.setDate(d.getDate())) {
                        $("#calendartimekeeping").fullCalendar('removeEvents', id);
                        $.notify("Can't apply in advance ", "error");

                        $scope.overtimecount = 0;
                        $scope.attendancecount = 0;
                        $scope.changeshiftcount = 0;
                        $scope.obcount = 0;
                    } else {
                        $('#modal-attendance').modal('show');
                        var disdate = new Date(event.start);

                        $("#attendance_end").datepicker({
                            minDate: disdate,
                            maxDate: new Date(),
                            dateFormat: 'yy-mm-dd'
                        });
                        $("#attendance_start").datepicker({
                            maxDate: new Date(),
                            dateFormat: 'yy-mm-dd'
                        });
                        $('#attendance_start').datepicker("setDate", disdate);
                        $('#attendance_end').datepicker("setDate", disdate);

                        $('#attendance_start').change(function () {
                            disdate = new Date($(this).val());
                            $('#attendance_end').datepicker('destroy');
                            $("#attendance_end").datepicker({
                                minDate: disdate,
                                maxDate: new Date(),
                                dateFormat: 'yy-mm-dd'
                            });
                        });
                    }
                } else if (event.type == 'overtime') {
                    var d = new Date();
                    var d2 = new Date();
                    var x = 1;

                    if (event.start > d.setDate(d.getDate() + 1)) {
                        $("#calendartimekeeping").fullCalendar('removeEvents', id);
                        $.notify("Can't apply in advance ", "error");

                        $scope.overtimecount = 0;
                        $scope.attendancecount = 0;
                        $scope.changeshiftcount = 0;
                        $scope.obcount = 0;
                    } else if (event.start < d2.setDate(d2.getDate() - 1)) {
                        $("#calendartimekeeping").fullCalendar('removeEvents', id);
                        $.notify("Late application for overtime unavailable ", "error");

                        $scope.overtimecount = 0;
                        $scope.attendancecount = 0;
                        $scope.changeshiftcount = 0;
                        $scope.obcount = 0;
                    } else {
                        $('#modal-overtime').modal('show');
                        var disdate = new Date(event.start);

                        var urlData = {
                            'accountid': $scope.dashboard.values.accountid,
                            'info': disdate
                        }
                        $http.post(apiUrl + 'admin/tk/app/overtime/forapplication.php', urlData)
                            .then(function (response, status) {
                                var str = response.data;
                                res = str.slice(0, -3);
                                $('#ot_start').val(res);
                            });


                        $("#ot_dstart").datepicker({
                            minDate: disdate,
                            maxDate: d,
                            dateFormat: 'yy-mm-dd'
                        });
                        $('#ot_dstart').datepicker("setDate", disdate);
                        $('#ot_dend').datepicker("setDate", disdate);

                        $("#ot_dend").datepicker({
                            minDate: disdate,
                            maxDate: d,
                            dateFormat: 'yy-mm-dd'
                        });
                        $('#ot_dstart').change(function () {
                            disdate = new Date($(this).val());
                            $('#ot_dend').datepicker('destroy');
                            $("#ot_dend").datepicker({
                                minDate: disdate,
                                maxDate: d,
                                dateFormat: 'yy-mm-dd'
                            });
                        });
                    }
                } else if (event.type == 'changeshift') {
                    var d = new Date();
                    if (event.start < d.setDate(d.getDate() - 1)) {
                        $("#calendartimekeeping").fullCalendar('removeEvents', id);
                        $.notify("Late application for changeshift unavailable ", "error");

                        $scope.overtimecount = 0;
                        $scope.attendancecount = 0;
                        $scope.changeshiftcount = 0;
                        $scope.obcount = 0;
                    } else {
                        $('#modal-changeshift').modal('show');
                        $scope.shifts();
                        var disdate = new Date(event.start);

                        $("#shift_start").datepicker({
                            minDate: disdate,
                            dateFormat: 'yy-mm-dd'
                        });
                        $("#shift_end").datepicker({
                            minDate: disdate,
                            dateFormat: 'yy-mm-dd'
                        });

                        $('#shift_start').datepicker("setDate", disdate);
                        $('#shift_end').datepicker("setDate", disdate);



                        $('#shift_start').change(function () {
                            disdate = new Date($(this).val());
                            $('#shift_end').datepicker('destroy');
                            $("#shift_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });
                        });
                    }
                } else {
                    $("#calendartimekeeping").fullCalendar('removeEvents', id);
                    $scope.overtimecount = 0;
                    $scope.attendancecount = 0;
                    $scope.changeshiftcount = 0;
                    $scope.obcount = 0;
                }
            },
            eventMouseover: function (event, delta, revertFunc, jsEvent, ui, view) {
                if (event.application == 'overtime') {
                    var tooltip = `<div class="fc-popover fc-more-popover text-center" style="padding: 10px;position:absolute;z-index:10001;background:` + event.backgroundColor + `; color:white;">
                                        <p style="margin : 0px">` + event.title + `</p>
                                        <p style="margin : 0px">` + tConvert(event.startt) + ` - ` + tConvert(event.endt) + `</p>
                                    </div>`;
                } else {
                    var tooltip = `<div class="fc-popover fc-more-popover text-center" style="padding: 10px;position:absolute;z-index:10001;background:` + event.backgroundColor + `; color:white;">
                                    <p style="margin : 0px">` + event.title + `</p>
                                </div>`;
                }
                var $tooltip = $(tooltip).appendTo('body');

                $(this).mouseover(function (e) {
                    $(this).css('z-index', 10000);
                    $tooltip.fadeIn('500');
                    $tooltip.fadeTo('10', 1.9);
                }).mousemove(function (e) {
                    $tooltip.css('top', e.pageY + 20);
                    $tooltip.css('left', e.pageX - 50);
                });
            },
            eventMouseout: function (event, delta, revertFunc, jsEvent, ui, view) {
                $(this).css('z-index', 8);
                $('.fc-popover').remove();
            },
            eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
            },
            eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                revertFunc();
            },
            eventClick: function (event, delta, revertFunc, jsEvent, ui, view) {
            },

            eventDragStop: function (event, jsEvent) {
                var trashEl = jQuery('#trash');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);

                if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {

                    var urlData = {
                        'id': event.ids,
                        'accountid': $scope.dashboard.values.accountid,
                        'type': event.application
                    }
                    alert(JSON.stringify(urlData));

                    if (event.status == "PENDING") {
                        $http.post(apiUrl + 'admin/tk/app/timekeeping/cancelapplication.php', urlData)
                            .then(function (response, status) {
                                var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
                                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                                $scope.timekeepingapplications(newdate);
                                $.notify(event.title + " successfully Cancelled", "success");
                            }, function (response) {
                                $rootScope.modalDanger();
                            });
                    } else if (event.status == "APPROVED" || event.status == "DECLINED") {
                        $.notify("Cannot cancel " + event.status + " " + event.title, "error");
                    } else {
                        var id = event.id;
                        $.notify(event.title + " successfully cancelled", "error");
                        $("#calendartimekeeping").fullCalendar('removeEvents', id);
                    }



                }

            },
            eventRender: function (event, element) {
                if (event.application == 'overtime') {
                    $scope.overtimecount++;
                }
                if (event.application == 'attendance') {
                    $scope.attendancecount++;
                }
                if (event.application == 'changeshift') {
                    $scope.changeshiftcount++;
                }
                if (event.application == 'ob') {
                    $scope.obcount++;
                }

                if (event.status == "PENDING") {
                    element.find('.fc-title').before('<div id="bloc1" class="dot3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');
                }
                if (event.status == "DECLINED") {
                    element.find('.fc-title').before('<div id="bloc1" class="dot2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');
                }
                if (event.status == "APPROVED") {
                    element.find('.fc-title').before('<div id="bloc1" class="dot">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');
                }


            },
        };

        $scope.generateattendanceTbl = function () {
            $scope.addaa = {};
            $scope.isSaving2 = false;
            var urlData = {
                'acct': $scope.dashboard.values.accountid,
                'from': $('#attendance_start').val(),
                'to': $('#attendance_end').val()
            }
            $http.post(apiUrl + 'admin/tk/app/adjustment/add_dates.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.addaa.leave_dates = data;
                    $scope.isSaving = true;
                    $scope.addaa.acct = $scope.dashboard.values.accountid;
                    $scope.addaa.datefrom = $('#attendance_start').val();
                    $scope.addaa.dateto = $('#attendance_end').val();

                }, function (response) {
                    $rootScope.modalDanger();
                });
        }
        $scope.calcLeavehrs = function (hrs, id, ndex) {
            $scope.addaa.leave_dates[ndex]['drop'].forEach(function (item, index) {
                if (item.id == id) {
                    if (hrs == 8) {
                        $scope.addaa.leave_dates[ndex]['hrs'] = hrs - item.hr;
                    } else if (hrs == 4) {
                        $scope.addaa.leave_dates[ndex]['hrs'] = item.hr;
                    }
                }
            });
        }
        $scope.resetCreateattendanceAcct = function () {
            $scope.isSaving = false;
            $scope.addaa = {};
            $scope.cancelapp();
        }

        $scope.generatechangeshiftTbl = function () {
            $scope.addcs = {};
            var urlData = {
                'acct': $scope.dashboard.values.accountid,
                'from': $('#shift_start').val(),
                'to': $('#shift_end').val()
            }
            $http.post(apiUrl + 'admin/tk/app/shift/add_dates.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    $scope.isSaving = false;
                    $scope.isSaving2 = false;
                    $scope.addcs.acct = $scope.dashboard.values.accountid;
                    $scope.addcs.datefrom = $('#shift_start').val();
                    $scope.addcs.dateto = $('#shift_end').val();
                    $scope.addcs.shift_dates = data;
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }
        $scope.changeshiftid = function (index) {
            $scope.addcs.shift_dates[index]['newshiftid'] = $scope.addcs.newshift[index];
        }
        $scope.resetCreatechangeshiftAcct = function () {
            $scope.isSaving = false;
            $scope.addcs = {};
            $scope.cancelapp();
        }


        $scope.addAdj = function (file) {
            var r = confirm("Are you sure you want to create requests?");
            if (r == true) {
                if ($scope.addaa.leave_dates.length > 0) {
                    if (file != null && file.length != 0) {
                        for (var key in file) {
                            if (file[key]['size'] > 2097152) {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "Each file must be lesser than 2MB";
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                                return;
                            }
                        }
                    }

                    spinnerService.show('form01spinner');
                    $scope.isSaving = true;

                    Upload.upload({
                        url: apiUrl + 'admin/tk/app/adjustment/create.php',
                        method: 'POST',
                        file: file,
                        data: {
                            'accountid': $scope.dashboard.values.accountid,
                            'info': $scope.addaa,
                            'targetPath': '../../../admin/tk/app/adjustment/file/'
                        }
                    }).then(function (response) {
                        var data = response.data;
                        $scope.isSaving = false;
                        spinnerService.hide('form01spinner');

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else if (data.status == "notloggedin") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "You are not logged in";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "acct") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify employee";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "datefrom") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Date From";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "dateto") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Date To";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "invdate") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Dates entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == 'error-upload-type') {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Only png, jpg, pdf, and jpeg files are accepted";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);
                            $("#modal-attendance").modal("hide");
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $("#modal-attendance").modal("hide");

                            if (data.reject.length == 0) {
                                $rootScope.dymodalmsg = "Attendance Adjustment created successfully";
                            } else {
                                var msg = "Below request(s) are not applied<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> REASON </th> </tr></thead> <tbody>";
                                var trow = "";
                                data.reject.forEach(function (item, index) {
                                    trow = trow + "<tr><td>" + item.date + "</td><td>" + item.msg + "</td></tr>";
                                });
                                trow = trow + "</tbody></table>";
                                $rootScope.dymodalmsg = msg + trow;
                            }

                            var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
                            var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                            $scope.timekeepingapplications(newdate);

                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");

                        }

                    }, function (response) {
                        if (response.status > 0) {
                            $rootScope.modalDanger();
                        }
                    });
                } else {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "Please generate leave dates";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }
            }
        }

        $scope.addChangeshift = function (file) {
            var r = confirm("Are you sure you want to create requests?");
            if (r == true) {
                if ($scope.addcs.shift_dates.length > 0) {
                    if (file != null && file.length != 0) {
                        for (var key in file) {
                            if (file[key]['size'] > 2097152) {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "Each file must be lesser than 2MB";
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                                return;
                            }
                        }
                    }

                    spinnerService.show('form01spinner');
                    $scope.isSaving = true;
                    console.log($scope.addcs);
                    Upload.upload({
                        url: apiUrl + 'admin/tk/app/shift/create.php',
                        method: 'POST',
                        file: file,
                        data: {
                            'accountid': $scope.dashboard.values.accountid,
                            'info': $scope.addcs,
                            'targetPath': '../../../admin/tk/app/shift/file/'
                        }
                    }).then(function (response) {
                        var data = response.data;
                        $scope.isSaving = false;
                        spinnerService.hide('form01spinner');

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else if (data.status == "notloggedin") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "You are not logged in";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "acct") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify employee";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "datefrom") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Date From";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "dateto") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Date To";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "invdate") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Dates entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == 'error-upload-type') {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Only png, jpg, pdf, and jpeg files are accepted";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);
                            $("#modal-attendance").modal("hide");
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";

                            $("#modal-changeshift").modal("hide");
                            var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
                            var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                            $scope.timekeepingapplications(newdate);

                            if (data.reject.length == 0) {
                                $rootScope.dymodalmsg = "Attendance Adjustment created successfully";
                            } else {
                                var msg = "Below request(s) are not applied<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> REASON </th> </tr></thead> <tbody>";
                                var trow = "";
                                data.reject.forEach(function (item, index) {
                                    trow = trow + "<tr><td>" + item.date + "</td><td>" + item.msg + "</td></tr>";
                                });
                                trow = trow + "</tbody></table>";
                                $rootScope.dymodalmsg = msg + trow;
                            }

                            var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
                            var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                            $scope.timekeepingapplications(newdate);

                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                        }

                    }, function (response) {
                        if (response.status > 0) {
                            $rootScope.modalDanger();
                        }
                    });
                } else {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "Please generate leave dates";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }
            }
        }


        $scope.addOt = function () {
            if ($('#ot_remarks').val() || $('#ot_end').val()) {
                spinnerService.show('form01spinner');
                $scope.isSaving = true;
                $scope.add.otsdate = $('#ot_dstart').val();
                $scope.add.start_time = $('#ot_start').val();

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.add
                }
                console.log(urlData);
                $http.post(apiUrl + 'admin/tk/app/overtime/create.php', urlData)
                    .then(function (response, status) {
                        $scope.isSaving = false;
                        spinnerService.hide('form01spinner');
                        var data = response.data;
                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else if (data.status == "notloggedin") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "You are not logged in";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "acct") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify employee";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "shiftdate") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Shift Date";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "startdate") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Start Date";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "enddate") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify End Date";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "starttime") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Start Time";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "endtime") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify End Time";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "invdate") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Start/End Dates entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "invtime") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = data.msg;
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "plantime") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = data.msg;
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err1") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = data.msg;
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
                            var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                            $scope.timekeepingapplications(newdate);

                            $("#modal-overtime").modal("hide");
                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);
                            $("#modal-add").modal("hide");
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "Overtime created successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            } else {
                $.notify("Please spicify remarks", "error");
            }
        }
        $scope.timekeepings = function (date) {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'date': date
            }
            $http.post(apiUrl + 'admin/tk/app/timekeeping/timekeepings.php', urlData)
                .then(function (response, status) {
                    $('#calendartimesheet').fullCalendar('removeEvents');
                    $('#calendartimesheet').fullCalendar('addEventSource', response.data);
                    $('#calendartimesheet').fullCalendar('rerenderEvents');
					$scope.piechartdiv(date);
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.calendarOptionstimekeeping = {
            header: {
                left: ' today prev,next title',
                center: '',
                right: ''
            },
            selectable: true,
            eventLimit: true,
            eventLimitText: 'events',
            editable: false,
            droppable: false,
            eventResizableFromStart: false,
            eventClick: function (event, delta, revertFunc, jsEvent, ui, view) {
                var date = event.start;
                window.location.href = "#/admin/emp/timesheet?date=" + moment(date).format('YYYY-MM-DD');
            },
            eventOrder: function (eventA, eventB) {
                return (eventA.miscProps.sort < eventB.miscProps.sort) ? -1 : 1;
            },
			eventMouseover: function (event, delta, revertFunc, jsEvent, ui, view) {},
			eventMouseout: function (event, delta, revertFunc, jsEvent, ui, view) {}
        }


        $(document).ready(function () {
            $('.fc-left').unbind().on('click', '.fc-button', function () {
                $scope.overtimecount = 0;
                $scope.attendancecount = 0;
                $scope.changeshiftcount = 0;
                $scope.obcount = 0;

                var date = new Date($('#calendartimekeeping').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.timekeepingapplications(newdate);

                var date = new Date($('#calendartimesheet').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.timekeepings(newdate);
            });
			
			$('.fc-today-button').click(function(){
				$scope.overtimecount = 0;
                $scope.attendancecount = 0;
                $scope.changeshiftcount = 0;
                $scope.obcount = 0;
                var date = new Date($('#calendarleave').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.timekeepingapplications(newdate);
                var date = new Date($('#calendartimesheet').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
				$scope.timekeepings(newdate);
			});

            $(".fc-right").html(`<i id="trash" class="fa fa-trash danger " style="font-size: 40px; color: red;" aria-hidden="true"></i>`);

            $('.tld').unbind().on('mouseover', ".dl", function () {
                $('.dl').draggable({
                    revert: true,
                    helper: 'clone',
                    start: function (e, ui) {

                        $('.fc-day').droppable({
                            over: function () {
                                $('.ui-draggable-dragging').removeClass('btn-block');
                                $('.ui-draggable-dragging').addClass('dw');
                            },

                            out: function () {
                                $('.ui-draggable-dragging').removeClass('dw');
                                $('.ui-draggable-dragging').addClass('btn-block');
                            }
                        });
                    }
                });
            });
			$("#tardylbl").text(
				moment().format('YYYY') + ' Tardiness / Absenteeism'
			);
        });
        function tConvert(time) {

            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) {
                time = time.slice(1);
                time[5] = +time[0] < 12 ? 'AM' : 'PM';
                time[0] = +time[0] % 12 || 12;
            }
            return time.join('');
        }
        $scope.dashboard.setup();

    }]);