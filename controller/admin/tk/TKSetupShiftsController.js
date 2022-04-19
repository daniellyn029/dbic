app.controller('TKSetupShiftsController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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

        $scope.setup_shifts_functions = function () {
            $scope.add = {};
            $scope.search = [];
            $scope.edit = [];
            $scope.search.name = '';
            $scope.search.alias = '';
            var vm = this;
            $scope.vm = vm;
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: apiUrl + 'admin/tk/setup/shifts/data.php',
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
                DTColumnBuilder.newColumn('name').withTitle('Name').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('stime').withTitle('Time In').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ftime').withTitle('Time Out').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ambstart').withTitle('AM Break Start Time').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('ambend').withTitle('AM Break End Time').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('breakin').withTitle('Noon Break Start Time').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('breakout').withTitle('Noon Break End Time').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('pmbstart').withTitle('PM Break Start Time').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('pmbend').withTitle('PM Break End Time').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('pdbreak').withTitle('Paid Breaks').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn('stype').withTitle('Shift Type').withClass('btnTD').notSortable(),
                DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
                    .renderWith(function (data, type, full, meta) {
                        if (data.isdefault == 0) {
                            var btn = '<button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-edit"></i> Update</button>';
                            //btn 	+= ' <button class="btn btn-flat btn-sm btn-success" title="Assign" data-target="#assignModal" data-toggle="modal" onclick="angular.element(this).scope().assign_view(\'' + data.id + '\')" ><i class="fa fa-briefcase"></i> Assign</button>';
                        } else {
                            var btn = '';
                        }
                        return btn;
                    })
            ];
            vm.dtInstance = {};

            $(document).ready(function () {
                $("div.buttons").html(`<button id="btn-refreshh" style="margin-right:3px;" class="btn btn-flat btn-primary pull-right"
                                            ng-click="dtInstance.reloadData()" title="Refresh">
                                            <i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh
                                        </button>
                                    
                                        <button style="margin-right:3px;" class="btn btn-flat btn-primary pull-right" title="Create"
                                            data-toggle="modal" data-target="#modal-add" ng-click="resetCreateAcct()">
                                            <i class="fa fa-plus-circle fa-sm" style="padding:3px"></i>Add
                                        </button>`);
            });

            $scope.unitSearch = function () {
                vm.dtInstance.reloadData();
            }

            $scope.resetSearch = function () {
                $scope.search = [];
                $scope.search.name = '';
                $scope.search.alias = '';
                $timeout(function () {
                    $("#btn-refreshh").click();
                }, 100);
            }

            $scope.resetCreateAcct = function () {
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl + 'admin/tk/setup/shifts/add_view.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.add = data;
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }

            $scope.edit_view = function (id) {
                var urlData = {
                    'id': id
                }
                $http.post(apiUrl + 'admin/tk/setup/shifts/edit_view.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
                        $scope.edit = data;

                        var paidbreak = $scope.edit.paidbreaks.split(',');

                        $timeout(function () {
                            jQuery('.epdb' + $scope.edit.id).each(function (index) {
                                var currentElement = $(this);
                                if (paidbreak[index] == 1) {
                                    console.log(paidbreak[index]);
                                    currentElement.attr('checked', true);
                                }
                            });
                        }, 500);


                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }

            $scope.editShift = function () {
                var pdbreak = '';

                jQuery('.epdb' + $scope.edit.id).each(function (index) {
                    var currentElement = $(this);
                    if (currentElement.is(":checked")) {
                        pdbreak = pdbreak + ',' + 1;
                    } else {
                        pdbreak = pdbreak + ',' + 0;
                    }
                });

                var pdbreaks = pdbreak.substring(1);

                $scope.isSaving = true;
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.edit,
                    'pdbreaks': pdbreaks
                }

                $http.post(apiUrl + 'admin/tk/setup/shifts/edit.php', urlData)
                    .then(function (response, status) {
                        $scope.isSaving = false;
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
                        } else if (data.status == "name") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Shift Name";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "exists1") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Shift Name already taken";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err1") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Time In or Time Out entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err2") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Break In or Break Out entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err3") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid AM Break Start or Break End Time entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err4") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid PM Break Start or Break End Time entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            vm.dtInstance.reloadData();
                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);
                            $("#editModal").modal("hide");
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "Shift updated successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");

                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }

            $scope.addShift = function () {
                $scope.isSaving = true;
                var pdbreak = '';

                jQuery('.pdb').each(function (index) {
                    var currentElement = $(this);
                    if (currentElement.is(":checked")) {
                        pdbreak = pdbreak + ',' + 1;
                    } else {
                        pdbreak = pdbreak + ',' + 0;
                    }
                });

                var pdbreaks = pdbreak.substring(1);
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'info': $scope.add,
                    'pdbreaks': pdbreaks
                }
                console.log(urlData);
                $http.post(apiUrl + 'admin/tk/setup/shifts/create.php', urlData)
                    .then(function (response, status) {
                        $scope.isSaving = false;
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
                        } else if (data.status == "name") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please specify Shift Name";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "exists1") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Shift Name already taken";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err1") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Time In or Time Out entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err2") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid Noon Break Start or Break End Time entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err3") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid AM Break Start or Break End Time entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else if (data.status == "err4") {
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Invalid PM Break Start or Break End Time entered";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            vm.dtInstance.reloadData();
                            $timeout(function () {
                                $("#btn-refreshh").click();
                            }, 1000);
                            $("#modal-add").modal("hide");
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Success!";
                            $rootScope.dymodalmsg = "Shift added successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";
                            $("#dymodal").modal("show");
                        }
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