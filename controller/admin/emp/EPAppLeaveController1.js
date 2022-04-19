app.controller('EPAppLeaveController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

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
                leaves: []
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
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        };

        $scope.leavesummary = function () {
            $scope.leavesumm = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
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
        };

        $scope.app_leaves_functions = function () {
            $scope.add = [];
            $scope.edit = [];
            $scope.search = [];
            $scope.search.acct = $scope.dashboard.values.accountid;
            $scope.search.leave = '';
            $scope.search.docu = '';
            $scope.search.datefrom = '';
            $scope.search.dateto = '';
            $scope.search.appstat = '';
            var vm = this;
            $scope.vm = vm;
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/tk/app/leaves/data.php',
                    type: 'POST',
                    data: function (d) {
                        d.acct = $scope.search.acct,
                            d.docu = $scope.search.docu,
                            d.leave = $scope.search.leave,
                            d.from = $scope.search.datefrom,
                            d.to = $scope.search.dateto,
                            d.appstat = $scope.search.appstat
                    }
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withDOM('lrtip')
                //.withOption('lengthMenu',[2,4,6,8])
                .withOption('order', [0, 'asc']);
            vm.dtColumns = [
                DTColumnBuilder.newColumn('date').withTitle('Leave Date').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('docnumber').withTitle('Document No.').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('leave_name').withTitle('Leave Name').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('leave_type').withTitle('Leave Type').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('empname').withTitle('Employee').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('hrs').withTitle('Total Hours').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('leave_status').withTitle('Status').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
                    .renderWith(function (data, type, full, meta) {
                        var btn = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
                        return btn;
                    })
            ];
            vm.dtInstance = {};

            $scope.unitSearch = function () {
                vm.dtInstance.reloadData();
            }

            $scope.resetSearch = function () {
                $scope.search = [];
                $scope.search.acct = $scope.dashboard.values.accountid;
                $scope.search.leave = '';
                $scope.search.docu = '';
                $scope.search.datefrom = '';
                $scope.search.dateto = '';
                $scope.search.appstat = '';
                $timeout(function () {
                    $("#btn-refreshh").click();
                }, 100);
            }

            $scope.filterAcct = function (acct) {
                if (parseInt($scope.dashboard.values.accouttype) == 1) {
                    return acct.id != '0';
                } else {
                    return acct.id == $scope.dashboard.values.accountid;
                }
            }


            $scope.resetReason = function () {
                $scope.edit.reason = '';
            }

            $scope.editreq = function () {
                var r = confirm("Are you sure you want to update request?");
                if (r == true) {
                    $scope.isSaving = true;

                    var urlData = {
                        'accountid': $scope.dashboard.values.accountid,
                        'info': $scope.edit
                    }
                    $http.post(apiUrl + 'admin/emp/leave/edit.php', urlData)
                        .then(function (response, status) {
                            $scope.isSaving = false;
                            var data = response.data;
                            if (data.status == "error") {
                                $rootScope.modalDanger();
                            } else if (data.status == "noreason") {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "Please specify your reason for not approving.";
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                                return;
                            } else if (data.status == "notloggedin") {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "You are not logged in";
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                                return;
                            } else if (data.status == "noid") {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "No request selected";
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                                return;
                            } else if (data.status == "inv") {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "Invalid status selected";
                                $rootScope.dymodalstyle = "btn-warning";
                                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                                $("#dymodal").modal("show");
                                return;
                            } else {
                                $timeout(function () {
                                    $("#btn-refreshh").click();
                                }, 1000);
                                $("#editModal").modal("hide");
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Success!";
                                $rootScope.dymodalmsg = "Request updated successfully";
                                $rootScope.dymodalstyle = "btn-success";
                                $rootScope.dymodalicon = "fa fa-check";
                                $("#dymodal").modal("show");
                            }
                        }, function (response) {
                            $rootScope.modalDanger();
                        });
                }
            }
        };

        $scope.empleaves = function (date) {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'date': date
            }
            $http.post(apiUrl + 'admin/tk/app/leaves/leaves.php', urlData)
                .then(function (response, status) {
                    $scope.leavesummary();

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
                    $scope.add.acct = $scope.dashboard.values.accountid;
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }


        $scope.generateTbl = function () {
            $scope.isSaving = false;
            $scope.isSaving2 = false;
            var urlData = {
                'acct': $scope.dashboard.values.accountid,
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
                    $scope.add.acct = $scope.dashboard.values.accountid;
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
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";

                            if (data.reject.length == 0) {
                                $rootScope.dymodalmsg = "Leaves created successfully";
                            } else {
                                var msg = "Below request(s) are not applied<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> REASON </th> </tr></thead> <tbody>";
                                var trow = "";
                                data.reject.forEach(function (item, index) {
                                    trow = trow + "<tr><td>" + item.date + "</td><td>" + item.msg + "</td></tr>";
                                });
                                trow = trow + "</tbody></table>";
                                $rootScope.dymodalmsg = msg + trow;
                            }

                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");

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




        $scope.setup_leave_accumulation = function () {

            $scope.search = [];
            $scope.sumhrs = [];
            $scope.search.acct = $scope.dashboard.values.accountid;
            $scope.search.datefrom = $rootScope.currperiod.pay_start;
            $scope.search.dateto = $rootScope.currperiod.pay_end;
            var vm = this;
            $scope.vm = vm;
            vm.LAdtOptions = DTOptionsBuilder.newOptions()
                // .withOption('ajax', {
                //     url: apiUrl + 'admin/emp/timesheet/data.php',
                //     type: 'POST',
                //     data: function (d) {
                //         d.acct = $scope.search.acct,
                //             d.dfrom = $scope.search.datefrom,
                //             d.dto = $scope.search.dateto

                //     },


                // })

                .withOption('rowCallback', function (row) {
                    if (!row.compiled) {
                        $compile(angular.element(row))($scope);
                        row.compiled = true;
                    }
                })
                .withDataProp('data')
                .withOption('language', { search: '', searchPlaceholder: "Search.." })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('lengthMenu', [[15, 25, 50], [15, 25, 50]])
                .withOption('searching', { "regex": true })
                .withDOM('<"toolbar dataTables_length"><"year dataTables_filter">rt')
                .withOption('order', [0, 'asc'])
                .withOption('drawCallback', function (settings) {
                    $scope.totalpending = settings.json.data[settings.json.data.length - 1].pending;
                    var api = this.api();
                    $timeout(function () {
                        if (settings.aoData.length > 0) {
                            $scope.sumhrs = api.rows().data()[0].total;
                        } else {
                            $scope.sumhrs = { late: 0, ut: 0, absent: 0, leave: 0, ot: 0, reg: 0 };
                        }
                    }, 0);
                });

            vm.LAdtColumns = [
                DTColumnBuilder.newColumn('leavetype').withTitle('Leave Type').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('unitbase').withTitle('Unit Base').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('jan').withTitle('Jan').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('feb').withTitle('Feb').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('mar').withTitle('Mar').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('apr').withTitle('Apr').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('may').withTitle('May').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('jun').withTitle('Jun').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('july').withTitle('Jul').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('aug').withTitle('Aug').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('sep').withTitle('Sep').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('oct').withTitle('Oct').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('nov').withTitle('Nov').withClass('btnTDs').notSortable(),
                DTColumnBuilder.newColumn('dec').withTitle('Dec').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('cover').withTitle('Cary Over').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('used').withTitle('Used').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('accrued').withTitle('Accrued').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('prorated').withTitle('Pro-Rated').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('tlb').withTitle('Total Leave Balance').withClass('btnTD').notSortable()
            ];
            vm.LAdtInstance = {};

            $(document).ready(function () {

                $("div.year").html('<div class="btn-group"> <button id="lanext">+</button><button disabled>&nbsp;&nbsp;&nbsp;Year&nbsp;&nbsp;&nbsp;</button><button id="laprev">-</button></div> <input type="text" placeholder="Year" maxlength="10" id="layear" name="layear" readonly required />');

                $("div.toolbar").html('<button disabled style="color:white;background-color: #00b050; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px; margin-left: -6px;" type="button">Leave Accumulation</button> ');

                $("#layear").datepicker({ dateFormat: "yy-mm-dd" });


                $("#layear").on('click', function () {

                });

                $("#lanext").on('click', function () {
                    alert();
                });

                $("#laprev").on('click', function () {
                    alert();
                });
            });

            $scope.unitSearch = function () {

                if ($scope.search.acct.length < 1 || $scope.search.datefrom.length < 1 || $scope.search.dateto.length < 1) {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "All fields are required!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }

                vm.LAdtInstance.reloadData();
            }

            $scope.resetSearch = function () {
                $scope.search = [];
                $scope.search.acct = $scope.dashboard.values.accountid;
                $scope.search.datefrom = $rootScope.currperiod.pay_start;
                $scope.search.dateto = $rootScope.currperiod.pay_end;
                $scope.sumhrs = [];
                $timeout(function () {
                    $("#btn-refreshh").click();
                }, 100);
            }

            $scope.filterAcct = function (acct) {
                if (parseInt($scope.dashboard.values.accouttype) == 1) {
                    return acct.id != '0';
                } else {
                    return acct.id == $scope.dashboard.values.accountid;
                }
            }

        }


        $scope.setup_leave_crediting = function () {

            $scope.search = [];
            $scope.sumhrs = [];
            $scope.search.acct = $scope.dashboard.values.accountid;
            $scope.search.datefrom = $rootScope.currperiod.pay_start;
            $scope.search.dateto = $rootScope.currperiod.pay_end;
            var vm = this;
            $scope.vm = vm;
            vm.LCdtOptions = DTOptionsBuilder.newOptions()
                // .withOption('ajax', {
                //     url: apiUrl + 'admin/emp/timesheet/data.php',
                //     type: 'POST',
                //     data: function (d) {
                //         d.acct = $scope.search.acct,
                //             d.dfrom = $scope.search.datefrom,
                //             d.dto = $scope.search.dateto

                //     },


                // })

                .withOption('rowCallback', function (row) {
                    if (!row.compiled) {
                        $compile(angular.element(row))($scope);
                        row.compiled = true;
                    }
                })
                .withDataProp('data')
                .withOption('language', { search: '', searchPlaceholder: "Search.." })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('lengthMenu', [[15, 25, 50], [15, 25, 50]])
                .withOption('searching', { "regex": true })
                .withDOM('<"lctoolbar dataTables_length"><"lcyear dataTables_filter">rt')
                .withOption('order', [0, 'asc'])
                .withOption('drawCallback', function (settings) {
                    $scope.totalpending = settings.json.data[settings.json.data.length - 1].pending;
                    var api = this.api();
                    $timeout(function () {
                        if (settings.aoData.length > 0) {
                            $scope.sumhrs = api.rows().data()[0].total;
                        } else {
                            $scope.sumhrs = { late: 0, ut: 0, absent: 0, leave: 0, ot: 0, reg: 0 };
                        }
                    }, 0);
                });

            vm.LCdtColumns = [
                DTColumnBuilder.newColumn('leavetype').withTitle('Leave Type').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('credits').withTitle('Credits').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('mar').withTitle('Mar').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('apr').withTitle('Apr').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('may').withTitle('May').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('jun').withTitle('Jun').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('july').withTitle('Jul').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('aug').withTitle('Aug').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('sep').withTitle('Sep').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('oct').withTitle('Oct').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('nov').withTitle('Nov').withClass('btnTDs').notSortable(),
                DTColumnBuilder.newColumn('dec').withTitle('Dec').withClass('btnTD').notSortable(),


                DTColumnBuilder.newColumn('used').withTitle('Used').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('balance').withTitle('Balance').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('accrued').withTitle('Accrued').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('outbal').withTitle('Outstanding Balance').withClass('btnTD').notSortable()
            ];
            vm.LCdtInstance = {};

            $(document).ready(function () {

                $("div.lcyear").html('<div class="btn-group"> <button id="lcnext">+</button><button disabled>&nbsp;&nbsp;&nbsp;Year&nbsp;&nbsp;&nbsp;</button><button id="lcprev">-</button></div> <input type="text" placeholder="Year" maxlength="10" id="layear" name="layear" readonly required />');

                $("div.lctoolbar").html('<button disabled style="color:white;background-color: #00b050; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px; margin-left: -6px;" type="button">Leave Crediting</button> ');

                $("#lcyear").datepicker({ dateFormat: "yy-mm-dd" });


                $("#lcyear").on('click', function () {

                });

                $("#lcnext").on('click', function () {
                    alert();
                });

                $("#lcprev").on('click', function () {
                    alert();
                });
            });

            $scope.unitSearch = function () {

                if ($scope.search.acct.length < 1 || $scope.search.datefrom.length < 1 || $scope.search.dateto.length < 1) {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "All fields are required!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }

                vm.LCdtInstance.reloadData();
            }

            $scope.resetSearch = function () {
                $scope.search = [];
                $scope.search.acct = $scope.dashboard.values.accountid;
                $scope.search.datefrom = $rootScope.currperiod.pay_start;
                $scope.search.dateto = $rootScope.currperiod.pay_end;
                $scope.sumhrs = [];
                $timeout(function () {
                    $("#btn-refreshh").click();
                }, 100);
            }

            $scope.filterAcct = function (acct) {
                if (parseInt($scope.dashboard.values.accouttype) == 1) {
                    return acct.id != '0';
                } else {
                    return acct.id == $scope.dashboard.values.accountid;
                }
            }

        }

        $scope.setup_leave_earned = function () {

            $scope.search = [];
            $scope.sumhrs = [];
            $scope.search.acct = $scope.dashboard.values.accountid;
            $scope.search.datefrom = $rootScope.currperiod.pay_start;
            $scope.search.dateto = $rootScope.currperiod.pay_end;
            var vm = this;
            $scope.vm = vm;
            vm.LEdtOptions = DTOptionsBuilder.newOptions()
                // .withOption('ajax', {
                //     url: apiUrl + 'admin/emp/timesheet/data.php',
                //     type: 'POST',
                //     data: function (d) {
                //         d.acct = $scope.search.acct,
                //             d.dfrom = $scope.search.datefrom,
                //             d.dto = $scope.search.dateto

                //     },


                // })

                .withOption('rowCallback', function (row) {
                    if (!row.compiled) {
                        $compile(angular.element(row))($scope);
                        row.compiled = true;
                    }
                })
                .withDataProp('data')
                .withOption('language', { search: '', searchPlaceholder: "Search.." })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('lengthMenu', [[15, 25, 50], [15, 25, 50]])
                .withOption('searching', { "regex": true })
                .withDOM('<"letoolbar dataTables_length"><"leyear dataTables_filter">rt')
                .withOption('order', [0, 'asc'])
                .withOption('drawCallback', function (settings) {
                    $scope.totalpending = settings.json.data[settings.json.data.length - 1].pending;
                    var api = this.api();
                    $timeout(function () {
                        if (settings.aoData.length > 0) {
                            $scope.sumhrs = api.rows().data()[0].total;
                        } else {
                            $scope.sumhrs = { late: 0, ut: 0, absent: 0, leave: 0, ot: 0, reg: 0 };
                        }
                    }, 0);
                });

            vm.LEdtColumns = [
                DTColumnBuilder.newColumn('leavetype').withTitle('Leave Type').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('a').withTitle('').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('b').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('b').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('c').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('d').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('e').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('f').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('g').withTitle('').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('h').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('i').withTitle('').withClass('btnTDs').notSortable(),
                DTColumnBuilder.newColumn('j').withTitle('').withClass('btnTD').notSortable(),


                DTColumnBuilder.newColumn('k').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('l').withTitle('').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('m').withTitle('').withClass('btnTD').notSortable(),

            ];
            vm.LEdtInstance = {};

            $(document).ready(function () {

                $("div.leyear").html('<div class="btn-group"> <button id="lenext">+</button><button disabled>&nbsp;&nbsp;&nbsp;Year&nbsp;&nbsp;&nbsp;</button><button id="leprev">-</button></div> <input type="text" placeholder="Year" maxlength="10" id="layear" name="layear" readonly required />');

                $("div.letoolbar").html('<button disabled style="color:white;background-color: #00b050; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px; margin-left: -6px;" type="button">Leave Earned and Expiration</button> ');

                $("#leyear").datepicker({ dateFormat: "yy-mm-dd" });


                $("#leyear").on('click', function () {

                });

                $("#lenext").on('click', function () {
                    alert();
                });

                $("#leprev").on('click', function () {
                    alert();
                });
            });

            $scope.unitSearch = function () {

                if ($scope.search.acct.length < 1 || $scope.search.datefrom.length < 1 || $scope.search.dateto.length < 1) {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "All fields are required!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }

                vm.LEdtInstance.reloadData();
            }

            $scope.resetSearch = function () {
                $scope.search = [];
                $scope.search.acct = $scope.dashboard.values.accountid;
                $scope.search.datefrom = $rootScope.currperiod.pay_start;
                $scope.search.dateto = $rootScope.currperiod.pay_end;
                $scope.sumhrs = [];
                $timeout(function () {
                    $("#btn-refreshh").click();
                }, 100);
            }

            $scope.filterAcct = function (acct) {
                if (parseInt($scope.dashboard.values.accouttype) == 1) {
                    return acct.id != '0';
                } else {
                    return acct.id == $scope.dashboard.values.accountid;
                }
            }

        }



        $(document).ready(function () {
            $('.fc-toolbar').unbind().on('click', '.fc-button', function () {
                var date = new Date($('#calendarleave').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.empleaves(newdate);
            });
            $('.fc-toolbar').unbind().on('click', '.fc-today-button', function () {
                var date = new Date($('#calendarleave').fullCalendar('getDate'));
                var newdate = (date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)) + '-' + ("0" + (date.getDate() + 1)).slice(-2);
                $scope.empleaves(newdate);
            });


            $(".fc-right").html(`<i id="trash" class="fa fa-trash danger " style="font-size: 40px; color: red;" aria-hidden="true"></i>`);

            $('.tld').unbind().on('mouseover', ".dl", function () {
                $('.dl').draggable({
                    revert: true,
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