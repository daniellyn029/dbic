app.controller('PMRegisterController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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


        $scope.payregister = function () {
            $scope.search = [];
            $scope.search.name = '';
            $scope.search.date = '';
            var vm = this;
            $scope.vm = vm;

            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/pay/report/register/data.php',
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
                DTColumnBuilder.newColumn('labor_type').withTitle('LABOR').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('empid').withTitle('EMP ID').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('empname').withTitle('NAME').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('basic').withTitle('BASIC').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('und').withTitle('TARDY').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ot').withTitle('OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('np').withTitle('NP').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lvs').withTitle('LEAVES').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('gross').withTitle('GROSS').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('sss').withTitle('SSS').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ibig').withTitle('HDMF').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('hlth').withTitle('PHIL HEALTH').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('withtax').withTitle('TAX').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('netpay').withTitle('NET PAY').withClass('btnTD').notSortable()
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