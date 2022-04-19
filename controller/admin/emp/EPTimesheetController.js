app.controller('EPTimesheetController', ['$scope', '$compile', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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
                period: []
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
                        $scope.dashboard.values.period = data.period;
                        $rootScope.currperiod.pay_start = moment($scope.dashboard.values.period.pay_start).format('YYYY-MM-DD');
                        $rootScope.currperiod.pay_end = moment($scope.dashboard.values.period.pay_end).format('YYYY-MM-DD');
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.setup_timesheet_functions = function () {
            $scope.search = [];
            $scope.sumhrs = [];
            $scope.search.acct = $scope.dashboard.values.accountid;
            if (typeof ($location.search().date) === 'undefined' ||
                typeof ($location.search().date) === 'undefined') {
                $scope.search.datefrom = $rootScope.currperiod.pay_start;
                $scope.search.dateto = $rootScope.currperiod.pay_end;
            } else {
                var d = $location.search().date;
                $scope.search.datefrom = d;
                $scope.search.dateto = d;
            }

            if (typeof ($scope.search.datefrom) === 'undefined' ||
                typeof ($scope.search.dateto) === 'undefined') {
                $scope.search.datefrom = moment().format('YYYY-MM-DD');
                $scope.search.dateto = moment().format('YYYY-MM-DD');
            }


            var vm = this;
            $scope.vm = vm;
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/emp/timesheet/data.php',
                    type: 'POST',
                    data: function (d) {
                        d.acct = $scope.search.acct,
                            d.dfrom = $scope.search.datefrom,
                            d.dto = $scope.search.dateto
                    },
                })

                .withOption('rowCallback', function (row) {
                    if (!row.compiled) {
                        $compile(angular.element(row))($scope);
                        row.compiled = true;
                    }
                })
                .withDataProp('data')
                .withOption('language', {
                    search: '',
                    searchPlaceholder: "Search.."
                })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('lengthMenu', [
                    [15, 25, 50],
                    [15, 25, 50]
                ])
                .withOption('searching', {
                    "regex": true
                })
                .withDOM('<"cutoff dataTables_length"><"toolbar dataTables_length">frtp')
                .withOption('order', [0, 'asc'])
                .withOption('drawCallback', function (settings) {
                    $scope.totalpending = settings.json.data[settings.json.data.length - 1].pending;
                    $scope.totaldeclined = settings.json.data[settings.json.data.length - 1].declined;
                    $scope.totalapproved = settings.json.data[settings.json.data.length - 1].approved;
                    $scope.totallvhrs = settings.json.data[settings.json.data.length - 1].lvtotalhrs;
                    $scope.totalwh = settings.json.data[settings.json.data.length - 1].totalwh;
                    $scope.totalewh = settings.json.data[settings.json.data.length - 1].totalewh;
                    $scope.totallates = settings.json.data[settings.json.data.length - 1].totallates;
                    $scope.totalut = settings.json.data[settings.json.data.length - 1].totalut;
                    $scope.totalot = settings.json.data[settings.json.data.length - 1].totalot;
                    $scope.totalabs = settings.json.data[settings.json.data.length - 1].totalabs;
                    $scope.workhourstotal = settings.json.data[settings.json.data.length - 1].workhourstotal;
                    var api = this.api();
                    $timeout(function () {
                        if (settings.aoData.length > 0) {
                            $scope.sumhrs = api.rows().data()[0].total;
                        } else {
                            $scope.sumhrs = {
                                late: 0,
                                ut: 0,
                                absent: 0,
                                leave: 0,
                                ot: 0,
                                reg: 0
                            };
                        }
                    }, 0);
                });

            vm.dtColumns = [
                DTColumnBuilder.newColumn('status').withTitle('Status').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shift').withTitle('Shift Code').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('In').withClass('btnTD').notSortable().renderWith(function (data, type, full, meta){
                    var ins = '';
                    if(data.late != "0.00"){
                        ins ='<span style="color:red !important"> ' + data.in + '</span>';
                    }else{
                        ins = data.in;
                    }
                    return ins;
                }),
                DTColumnBuilder.newColumn(null).withTitle('Out').withClass('btnTD').notSortable().renderWith(function (data, type, full, meta){
                    var outs = '';
                    if(data.ut != "0.00"){
                        outs ='<span style="color:red !important"> ' + data.out + '</span>';
                    }else{
                        outs = data.out;
                    }
                    return outs;
                }),
                DTColumnBuilder.newColumn('wh').withTitle('Work Hours').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('acthrs').withTitle('Total Work Hours').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('othrs').withTitle('Excess Work Hours').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('Late').withClass('btnTD').notSortable().renderWith(function (data, type, full, meta){
                    var lates = '';
                    if(data.late != "0.00"){
                        lates ='<span style="color:red !important"> ' + data.late + '</span>';
                    }else{
                        lates = data.late;
                    }
                    return lates;
                }),
                DTColumnBuilder.newColumn(null).withTitle('UnderTime').withClass('btnTD').notSortable().renderWith(function (data, type, full, meta){
                    var uts = '';
                    if(data.ut != "0.00"){
                        uts ='<span style="color:red !important"> ' + data.ut + '</span>';
                    }else{
                        uts = data.ut;
                    }
                    return uts;
                }),
                DTColumnBuilder.newColumn('absent').withTitle('Absence').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('cs').withTitle('CS').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('adaj').withTitle('AA').withClass('btnTDs').notSortable(),
                DTColumnBuilder.newColumn('ot').withTitle('OT').withClass('btnTD').notSortable(),

                DTColumnBuilder.newColumn('lv').withTitle('LV').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ob').withTitle('OB').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('action').withTitle('Action').withClass('btnTD').notSortable()
            ];
            vm.dtInstance = {};
            $(document).ready(function () {
                $("div.cutoff").html('<div class="btn-group"><button id="cnext" onclick="angular.element(this).scope().cutoffData(\'1\')" ><<</button><button onclick="angular.element(this).scope().cutoffData(\'0\')" > CutOff Period</button><button id="cprev" onclick="angular.element(this).scope().cutoffData(\'2\')" >>></button></div>');
                $("div.toolbar").html(`<button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </button> 
                <input type="text" placeholder="Date from" maxlength="10" id="search_dfrom" name="search_dfrom" readonly required />
                 <input type="text" placeholder="Date To" maxlength="10" id="search_dto" name="search_dto" readonly required /> 
                  <button style="color : white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);


                $("#search_dfrom").datepicker({
                    dateFormat: "yy-mm-dd"
                });

                $("#search_dto").datepicker({
                    dateFormat: "yy-mm-dd",
                    minDate: new Date($scope.search.datefrom)
                });

                $("#search_dfrom").datepicker('setDate', new Date($scope.search.datefrom));
                $("#search_dto").datepicker('setDate', new Date($scope.search.dateto));



                $('#search_dfrom').change(function () {
                    disdate = new Date($(this).val());
                    $('#search_dto').datepicker('destroy');
                    $("#search_dto").datepicker({
                        minDate: disdate,
                        dateFormat: 'yy-mm-dd'
                    });
                    $("#search_dto").datepicker('setDate', new Date(disdate));
                });

                $("#tsearch").on('click', function () {
                    $scope.search.datefrom = $("#search_dfrom").val();
                    $scope.search.dateto = $("#search_dto").val();

                    $scope.unitSearch();
                });
            });

            $scope.cutoffData = function (f) {
                if (parseInt(f) == 0) {
                    $scope.dashboard.setup();
                    $scope.search.datefrom = $cookieStore.get('pay_start');
                    $scope.search.dateto = $cookieStore.get('pay_end');
                } else {
                    var urlData = {
                        'idperiod': $scope.dashboard.values.period.id,
                        'f': f
                    }
                    $http.post(apiUrl + 'payperiod.php', urlData)
                        .then(function (response, status) {
                            var data = response.data;
                            if (data.length == 0) {
                                $scope.dashboard.setup();
                                $scope.search.datefrom = $cookieStore.get('pay_start');
                                $scope.search.dateto = $cookieStore.get('pay_end');
                            } else {
                                $scope.search.datefrom = data.pay_start;
                                $scope.search.dateto = data.pay_end;
                                $scope.dashboard.values.period = data;
                            }
                        }, function (response) {
                            $rootScope.modalDanger();
                        });
                }
                $timeout(function () {
                    $("#search_dfrom").datepicker('setDate', new Date($scope.search.datefrom));
                    $("#search_dto").datepicker('setDate', new Date($scope.search.dateto));
                    $("#tsearch").click();
                }, 100);
            }

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

                vm.dtInstance.reloadData();
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


            $scope.resetCreateAcct = function () {
                $scope.isSaving = false;
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl + 'admin/tk/app/adjustment/add_view.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.add = data;
                        $scope.add.acct = $scope.dashboard.values.accountid;
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }


            $scope.generateattendanceTbl = function (date) {
                $scope.addaa = {};
                $scope.isSaving2 = false;
                var urlData = {
                    'acct': $scope.dashboard.values.accountid,
                    'from': date,
                    'to': date
                }
                $http.post(apiUrl + 'admin/emp/adjustment/add_dates.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.addaa.leave_dates = data;
                        $scope.addaa.acct = $scope.dashboard.values.accountid;

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

            $scope.shifts = function (idshift) {

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'idshift': idshift
                }
                $http.post(apiUrl + 'admin/emp/timesheet/shifts.php', urlData)
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

            $scope.changeshift = function (event, id, date, idshift) {
                $scope.wdate = '';
                if (event.target.checked == true) {
                    $("#modal-changeshift").modal("show");
                    $scope.shifts(idshift);
                    $scope.wdate = date;
                }
                $scope.cid = id;

                $scope.cancelcs = function (cid) {
                    $("#cs" + cid).prop('checked', false);
                }
            }

            $scope.adaj = function (event, id, date, idshift) {
                $scope.wdate = '';
                if (event.target.checked == true) {
                    $("#modal-addaj").modal("show");
                    $scope.wdate = date;
                    $scope.generateattendanceTbl(date);
                }
                $scope.cid = id;

                $scope.cancelaa = function (cid) {
                    $("#adaj" + cid).prop('checked', false);
                }
            }

            $scope.leaves = function (event, id, date, idshift) {
                $scope.wdate = '';
                if (event.target.checked == true) {
                    $("#modal-leaves").modal("show");
                    $scope.wdate = date;
                    $scope.leavesummary(date);
                }
                $scope.cid = id;

                $scope.cancellv = function (cid) {
                    $("#lv" + cid).prop('checked', false);
                }
            }

            $scope.overtime = function (event, id, date, idshift) {
                $scope.wdate = '';
                if (event.target.checked == true) {
                    $("#modal-overtime").modal("show");
                    $scope.wdate = date;
                    var d = new Date();
                    var disdate = new Date(date);
                    d.setDate(d.getDate() + 1);

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

                    $('#ot_dstart').datepicker("setDate", new Date(date));
                    $('#ot_dend').datepicker("setDate", new Date(date));

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
                $scope.cid = id;

                $scope.cancelot = function (cid) {
                    $("#ot" + cid).prop('checked', false);
                }
            }
        }

        $scope.proceedcs = function (wdate) {
            var urlData = {
                'id': $scope.csid,
                'accountid': $scope.dashboard.values.accountid,
                'date': wdate,
                'remarks': $scope.csremarks
            }

            $http.post(apiUrl + 'admin/emp/timesheet/changeshift.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.dtInstance.rerender();
                        $("#modal-changeshift").modal("hide");
                        $scope.csremarks = '';
                        $scope.csid = '';

                        $timeout(function () {
                            $("#btn-refreshh").click();
                        }, 1000);
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Success!";

                        if (data.reject.length == 0) {
                            $rootScope.dymodalmsg = "Change Shift created successfully";
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

                        $(document).ready(function () {
                            $("div.cutoff").html('<div class="btn-group"><button id="cnext"><<</button><button> CutOff Period</button><button id="cprev">>></button></div>');
                            $("div.toolbar").html(`<button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </button> 
                            <input type="text" placeholder="Date from" maxlength="10" id="search_dfrom" name="search_dfrom" readonly required />
                             <input type="text" placeholder="Date To" maxlength="10" id="search_dto" name="search_dto" readonly required /> 
                              <button style="color : white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);


                            $("#search_dfrom").datepicker({
                                dateFormat: "yy-mm-dd"
                            });

                            $("#search_dto").datepicker({
                                dateFormat: "yy-mm-dd",
                                minDate: new Date($scope.search.datefrom)
                            });

                            $("#search_dfrom").datepicker('setDate', new Date($scope.search.datefrom));
                            $("#search_dto").datepicker('setDate', new Date($scope.search.dateto));



                            $('#search_dfrom').change(function () {
                                disdate = new Date($(this).val());
                                $('#search_dto').datepicker('destroy');
                                $("#search_dto").datepicker({
                                    minDate: disdate,
                                    dateFormat: 'yy-mm-dd'
                                });
                                $("#search_dto").datepicker('setDate', new Date(disdate));
                            });

                            $("#tsearch").on('click', function () {
                                $scope.search.datefrom = $("#search_dfrom").val();
                                $scope.search.dateto = $("#search_dto").val();

                                $scope.unitSearch();
                            });
                            $("#cnext").on('click', function () {
                                alert();
                            });
                            $("#cprev").on('click', function () {
                                alert();
                            });
                        });
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.proceedaa = function (wdate, file) {
            var r = confirm("Are you sure you want to create requests?");

            if (r == true) {
                spinnerService.show('form01spinner');
                $scope.isSaving = true;

                Upload.upload({
                    url: apiUrl + 'admin/emp/adjustment/addajustment.php',
                    method: 'POST',
                    file: file,
                    data: {
                        'accountid': $scope.dashboard.values.accountid,
                        'info': $scope.addaa,
                        'date': wdate,
                        'remarks': $scope.aaremarks,
                        'targetPath': '../../../admin/tk/app/adjustment/file/'
                    }
                }).then(function (response) {
                    var data = response.data;
                    $scope.isSaving = false;
                    spinnerService.hide('form01spinner');

                    if (data.status == "error") {
                        $rootScope.modalDanger();
                    } else if (data.status == 'error-upload-type') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Only png, jpg, pdf, and jpeg files are accepted";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                        return;
                    } else {
                        $scope.dtInstance.rerender();
                        $("#modal-addaj").modal("hide");
                        $scope.aaremarks = '';

                        $timeout(function () {
                            $("#btn-refreshh").click();
                        }, 1000);
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


                        $(document).ready(function () {
                            $("div.cutoff").html('<div class="btn-group"><button id="cnext"><<</button><button> CutOff Period</button><button id="cprev">>></button></div>');
                            $("div.toolbar").html(`<button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </button> 
                            <input type="text" placeholder="Date from" maxlength="10" id="search_dfrom" name="search_dfrom" readonly required />
                             <input type="text" placeholder="Date To" maxlength="10" id="search_dto" name="search_dto" readonly required /> 
                              <button style="color : white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);


                            $("#search_dfrom").datepicker({
                                dateFormat: "yy-mm-dd"
                            });

                            $("#search_dto").datepicker({
                                dateFormat: "yy-mm-dd",
                                minDate: new Date($scope.search.datefrom)
                            });

                            $("#search_dfrom").datepicker('setDate', new Date($scope.search.datefrom));
                            $("#search_dto").datepicker('setDate', new Date($scope.search.dateto));



                            $('#search_dfrom').change(function () {
                                disdate = new Date($(this).val());
                                $('#search_dto').datepicker('destroy');
                                $("#search_dto").datepicker({
                                    minDate: disdate,
                                    dateFormat: 'yy-mm-dd'
                                });
                                $("#search_dto").datepicker('setDate', new Date(disdate));
                            });

                            $("#tsearch").on('click', function () {
                                $scope.search.datefrom = $("#search_dfrom").val();
                                $scope.search.dateto = $("#search_dto").val();

                                $scope.unitSearch();
                            });
                            $("#cnext").on('click', function () {
                                alert();
                            });
                            $("#cprev").on('click', function () {
                                alert();
                            });
                        });
                    }

                }, function (response) {
                    if (response.status > 0) {
                        $rootScope.modalDanger();
                    }
                });

            }
        }

        $scope.proceedot = function () {
            if ($('#ot_remarks').val() || $('#ot_end').val()) {
                spinnerService.show('form01spinner');
                $scope.isSaving = true;
                $scope.add.otsdate = $('#ot_dstart').val();
                $scope.add.start_time = $('#ot_start').val();

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.add
                }

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
                            $scope.dtInstance.rerender();


                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);

                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";

                            $("#modal-overtime").modal("hide");

                            if (data.reject.length == 0) {
                                $rootScope.dymodalmsg = "Overtime created successfully";
                                $scope.csremarks = '';
                                $scope.csid = '';
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

                            $(document).ready(function () {
                                $("div.cutoff").html('<div class="btn-group"><button id="cnext"><<</button><button> CutOff Period</button><button id="cprev">>></button></div>');
                                $("div.toolbar").html(`<button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </button> 
                                <input type="text" placeholder="Date from" maxlength="10" id="search_dfrom" name="search_dfrom" readonly required />
                                 <input type="text" placeholder="Date To" maxlength="10" id="search_dto" name="search_dto" readonly required /> 
                                  <button style="color : white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);


                                $("#search_dfrom").datepicker({
                                    dateFormat: "yy-mm-dd"
                                });

                                $("#search_dto").datepicker({
                                    dateFormat: "yy-mm-dd",
                                    minDate: new Date($scope.search.datefrom)
                                });

                                $("#search_dfrom").datepicker('setDate', new Date($scope.search.datefrom));
                                $("#search_dto").datepicker('setDate', new Date($scope.search.dateto));



                                $('#search_dfrom').change(function () {
                                    disdate = new Date($(this).val());
                                    $('#search_dto').datepicker('destroy');
                                    $("#search_dto").datepicker({
                                        minDate: disdate,
                                        dateFormat: 'yy-mm-dd'
                                    });
                                    $("#search_dto").datepicker('setDate', new Date(disdate));
                                });

                                $("#tsearch").on('click', function () {
                                    $scope.search.datefrom = $("#search_dfrom").val();
                                    $scope.search.dateto = $("#search_dto").val();

                                    $scope.unitSearch();
                                });
                                $("#cnext").on('click', function () {
                                    alert();
                                });
                                $("#cprev").on('click', function () {
                                    alert();
                                });
                            });
                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            } else {
                $.notify("Please spicify remarks", "error");
            }
        }



        $scope.leavesummary = function (date) {
            $scope.leavesumm = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'date': date
            }
            $http.post(apiUrl + 'admin/emp/timesheet/leavesummary.php', urlData)
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

        $scope.clvtype = function () {
            $scope.generateTbllv($scope.lvtype, $scope.wdate);
        };

        $scope.isSaving2 = true;
        $scope.generateTbllv = function (lvid, date) {
            $scope.isSaving = false;
            $scope.isSaving2 = false;
            var urlData = {
                'acct': $scope.dashboard.values.accountid,
                'idleave': lvid,
                'from': date,
                'to': date
            }
            $http.post(apiUrl + 'admin/tk/app/leaves/add_dates.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.addlv.leave_dates = data;
                    $scope.total_units = $scope.addlv.leave_dates[($scope.addlv.leave_dates.length - 1)]["unit"];
                    $scope.addlv.idleave = lvid;
                    $scope.addlv.datefrom = date;
                    $scope.addlv.dateto = date;
                    $scope.addlv.acct = $scope.dashboard.values.accountid;
                    $scope.addlv.remarks = '';
                    $scope.showfilebtn = 0;
                    if ($scope.addlv.idleave == 1) {
                        if ($scope.total_units > 8) {
                            $scope.showfilebtn = 1;
                        }
                    }

                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.proceedlv = function (file) {
            if ($scope.lvremarks == '') {
                $rootScope.dymodalstat = true;
                $rootScope.dymodaltitle = "Warning!";
                $rootScope.dymodalmsg = "Please specify leave reasons";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                $("#dymodal").modal("show");
                return;
            } else {
                if ($scope.addlv.leave_dates.length > 0) {
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
                            'info': $scope.addlv,
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
                            $scope.dtInstance.rerender();

                            $scope.add = '';

                            $timeout(function () {
                                $("#btn-refreshh").click();

                            }, 1000);
                            $("#modal-leaves").modal("hide");
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

                            $(document).ready(function () {
                                $("div.cutoff").html('<div class="btn-group"><button id="cnext"><<</button><button> CutOff Period</button><button id="cprev">>></button></div>');
                                $("div.toolbar").html(`<button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </button> 
                                <input type="text" placeholder="Date from" maxlength="10" id="search_dfrom" name="search_dfrom" readonly required />
                                 <input type="text" placeholder="Date To" maxlength="10" id="search_dto" name="search_dto" readonly required /> 
                                  <button style="color : white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);


                                $("#search_dfrom").datepicker({
                                    dateFormat: "yy-mm-dd"
                                });

                                $("#search_dto").datepicker({
                                    dateFormat: "yy-mm-dd",
                                    minDate: new Date($scope.search.datefrom)
                                });

                                $("#search_dfrom").datepicker('setDate', new Date($scope.search.datefrom));
                                $("#search_dto").datepicker('setDate', new Date($scope.search.dateto));



                                $('#search_dfrom').change(function () {
                                    disdate = new Date($(this).val());
                                    $('#search_dto').datepicker('destroy');
                                    $("#search_dto").datepicker({
                                        minDate: disdate,
                                        dateFormat: 'yy-mm-dd'
                                    });
                                    $("#search_dto").datepicker('setDate', new Date(disdate));
                                });

                                $("#tsearch").on('click', function () {
                                    $scope.search.datefrom = $("#search_dfrom").val();
                                    $scope.search.dateto = $("#search_dto").val();

                                    $scope.unitSearch();
                                });
                                $("#cnext").on('click', function () {
                                    alert();
                                });
                                $("#cprev").on('click', function () {
                                    alert();
                                });
                            });
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

        $scope.cancelapplication = function (type, id) {
            var urlData = {
                'id': id,
                'accountid': $scope.dashboard.values.accountid,
                'type': type
            }

            $http.post(apiUrl + 'admin/tk/app/timekeeping/cancelapplication.php', urlData)
                .then(function (response, status) {
                    $scope.dtInstance.rerender();
                    if (type == 'attendance') {
                        type = 'Attendance Adjustment';
                    }
                    if (type == 'overtime') {
                        type = 'Overtime';
                    }
                    if (type == 'changeshift') {
                        type = 'Change shift';
                    }
                    if (type == 'obtrip') {
                        type = 'Official Business Trip';
                    }
                    $.notify(type + " application successfully Cancelled", "success");
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }
        $scope.cancellvapplication = function (id) {
            var urlData = {
                'id': id,
                'accountid': $scope.dashboard.values.accountid,
            }
            $http.post(apiUrl + 'admin/tk/app/leaves/cancelleave.php', urlData)
                .then(function (response, status) {
                    $scope.dtInstance.rerender();
                    $.notify("Leave successfully Cancelled", "success");
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.multi = function () {
            window.location = "#/admin/emp/app/leaveapp";
        }
        $scope.dashboard.setup();
    }
]);