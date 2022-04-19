app.controller('TKAppAdjustmentController',[ '$scope', '$rootScope', '$location', '$window', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $window, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/tk/sidebar/index.html";
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
	
	$scope.app_adjustment_functions = function(){
		// $scope.add 					= [];
		// $scope.edit					= [];
		// $scope.search				= [];		
		$scope.search_acct = '';
		$scope._from = '';
		$scope._to = '';
		// if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 
		// 	$scope.search.datefrom 		= '';
		// 	$scope.search.dateto 		= '';
		// 	$scope.search.appstat		= '';
		// }else{ 
		// 	$scope.search.datefrom 		= $location.search().df; 
		// 	$scope.search.dateto 		= $location.search().dt; 
		// 	$scope.search.appstat		= $location.search().st;
		// };
		var vm = this;
		$scope.vm = vm;
		vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
				url: apiUrl+'admin/tk/app/adjustment/new_data.php',
				type: 'POST',
				data: function(d){
					d.accountid = $scope.dashboard.values.accountid,
					d.search_acct	= $scope.search_acct,
					d._from			= $scope._from,
					d._to			= $scope._to				
				}
		})		
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true)
		.withPaginationType('full_numbers')
		.withOption('responsive',true)
		.withOption('autoWidth',false)
		.withDOM('<"cutoff dataTables_length"><"toolbar dataTables_length"><"toolbuttons dataTables_filter"><"cutoffinfo dataTables_length"><"title_table">t<"foot_con"<"buttons dataTables_info">p>')
        .withOption('order', [1, 'asc']);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('count').withTitle('#').withClass('btnTDC'),



			
			DTColumnBuilder.newColumn('empname').withTitle('Employee Name').withClass('btnTD'),
			DTColumnBuilder.newColumn('business_unit').withTitle('Department/Section').withClass('btnTD'),
			DTColumnBuilder.newColumn('date').withTitle('Date').withClass('btnTDC'),			
			DTColumnBuilder.newColumn('app_type').withTitle('IN/OUT').withClass('btnTDC').notSortable(),
			DTColumnBuilder.newColumn('app_time').withTitle('Actual Time').withClass('btnTDC').notSortable(),
			DTColumnBuilder.newColumn('remarks').withTitle('Reason').withClass('btnTDR').notSortable(),
			DTColumnBuilder.newColumn(null).withTitle('').withClass('btnTDL').notSortable().renderWith(function(data, type, full, meta){
				var btn = '';
				if( data.file.length > 1 ){
					btn = '<img style="width:45px;cursor:pointer" src="assets/images/Attachment.png" onclick="angular.element(this).scope().viewfile(\''+data.file+'\')" class="btn" title="Download" />';
				}
				return btn;
			}),
			DTColumnBuilder.newColumn(null).withTitle('Status').withClass('btnTDC').renderWith(function (data, type, full, meta) {
				var btn = '';
				if (data.adj_status == "APPROVED") {
					btn = '<span style="font-weight:600 !important; color: green !important"> APPROVED </span>';
				} else if (data.adj_status == "DECLINED") {
					btn = '<span style="font-weight:600 !important; color: red !important"> ' + data.adj_status + ' </span>';
				} else {
					btn = '<span style="font-weight:600 !important; color: #ffc000 !important"> ' + data.adj_status + ' </span>';
				}
				return btn;
			})
		];
		vm.dtInstance = {};

		$(document).ready(function () {
			// $("div.cutoff").html('<div class="btn-group"><button id="cnext" onclick="angular.element(this).scope().cutoffData(\'1\')" ><<</button><button onclick="angular.element(this).scope().cutoffData(\'0\')" >CutOff Period</button><button id="cprev" onclick="angular.element(this).scope().cutoffData(\'2\')" >>></button></div>');

			$("div.toolbuttons").html('<button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().export()"><i class="fa fa-file-excel-o fa-sm"></i>&nbsp;&nbsp;&nbsp;Export</button>  <button style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" title="Search" data-toggle="modal" data-target="#modal-search" ><i class="fa fa-search fa-sm"></i>&nbsp;&nbsp;&nbsp;Filter</button><button id="btn-refreshh" style="width:100px;margin: 0 3px 0 3px;color : white;border-radius: 5px;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;border-width: 1px;background: black;" onclick="angular.element(this).scope().dtInstance.reloadData()"><i class="fa fa-refresh fa-sm"></i>&nbsp;&nbsp;&nbsp;Refresh</button>');

			var str_div = '<div style="width: 100%; text-align: center; background: #d4650a; font-size: 22pt; color: white;">Attendance Adjustment</div>';
			$("div.title_table").html(str_div);

			// var buttom = '<div> <button type="button" class="btn btn-primary" style="margin-right:5px;width:100px;border: 1px solid white;background:#c48813" data-toggle="modal" data-target="#modal-approved"  >Approve</button> <button type="button" class="btn btn-danger"  style="width:100px;border: 1px solid white;background:#c48813" data-toggle="modal" data-target="#modal-disapproved" onclick="angular.element(this).scope().edit_view()">Disapprove</button> </div>';
			// $("div.buttons").html(buttom);
			// $("div.cutoffinfo").html(`<span style="font-weight:600 !important; color: green !important">Cutoff Period: </span><span ng-bind="dashboard.values.period.pay_start" style="font-weight:600 !important;" ></span> <span ng-show="dashboard.values.period.pay_start" style="font-weight:600 !important;" >to</span> <span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_end" ></span>
			// 						  <span style="font-weight:600 !important; color: green !important;margin-left:15px;">Payroll Period: </span><span style="font-weight:600 !important;" ng-bind="dashboard.values.period.pay_date" ></span>`);


			// $(".checkcircle").html('<input class="circlCheck" type="checkbox" title="Approve all">');
			// $(".circlCheck").click(function () {
			// 	var ele = $(".circlCheck");
			// 	if ($(ele).is(':checked')) {
			// 		$(".circlCheck2").prop("checked", true);
			// 	} else {
			// 		$(".circlCheck2").prop("checked", false);
			// 	}
			// });

		});
		
		$scope.unitSearch = function(){	
			vm.dtInstance.reloadData();			
		}

		//View file
		$scope.viewfile = function( file ){
			window.open(apiUrl + 'admin/tk/app/adjustment/viewfile.php?loc=' + file);
		}

		$scope.resetSearch = function(){
			// $scope.search				= [];
			$scope.search_acct 		= ''; 
			$scope._from 			= ''; 
			$scope._to 			= ''; 
			$timeout(function () {	
				$("#btn-refreshh").click();
			}, 100);
		}
		// //Export
		$scope.export = function () {
			var search_acct		= typeof $scope.search_acct === "undefined" ? '' : $scope.search_acct  ;
			var _from		= typeof $scope._from === "undefined" ? '' : $scope._from  ;
			var _to			= typeof $scope._to === "undefined" ? '' : $scope._to  ;
			var company 	= typeof $rootScope.compensationCompanyName.company_name === "undefined" ? '' : $rootScope.compensationCompanyName.company_name;
			var datenow		= typeof $scope.dashboard.values.userInformation.datenow === "undefined" ? '' : moment().format('MM/D/YYYY hh:mm:00 A');
			var url = apiUrl+"admin/tk/app/adjustment/export.php?datenow=" + datenow + "&company=" + company + "&_from=" + _from + "&search_acct=" + search_acct + "&_to=" + _to ;
			var conf = confirm("Export to CSV?");
			if(conf == true){
				window.open(url, '_blank');
			}
		}

		// $scope.resetSearch = function(){			
		// 	if (typeof($location.search().st)==='undefined' || $location.search().st == null ){ 
		// 		$scope.search				= [];
		// 		$scope.search.acct 			= ''; 
		// 		$scope.search.docu 			= '';
		// 		$scope.search.datefrom 		= '';
		// 		$scope.search.dateto 		= '';
		// 		$scope.search.appstat		= '';
		// 		$timeout(function () {	
		// 			$("#btn-refreshh").click();
		// 		}, 100);
		// 	}else{ 
		// 		$timeout(function () {	
		// 			$(".modal-backdrop").remove();
		// 		}, 100);
		// 		$timeout(function () {	
		// 			$window.location.href="#/admin/tk/app/adjustapp";
		// 		}, 1000);
		// 	};
		// }
		
		$scope.resetCreateAcct = function(){	
			$scope.isSaving=false;
			var urlData = {
				'accountid': $scope.dashboard.values.accountid
			}
			$http.post(apiUrl+'admin/tk/app/adjustment/add_view.php',urlData)
			.then( function (response, status){			
				var data = response.data;				
				$scope.add = data;
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
		
		$scope.calcLeavehrs = function(hrs, id, ndex){			
			$scope.add.leave_dates[ndex]['drop'].forEach(function(item, index){
				if( item.id == id ){
					if( hrs == 8 ){
						$scope.add.leave_dates[ndex]['hrs'] = hrs - item.hr;
					}else if( hrs == 4  ){
						$scope.add.leave_dates[ndex]['hrs'] = item.hr;
					}					
				}				
			});			
		}
		
		$scope.generateTbl = function(){
			var dfrom = new Date('' + $scope.add.datefrom);
			var dto   = new Date('' + $scope.add.dateto);	
			$scope.isSaving=true;
			if( dfrom > dto ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Date From should be less than Date To";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( $scope.add.datefrom.length <= 1 || $scope.add.dateto.length <= 1 ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Dates entered";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else if( $scope.add.acct == '' ){
				$scope.isSaving=false;
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please select account";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}else{
				var urlData = {
					'acct'		: $scope.add.acct,					
					'from'		: $scope.add.datefrom,
					'to'		: $scope.add.dateto					
				}
				$http.post(apiUrl+'admin/tk/app/adjustment/add_dates.php',urlData)
				.then( function (response, status){			
					var data = response.data;
					$scope.add.leave_dates = data;
				}, function(response) {
					$rootScope.modalDanger();
				});
			}
		}
		
		$scope.addAdj = function(file){
			if( $scope.add.leave_dates.length > 0 ){
				if( file!=null && file.length != 0){
					for( var key in file ){
						if(file[key]['size'] > 2097152){ 
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "Each file must be lesser than 2MB";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
							return;
						}
					}
				}
				
				spinnerService.show('form01spinner');
				$scope.isSaving = true;
				
				Upload.upload({
					url: apiUrl+'admin/tk/app/adjustment/create.php',
					method: 'POST',
					file: file,
					data: {
						'accountid' : $scope.dashboard.values.accountid,
						'info'		: $scope.add,
						'targetPath': '../../../admin/tk/app/adjustment/file/'					
					}
				}).then(function (response) {
					var data = response.data;
					$scope.isSaving  = false;
					spinnerService.hide('form01spinner');
					
					if( data.status == "error" ){
						$rootScope.modalDanger();
					}else if( data.status == "notloggedin" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "You are not logged in";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "acct" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify employee";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "datefrom" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Date From";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "dateto" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Please specify Date To";
						$rootScope.dymodalstyle = "btn-warning";
						$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
						$("#dymodal").modal("show");
						return;
					}else if( data.status == "invdate" ){
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Warning!";
						$rootScope.dymodalmsg  = "Invalid Dates entered";
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
					}else{
						$timeout(function () {	
							$("#btn-refreshh").click();
						}, 1000);
						$("#modal-add").modal("hide");
						$rootScope.dymodalstat = true;
						$rootScope.dymodaltitle= "Success!";
						
						if( data.reject.length == 0 ){
							$rootScope.dymodalmsg  = "Attendance Adjustment created successfully";
						}else{
							var msg="Below request(s) are not applied<br/><br/><table class='table table-bordered text-center table-striped'><thead><tr><th> DATE </th> <th> REASON </th> </tr></thead> <tbody>";
							var trow = "";
							data.reject.forEach(function(item, index){
								trow = trow + "<tr><td>"+item.date+"</td><td>"+item.msg+"</td></tr>";						
							});
							trow = trow + "</tbody></table>";
							$rootScope.dymodalmsg  = msg + trow;
						}
						
						$rootScope.dymodalstyle = "btn-success";
						$rootScope.dymodalicon = "fa fa-check";				
						$("#dymodal").modal("show");
					}
					
				}, function (response) {
					if (response.status > 0){
						$rootScope.modalDanger();
					}
				});		
			}else{
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please generate leave dates";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
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

	$rootScope.getCompanyName();
	$scope.dashboard.setup();
}]);