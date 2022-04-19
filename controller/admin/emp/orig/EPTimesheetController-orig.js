app.controller('EPTimesheetController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/emp/sidebar/index.html";
	$scope.footerTemplate="view/admin/footer/index.html";	 
	
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
			accounts:[]
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
			$http.post(apiUrl+'admin/tk/setup/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.accounts 	= data.accounts;			
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
	
	$scope.setup_timesheet_functions = function(){
		$scope.search				= [];	
		$scope.sumhrs				= [];
		$scope.search.acct			= $scope.dashboard.values.accountid;
		$scope.search.datefrom		= $rootScope.currperiod.pay_start; 
		$scope.search.dateto  		= $rootScope.currperiod.pay_end;
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/emp/timesheet/data.php',
				type: 'POST',
				data: function(d){
					d.acct			= $scope.search.acct,
					d.dfrom			= $scope.search.datefrom,
					d.dto			= $scope.search.dateto
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('lrtip')
		.withOption('order', [0, 'asc'])
		.withOption('drawCallback', function (settings) {
			var api = this.api();
			$timeout(function () {					
				if (settings.aoData.length > 0) {
					$scope.sumhrs = api.rows().data()[0].total;	
				}else{
					$scope.sumhrs = {late:0,ut:0,absent:0,leave:0,ot:0,reg:0};
				}
			}, 0);			
		});
		vm.dtColumns = [
			DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('shift').withTitle('Shift').withClass('btnTD').notSortable(),			
			DTColumnBuilder.newColumn('in').withTitle('In').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('out').withTitle('Out').withClass('btnTD').notSortable(),			
			DTColumnBuilder.newColumn('late').withTitle('Late').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('ut').withTitle('Under Time').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('absent').withTitle('Absent').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leavehrs').withTitle('Leave').withClass('btnTD').notSortable(),			
			DTColumnBuilder.newColumn('othrs').withTitle('Over Time').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('reghrs').withTitle('Reg Hrs').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('application').withTitle('Applications').withClass('btnTD').notSortable()
		];
		vm.dtInstance = {};
		
		$scope.unitSearch = function(){	
			if( $scope.search.acct.length < 1 || $scope.search.datefrom.length < 1 || $scope.search.dateto.length < 1 ){ 
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "All fields are required!";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			$scope.search				= [];
			$scope.search.acct			= $scope.dashboard.values.accountid;
			$scope.search.datefrom		= $rootScope.currperiod.pay_start; 
			$scope.search.dateto  		= $rootScope.currperiod.pay_end;
			$scope.sumhrs				= [];
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		
		$scope.filterAcct = function(acct){
			if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
				return acct.id != '0';
			}else{				
				return acct.id == $scope.dashboard.values.accountid;
			}
		}
	}
	
	$scope.shifts = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/emp/timesheet/shifts.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    if (data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                        $scope.shiftlist = data;

                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.changeshift = function (event, id) {
            if (event.target.checked == true) {
                $("#modal-changeshift").modal("show");

                $scope.proceedcs = function (id) {
                    $(document).on('click', "#cs" + id, function () {
                        alert();
                    });

                }

            }
            $scope.cid = id;

            $scope.cancelcs = function (cid) {
                $("#" + cid).prop('checked', false);
            }
        }

        $scope.adaj = function (wd, id) {

            $(document).on('click', "#adaj" + id, function () {
                if ($(this).is(':checked')) {
                    $("#modal-add").modal("show");

                    $scope.generateTbl = function () {
                        var dfrom = new Date('' + wd);
                        var dto = new Date('' + wd);

                        if ($scope.add.acct == '') {
                            $scope.isSaving = false;
                            $rootScope.dymodalstat = true;
                            $rootScope.dymodaltitle = "Warning!";
                            $rootScope.dymodalmsg = "Please select account";
                            $rootScope.dymodalstyle = "btn-warning";
                            $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                            $("#dymodal").modal("show");
                            return;
                        } else {
                            $scope.isSaving = true;
                            var urlData = {
                                'acct': $scope.add.acct,
                                'from': wd,
                                'to': wd
                            }
                            $http.post(apiUrl + 'admin/tk/app/adjustment/add_dates.php', urlData)
                                .then(function (response, status) {
                                    var data = response.data;
                                    $scope.add.leave_dates = data;
                                }, function (response) {
                                    $rootScope.modalDanger();
                                });
                        }
                    }
                }
            });


        }
	
	$scope.dashboard.setup();
}]);