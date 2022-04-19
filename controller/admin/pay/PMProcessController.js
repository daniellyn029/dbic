app.controller('PMProcessController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/pay/sidebar/index.html";
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
                        $scope.dashboard.values.period = data.period;
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.earnings1 = function (views) {
            return views.trans != '68' && views.trans != '53' && views.trans != '54' && views.trans != '56' && views.trans != '61' && views.trans != '62';
        }
        $scope.earnings2 = function (views) {
            return views.trans == '53' || views.trans == '56' || views.trans == '61' || views.trans == '62';
        }
        $scope.earnings3 = function (views) {
            return views.trans == '54';
        }
        $scope.earnings4 = function (views) {
            return views.trans == '68';
        }

        $scope.payprocess_view = function () {
            $scope.view = [];
            $scope.search = [];
            $scope.search.name = '';
            $scope.search.alias = '';
            var vm = this;
            $scope.vm = vm;

            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/pay/process/data.php',
                    type: 'POST',
                    data: function (d) {
                        d.name = $scope.search.name,
                            d.alias = $scope.search.alias,
                            d.id_acct = ''
                    }
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withDOM('lfrtip')
                //.withOption('lengthMenu',[2,4,6,8])
                .withOption('order', [0, 'asc']);
            vm.dtColumns = [
                DTColumnBuilder.newColumn('empid').withTitle('Employee ID').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('emp').withTitle('Name').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('pay_date').withTitle('Date').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('amt').withTitle('NET Pay').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
                    .renderWith(function (data, type, full, meta) {
                        var btn = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().pay_view(\'' + data.id_acct + '\', \'' + data.id_paydate + '\')" ><i class="fa fa-eye"></i> Payslip</button>';
                        return btn;
                    })
            ];
            vm.dtInstance = {};

            $scope.pay_view = function (id_acct, id_paydate) {
                $scope.view = [];
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'id_acct': id_acct,
                    'id_paydate': id_paydate
                }
                $http.post(apiUrl + 'admin/pay/slip/view.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        console.log(data);
                        $scope.view = data;
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.payprocess_functions = function () {
            $scope.typeprocess = '';

            $scope.resetBar = function () {
                $("#progressbar").val(0);
                $("#progstatus").text("Analyzing 0%");
            }
            $scope.process = function () {
                if (parseInt($scope.typeprocess) == 1) {
                    Upload.upload({
                        url: apiUrl + 'admin/pay/process/process.php',
                        method: 'POST',
                        file: null,
                        data: {
                            'accountid': $scope.dashboard.values.accountid,
                            'id_paydate': $scope.dashboard.values.period.id,
                            'pay_date': $scope.dashboard.values.period.pay_date,
                            'targetPath': ''
                        }
                    }).progress(function (e) {
                        if (e.lengthComputable) {
                            var percent = (e.loaded / e.total) * 100;
                            $("#progressbar").val(Math.round(percent));
                            $("#progstatus").text("Analyzing " + Math.round(percent) + "%");
                        }
                    }).then(function (response) {
                        var data = response.data;
                        $timeout(function () {
                            $("#progstatus").text("Analyzed 100%");
                        }, 100);

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else if (data.status == "closedalready") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Could not overwrite Payroll Process.";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            $timeout(function () {
                                $("#progressbar").val("0");
                                $("#progstatus").text("Analyzed 0%");
                                $scope.typeprocess = '';
                                $("#btn-refreshh").click();
                            }, 100);
                        }
                    }, function (response) {
                        console.log(response);
                        if (response.status > 0) {
                            $rootScope.modalDanger();
                        }
                    });
                } else {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle = "Warning!";
                    $rootScope.dymodalmsg = "Invalid Process Type.";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }
            }

        }

        $scope.payprocess_view();

        $(document).ready(function () {
            if ($("body").hasClass("sidebar-collapse")) {
                $('.sidebar').removeClass("sidebar1280")
            } else {
                $('.sidebar').addClass('sidebar1280')
            }

            $("#tab").tabs();
        });

        $scope.toggleside = function () {
            if ($("body").hasClass("sidebar-collapse")) {
                $('.sidebar').addClass('sidebar1280')
            } else {
                $('.sidebar').removeClass("sidebar1280")
            }
        }


        $scope.dashboard.setup();

    }]);