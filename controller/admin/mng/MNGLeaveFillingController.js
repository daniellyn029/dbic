app.controller('MNGLeaveFillingController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager', '$route',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager, $route) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/mng/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";
		
		$scope.teamfilter = '';
		$scope.mystaff_id = '0';
		$scope.search = {
			month: '',
			year: ''
		};
		
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
				minmaxyr:[]
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
						$scope.dashboard.values.minmaxyr = data.work_dates;
                        $scope.dashboard.values.leaves = data.leaves;
                        $scope.dashboard.values.period = data.period;
                        $scope.dashboard.values.daterange = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');
						$scope.myteam2();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }
		
		$scope.resetSearch = function(){
			$scope.search = {
				month: '',
				year: ''
			};
		}
		
		$scope.searchCalendar = function(){
			var currentDate = $scope.search.year + '-' + $scope.search.month + '-01';
			$('#calendarleave').fullCalendar('gotoDate', currentDate);
			$scope.empleaves( currentDate );
		}
		
		$scope.reloadRoute = function(){
			$route.reload();
		}
		
		$scope.$watch('teamfilter', function () {
            $scope.myteam();
        });
        $scope.myteam = function () {
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
				}
				$scope.mystaff_id = '0';
				$scope.empleaves('');
			}, function (response) {
				$rootScope.modalDanger();
			});
        }
		$scope.myteam2 = function () {
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
					$scope.team2 = data;
				}
			}, function (response) {
				$rootScope.modalDanger();
			});
        }

		$scope.showApplications = function(obj){
			var $t = $(obj);
			var $form = $t.closest('form');
			var name = $t.attr('name');
			var selector = 'input[name="myteamchk"]';
			var m = (new RegExp('^(.+)\\[([^\\]]+)\\]$')).exec( name );
			if( m ){
			  selector += '[name^="'+m[1]+'["][name$="]"]';
			}else{
			  selector += '[name="'+name+'"]';
			}
			$(selector, $form).not($t).prop('checked',false);
			
			$scope.mystaff_id = '0';
			if($($t).is(':checked')){
				$scope.mystaff_id  = $($t).val().toString();
			}
			$scope.empleaves('');
			$scope.leavesummary();
		}

        $scope.leavesummary = function () {
            $scope.leavesumm = [];
			if( parseInt( $scope.mystaff_id ) > 0 ){
				var urlData = {
					'accountid': $scope.mystaff_id,
				}
				$http.post(apiUrl + 'admin/emp/dashboard/leavesummary.php', urlData)
					.then(function (response, status) {
						var data = response.data;
						if (data.status == 'error') {
							$rootScope.modalDanger();
						} else {
							$scope.leavesumm = data;
						}
					}, function (response) {
						$rootScope.modalDanger();
					});
			}
        };

        
        $scope.empleaves = function (date) {
            var urlData = {
                'accountid': $scope.mystaff_id,
                'date': date
            }
            $http.post(apiUrl + 'admin/tk/app/leaves/leaves.php', urlData)
                .then(function (response, status) {
                    $('#calendarleave').fullCalendar('removeEvents');
                    $('#calendarleave').fullCalendar('addEventSource', response.data);
                    $('#calendarleave').fullCalendar('rerenderEvents');
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.showadd = function () {
            $('#modal-add').modal('show');
        }

		$scope.calendarOptions = {
            header: {
                left: ' today prev,next title',
                center: '',
                right: ''
            },
            selectable: true,
            eventLimit: true,
            eventLimitText: 'leave',
            editable: true,
            droppable: true,
            eventResizableFromStart: false,
            eventReceive: function (event, delta, revertFunc, jsEvent, ui, view) {
                $('#leave_start').datepicker('destroy');
                $('#leave_end').datepicker('destroy');

                $scope.bgcolor = event.backgroundColor;
                $scope.applicationtype = event.title;
                $scope.$digest();

                var id = event.id;

                var d = new Date();
                var d2 = new Date();

                if (event.idleave == 1) {
                    if (event.start <= d.setDate(d.getDate() - 2)) {
                        $("#calendarleave").fullCalendar('removeEvents', id);
                        $.notify("Late Filing is not allowed", "error");
                    } else if (event.start > d.setDate(d.getDate() + 2)) {
                        $("#calendarleave").fullCalendar('removeEvents', id);
                        $.notify("Prefiling is not allowed", "error");
                    } else {
                        $('#modal-mutiple').modal('show');
                        $cookieStore.put('idleave', event.idleave);

                        var disdate = new Date(event.start);

                        $("#leave_end").datepicker({
                            minDate: disdate,
                            dateFormat: 'yy-mm-dd'
                        });

                        $("#leave_start").datepicker({
                            minDate: disdate,
                            maxDate: new Date(),
                            dateFormat: 'yy-mm-dd'
                        });

                        $('#leave_start').datepicker("setDate", disdate);
                        $('#leave_end').datepicker("setDate", disdate);

                        $('#leave_start').change(function () {
                            disdate = new Date($(this).val());
                            $('#leave_end').datepicker('destroy');
                            $("#leave_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });
                        });

                        $(document).on("click", "#cancelleave", function () {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                        });

                    }
                } else if (event.idleave == 2) {
                    if (event.start <= d.setDate(d.getDate() - 1)) {
                        $("#calendarleave").fullCalendar('removeEvents', id);
                        $.notify("Leave application on past dates are not allowed", "error");
                    } else if (event.start < d.setDate(d.getDate() + 7)) {
                        $("#calendarleave").fullCalendar('removeEvents', id);
                        $.notify("Advance Filing is 1 week before the scheduled leave", "error");
                    } else {
                        $('#modal-mutiple').modal('show');

                        $cookieStore.put('idleave', event.idleave);

                        var disdate = new Date(event.start);

                        $("#leave_start").datepicker({
                            minDate: new Date(d2.setDate(d2.getDate() + 7)),
                            dateFormat: 'yy-mm-dd'
                        });

                        $("#leave_end").datepicker({
                            minDate: disdate,
                            dateFormat: 'yy-mm-dd'
                        });

                        $('#leave_start').datepicker("setDate", disdate);
                        $('#leave_end').datepicker("setDate", disdate);


                        $('#leave_start').change(function () {
                            disdate = new Date($(this).val());
                            $('#leave_end').datepicker('destroy');
                            $("#leave_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });
                        });


                        $(document).on("click", "#cancelleave", function () {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                        });

                    }
                } else {
                    if (event.start <= d.setDate(d.getDate() - 1)) {
                        $("#calendarleave").fullCalendar('removeEvents', id);
                        $.notify("Late Filing is not allowed", "error");
                    } else {
                        $('#modal-mutiple').modal('show');
                        $cookieStore.put('idleave', event.idleave);

                        var disdate = new Date(event.start);

                        $("#leave_end").datepicker({
                            minDate: disdate,
                            dateFormat: 'yy-mm-dd'
                        });

                        $("#leave_start").datepicker({
                            minDate: disdate,
                            dateFormat: 'yy-mm-dd'
                        });

                        $('#leave_start').datepicker("setDate", disdate);
                        $('#leave_end').datepicker("setDate", disdate);

                        $('#leave_start').change(function () {
                            disdate = new Date($(this).val());
                            $('#leave_end').datepicker('destroy');
                            $("#leave_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });
                        });

                        $(document).on("click", "#cancelleave", function () {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                        });

                    }
                }
            },
            eventMouseover: function (event, delta, revertFunc, jsEvent, ui, view) {
                if (event.approverstatus == 'Cancelled') {
                    var tooltip = `<div class="eventtooltip text-center" style="padding: 10px;position:absolute;z-index:10001;background:` + event.backgroundColor + `; color:white;">
                                        <table style="width:auto ;margin:10px; padding : 10px" >
                                            <tr>
                                                <td style="padding :5px; border-style: solid; border-color: white;">Reason</td>
                                                <td style="padding :5px; border-style: solid; border-color: white;">Status</th>
                                                <td style="padding :5px; border-style: solid; border-color: white;">Remarks</th>
                                            </tr>
                                            <tr>
                                                <td style="padding :5px; border-style: solid; border-color: white;">`+ event.remarks + `</td>
                                                <td style="padding :5px; border-style: solid; border-color: white;">`+ event.approverstatus + `</td>
                                                <td style="padding :5px; border-style: solid; border-color: white;">`+ event.cancelreason + `</td>
                                            </tr>
                                        </table>
                                    </div> `;
                    var $tooltip = $(tooltip).appendTo('body');
                } else if (event.approverstatus == 'Disapproved') {
                    var tooltip = `<div class="eventtooltip text-center" style="padding: 10px;position:absolute;z-index:10001;background:` + event.backgroundColor + `; color:white;">
                                    <table style="width:auto ;margin:10px; padding : 10px" >
                                        <tr>
                                            <td style="padding :5px; border-style: solid; border-color: white;">Reason</td>
                                            <td style="padding :5px; border-style: solid; border-color: white;">Status</th>
                                            <td style="padding :5px; border-style: solid; border-color: white;">Remarks</th>
                                        </tr>
                                        <tr>
                                            <td style="padding :5px; border-style: solid; border-color: white;">`+ event.remarks + `</td>
                                            <td style="padding :5px; border-style: solid; border-color: white;">`+ event.approverstatus + `</td>
                                            <td style="padding :5px; border-style: solid; border-color: white;">`+ event.cancelreason + `</td>
                                        </tr>
                                    </table>
                                </div> `;
                    var $tooltip = $(tooltip).appendTo('body');
                } else {
                    var tooltip = `<div class="eventtooltip text-center" style="padding: 10px;position:absolute;z-index:10001;background:` + event.backgroundColor + `; color:white;">
                                        <table style="width:auto ;margin:10px; padding : 10px" >
                                            <tr>
                                                <td style="padding :5px; border-style: solid; border-color: white;">Reason</td>
                                                <td style="padding :5px; border-style: solid; border-color: white;">Status</th>
                                            </tr>
                                            <tr>
                                                <td style="padding :5px; border-style: solid; border-color: white;">`+ event.remarks + `</td>
                                                <td style="padding :5px; border-style: solid; border-color: white;">`+ event.approverstatus + `</td>
                                            </tr>
                                        </table>
                                    </div> `;
                    var $tooltip = $(tooltip).appendTo('body');
                }


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
                $('.eventtooltip').remove();
            },
            select: function (event, delta, revertFunc, jsEvent, ui, view) {
            },
            eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                if (event.leave_status == 'PENDING' || event.leave_status == 'DECLINED' || event.leave_status == 'APPROVED') {
                    revertFunc();
                } else {
                    $('#leave_start').datepicker("destroy");
                    $('#leave_end').datepicker("destroy");
                    var id = event.id;

                    var d = new Date();
                    var d2 = new Date();

                    if (event.idleave == 1) {
                        if (event.start <= d.setDate(d.getDate() - 2)) {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                            $.notify("Late Filing is not allowed", "error");
                        } else if (event.start > d.setDate(d.getDate() + 2)) {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                            $.notify("Prefiling is not allowed", "error");
                        } else {


                            $('#modal-add').modal('show');
                            $cookieStore.put('idleave', event.idleave);

                            var disdate = new Date(event.start);

                            $("#leave_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });

                            $("#leave_start").datepicker({
                                minDate: disdate,
                                maxDate: new Date(),
                                dateFormat: 'yy-mm-dd'
                            });

                            var end = new Date(event.end)
                            end = end.setDate(end.getDate() - 1)


                            $('#leave_start').datepicker("setDate", disdate);
                            $('#leave_end').datepicker("setDate", new Date(end));

                            $('#leave_start').change(function () {
                                disdate = new Date($(this).val());
                                $('#leave_end').datepicker('destroy');
                                $("#leave_end").datepicker({
                                    minDate: disdate,
                                    dateFormat: 'yy-mm-dd'
                                });
                            });



                            $(document).on("click", "#cancelleave", function () {
                                $("#calendarleave").fullCalendar('removeEvents', id);
                            });

                        }
                    } else if (event.idleave == 2) {
                        if (event.start <= d.setDate(d.getDate() - 1)) {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                            $.notify("Leave application on past dates are not allowed", "error");
                        } else if (event.start < d.setDate(d.getDate() + 6)) {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                            $.notify("Advance Filing is 1 week before the scheduled leave", "error");
                        } else {
                            $('#modal-add').modal('show');

                            $cookieStore.put('idleave', event.idleave);

                            var disdate = new Date(event.start);
                            $("#leave_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });

                            $("#leave_start").datepicker({
                                minDate: new Date(),
                                dateFormat: 'yy-mm-dd'
                            });
                            var end = new Date(event.end)
                            end = end.setDate(end.getDate() - 1)


                            $('#leave_start').datepicker("setDate", disdate);
                            $('#leave_end').datepicker("setDate", new Date(end));

                            $('#leave_start').change(function () {
                                disdate = new Date($(this).val());
                                $('#leave_end').datepicker('destroy');
                                $("#leave_end").datepicker({
                                    minDate: disdate,
                                    dateFormat: 'yy-mm-dd'
                                });
                            });


                            $(document).on("click", "#cancelleave", function () {
                                $("#calendarleave").fullCalendar('removeEvents', id);
                            });

                        }
                    } else {
                        if (event.start <= d.setDate(d.getDate() - 1)) {
                            $("#calendarleave").fullCalendar('removeEvents', id);
                            $.notify("Late Filing is not allowed", "error");
                        } else {
                            $('#modal-add').modal('show');
                            $cookieStore.put('idleave', event.idleave);

                            var disdate = new Date(event.start);

                            $("#leave_end").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });

                            $("#leave_start").datepicker({
                                minDate: disdate,
                                dateFormat: 'yy-mm-dd'
                            });
                            var end = new Date(event.end)
                            end = end.setDate(end.getDate() - 1)


                            $('#leave_start').datepicker("setDate", disdate);
                            $('#leave_end').datepicker("setDate", new Date(end));

                            $('#leave_start').change(function () {
                                disdate = new Date($(this).val());
                                $('#leave_end').datepicker('destroy');
                                $("#leave_end").datepicker({
                                    minDate: disdate,
                                    dateFormat: 'yy-mm-dd'
                                });
                            });

                            $(document).on("click", "#cancelleave", function () {
                                $("#calendarleave").fullCalendar('removeEvents', id);
                            });

                        }
                    }
                }
            },
            eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                revertFunc();
            },
            eventClick: function (event, delta, revertFunc, jsEvent, ui, view) {
                if (event.file != undefined) {
                    window.open(apiUrl + 'admin/tk/app/leaves/viewfile.php?loc=' + event.file);
                }
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
                    if( parseInt(event.creator) != parseInt($scope.dashboard.values.accountid) ){
						$.notify("CANNOT CANCEL " + event.leave_status + " LEAVES", "error");
					}else{
						if (event.leave_status == "PENDING") {
							var urlData = {
								'id': event.id,
								'accountid': $scope.dashboard.values.accountid,
							}
							$http.post(apiUrl + 'admin/tk/app/leaves/cancelleave.php', urlData)
							.then(function (response, status) {
								var date = new Date($('#calendarleave').fullCalendar('getDate'));
								var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
								$scope.empleaves(newdate);
								$scope.resetCreateAcct();

								$.notify("Leave successfully Cancelled", "success");
							}, function (response) {
								$rootScope.modalDanger();
							});
						} else if (event.leave_status == "APPROVED" || event.leave_status == "DECLINED") {
							$.notify("CANNOT CANCEL " + event.leave_status + " LEAVES", "error");
						} else {
							$scope.resetCreateAcct();
							var id = event.id;
							$.notify("Leave application cancelled", "error");
							$("#calendarleave").fullCalendar('removeEvents', id);
						}
					}
                }
            },
            eventRender: function (event, element) {
                if (event.file != null) {
                    element.find('.fc-title').after(`<i class="fa fa-paperclip pull-right" style="font-size : 20px" aria-hidden="true"></i>`);
                }
                if (event.leave_status == "PENDING") {
                    if (event.cancelreason == null) {
                        element.find('.fc-title').before('<div id="bloc1" class="dot3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');
                    } else {
                        element.find('.fc-title').before('<div id="bloc1" class="dot4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');
                    }
                }
                if (event.leave_status == "DECLINED") {
                    element.find('.fc-title').before('<div id="bloc1" class="dot2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');

                }
                if (event.leave_status == "APPROVED") {
                    element.find('.fc-title').before('<div id="bloc1" class="dot">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div id="bloc2"><span></span></div>');
                }

            },

        };
        
        $scope.edit_view = function (id) {

            var urlData = {
                'id': id
            }
            $http.post(apiUrl + 'admin/mng/leave/edit_view.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.edit = data;
                    $scope.edit.stat = '';
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.calcLeavehrs = function (hrs, id, ndex) {
            var total = 0;
            $scope.add.leave_dates[ndex]['drop'].forEach(function (item, index) {
                if (item.id == id) {
                    if (hrs == 8) {
                        $scope.add.leave_dates[ndex]['hrs'] = hrs - item.hr;
                    } else if (hrs == 4) {
                        $scope.add.leave_dates[ndex]['hrs'] = item.hr;
                    }
                }
            });
            $scope.add.leave_dates.forEach(function (item, index) {
                total = total + item.hrs;
            });
            $scope.total_units = total;
        }

        $scope.resetCreateAcct = function () {
            $scope.isSaving = false;
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/tk/app/leaves/add_view.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.add = data;
                    $scope.add.acct = $scope.mystaff_id;
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }


        $scope.generateTbl = function () {
            $scope.isSaving = false;
            $scope.isSaving2 = false;
            var urlData = {
                'acct': $scope.mystaff_id,
                'idleave': $cookieStore.get('idleave'),
                'from': $('#leave_start').val(),
                'to': $('#leave_end').val()
            }
            $http.post(apiUrl + 'admin/tk/app/leaves/add_dates.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.add.leave_dates = data;
                    $scope.total_units = $scope.add.leave_dates[($scope.add.leave_dates.length - 1)]["unit"];
                    $scope.add.idleave = $cookieStore.get('idleave');
                    $scope.add.datefrom = $('#leave_start').val();
                    $scope.add.dateto = $('#leave_end').val();
                    $scope.add.acct = $scope.mystaff_id;
                    $scope.add.remarks = '';
                    $scope.showfilebtn = 0;
                    if ($scope.add.idleave == 1) {
                        if ($scope.total_units > 8) {
                            $scope.showfilebtn = 1;
                        }
                    }

                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.addLeave = function (file) {
            if ($scope.add.remarks == '') {
                $rootScope.dymodalstat = true;
                $rootScope.dymodaltitle = "Warning!";
                $rootScope.dymodalmsg = "Please specify leave reasons";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                $("#dymodal").modal("show");
                return;
            } else {
                if ($scope.add.leave_dates.length > 0) {
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
                    $scope.isSaving2 = true;
                    Upload.upload({
                        url: apiUrl + 'admin/tk/app/leaves/create.php',
                        method: 'POST',
                        file: file,
                        data: {
                            'accountid': $scope.dashboard.values.accountid,
                            'info': $scope.add,
                            'targetPath': '../../../../admin/tk/app/leaves/file/'
                        }
                    }).then(function (response) {
                        var data = response.data;
                        $scope.isSaving = false;
                        $scope.isSaving2 = false;

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
                        } else if (data.status == "idleave") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Leave Name";
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
                        } else if (data.status == "approver") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "No Approver was set";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            $scope.add = '';
                            var date = new Date($('#calendarleave').fullCalendar('getDate'));
                            var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                            $scope.empleaves(newdate);

                            $timeout(function () {
                                $("#btn-refreshh").click();

                            }, 1000);
                            $("#modal-add").modal("hide");

                            if (data.reject.length == 0) {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Success!";
                                $rootScope.dymodalmsg = "Leaves created successfully";
                                $rootScope.dymodalstyle = "btn-success";
                                $rootScope.dymodalicon = "fa fa-check";
                                $("#dymodal").modal("show");
                            } else {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                var msg = "Below request(s) are not applied<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> REASON </th> </tr></thead> <tbody>";
                                var trow = "";
                                data.reject.forEach(function (item, index) {
                                    trow = trow + "<tr><td>" + item.date + "</td><td>" + item.msg + "</td></tr>";
                                });
                                trow = trow + "</tbody></table>";
                                $rootScope.dymodalmsg = msg + trow;
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                            }

                            $('#calendarleave').fullCalendar('refetchEvents')
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
        $scope.isSaving2 = true;



        $(document).ready(function () {
			
			$('.fc-left').unbind().on('click', '.fc-button', function () {
                var date = new Date($('#calendarleave').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.empleaves(newdate);
            });
			
			$('.fc-today-button').click(function () {
                var date = new Date($('#calendarleave').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.empleaves(newdate);
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
            })
        });
        $scope.dashboard.setup();
    }]);