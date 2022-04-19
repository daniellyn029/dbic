app.controller('MNGAppLeaveController', ['$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/mng/sidebar/index.html";
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
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.app_leaves_functions = function () {
            $scope.add = [];
            $scope.edit = [];
            $scope.search = [];
            $scope.search.acct = '';
            $scope.search.docu = '';
            if (typeof ($location.search().st) === 'undefined' || $location.search().st == null) {
                $scope.search.datefrom = $rootScope.currperiod.pay_start;
                $scope.search.dateto = $rootScope.currperiod.pay_end;
                $scope.search.appstat = '';
            } else {
                $scope.search.datefrom = $location.search().df;
                $scope.search.dateto = $location.search().dt;
                $scope.search.appstat = $location.search().st;
            }

            if (typeof ($scope.search.datefrom) === 'undefined' ||
                typeof ($scope.search.dateto) === 'undefined') {
                $scope.search.datefrom = $cookieStore.get('pay_start');
                $scope.search.dateto = $cookieStore.get('pay_end');
            }

            var vm = this;
            $scope.vm = vm;
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/tk/app/leaves/data.php',
                    type: 'POST',
                    data: function (d) {
                        d.idsuperior = $scope.dashboard.values.accountid,
                            d.acct = $scope.search.acct,
                            d.docu = $scope.search.docu,
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
                .withDOM('<"cutoff dataTables_length"><"toolbar dataTables_length"><"toolbuttons dataTables_filter"><"cutoffinfo dataTables_length"><"title_table">t<"foot_con"<"buttons dataTables_info">p>')
                .withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $(".circlCheck").prop("checked", false);
                })
                .withOption('order', [1, 'asc']);
            vm.dtColumns = [
                DTColumnBuilder.newColumn('checkbox').withTitle('').notSortable().withClass('btnTD checkcircle'),
                // .renderWith(function (data, type, full, meta) {
                //     var btn = '';
                //     if (data.leave_status == "Pending") {
                //         btn = '<input ng-disabled="isSaving" type="checkbox" class="circlCheck2" value="' + data.id + '">';
                //     }
                //     return btn;
                // }),
                DTColumnBuilder.newColumn('empname').withTitle('Employee Name').withClass('btnTD'),
                DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTD'),
                DTColumnBuilder.newColumn('app_type').withTitle('Leave Type').withClass('btnTDC').notSortable(),
                DTColumnBuilder.newColumn('units').withTitle('Units').withClass('btnTDC').notSortable(),
                DTColumnBuilder.newColumn('remarks').withTitle('Reason').withClass('btnTDR').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('').withClass('btnTDL').notSortable().renderWith(function (data, type, full, meta) {
                    var btn = '';
                    if (data.file.length > 1) {
                        btn = '<img style="width:45px;cursor:pointer" src="assets/images/Attachment.png" onclick="angular.element(this).scope().viewfile(\'' + data.file + '\')" class="btn" title="Download" />';
                    }
                    return btn;
                }),
                DTColumnBuilder.newColumn('leave_status').withTitle('Status').withClass('btnTD')
                // .renderWith(function (data, type, full, meta) {
                //     var btn = '';
                //     if (data.leave_status == "Approved") {
                //         btn = '<span style="font-weight:600 !important; color: green !important"> Approved </span>';
                //     } else {
                //         btn = '<span style="font-weight:600 !important; color: red !important"> ' + data.leave_status + ' </span>';
                //     }
                //     return btn;
                // })
            ];
            vm.dtInstance = {};
            $(document).ready(function () {
                $("div.cutoff").html('<div class="btn-group"><button id="cnext" onclick="angular.element(this).scope().cutoffData(\'1\')" ><<</button><button onclick="angular.element(this).scope().cutoffData(\'0\')" >CutOff Period</button><button id="cprev" onclick="angular.element(this).scope().cutoffData(\'2\')" >>></button></div>');

                $("div.toolbuttons").html('<button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().xport()"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#modal-search" ><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refreshh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().dtInstance.reloadData()"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>');

                var str_div = '<div style="width: 100%; text-align: center; background: #c48813; font-size: 22pt; color: white;">Leaves</div>';
                $("div.title_table").html(str_div);

                var buttom = '<div> <button type="button" class="btn btn-primary" style="margin-right:5px;width:100px;border: 1px solid white;background:#c48813" data-toggle="modal" data-target="#modal-approved"  >Approve</button> <button type="button" class="btn btn-danger"  style="width:100px;border: 1px solid white;background:#c48813" data-toggle="modal" data-target="#modal-disapproved" >Disapprove</button> </div>';
                $("div.buttons").html(buttom);
                $("div.cutoffinfo").html(`<span style="font-weight:600 !important; color: green !important">Cutoff Period: </span><span ng-bind="dashboard.values.period.pay_start" style="font-weight:600 !important;" ></span> <span ng-show="dashboard.values.period.pay_start" style="font-weight:600 !important;" >to</span> <span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_end" ></span>
										  <span style="font-weight:600 !important; color: green !important;margin-left:15px;">Payroll Period: </span><span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_date" ></span>`);


                $(".checkcircle").html('<input class="circlCheck" type="checkbox" title="Approve all">');
                $(".circlCheck").click(function () {
                    var ele = $(".circlCheck");
                    if ($(ele).is(':checked')) {
                        $(".circlCheck2").prop("checked", true);
                    } else {
                        $(".circlCheck2").prop("checked", false);
                    }
                });

                $("div.toolbar").html(`<button disabled style="color:white;background-color: green; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data Parameter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</button> 
					
					<input type="text" placeholder="Date from" readonly searchdatepickers2 ng-model="search.datefrom" maxlength="10" id="search_dfrom" name="search_dfrom"  required  />
					<input type="text" placeholder="Date To"   readonly searchdatepickers2 ng-model="search.dateto"   maxlength="10" id="search_dto"   name="search_dto"    required  />
					
					 
					<button onclick="angular.element(this).scope().unitSearch()" style="color : white;background-color: green; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px;" type="button" id="tsearch">Apply</button>`);

                $compile($("div.cutoffinfo"))($scope);
                $compile($("div.toolbar"))($scope);

            });

            $scope.approve = function () {
                $scope.info = [];
                $(".circlCheck2:checked").each(function () {
                    var obj = {};
                    obj["idleave"] = $(this).val();
                    obj["leaveid"] = $(this).data("idleave");
                    obj["approvercount"] = $(this).data("approvercount");
                    obj["approversequence"] = $(this).data("approver");
                    obj["hours"] = $(this).data("hours");
                    obj["appid"] = $(this).data("appid");
                    obj["period_start"] = $(this).data("period_start");
                    obj["period_end"] = $(this).data("period_end");
                    obj["grace_hour"] = $(this).data("grace_hour");
                    obj["date"] = $(this).data("date");
                    $scope.info.push(obj);
                });

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.info
                }

                $http.post(apiUrl + 'admin/mng/leave/approve.php', urlData)
                    .then(function (response, status) {
                        $.notify('Leave Approved', "success");
                        $('#modal-approved').modal('hide');
                        vm.dtInstance.reloadData();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            };

            $scope.disapproved = function () {
                $scope.info = [];
                $(".circlCheck2:checked").each(function () {
                    var obj = {};
                    obj["idleave"] = $(this).val();
                    obj["leaveid"] = $(this).data("idleave");

                    obj["approvercount"] = $(this).data("approvercount");
                    obj["approversequence"] = $(this).data("approver");
                    obj["hours"] = $(this).data("hours");
                    obj["appid"] = $(this).data("appid");
                    obj["period_start"] = $(this).data("period_start");
                    obj["period_end"] = $(this).data("period_end");
                    obj["grace_hour"] = $(this).data("grace_hour");
                    obj["date"] = $(this).data("date");
                    obj["remarks"] = $scope.cancelreason;
                    $scope.info.push(obj);
                });

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.info
                }

                $http.post(apiUrl + 'admin/mng/leave/disapprove.php', urlData)
                    .then(function (response, status) {
                        $.notify($scope.header + ' Disapproved', "success");
                        $('#modal-disapproved').modal('hide');
                        vm.dtInstance.reloadData();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }


            $scope.xport = function () {
                var idsuperior = typeof $scope.dashboard.values.accountid === "undefined" ? '' : $scope.dashboard.values.accountid;
                var acct = typeof $scope.search.acct === "undefined" ? '' : $scope.search.acct;
                var docu = typeof $scope.search.docu === "undefined" ? '' : $scope.search.docu;
                var from = typeof $scope.search.datefrom === "undefined" ? '' : $scope.search.datefrom;
                var to = typeof $scope.search.dateto === "undefined" ? '' : $scope.search.dateto;
                var appstat = typeof $scope.search.appstat === "undefined" ? '' : $scope.search.appstat;
                var company = typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
                var datenow = typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');

                var url = apiUrl + "admin/tk/app/leaves/xport.php?datenow=" + datenow + "&idsuperior=" + idsuperior + "&company=" + company + "&acct=" + acct + "&docu=" + docu + "&from=" + from + "&to=" + to + "&appstat=" + appstat;
                var conf = confirm("Export to CSV?");
                if (conf == true) {
                    window.open(url, '_blank');
                }
            }

            $scope.cutoffData = function (f) {
                if (parseInt(f) == 0) {
                    $scope.dashboard.setup();
                    $scope.search.datefrom = $cookieStore.get('pay_start');
                    $scope.search.dateto = $cookieStore.get('pay_end');
                    $scope.unitSearch();
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
                                $scope.unitSearch();
                            } else {
                                $scope.search.datefrom = data.pay_start;
                                $scope.search.dateto = data.pay_end;
                                $scope.dashboard.values.period = data;
                            }
                            $scope.unitSearch();
                        }, function (response) {
                            $rootScope.modalDanger();
                        });
                }
            }

            $scope.unitSearch = function () {
                vm.dtInstance.reloadData();
            }

            $scope.resetSearch = function () {
                if (typeof ($location.search().st) === 'undefined' || $location.search().st == null) {
                    //$scope.search				= [];
                    $scope.search.acct = '';
                    $scope.search.docu = '';
                    //$scope.search.datefrom 		= '';
                    //$scope.search.dateto 		= '';
                    $scope.search.appstat = '';
                    $timeout(function () {
                        $("#btn-refreshh").click();
                    }, 100);
                } else {
                    $timeout(function () {
                        $(".modal-backdrop").remove();
                    }, 100);
                    $timeout(function () {
                        $window.location.href = "#/admin/mng/app/obapp";
                    }, 1000);
                };
            }

            $scope.filterAcct = function (acct) {
                if (parseInt($scope.dashboard.values.accouttype) == 1) {
                    return acct.id != '0';
                } else {
                    return acct.idsuperior == $scope.dashboard.values.accountid;
                }
            }

            $scope.edit_view = function (id) {
                var arr_id = [];
                $(".circlCheck2").each(function () {
                    var val = $(this).val();
                    if ($(this).is(':checked')) {
                        arr_id.push(val);
                    }
                });

                if (arr_id.length > 0) {
                    console.log(arr_id);
                    $scope.edit = [];
                    var urlData = {
                        'id': arr_id
                    }
                    $http.post(apiUrl + 'admin/mng/ob/edit_view.php', urlData)
                        .then(function (response, status) {
                            var data = response.data;
                            $scope.edit = data;
                            console.log($scope.edit);
                        }, function (response) {
                            $rootScope.modalDanger();
                        });
                } else {
                    $scope.edit = [];
                }
            }

            $scope.resetReason = function () {
                $scope.edit.reason = '';
            }

            $scope.editreq = function (o) {
                alert('No UX'); return
                if (typeof ($scope.edit.data) === 'undefined') {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "No request selected";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }

                if ($scope.edit.data.length > 0) {
                    $scope.edit.stat = o;
                    $scope.isSaving = true;
                    var urlData = {
                        'accountid': $scope.dashboard.values.accountid,
                        'info': $scope.edit
                    }
                    $http.post(apiUrl + 'admin/mng/ob/edit.php', urlData)
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
                            } else if (data.status == "noactual_hrs") {
                                $rootScope.dymodalstat = true;
                                $rootScope.dymodaltitle = "Warning!";
                                $rootScope.dymodalmsg = "You can not approve actual hours.";
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
                            } else {
                                $timeout(function () {
                                    $("#btn-refreshh").click();
                                }, 1000);
                                $(".modal").modal("hide");
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
                } else {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "No request selected";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }
            }
        }

        $scope.dashboard.setup();
        $rootScope.getCompanyName();
    }]);