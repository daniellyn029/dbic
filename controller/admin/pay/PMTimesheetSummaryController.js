app.controller('PMTimesheetSummaryController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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

        $scope.timesheetsummary = function () {
            $scope.view = [];
            $scope.search = [];
            $scope.search.name = '';
            $scope.search.alias = '';
            var vm = this;
            $scope.vm = vm;

            vm.tsdtOptions = DTOptionsBuilder.newOptions()
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
                .withDOM('l<"filter dataTables_filter">rtip')
                //.withOption('lengthMenu',[2,4,6,8])
                .withOption('order', [0, 'asc']);
            vm.tsdtColumns = [
                DTColumnBuilder.newColumn('id').withTitle('ID').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('name').withTitle('Name').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('orgunit').withTitle('Org_Unit').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('joblvl').withTitle('Job Level').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('reghrs').withTitle('Reg Hrs').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('abs').withTitle('Abs').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('late').withTitle('Late').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('und').withTitle('Und').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('adv').withTitle('Adv').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('rwdot').withTitle('Regular Work Day OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('rwdot8').withTitle('Regular Work Day OT Prof>8').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shwdot').withTitle('Special Holiday Work Day OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shwdnp').withTitle('Special Holiday Work Pay NP').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhbp').withTitle('Legal Holiday Basic Pay(100%)').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhwdot').withTitle('Legal Holiday Work Day OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhwdot8').withTitle('Legal Holiday Work Day OT>8').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('rdot').withTitle('Rest Day OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('rdot8').withTitle('Rest Day OT>8').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('np10610').withTitle('Night Premium (10am-6pm) 10%').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhrdot').withTitle('Legal Holiday Rest Day OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhrdot8').withTitle('Legal Holiday Rest Day OT>8').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shrdot').withTitle('Special Holiday Rest Day OT').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shrdot8').withTitle('Special Holiday Rest Day OT>8').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shrdnp').withTitle('Special Holiday Rest Day NP').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('rwdotnp').withTitle('Regular Work Day OT NP-Prof').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhwdnp').withTitle('Legal Holiday Work Day NP').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('lhrdnp').withTitle('Legal Holiday Rest Day NP').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('rdnp').withTitle('Rest Day Night Premium').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('shwdot').withTitle('Special Holiday Work Day OT(My)').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ma').withTitle('Meal Allowance').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('adate').withTitle('Apply Date').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('pdate').withTitle('Pay Date').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('remarks').withTitle('Remarks').withClass('btnTD').notSortable(),
            ];
            vm.tsdtInstance = {};

            $(document).ready(function () {
                $("div.filter").html(`<p>Pay Date : <input type="text" id="paydate"></p>`);

                $("#paydate").datepicker({
                    dateFormat: "yy-mm-dd"
                });
            });


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