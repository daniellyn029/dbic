app.controller('PMClosingController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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
                period: [],
                account: []
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

        $scope.pay_closing = function (id) {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'id_payperiod': id
            }
            $http.post(apiUrl + 'admin/pay/closing/process.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == "id_payperiod") {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "No Pay Period selected.";
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
                    } else if (data.status == "error") {
                        $rootScope.modalDanger();
                    } else if (data.status == "success") {
                        setTimeout(function () { $("#btn-refreshh").click(); }, 1000);
                    }



                }, function (response) {
                    $rootScope.modalDanger();
                });
        }


        $scope.closing_functions = function () {
            $scope.search = [];
            $scope.search.name = '';
            $scope.search.date = '';
            var vm = this;
            $scope.vm = vm;

            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/pay/closing/data.php',
                    type: 'POST',
                    data: function (d) {
                        d.name = $scope.search.name,
                            d.date = $scope.search.date
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
                DTColumnBuilder.newColumn('id').withTitle('ID').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('period_start').withTitle('START').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('period_end').withTitle('END').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('pay_date').withTitle('PAY DATE').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('period_stat').withTitle('STATUS').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
                    .renderWith(function (data, type, full, meta) {
                        if (parseInt(data.payrolltrans) > 0 && parseInt(data.stat) == 0) {
                            var btn = '<button class="btn btn-flat btn-sm btn-danger" title="Close Pay Period" onclick="angular.element(this).scope().pay_closing(\'' + data.id + '\')" ><i class="fa fa-times"></i> Close</button>';
                            return btn;
                        } else {
                            return '';
                        }
                    })
            ];
            vm.dtInstance = {};
        }

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