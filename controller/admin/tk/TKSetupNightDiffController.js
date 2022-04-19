app.controller('TKSetupNightDiffController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/tk/sidebar/index.html";
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
                leavetype: []
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
                        $scope.dashboard.values.leavetype = data.leavetype;
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }


        $scope.nightdiff = function () {
            $scope.add = {};
            $scope.search = [];
            $scope.edit = [];
            $scope.search.name = '';
            $scope.search.alias = '';
            var vm = this;
            $scope.vm = vm;
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/tk/setup/nightdiff/data.php',
                    type: 'POST',
                    data: function (d) {
                        d.name = $scope.search.name,
                            d.alias = $scope.search.alias
                    }
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withDOM('<"buttons dataTables_filter">lrtip')
                //.withOption('lengthMenu',[2,4,6,8])
                .withOption('order', [0, 'asc']);
            vm.dtColumns = [
                DTColumnBuilder.newColumn('nightin').withTitle('Night In').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('nextin').withTitle('Next In').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('nextout').withTitle('Next Out').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('nightout').withTitle('Night Out').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('auto').withTitle('Auto').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
                    .renderWith(function (data, type, full, meta) {
                        var btn = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#modal-edit" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
                        return btn;
                    })
            ];
            vm.dtInstance = {};

            $scope.ni = function (id) {
                if ($('#ni' + id).is(':checked')) {
                    $scope.edit.nextin = 'Y';
                } else {
                    $scope.edit.nextin = 'N';
                }
            }
            $scope.no = function (id) {
                if ($('#no' + id).is(':checked')) {
                    $scope.edit.nightout = 'Y';
                } else {
                    $scope.edit.nightout = 'N';
                }
            }

            $scope.auto = function (id) {
                if ($('#auto' + id).is(':checked')) {
                    $scope.edit.auto = 'Y';
                } else {
                    $scope.edit.auto = 'N';
                }
            }

            $scope.editnightdiff = function () {
                $scope.isSaving = true;

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.edit
                }

                $http.post(apiUrl + 'admin/tk/setup/nightdiff/edit.php', urlData)
                    .then(function (response, status) {
                        $scope.isSaving = false;
                        var data = response.data;

                        if (data.status == "error") {
                            $rootScope.modalDanger();
                        } else {
                            vm.dtInstance.reloadData();
                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);
                            $("#modal-edit").modal("hide");
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "Leave Master updated successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });

            }

            $scope.edit_view = function (id) {
                var urlData = {
                    'id': id
                }
                $http.post(apiUrl + 'admin/tk/setup/nightdiff/edit_view.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.edit = data;

                        $timeout(function () {
                            if ($scope.edit.nextin == 'Y') {
                                $('#ni' + $scope.edit.id).prop('checked', true);
                            } else {
                                $('#ni' + $scope.edit.id).prop('checked', false);
                            }

                            if ($scope.edit.nightout == 'Y') {
                                $('#no' + $scope.edit.id).prop('checked', true);
                            } else {
                                $('#no' + $scope.edit.id).prop('checked', false);
                            }

                            if ($scope.edit.auto == 'Y') {
                                $('#auto' + $scope.edit.id).prop('checked', true);
                            } else {
                                $('#auto' + $scope.edit.id).prop('checked', false);
                            }

                        }, 500);


                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }

        }


        $(document).ready(function () {
            if ($("body").hasClass("sidebar-collapse")) {
                $('.sidebar').removeClass("sidebar1280")
            } else {
                $('.sidebar').addClass('sidebar1280')
            }


        });

        $scope.toggleside = function () {
            if ($("body").hasClass("sidebar-collapse")) {
                $('.sidebar').addClass('sidebar1280')
            } else {
                $('.sidebar').removeClass("sidebar1280")
            }
        }
        //$scope.dashboard.setup();
    }]);