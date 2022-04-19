app.controller('HRMassUpdaterController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/hr/sidebar/index.html";
        $scope.footerTemplate = "view/admin/footer/index.html";

        $scope.dashboard = {
            values: {
                loggedid	: $cookieStore.get('acct_id'),
                accountid	: $cookieStore.get('acct_id'),
                accteid		: $cookieStore.get('acct_eid'),
                accouttype	: $cookieStore.get('acct_type'),	
                accoutfname	: $cookieStore.get('acct_fname'),
                accoutlname	: $cookieStore.get('acct_lname'),
                acct_loc	: $cookieStore.get('acct_loc'),	
                userInformation: null,
                accttype:[],
                civilstat:[],
                emptypes:[],
                empstatus:[],
                joblvl:[],
                positions: [],
                labors:[],
                accounts:[],
            },
            active: function(){
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl+'tmsmems/loggedinuser.php',urlData)
                .then( function (response, status){			
                    var data = response.data;
                    if(data.status=='error'){	
                        $rootScope.modalDanger();
                    }else{
    
                        $scope.dashboard.values.userInformation = data;
                    }				
                }, function(response) {
                    $rootScope.modalDanger();
                });	
            },
            setup: function(){
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post(apiUrl+'admin/hr/employee/settings.php',urlData)
                .then( function (response, status){			
                    
                    var data = response.data;
                    $scope.dashboard.values.department 	= data.departments;
					$scope.entry = [];
                    $scope.entry.mu='mwi';
					$scope.select();
                }, function(response) {
                    $rootScope.modalDanger();
                });
            }
        }

        $scope.select = function(){
            if($scope.entry.mu=='mwi'){
                $scope.entry.mwi = [];
                $scope.entry.mwi.wono       = '';
                $scope.entry.mwi.effdate    = '';
                $scope.entry.mwi.minwage    = '';
                $scope.entry.mwi.region     = '';
                $scope.entry.mwi.attach     = '';
                $scope.viewByRegion         = '';
                $timeout(function () {				
                    $('#mwiregion').val($scope.entry.mwi.region).trigger("change");			
                }, 100);
                var urlData = {
                    'accountid'		: $scope.dashboard.values.accountid
                }
                $http.post(apiUrl+'admin/hr/massupdate/minwageinc/region.php', urlData)
                .then(function(data, status){
                    $scope.region = data.data;
                });
            }
            if($scope.entry.mu=='tt'){
                $scope.entry.tt = [];
                $scope.entry.tt.ir      = '';
                $scope.entry.tt.paygrp    = '';
                $scope.viewByPayGroup     = '';
                $timeout(function () {				
                    $('#mutype').val($scope.entry.tt.ir).trigger("change");
                    $('#mupaygrp').val($scope.entry.tt.paygrp).trigger("change");		
                }, 100);
                var urlData = {
                    'accountid'		: $scope.dashboard.values.accountid
                }
                $http.post(apiUrl+'admin/hr/massupdate/taxtable/dropdowns.php', urlData)
                .then(function(data, status){
                    $scope.dropdowns = data.data;
                });
            }
			//alert( $scope.entry.mu );
            if($scope.entry.mu=='sdand'){
                $scope.entry.sdand = [];
                $scope.entry.sdand.classif      = '';
                $scope.entry.sdand.shift        = '';
                $scope.entry.sdand.typeshift    = '';
                $scope.entry.sdand.note         = '';
                $scope.entry.sdand.sdate        = '';
                $scope.entry.sdand.edate        = '';
                $scope.viewByClassif            = '';
                $timeout(function () {				
                    $('#classif').val($scope.entry.sdand.classif).trigger("change");	
                }, 100);
                var urlData = {
                    'accountid'		: $scope.dashboard.values.accountid
                }
                $http.post(apiUrl+'admin/hr/massupdate/nonworkingday/shift.php', urlData)
                .then(function(data, status){
                    $scope.shifts = data.data;
                });
            }
        }

        //MWI
        $scope.filterRegion = function(region){
            if(region&&($scope.entry.mwi.minwage!=''||$scope.entry.mwi.minwage!=0)){
                var abc = $scope.entry.mwi.minwage ? $scope.entry.mwi.minwage : "0";
                if (abc.indexOf(',') > -1) { 
                    abc=abc.replace(/\,/g,'');
                }
                $scope.entry.mwi.minwage = abc;
                var urlData = {
                    'accountid'		: $scope.dashboard.values.accountid,
                    'region'		: region,
                    'minwage'       : $scope.entry.mwi.minwage
                }
                $http.post(apiUrl+'admin/hr/massupdate/minwageinc/filterRegion.php', urlData)
                .then(function(data, status){
                    $scope.viewByRegion = data.data;
                    $scope.entry.mwi.minwage = addCommas($scope.entry.mwi.minwage);
                });
            }else{
                $scope.viewByRegion = '';
            }
        }

        $scope.resetmwi = function(){
            $scope.entry.mwi = [];
            $scope.viewByRegion = '';
            $timeout(function () {				
                $('#mwiregion').val($scope.entry.mwi.region).trigger("change");			
            }, 100);
        }

        $scope.updatemwi= function( file ){
            var r = confirm("This will update employee/s salary. Are you sure you want to update?");
            if(r==true){
                if($scope.entry.mwi.wono==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please enter wage order number";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if($scope.entry.mwi.effdate==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please enter effectivity date";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if($scope.entry.mwi.minwage==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please enter minimum wage";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if($scope.entry.mwi.region==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please enter region";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if(file==''||file==null){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please attach file <b>pdf/jpg/jpeg/png</b>";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if($scope.viewByRegion==''||$scope.viewByRegion==null){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No employee/s in selected region";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
                
                $scope.isSaving = true;
                Upload.upload({
                    url: apiUrl+'admin/hr/massupdate/minwageinc/update.php',
                    method: 'POST',
                    file: file,
                    data: {
                        'accountid'	: 	$scope.dashboard.values.accountid,
                        'entry'		:	$scope.entry.mwi,
                        'employees' :   $scope.viewByRegion,
                        'targetPath': 	'../../../../admin/hr/massupdate/minwageinc/attachments/'						
                    }
                }).then(function (response) {
                    var data = response.data;
                    $scope.isSaving = false;
                    if( data.status == "error" ){
                        $rootScope.modalDanger();
                        return;
                    }else if( data.status == "notloggedin" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "You are not logged in";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if( data.status == "entryExists" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "<b>Wage Order No.</b> already existed";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if( data.status == "tblfull" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Records already reached limit. Please contact system admin/creator";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='error-upload-type'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Only png, jpg, pdf, and jpeg files are accepted";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='error-iddoc'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No file uploaded or you forgot to choose type of document uploaded";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else{	
                        $scope.resetmwi();
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Success!";
                        $rootScope.dymodalmsg  = "Updated successfully";
                        $rootScope.dymodalstyle = "btn-success";
                        $rootScope.dymodalicon = "fa fa-check";				
                        $("#dymodal").modal("show");
                    }							
                }, function (response) {
                    if (response.status > 0){
                        $rootScope.modalDanger();
                    }
                });
            }
        }
        //End of MWI

        //TT
        $scope.filterPayGrp = function(paygrp){
            if(paygrp){
                var urlData = {
                    'accountid'		: $scope.dashboard.values.accountid,
                    'paygrp'		: paygrp
                }
                $http.post(apiUrl+'admin/hr/massupdate/taxtable/filterPayGroup.php', urlData)
                .then(function(data, status){
                    $scope.viewByPayGroup = data.data;
                });
            }else{
                $scope.viewByPayGroup = '';
            }
        }
        $scope.resettt = function(){
            $scope.entry.tt = [];
            $scope.viewByPayGroup     = '';
            $timeout(function () {				
                $('#mutype').val($scope.entry.tt.ir).trigger("change");
                $('#mupaygrp').val($scope.entry.tt.paygrp).trigger("change");		
            }, 100);
        }
        $scope.updatett= function( file ){
            var r = confirm("This will update employee/s internal revenue. Are you sure you want to update?");
            if(r==true){
                if($scope.entry.tt.ir ==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select internal revenue";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if($scope.entry.tt.paygrp==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select pay group";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
    
                if($scope.viewByPayGroup==''||$scope.viewByPayGroup==null){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No employee/s in selected region";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
                
                $scope.isSaving = true;
                Upload.upload({
                    url: apiUrl+'admin/hr/massupdate/taxtable/update.php',
                    method: 'POST',
                    file: file,
                    data: {
                        'accountid'	: 	$scope.dashboard.values.accountid,
                        'entry'		:	$scope.entry.tt,
                        'employees' :   $scope.viewByPayGroup,					
                    }
                }).then(function (response) {
                    var data = response.data;
                    $scope.isSaving = false;
                    if( data.status == "error" ){
                        $rootScope.modalDanger();
                        return;
                    }else if( data.status == "notloggedin" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "You are not logged in";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if( data.status == "entryExists" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "<b>Wage Order No.</b> already existed";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if( data.status == "tblfull" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Records already reached limit. Please contact system admin/creator";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='error-upload-type'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Only png, jpg, pdf, and jpeg files are accepted";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='error-iddoc'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No file uploaded or you forgot to choose type of document uploaded";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else{	
                        $scope.resettt();
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Success!";
                        $rootScope.dymodalmsg  = "Updated successfully";
                        $rootScope.dymodalstyle = "btn-success";
                        $rootScope.dymodalicon = "fa fa-check";				
                        $("#dymodal").modal("show");
                    }							
                }, function (response) {
                    if (response.status > 0){
                        $rootScope.modalDanger();
                    }
                });
            }
        }
        //End of TT

        //SDAND
        $scope.filterClassif = function(classif){
            if(classif&&$scope.entry.sdand.sdate!=''&&$scope.entry.sdand.edate!=''){
                // var today = new Date();
                // var dd = today.getDate();
        
                // var mm = today.getMonth()+1; 
                // var yyyy = today.getFullYear();
                // if(dd<10) 
                // {
                //     dd='0'+dd;
                // } 
        
                // if(mm<10) 
                // {
                //     mm='0'+mm;
                // } 
        
                // var date = yyyy+'-'+mm+'-'+dd;
        
                // if(date > $scope.entry.sdand.sdate){
                //     $rootScope.dymodalstat = true;
                //     $rootScope.dymodaltitle= "Warning!";
                //     $rootScope.dymodalmsg  = "Start date must be beyond today's date";
                //     $rootScope.dymodalstyle = "btn-warning";
                //     $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                //     $("#dymodal").modal("show");
                //     return;
                // }

                if( $scope.entry.sdand.sdate > $scope.entry.sdand.edate ){
                    $scope.viewByClassif = '';
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "End date must be greater than start date";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
                var urlData = {
                    'accountid'		: $scope.dashboard.values.accountid,
                    'sdate'		    : $scope.entry.sdand.sdate,
                    'edate'		    : $scope.entry.sdand.edate,
                    'classif'		: classif
                }
                $http.post(apiUrl+'admin/hr/massupdate/nonworkingday/filterClassification.php', urlData)
                .then(function(data, status){
                    if( data.data.status == "invalid" ){
                        $scope.viewByClassif = '';
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Invalid date selection";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }
                    $scope.viewByClassif = data.data;
                });
            }else{
                $scope.viewByClassif = '';
            }
        }
        $scope.resetsdand = function(){
            $scope.entry.sdand = [];
            // $scope.viewByPayGroup     = '';
            $timeout(function () {				
                $('#classif').val($scope.entry.sdand.classif).trigger("change");		
            }, 100);
        }
        $scope.updatesdand= function( file ){
            var r = confirm("This will update employee/s schedule. Are you sure you want to update?");
            if(r==true){
                if($scope.entry.sdand.classif ==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select classification";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }

                if($scope.entry.sdand.shift==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select new shift";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }

                if($scope.entry.sdand.typeshift==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select shift schedule (WS/FH/SH)";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }

                if($scope.entry.sdand.note==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input note";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }

                if($scope.entry.sdand.sdate==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select start date";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }

                if($scope.entry.sdand.edate==''){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please select end date";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }

                if($scope.viewByClassif==''||$scope.viewByClassif==null){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No employee/s in selected dates";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                    $("#dymodal").modal("show");
                    return;
                }
                
                $scope.isSaving = true;
                Upload.upload({
                    url: apiUrl+'admin/hr/massupdate/nonworkingday/update.php',
                    method: 'POST',
                    file: file,
                    data: {
                        'accountid'	: 	$scope.dashboard.values.accountid,
                        'entry'		:	$scope.entry.sdand,
                        'employees' :   $scope.viewByClassif,					
                    }
                }).then(function (response) {
                    var data = response.data;
                    $scope.isSaving = false;
                    if( data.status == "error" ){
                        $rootScope.modalDanger();
                        return;
                    }else if( data.status == "notloggedin" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "You are not logged in";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if( data.status == "entryExists" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "<b>Wage Order No.</b> already existed";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if( data.status == "tblfull" ){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Records already reached limit. Please contact system admin/creator";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='error-upload-type'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Only png, jpg, pdf, and jpeg files are accepted";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='error-iddoc'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No file uploaded or you forgot to choose type of document uploaded";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";				
                        $("#dymodal").modal("show");
                        return;
                    }else{	
                        $scope.resettt();
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle= "Success!";
                        $rootScope.dymodalmsg  = "Updated successfully";
                        $rootScope.dymodalstyle = "btn-success";
                        $rootScope.dymodalicon = "fa fa-check";				
                        $("#dymodal").modal("show");
                    }							
                }, function (response) {
                    if (response.status > 0){
                        $rootScope.modalDanger();
                    }
                });
            }
        }
        //End of SDAND

        $scope.today = new Date();

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

        function addCommas(num) {
            var str = num.toString().split('.');
            if (str[0].length >= 4) {
                //add comma every 3 digits befor decimal
                str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
            }
            /* Optional formating for decimal places
            if (str[1] && str[1].length >= 4) {
                //add space every 3 digits after decimal
                str[1] = str[1].replace(/(\d{3})/g, '$1 ');
            }*/
            return str.join('.');
        }

        $scope.typeLimit = function( o ){
            return o.unittype != 1 && o.unittype != 6;
        }

        $scope.dashboard.setup();
    }]);
