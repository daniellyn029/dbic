app.controller('MNGSchedulerShiftSched', ['$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/mng/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";
        $scope.scheduler = '';
        $scope.scheduler_name = '';
        $scope.dashboard = {
            values: {
                loggedid: $cookieStore.get('acct_id'),
                accountid: $cookieStore.get('acct_id'),
                accteid: $cookieStore.get('acct_eid'),
                accouttype: $cookieStore.get('acct_type'),
                accoutfname: $cookieStore.get('acct_fname'),
                accoutlname: $cookieStore.get('acct_lname'),
                acct_loc: $cookieStore.get('acct_loc'),
                //undersec	: JSON.parse($cookieStore.get('dept1')),
                undersec: $cookieStore.get('dept1'),
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
                $scope.entry = {
                    datefrom: '',
                    dateto: '',
                    empname: [{
                        empid: '',
                        date: [],
                        oldsched: [],
                        newsched: [],
                    }]
                };
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl + 'admin/tk/setup/settings.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.dashboard.values.period = data.period;
                        $scope.dashboard.values.accounts = data.accounts;
                        $scope.entry.datefrom = $scope.dashboard.values.period.pay_start;
                        $scope.entry.dateto = $scope.dashboard.values.period.pay_end;
                        if ($scope.entry.datefrom != '' && $scope.entry.dateto != '') {
                            $scope.dateparam();
                        }
                        $scope.temppayperiod = $scope.dashboard.values.period.id;
                        $scope.settings();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.cutoffData = function (f) {
            if (parseInt(f) == 0) {
                $scope.dashboard.setup();
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
                        } else {
                            if (data.pay_stat == "0") {
                                $scope.dashboard.values.period = data;
                                $scope.entry.datefrom = data.pay_start;
                                $scope.entry.dateto = data.pay_end;
                                $scope.dateparam();
                            } else {
                                $scope.dashboard.setup();
                            }
                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.settings = function () {
            $scope.scheduler = '';
            $scope.scheduler_name = '';
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'businessunit': $scope.dashboard.values.userInformation.business_unit
            }
            $http.post("/dbic/assets/php/admin/mng/shiftschedule/settings.php", urlData)
                .then(function (result) {
                    if (result.data.status == "empty") {
                        $scope.scheduler = '';
                    } else {
                        $scope.scheduler = result.data.idacct;
                        $scope.scheduler_name = result.data.empaname;
                        $timeout(function () {
                            $('#myscheduler').val(result.data.idacct).trigger('change');
                        }, 100);
                    }
                }, function (error) { }).finally(function () { });
        }

        $scope.savesettings = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'businessunit': $scope.dashboard.values.userInformation.business_unit,
                'scheduler': $scope.scheduler
            }
            $http.post("/dbic/assets/php/admin/mng/shiftschedule/savesettings.php", urlData)
                .then(function (data, status) {
                    if (data.data.savestatus == "success") {
                        $(".modal").modal("hide");
                        $.notify("Settings saved", "success");
                        $scope.settings();
                        return;
                    } else if (data.data.savestatus == "oops") {
                        $.notify("Failed to cancel", "error");
                        return;
                    }
                });
        }

        $scope.dateparam = function () {
            $scope.unit = '';
            $scope.type = 0;

            if ($scope.dashboard.values.undersec != '') {
                $scope.unit = $scope.dashboard.values.undersec;
                $scope.type = 2;
            } else {
                $scope.unit = $scope.dashboard.values.userInformation.idunit;
                $scope.type = 1;
            }

            if ($scope.entry.datefrom > $scope.entry.dateto) {
                $rootScope.dymodalstat = true;
                $rootScope.dymodaltitle = "Warning!";
                $rootScope.dymodalmsg = "Invalid date entered";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                $("#dymodal").modal("show");
                return;
            }

            if ($scope.entry.datefrom != '' && $scope.entry.dateto != '') {
                $scope.entry.empname = [{
                    empid: '',
                    oldsched: [],
                    newsched: [],
                }];
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'datefrom': $scope.entry.datefrom,
                    'dateto': $scope.entry.dateto,
                    'type': $scope.type,
                    'unit': $scope.unit
                }
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/datefilter.php", urlData)
                    .then(function (result) {
                        $scope.dates = result.data.work_date;
                        result.data.employee.forEach(function (item, index) {
                            $scope.entry.empname[index] = {
                                empid: '',
                                date: [],
                                oldsched: [],
                                newsched: [],
                            };
                            $scope.entry.empname[index].empid = item.idacct;
                        });
                        $scope.empunder = '';
                        $scope.EmpUnder();

                    }, function (error) { }).finally(function () { });
            }
        }

        $scope.EmpUnder = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'under': $scope.dashboard.values.undersec
            }
            $http.post("/dbic/assets/php/admin/mng/shiftschedule/empunder.php", urlData)
                .then(function (result) {
                    if (result.data.status == "empty") {
                        $scope.empunder = [];
                    } else {
                        $scope.empunder = result.data;
                    }
                }, function (error) { }).finally(function () { });
        }

        $scope.generatebtn = '';
        $scope.generatedr = function () {
            $scope.generatebtn = 'yes';
            $scope.dateparam();
            $scope.EmpUnder();
        }

        $scope.listShifts = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post("/dbic/assets/php/admin/mng/shiftschedule/listshifts.php", urlData)
                .then(function (data, status) {
                    $scope.shifts = data.data;
                });
        }

        $scope.schd = [];
        $scope.empsched = function (id, parentindex) {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'usec': $scope.dashboard.values.undersec,
                'idacct': id,
                'datefrom': $scope.entry.datefrom,
                'dateto': $scope.entry.dateto,
                'unit': $scope.dashboard.values.userInformation.idunit
            }

            if ($scope.generatebtn == 'yes') {
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/generate.php", urlData)
                    .then(function (result) {
                        if (result.data.status == "empty") {
                            $scope.schd = [];
                            $scope.generatebtn = '';
                        } else {
                            $scope.schd[parentindex] = result.data;
                            $scope.generatebtn = '';
                        }
                    }, function (error) { }).finally(function () { });
            } else {

                $http.post("/dbic/assets/php/admin/mng/shiftschedule/namefilter.php", urlData)
                    .then(function (result) {
                        if (result.data.status == "empty") {
                            $scope.schd = [];
                        } else {
                            $scope.schd[parentindex] = result.data;
                        }
                    }, function (error) { }).finally(function () { });
            }


        };





        $scope.newscheds = function (parentindex, index) {
            var name = 'newsched' + '' + parentindex + '' + index;
            $scope.schd[parentindex][index].drpndng = $('select[name="' + name + '"]').val();
        }

        $scope.btn = function (index) {
            $scope.selindex = index;
            $timeout(function () {
                $('#checkboxall').prop('checked', false);
                $('select[name="dupselected"]').val(null).trigger('change');
            })
        }

        $scope.allemp = function () {
            if ($("#checkboxall").is(':checked')) {
                var selected = [];
                $timeout(function () {
                    angular.forEach($scope.empunder, function (value, key) {
                        if (key != $scope.selindex) {
                            selected.push(key);
                        }
                    });
                    $('select[name="dupselected"]').val(selected).trigger('change');
                })
            } else {
                $timeout(function () {
                    $('select[name="dupselected"]').val(null).trigger('change');
                })
            }


        }

        $scope.duplicate = function () {
            var arr = $('select[name="dupselected"]').val();
            angular.forEach($scope.schd[$scope.selindex], function (value, key) {
                if (value.drpndng) {
                    angular.forEach(arr, function (value1, key1) {
                        $timeout(function () {
                            $scope.schd[value1][key].drpndng = value.drpndng;
                            var name = 'newsched' + '' + value1 + '' + key;
                            $('select[name="' + name + '"]').val(value.drpndng).trigger('change');
                        })
                    });
                }
            });
        }

        $scope.btnapply = function (key) {
            var ctr = 0;
            var d = [];
            var o = [];
            var z = [];
            var x = [];
            $scope.dates.forEach(function (item, index) {
                d.push(item.work_date);
            })

            $scope.entry.empname[key].oldsched.forEach(function (item, index) {
                o.push(item[0]);
            })

            $scope.entry.empname[key].newsched.forEach(function (item, index) {
                z.push(item[0]);
                x.push(item[1]);
            })

            // console.log(z);
            // console.log(x);
            // console.log(o);
            // console.log(d);

            z.forEach(function (item, index) {
                if (item != '') {
                    ctr++;
                }
            })

            if (ctr == 0) {
                $rootScope.dymodalstat = true;
                $rootScope.dymodaltitle = "Warning!";
                $rootScope.dymodalmsg = "Please select new schedule/s";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                $("#dymodal").modal("show");
                return;
            } else {
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'idacct': $scope.entry.empname[key].empid,
                    'newschd': z,
                    'pending': x,
                    'oldschd': o,
                    'dates': d
                }
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/apply.php", urlData)
                    .then(function (data, status) {
                        if (data.data.status == "success") {
                            $scope.filtername(key);
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "New schedule created successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "error") {
                            $rootScope.modalDanger();
                            return;
                        }
                    });
            }


        }

        $scope.sec = function (p) {
            if (p == 'save') {
                var typecreate = 0;
                if ($scope.dashboard.values.undersec != '') {
                    typecreate = 2;
                }

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'employee': $scope.schd,
                    'typec': typecreate,
                    'button': p,
                    'businessunit': $scope.dashboard.values.undersec
                }
                console.log(urlData)
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/secretary.php", urlData)
                    .then(function (data, status) {
                        console.log(data.data);
                        if (data.data.savestatus == "success") {
                            $scope.dateparam();
                            $scope.empsched();
                            $scope.empunder = '';
                            $scope.EmpUnder();
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "New schedule created successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                            return;
                        }
                    });
            }
            if (p == 'submit') {
                var typecreate = 0;
                if ($scope.dashboard.values.undersec != '') {
                    typecreate = 2;
                }

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'employee': $scope.schd,
                    'typec': typecreate,
                    'button': p,
                    'businessunit': $scope.dashboard.values.undersec
                }
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/secretary.php", urlData)
                    .then(function (data, status) {
                        if (data.data.submitstatus == "success") {
                            $scope.empunder = '';
                            $scope.EmpUnder();
                            $scope.dateparam();
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "Duty Roster submitted succesfully for approval";
                            $rootScope.dymodalnote = "Note : You can no longer edit the roster once submitted/approved not unless it is recalled";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");

                            return;
                        } else if (data.data.submitstatus == "ooops") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Already submitted schedule";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.data.submitstatus == "oops") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please save the schedule before submitting";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        }
                    });

            }
        }

        $scope.mng = function (q) {
            if (q == 'approve') {
                var typecreate = 0;
                if ($scope.dashboard.values.undersec == '') {
                    typecreate = 1;
                }
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'employee': $scope.schd,
                    'typec': typecreate,
                    'button': q,
                    'businessunit': $scope.dashboard.values.userInformation.idunit
                }
                console.log($scope.schd);
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/manager.php", urlData)
                    .then(function (data, status) {

                        if (data.data.savestatus == "success") {
                            $scope.dateparam();
                            $scope.empunder = '';
                            $scope.EmpUnder();
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "New schedule approved successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");

                            return;
                        }
                        if (data.data.savestatus == "oops") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please save the schedule to approve";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        }
                    });


            } else if (q == 'save') {
                if ($scope.dashboard.values.undersec == '') {
                    typecreate = 1;
                }
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'employee': $scope.schd,
                    'typec': typecreate,
                    'button': q,
                    'businessunit': $scope.dashboard.values.userInformation.idunit
                }
                $http.post("/dbic/assets/php/admin/mng/shiftschedule/manager.php", urlData)
                    .then(function (data, status) {
                        if (data.data.savestatus == "success") {
                            $scope.empunder = '';
                            $scope.EmpUnder();
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "New schedule saved successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                            return;
                        }
                    });
            } else if (q == 'recall') {
                if ($scope.dashboard.values.undersec == '') {
                    typecreate = 1;
                }
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'employee': $scope.schd,
                    'typec': typecreate,
                    'button': q,
                    'businessunit': $scope.dashboard.values.userInformation.idunit
                }

                $http.post("/dbic/assets/php/admin/mng/shiftschedule/manager.php", urlData)
                    .then(function (data, status) {
                        if (data.data.savestatus == "success") {
                            $scope.empunder = '';
                            $scope.EmpUnder();
                            $scope.dateparam();
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "Schedule Recalled";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            $scope.dateparam();
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "No schedule submitted";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                            return;
                        }
                    });
            }
        }

        function hasDuplicates(array) {
            var valuesSoFar = Object.create(null);
            for (var i = 0; i < array.length; ++i) {
                var value = array[i];
                if (value in valuesSoFar && value != '') {
                    return true;
                }
                valuesSoFar[value] = true;
            }
            return false;
        }

        // $scope.next = function(){
        // 	// $scope.temppayperiod = parseInt($scope.dashboard.values.period.id) + 1;
        // 	// if($scope.dashboard.values.period.id!=$scope.temppayperiod){
        // 	// 	$scope.temppayperiod++;
        // 	// }
        // 	$scope.temppayperiod++;
        // 	alert($scope.dashboard.values.period.id+' '+$scope.temppayperiod);

        // 	var urlData = {
        // 		'accountid'	: $scope.dashboard.values.accountid,
        // 		'cutoff'	: $scope.temppayperiod
        // 	}
        // 	$http.post("/dbic/assets/php/admin/mng/shiftschedule/cutoff.php", urlData)
        // 	.then(function(data, status){
        // 		if(data.data.status == "empty"){
        // 			$scope.entry.datefrom 	='';
        // 			$scope.entry.dateto 	='';
        // 		}else{
        // 			$scope.entry.datefrom = data.data.start;
        // 			$scope.entry.dateto = data.data.end;
        // 			$scope.dateparam();
        // 		}
        // 	});

        // }
        $scope.copy = '';

        $(document).on("contextmenu", ".select2-selection__rendered", function (e) {
            $scope.copy = $(this).parent().parent().parent().prev().val();
            var schedcopy = $(this).parent().parent().parent().prev().attr('name');

            $scope.schedcopy = $('[name="' + schedcopy + '"]  option:selected').text();

            e.stopImmediatePropagation();
            $.notify("Scheduled copied", "success");
            return false;
        });


        $(document).on("contextmenu", ".select2-selection", function (e) {
            if ($scope.copy == '') {
                $.notify("Copy schedule first", "warn");
                e.stopImmediatePropagation();
                return false;
            } else {
                var select2 = $(this).parent().parent().prev().attr('name');
                var hasval = !!$('[name="' + select2 + '"] > option[value="' + $scope.copy + '"]').length;

                if (hasval == true) {
                    $(this).parent().parent().prev().val($scope.copy).trigger('change');
                    e.stopImmediatePropagation();
                    $.notify("Scheduled pasted", "success");
                    return false;
                } else {
                    e.stopImmediatePropagation();
                    $.notify("Selected Schedule Already " + $scope.schedcopy, "error");
                    return false;
                }
            }
        });


        $scope.dashboard.active();
        $scope.dashboard.setup();
        $scope.EmpUnder();
        $scope.listShifts();
    }]);