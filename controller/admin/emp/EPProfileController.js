app.controller('EPProfileController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
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
                accounts: []
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

        $scope.profile_functions = function () {
            var urlData = {
                'id': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/emp/profile/view.php', urlData)
                .then(function (response, status) {
                    var data = response.data;

                    $scope.view = data[0];

                }, function (response) {
                    $rootScope.modalDanger();
                });
        }


        $scope.save123 = function () {

            if( ($scope.view.new_fname == '' || $scope.view.new_fname == null) && ($scope.view.new_mname == '' || $scope.view.new_mname == null) &&
                ($scope.view.new_lname == '' || $scope.view.new_lname == null) && ($scope.view.new_suffix == '' || $scope.view.new_suffix == null) &&
                ($scope.view.new_nickname == '' || $scope.view.new_nickname == null) && ($scope.view.new_mari_stat == '' || $scope.view.new_mari_stat == null) &&
                ($scope.view.new_emer_name == '' || $scope.view.new_emer_name == null) && ($scope.view.new_emer_cont == '' || $scope.view.new_emer_cont == null) &&
                ($scope.view.new_add_st == '' || $scope.view.new_add_st == null) && ($scope.view.new_add_area == '' || $scope.view.new_add_area == null) &&
                ($scope.view.new_add_city == '' || $scope.view.new_add_city == null) && ($scope.view.new_add_prov == '' || $scope.view.new_add_prov == null) &&
                ($scope.view.new_add_code == '' || $scope.view.new_add_code == null) && ($scope.view.new_pnum == '' || $scope.view.new_pnum == null) &&
                ($scope.view.new_fax_num == '' || $scope.view.new_fax_num == null) && ($scope.view.new_mnum == '' || $scope.view.new_mnum == null) &&
                ($scope.view.new_add_code == '' || $scope.view.new_add_code == null) && ($scope.view.new_pnum == '' || $scope.view.new_pnum == null) &&
                ($scope.view.new_dependent.new_dependent_name[0] == '') && $scope.view.new_dependent.new_dependent_bdate[0] == '' ){
                $rootScope.dymodalstat = true;
                $rootScope.dymodaltitle= "Warning!";
                $rootScope.dymodalmsg  = "Please input fields";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                $("#dymodal").modal("show");
                return;
            }
            
            var qwe = true;
            $scope.view.new_dependent.new_dependent_name.forEach(function(item,index){
                if( ($scope.view.new_dependent.new_dependent_name[index] == '' && $scope.view.new_dependent.new_dependent_bdate[index] == '') ){
                }else{
                    if( ($scope.view.new_dependent.new_dependent_name[index] == '' || $scope.view.new_dependent.new_dependent_bdate[index] == '') ){
                        qwe = false;
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Kindly complete Dependent Fields";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                       return;
                    }
                }

                
            }); 
           
            // $scope.view.new_dependent.new_dependent_bdate.forEach(function(item,index){
            //     if((item != '' && ($scope.view.new_dependent.new_dependent_name[index] == '' || $scope.view.new_dependent.new_dependent_name[index] == null)) || ($scope.view.new_dependent.new_dependent_name[index] != '' && item == '')){
            //         $rootScope.dymodalstat = true;
            //         $rootScope.dymodaltitle= "Warning!";
            //         $rootScope.dymodalmsg  = "Complete Dependent Fields";
            //         $rootScope.dymodalstyle = "btn-warning";
            //         $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
            //         $("#dymodal").modal("show");
            //         return;
            //     }
            // });
            
            if(qwe == true){
                var urlData = {
                    'accountid'     : $scope.dashboard.values.accountid,
                    'save'          : $scope.view
                }
               
                $http.post(apiUrl + 'admin/emp/profile/save.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;
    
                        $scope.isSaving = false;
                        
                        if( data.status == "error" ){
                            $rootScope.modalDanger();
                            return;
                        }else if (data.status == "haspending"){
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle= "Warning!";
                            $rootScope.dymodalmsg  = "You still have pending request on HR.";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                            $("#dymodal").modal("show");
                            return;
                        }else{
    
                            $scope.view.new_fname = '';
                            $scope.view.new_mname = '';
                            $scope.view.new_lname = '';
                            $scope.view.new_suffix = '';
                            $scope.view.new_nickname = '';
                            $scope.view.new_mari_stat = '';
                            $scope.view.new_emer_name = '';
                            $scope.view.new_emer_cont = '';
                            $scope.view.new_add_st = '';
                            $scope.view.new_add_area = '';
                            $scope.view.new_add_city = '';
                            $scope.view.new_add_prov = '';
                            $scope.view.new_add_code = '';
                            $scope.view.new_pnum = '';
                            $scope.view.new_fax_num = '';
                            $scope.view.new_mnum = '';
                            $scope.view.new_dependent.new_dependent_name = [''];
                            $scope.view.new_dependent.new_dependent_bdate = [''];
                            $scope.view.new_dependent.new_dependent_age = [''];
                            
                            
                            
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle= "Success!";
                            $rootScope.dymodalmsg  = "Request added successfully";
                            $rootScope.dymodalstyle = "btn-success";
                            $rootScope.dymodalicon = "fa fa-check";				
                            $("#dymodal").modal("show");
                            
    
                        }	
                            
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
            
        }

        $scope.files2 = function(file){
			window.location = '/dbic/assets/php/admin/hr/employee/attachments/download.php?file='+file;
        }
        
        $scope.confirmPassCompBen = function(){
            // $scope.display=0;
            var urlData = {
                'id': $scope.dashboard.values.accountid,
                'compben_pass'  : $scope.compben_pass
            }
            $http.post(apiUrl + 'admin/emp/profile/viewCompBenInfo.php', urlData)
                .then(function (response, status) {
                    
                    var data = response.data;

                    if(data.status=='success'){
                        $scope.compben_pass ='';
                        $scope.display = true;
                        $("#modal-compben").modal("hide");
                        // $rootScope.dymodalstat = true;
                        // $rootScope.dymodaltitle= "Success!";
                        // $rootScope.dymodalmsg  = "You can now view your Compensation & Benefits Information";
                        // $rootScope.dymodalstyle = "btn-success";
                        // $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        // $("#dymodal").modal("show");
                        
                    }else if(data.status=='wrongpass'){	
                        $scope.compben_pass ='';
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Incorrect password";
                        $rootScope.dymodalstyle = "btn-danger";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                    }

                }, function (response) {
                    $rootScope.modalDanger();
                });
        }
        

        $scope.hideCompBen = function(){

            $scope.display = false;

        }

        // $scope.adddependents = function () {
        //     $("#dependents").append(`<input class="underline w"
        //     style="border: 0; background-color: #f5f5f5; display:table-cell;border-bottom: 1px solid black;">`);
        // }

        
        $scope.dashboard.setup();
    }]);