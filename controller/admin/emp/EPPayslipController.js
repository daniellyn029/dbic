app.controller('EPPayslipController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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
        }



        $scope.setup_compensation = function () {

            $scope.search = [];
            $scope.sumhrs = [];
            $scope.search.acct = $scope.dashboard.values.accountid;
            $scope.search.datefrom = $rootScope.currperiod.pay_start;
            $scope.search.dateto = $rootScope.currperiod.pay_end;
            var vm = this;
            $scope.vm = vm;
            vm.PLdtOptions = DTOptionsBuilder.newOptions()
                // .withOption('ajax', {
                //     url: apiUrl + 'admin/emp/timesheet/data.php',
                //     type: 'POST',
                //     data: function (d) {
                //         d.acct = $scope.search.acct,
                //             d.dfrom = $scope.search.datefrom,
                //             d.dto = $scope.search.dateto

                //     },


                // })

                // .withOption('rowCallback', function (row) {
                //     if (!row.compiled) {
                //         $compile(angular.element(row))($scope);
                //         row.compiled = true;
                //     }
                // })
                //.withDataProp('data')
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
            //.withOption('drawCallback', function (settings) {
            //     $scope.totalpending = settings.json.data[settings.json.data.length - 1].pending;
            //     var api = this.api();
            //     $timeout(function () {
            //         if (settings.aoData.length > 0) {
            //             $scope.sumhrs = api.rows().data()[0].total;
            //         } else {
            //             $scope.sumhrs = { late: 0, ut: 0, absent: 0, leave: 0, ot: 0, reg: 0 };
            //         }
            //     }, 0);
            // });

            vm.PLdtColumns = [
                DTColumnBuilder.newColumn('').withTitle('<p class="fs25">PAYSLIP</p> <p class="text-left pcomp">DELSAN BUSINESS INNOVATIONS CORPORATION</p>').withClass('btnTDs').notSortable(),
                DTColumnBuilder.newColumn('').withTitle('').withClass('btnTDsunit').notSortable(),
                DTColumnBuilder.newColumn('').withTitle('<p class="text-right pcomp" id="cp">Cuttoff Period : </p> <p id="ei" class="text-right pcomp">Employee ID : </p>').withClass('btnTDs').notSortable(),
                DTColumnBuilder.newColumn('').withTitle('<p class="text-right pcomp" id="pp">Payroll Period : </p> <p id="en" class="text-right pcomp">Employee Name : </p>').withClass('btnTDs').notSortable(),
            ];
            vm.LEdtInstance = {};

            $(document).ready(function () {
                $("div.letoolbar").html('<button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px; margin-left: -6px;" type="button" class="ml-5">Data Parameter</button><input type="text" placeholder="Start date" id="compfrom" class="ml-5" required /><input type="text" placeholder="End date" id="compto" class="ml-5" required /><button disabled style="color:white;background-color: #f39c12; border-radius: 0;-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-width: 1px; margin-left: -6px;" type="button" class="ml-5">Apply</button> ');

                $("div.leyear").html('<input type="text" placeholder="Search.." id="layear" name="layear" readonly required />');

                $("#compfrom").datepicker({ dateFormat: "yy-mm-dd" });
                $("#compto").datepicker({ dateFormat: "yy-mm-dd" });

                $('#cp').append('<text style="font-weight: normal;"> 2020-01-11 to 2020-01-25 </text>');
                $('#pp').append('<text style="font-weight: normal;"> 2020-01-31 </text>');
                $('#ei').append('<text style="font-weight: normal;"> 0427</text>');
                $('#en').append('<text style="font-weight: normal;"> Cardoza, Ryan L.</text>');

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

                vm.PLdtInstance.reloadData();
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


        $scope.prevc = function () {

        }

        $scope.nextc = function () {
            alert();
        }

        $scope.dashboard.setup();
    }]);