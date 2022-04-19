app.controller('CompanyActController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile','textAngularManager',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager ){
	
	$scope.headerTemplate="view/admin/header/index.html";
	$scope.leftNavigationTemplate="view/admin/org/sidebar/index.html";
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
			typeList:null,
			statusList:null,
			comptypes:[],
			compsize:[],
			compind:[]
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
					$rootScope.global_branch = $cookieStore.get('global_branch');
					var  a = $filter('filter')( data.dblist , { id : ''+$cookieStore.get('global_branch') })[0];	
					$scope.dashboard.values.userInformation.dbcompany = a.company;
				}			
			}, function(response) {
				$rootScope.modalDanger();
			});	
		},
		setup: function(){			
			var urlData = {
				'accountid': $scope.dashboard.values.accountid,
				'conn'	   : $cookieStore.get('global_branch')
			}
			$http.post(apiUrl+'admin/org/company/settings.php',urlData)
			.then( function (response, status){			
				var data = response.data;
				$scope.dashboard.values.comptypes 	= data.comptypes;	
				$scope.dashboard.values.compsize 	= data.compsize;	
				$scope.dashboard.values.compind 	= data.compind;								
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}

	$scope.activityevents = function(){
		$scope.activity_events 			= [];
		$scope.activity_options			= {};
		var urlData = {
			'accountid' : $scope.dashboard.values.accountid,
			'conn'	   : $cookieStore.get('global_branch')
		}
		$http.post(apiUrl+'admin/org/activity/data.php',urlData)
		.then( function (response, status){			
			var data = response.data;
			$scope.activity_events = data;
			
			tinymce.PluginManager.add('spacing', function (editor, url) {
			// Adds a menu item to the tools menu
				editor.addMenuItem('example', {
					text: 'Example plugin',
					context: 'tools',
					onclick: function () {
						// Open window with a specific url
						editor.windowManager.open({
							title: 'TinyMCE site',
							url: 'http://www.tinymce.com',
							width: 400,
							height: 300,
							buttons: [{
								text: 'Close',
								onclick: 'close'
							}]
						});
					}
				});
			});
			
			

			
			
			
			
			
			var myBtn = {};
			if( parseInt( $cookieStore.get('global_branch') ) == 1 ){
				myBtn = {
						myCustomButton: {
						text: 'Add Activity',
						click: function() {
							$timeout(function () {	
								if (tinyMCE.execCommand('mceRemoveEditor', false, 'contents')) {
									tinymce.init({
										selector: "#contents",
										plugins: "spacing preview print powerpaste ",
										menubar: false,
										toolbar: "undo redo | styleselect fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
										formats: { 'letterSpacing': { inline: 'span', styles: { 'letter-spacing': '%value' } } },
										content_style: "body {margin: 90px}",
										height: "350",
										content_css: "assets/css/contents.css",
										content_style: "body { font-size: 10pt; font-family: Arial; }",
										powerpaste_allow_local_images: true,
										powerpaste_word_import: 'prompt',
										powerpaste_html_import: 'prompt'
									});
								};
								tinymce.get('contents').setContent('');
								$scope.eventz = {
									event_title: '',
									efrom: '',
									eto: '',
									desc: '',
									isall: '0'
								};
								$("#modal-events").modal("show");
							}, 100);
						}
					}
				};
			}
			
			$scope.activity_options = {
				eventLimit: true,
				eventLimitText: 'events',
				views: {
					agenda: {
					  eventLimit: 1
					}
				},
				customButtons: myBtn,
				header: {
					right: 'prev,next,myCustomButton'
				},
				selectable: false,
				editable: false,
				droppable: false,
				eventResizableFromStart: false,
				eventClick: function(event, element) {
					$timeout(function () {	
						if (tinyMCE.execCommand('mceRemoveEditor', false, 'contents2')) {
							tinymce.init({
								selector: "#contents2",
								plugins: "spacing preview print powerpaste ",
								menubar: false,
								toolbar: "undo redo | styleselect fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
								formats: { 'letterSpacing': { inline: 'span', styles: { 'letter-spacing': '%value' } } },
								content_style: "body {margin: 90px}",
								height: "350",
								content_css: "assets/css/contents.css",
								content_style: "body { font-size: 10pt; font-family: Arial; }",
								powerpaste_allow_local_images: true,
								powerpaste_word_import: 'prompt',
								powerpaste_html_import: 'prompt'
							});
						};
						tinymce.get('contents2').setContent(event.description);
						event.description = event.description.replace(/<br\s?\/?>/g,"\n");
						$scope.eventz_update = {
							id:				event.id,
							title: 			event.title,
							start: 			moment( event.start ).format('YYYY-MM-DD'),
							end: 			moment( event.end ).subtract(1, "days").format('YYYY-MM-DD'),
							desc: 			event.description,
							pix:			event.pix,
							isall:			event.isall,	
							picFile: 		""
						};
						$("#modal-eventz").modal("show");
					}, 100);
				},
				eventRender: function(event, element) {
					if( parseInt(event.pix) == 1 ){          
						element.find(".fc-title").prepend("<i class='fa fa-paperclip'></i>");
					}
				}
			};
		}, function(response) {
			$rootScope.modalDanger();
		});
	}

	$scope.resetEventz = function(){
		$scope.eventz = {
			event_title: "",
			efrom: "",
			eto: "",
			desc: "",
			isall: "0",
			picFile: ""
		};
	}
	
	$scope.files2 = function(id){
		var file = id + ".pdf";
		window.location = '/dbic/assets/php/admin/org/activity/file/download.php?file='+file;
	}
	
	$scope.editEventz = function( file ){
		var r = confirm("Are you sure you want to update?");
		if (r == true) {
			$scope.eventz_update.desc = tinymce.get('contents2').getContent();
			if( $scope.eventz_update.title == null || $scope.eventz_update.title.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Activity";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.eventz_update.desc == null || $scope.eventz_update.desc.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Description";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.eventz_update.start == null || $scope.eventz_update.start.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Date Start";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.eventz_update.end == null || $scope.eventz_update.end.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Date End";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			if( moment( $scope.eventz_update.start ).isAfter( $scope.eventz_update.end ) ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Dates specified";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( moment( $scope.eventz_update.start ).isSame( $scope.eventz_update.end ) ){
				var end = moment( $scope.eventz_update.end ).add(1, 'd');
				//$scope.eventz_update.end = moment(end).format('YYYY-MM-DD');
			}
			
			var str = $scope.eventz_update.desc;
			$scope.eventz_update.desc = str.replace(/\r\n|\r|\n/g,"<br />");
			
			var curr_date = moment().format('YYYY-MM-DD');
			if( moment( $scope.eventz_update.start ).isBefore( curr_date ) ){
				var rr = confirm("Start date is less than current date, Are you sure you still want to continue?");
			}else{
				var rr = true;
			}
			
			if(rr == true){
				spinnerService.show('form01spinner');
				$scope.isSaving = true;
				Upload.upload({
					url		: apiUrl+'admin/org/activity/edit.php',
					method	: 'POST',
					file	: file,
					data	: {
						'accountid' : $scope.dashboard.values.accountid,
						'event'		: $scope.eventz_update,
						'targetPath': '../../../admin/org/activity/file/',
						'conn'	   : $cookieStore.get('global_branch')							
					}
				}).then(function (response) {
						var data = response.data;
						$scope.isSaving = false;
						spinnerService.hide('form01spinner');
						if( data.status == "error" ){
							$rootScope.modalDanger();
						}else if(data.status=='error-upload-type'){
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "Only pdf files are accepted";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
							return;
						}else if(data.status=='notloggedin'){
							$rootScope.modalDanger();
						}else{
							var k;
							$scope.activity_events.forEach(function(item, index){
								if( item.id == $scope.eventz_update.id ){
									k=index;
								}
							});
							
							var end = moment( $scope.eventz_update.end ).add(1, 'd').format('YYYY-MM-DD');
							//$scope.eventz_update.end = moment(end).format('YYYY-MM-DD');
							
							$scope.activity_events[k].title  		= $scope.eventz_update.title;
							$scope.activity_events[k].start 		= $scope.eventz_update.start;
							$scope.activity_events[k].end 			= end;
							$scope.activity_events[k].finish		= end;
							$scope.activity_events[k].description	= $scope.eventz_update.desc;
							if( file ){
								$scope.activity_events[k].pix		= 1;
							}
							$('#calendar_activity').fullCalendar('updateEvent', event);
							$("#modal-eventz").modal("hide");
						}
					}, function (response) {
						if (response.status > 0){
							$rootScope.modalDanger();
						}
					}
				);	
			}
		}
	}
	
	$scope.deleteEventz = function(){
		var r = confirm("Are you sure you want to delete?");
		if (r == true) {
			spinnerService.show('form01spinner');
			var k;
			$scope.activity_events.forEach(function(item, index){
				if( item.id == $scope.eventz_update.id ){
					k=index;
				}
			});
			var urlData = {
				'accountid' : $scope.dashboard.values.accountid,
				'id'		: $scope.eventz_update.id,
				'conn'	   : $cookieStore.get('global_branch')	
			}
			$http.post(apiUrl+'admin/org/activity/delete.php',urlData)
			.then( function (response, status){			
				spinnerService.hide('form01spinner');
				$scope.activity_events.splice(k,1);
			}, function(response) {
				$rootScope.modalDanger();
			});
		}
	}

	$scope.addEventz = function( file ){
		var r = confirm("Are you sure you want to create?");
		if (r == true) {
			$scope.eventz.desc = tinymce.get('contents').getContent();
			if( $scope.eventz.event_title == null || $scope.eventz.event_title.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Activity";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.eventz.desc == null || $scope.eventz.desc.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Description";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.eventz.efrom == null || $scope.eventz.efrom.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Date Start";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			if( $scope.eventz.eto == null || $scope.eventz.eto.trim() === "" ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Please specify Date End";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			if( moment( $scope.eventz.efrom ).isAfter( $scope.eventz.eto ) ){
				$rootScope.dymodalstat = true;
				$rootScope.dymodaltitle= "Warning!";
				$rootScope.dymodalmsg  = "Invalid Dates specified";
				$rootScope.dymodalstyle = "btn-warning";
				$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
				$("#dymodal").modal("show");
				return;
			}
			
			var curr_date = moment().format('YYYY-MM-DD');
			if( moment( $scope.eventz.efrom ).isBefore( curr_date ) ){
				var rr = confirm("Start date is less than current date, Are you sure you still want to continue?");
			}else{
				var rr = true;
			}
			var str = $scope.eventz.desc;
			$scope.eventz.desc = str.replace(/\r\n|\r|\n/g,"<br />");
			if (rr == true) {
				spinnerService.show('form01spinner');
				$scope.isSaving = true;
				Upload.upload({
					url		: apiUrl+'admin/org/activity/add.php',
					method	: 'POST',
					file	: file,
					data	: {
						'accountid' : $scope.dashboard.values.accountid,
						'event'		: $scope.eventz,
						'targetPath': '../../../admin/org/activity/file/',
						'conn'	   : $cookieStore.get('global_branch')								
					}
				}).then(function (response) {
						var data = response.data;
						$scope.isSaving = false;
						spinnerService.hide('form01spinner');
						if( data.status == "error" ){
							$rootScope.modalDanger();
						}else if(data.status=='error-upload-type'){
							$rootScope.dymodalstat = true;
							$rootScope.dymodaltitle= "Warning!";
							$rootScope.dymodalmsg  = "Only pdf files are accepted";
							$rootScope.dymodalstyle = "btn-warning";
							$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
							$("#dymodal").modal("show");
							return;
						}else if(data.status=='notloggedin'){
							$rootScope.modalDanger();
						}else{
							var pi = 0;
							if( file ){
								pi = 1;
							}
							var arr = {			
								id:				data.id,
								title: 			data.title,
								start: 			data.start,
								end: 			data.end,
								description: 	data.description,
								isall:			data.isall,
								pix:			pi
							}
							$scope.activity_events.push( arr );
							$scope.resetEventz();
							$("#modal-events").modal("hide");
						}
					}, function (response) {
						if (response.status > 0){
							$rootScope.modalDanger();
						}
					}
				);
			}
		}
	}
 	
	$scope.activityevents();
	$scope.dashboard.setup();
		
}]);