app.controller('TKAppDutyRosterController', ['$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

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
                period: [],
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
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.dutyroster = function () {
            spinnerService.show('form01spinner');
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/tk/app/dutyroster/data.php', urlData)
                .then(function (response, status) {
                    $scope.departments = response.data;
                    spinnerService.hide('form01spinner');
                }, function (response) {
                    $rootScope.modalDanger();
                });

        }

        $scope.lock = function (stat, department, payperiod, departmentname) {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'stat': stat,
                'department': department,
                'payperiod': payperiod
            }
            console.log(urlData);
            $http.post(apiUrl + 'admin/tk/app/dutyroster/lock.php', urlData)
                .then(function (response, status) {
                    if (response.data.status == "error") {
                        $rootScope.modalDanger();
                    } else {
                        $scope.dutyroster();
                        if (response.data == 'locked') {
                            $.notify(departmentname + " Duty Roster Locked", "success");
                        }
                        if (response.data == 'unlocked') {
                            $.notify(departmentname + " Duty Roster Unlocked", "success");
                        }

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.resetSearch = function () {
            $scope.department = '';
        }

        $scope.unitSearch = function () {
            $scope.department = $scope.search;
        }

        $scope.xport = function () {
            $('th.firstr').remove();
            $('td.firstr').remove();
            $('td.removetd').remove();
            $('.tblack').attr('style', 'color: black !important');
            var url = 'data:application/vnd.ms-excel,' + encodeURIComponent($('#xport').html())
            location.href = url
            $scope.departments = '';
            $scope.dutyroster();
            return false;
        }

        $scope.filter = function () {
            $timeout(function () {
                $('#filterd').val('').trigger("change");
            }, 100);
        }

        $scope.print = function () {
            $('th.firstr').remove();
            $('td.firstr').remove();
            $('td.removetd').remove();
            $('.tblack').attr('style', 'color: black !important');
            var mywindow = window.open('', 'PRINT');
            mywindow.document.write('<html><head><title>' + document.title + '</title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write('<h1>' + document.title + '</h1>');
            mywindow.document.write(document.getElementById('xport').innerHTML);
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
            mywindow.close();
            $scope.departments = '';
            $scope.dutyroster();
            return false;
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


        $scope.dashboard.setup();
    }]);