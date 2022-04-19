app.controller('MNGSickLeaveController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/mng/sidebar/index.html";
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
			accounts:[],
			leaves:[]
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
				$scope.dashboard.values.leaves		= data.leaves;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	} 
    


	$scope.app_sickleave_function = function(){
		$scope.search				= [];		
		$scope.search.acct 			= ''; 
        $scope.search.docu 			= '';
        if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 
			$scope.search.datefrom 		= '';
			$scope.search.dateto 		= '';
			$scope.search.appstat		= '';
		}else{ 
			$scope.search.datefrom 		= $location.search().df; 
			$scope.search.dateto 		= $location.search().dt; 
			$scope.search.appstat		= $location.search().st;
		};
		
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/mng/sickleave/view.php',
				type: 'POST',
				data: function(d){
					d.accountid    = $scope.dashboard.values.accountid
                    d.acct			= $scope.search.acct,
					d.docu			= $scope.search.docu,
					d.from			= $scope.search.datefrom,
					d.to			= $scope.search.dateto,
					d.appstat		= $scope.search.appstat

				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
        .withOption('autoWidth',false)
        .withDOM('<"buttons dataTables_filter">lrtip')
		//.withOption('lengthMenu',[2,4,6,8])
		.withOption('order', [0, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('date').withTitle('Leave Date').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('docnumber').withTitle('Document No.').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leave_name').withTitle('Leave Name').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leave_type').withTitle('Leave Type').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('empname').withTitle('Employee').withClass('btnTD').notSortable(),			
			//DTColumnBuilder.newColumn('time_in').withTitle('Time Start').withClass('btnTD').notSortable(),
			//DTColumnBuilder.newColumn('time_out').withTitle('Time End').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('hrs').withTitle('Total Hours').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn('leave_status').withTitle('Status').withClass('btnTD').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().withClass('btnTD')
			.renderWith(function(data, type, full, meta){
                var btn  = '<button class="btn btn-flat btn-sm btn-success" title="Approved" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" style="margin-right:3px;"><i class="fa fa-check"></i></button>';
                btn		+= '<button class="btn btn-flat btn-sm btn-danger" title="Disapproved" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" ><i class="fa fa-times"></i></button>';
                // <button class="btn btn-flat btn-sm btn-primary" title="View" data-target="#editModal" data-toggle="modal" onclick="angular.element(this).scope().edit_view(\'' + data.id + '\')" style="margin-right:3px;"><i class="fa fa-edit"></i> Update</button>
				return btn;
			})
		];
        vm.dtInstance = {};
        $(document).ready(function () {
            $("div.buttons").html('<button style="margin-right:3px;" class="btn btn-flat btn-primary pull-right" title="Search" data-toggle="modal" data-target="#modal-search"  ><i class="fa fa-search fa-sm" style="padding:3px"></i>Filter</button><button id="btn-refreshh" style="margin-right:3px;" class="btn btn-flat btn-primary pull-right" onclick="angular.element(this).scope().dtInstance.reloadData()" title="Refresh"><i class="fa fa-refresh fa-sm" style="padding:3px"></i>Refresh</button>')
		});

		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		$scope.resetSearch = function(){
			if (typeof($location.search().ty)==='undefined' || $location.search().ty == null ){ 
				$scope.search				= [];
				$scope.search.acct 			= ''; 
				$scope.search.docu 			= '';
				$scope.search.datefrom 		= '';
				$scope.search.dateto 		= '';
				$scope.search.appstat		= '';
				$timeout(function () {	
					$("#btn-refreshh").click();
				}, 100);
			}else{ 
				$timeout(function () {	
					$(".modal-backdrop").remove();
				}, 100);
				$timeout(function () {	
					$window.location.href="#/admin/mng/app/leaves/sickapp";
				}, 1000);
			};
		}
		
		//Filter Employee
		$scope.filterAcct = function(acct){
			if( parseInt( $scope.dashboard.values.accouttype  ) == 1 ){				
				return acct.id != '0';
			}else{				
				return acct.idsuperior == $scope.dashboard.values.accountid;
			}
		}


    }
    
	
	$scope.dashboard.setup();
}]);