app.controller('EPAnnouncementController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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

        $scope.announcement = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/emp/announcement/announcement.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.announcelist = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.viewannouncement = function (id) {
            window.location.href = '#/admin/emp/announcement/view';
            $cookieStore.put('viewid', id);
        }

        $scope.viewid = function () {

            var id = $cookieStore.get('viewid');

            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'id': id
            }

            $http.post(apiUrl + 'admin/emp/announcement/view.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.announcementview = data;
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });


        }
        $scope.filesrc = function (file) {
            if (file !== '')
                return '../../../../dbic/assets/php/admin/org/activity/file/' + file;
        }

        $scope.dashboard.setup();

    }]);