app.controller('EPPlannerController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager) {

        var _isNotMobile = (function () {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
            return !check;
        })();

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        $scope.epviews = ['2'];

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
                accounts: [],
                period: [],
                daterange: '',
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
                        $scope.dashboard.values.period = data.period;
                        $scope.dashboard.values.daterange = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');
                        $scope.allEmployeeFunc();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        }

        $scope.plans = function () {

            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }
            $http.post(apiUrl + 'admin/emp/planner/planner.php', urlData)
                .then(function (response, status) {
                    $('#planevents').fullCalendar('removeEvents');
                    $('#planevents').fullCalendar('addEventSource', response.data);
                    $('#planevents').fullCalendar('rerenderEvents');
            
                    if (response.data.status == 'error') {
                        $rootScope.modalDanger();
                    } else {
                      
                        
                    }
                }, function (response) {
                    $rootScope.modalDanger();
                });

        }

        if (_isNotMobile == true) {
            $scope.calendarOptions = {
                selectable: true,
                eventLimit: true,
                eventLimitText: 'Plan',
                header: {
                    left: ' today prev,next title',
                    center: '',
                    right: ''
                },
                buttonText: {
                    today: 'Today' 
                },
                editable: true,
                droppable: false,
                eventResizableFromStart: true,
                eventMouseover: function (calEvent, jsEvent) {
                    var tooltip = '<div class="tooltipevent" style="position:absolute;z-index:10001;background:#ccc;">' + calEvent.title + '</div>';
                    var $tooltip = $(tooltip).appendTo('body');

                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $tooltip.fadeIn('500');
                        $tooltip.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tooltip.css('top', e.pageY + 20);
                        $tooltip.css('left', e.pageX - 50);
                    });
                },
                eventMouseout: function (calEvent, jsEvent) {
                    $(this).css('z-index', 8);
                    $('.tooltipevent').remove();
                },
                select: function (start, end, allDay) {
                    var today = new Date();
                    var dd = today.getDate();
                    var dd1 = today.getDate() + 1;
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) { dd = '0' + dd; }
                    if (mm < 10) { mm = '0' + mm; }
                    var date = yyyy + '-' + mm + '-' + dd;
                    var date1 = yyyy + '-' + mm + '-' + dd1;

                    $("#startd").val(start.format("YYYY-MM-DD"));
                    $("#endd").val(end.format("YYYY-MM-DD"));

                    if(start.format("YYYY-MM-DD")<date){
                        $.notify("Unable to add", "error");
                        return;
                    }

                    $("#eventCreate").modal("show");
                    $scope.$apply();
                },
                eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                    var today = new Date();
                    var dd = today.getDate();
                    var dd1 = today.getDate() + 1;
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) { dd = '0' + dd; }
                    if (mm < 10) { mm = '0' + mm; }
                    var date = yyyy + '-' + mm + '-' + dd;
                    var date1 = yyyy + '-' + mm + '-' + dd1;

                    var urlData1 = {
                        'id': event.id,
                    }
                    $http.post(apiUrl + 'admin/emp/planner/checkplan.php', urlData1)
                    .then(function (response, status) {
                        if (response.data[0].status == 'success') {
                            if(response.data[0].start<date && response.data[0].end<date1){
                                revertFunc();
                                $.notify("Unable to update", "error");
                                return;
                            }

                            if((response.data[0].start<date && event.start.format("YYYY-MM-DD")<=date  && response.data[0].end==event.end.format("YYYY-MM-DD"))){
                                revertFunc();
                                $.notify("Unable to update", "error");
                                return;
                            }

                            if(event.end.format("YYYY-MM-DD")<date1){
                                revertFunc();
                                $.notify("Unable to update", "error");
                                return;
                            }

                            if((response.data[0].start==date && event.start.format("YYYY-MM-DD")<date)){
                                revertFunc();
                                $.notify("Unable to update", "error");
                                return;
                            }

                            if (event.idcreator == $scope.dashboard.values.accountid) {
                                var urlData = {
                                    'accountid': $scope.dashboard.values.accountid
                                }
                                urlData.id = event.id;
                                urlData.start = event.start.format("YYYY-MM-DD");
                                urlData.end = event.end.format("YYYY-MM-DD");
        
                                $scope.editPlan(urlData);
                            } else {
                                revertFunc();
                                $.notify("Only creator can alter this plan", "error");
                            }

                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
                },
                eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                    var today = new Date();
                    var dd = today.getDate();
                    var dd1 = today.getDate() + 1;
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) { dd = '0' + dd; }
                    if (mm < 10) { mm = '0' + mm; }
                    var date = yyyy + '-' + mm + '-' + dd;
                    var date1 = yyyy + '-' + mm + '-' + dd1;

                    var urlData1 = {
                        'id': event.id,
                    }
                    $http.post(apiUrl + 'admin/emp/planner/checkplan.php', urlData1)
                    .then(function (response, status) {
                        if (response.data[0].status == 'success') {

                            if(response.data[0].start<date && response.data[0].end<date1){
                                revertFunc();
                                $.notify("Unable to update", "error");
                                return;
                            }

                            if(response.data[0].start<date || event.start.format("YYYY-MM-DD")<date){
                                revertFunc();
                                $.notify("Unable to update", "error");
                                return;
                            }
        
                            if (event.idcreator == $scope.dashboard.values.accountid) {
                                if (event.end == null) {
                                    var myDate = new Date(event.start);
                                    myDate.setDate(myDate.getDate() + 1);
                                    event.end = formatDate(myDate);
                                } else {
                                    event.end = event.end.format("YYYY-MM-DD");
                                }
        
                                var urlData = {
                                    'accountid': $scope.dashboard.values.accountid
                                }
                                urlData.id = event.id;
                                urlData.start = event.start.format("YYYY-MM-DD");
                                urlData.end = event.end;
                                urlData.viewers = event.canview;
                                
                                $scope.editPlan(urlData);
                            } else {
                                revertFunc();
                                $.notify("Only creator can alter this plan", "error");
                            }

                        }
                    }, function (response) {
                        $rootScope.modalDanger();
                    });

                },
                eventClick: function (event) {
                    if (event.idcreator == $scope.dashboard.values.accountid) {
                        $scope.editplantype = event.backgroundColor;
                        document.getElementById("mh2").style.backgroundColor = event.backgroundColor;
                        $("#eventid").val(event.id);
                        $("#eventtitle").val(event.title);
                        $("#bgcolor").val(event.backgroundColor);
                        $("#editPlanmodal").modal("show");
                        var string = event.canview;
                        var array = string.split(",");
                        $('#edittags').val(array).trigger("change");
                    } else {
                        $("#eventtitleviewer").val(event.title);
                        $("#bgcolorviewer").val(event.backgroundColor);
                        $("#viewPlanmodal").modal("show");
                        var string = event.canview;
                        var array = string.split(",");
                        $('#edittagsviewer').val(array).trigger("change");

                        $('#editcreatorviewer').val([event.idcreator]).trigger("change");
                    }
                },
                eventDragStop: function (event, jsEvent) {
                    var trashEl = jQuery('#trash');
                    var ofs = trashEl.offset();
                    var x1 = ofs.left;
                    var x2 = ofs.left + trashEl.outerWidth(true);
                    var y1 = ofs.top;
                    var y2 = ofs.top + trashEl.outerHeight(true);

                    if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                        jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        if (event.idcreator == $scope.dashboard.values.accountid) {
                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1;
                            var yyyy = today.getFullYear();
                            if (dd < 10) { dd = '0' + dd; }
                            if (mm < 10) { mm = '0' + mm; }
                            var date = yyyy + '-' + mm + '-' + dd;

                            if (event.start.format("YYYY-MM-DD") < date || (event.start.format("YYYY-MM-DD") < date && event.end.format("YYYY-MM-DD") >= date)) {
                                $.notify("Unable to cancel", "error");
                                return;
                            }

                            var urlData = {
                                'id': event.id,
                                'accountid': $scope.dashboard.values.accountid,
                            }
                            $http.post(apiUrl + 'admin/emp/planner/deleteplan.php', urlData)
                                .then(function (response, status) {
                                    if (response.data[0].status == 'success') {
                                        $.notify("Plan successfully Cancelled", "success");
                                        $scope.plans();
                                        $('#planevents').fullCalendar('refetchEvents');
                                    } else {
                                        $.notify("Failed to cancel", "error");
                                    }
                                }, function (response) {
                                    $rootScope.modalDanger();
                                });
                        } else {
                            $.notify("Only creator can alter this plan", "error");
                        }
                    }
                },
                eventRender: function (event, element) {
                    if (event.idcreator == $scope.dashboard.values.accountid) {

                    } else {

                    }
                },

            };
        } else {
            $scope.calendarOptions = {
                defaultView: 'listMonth',
                eventMouseover: function (calEvent, jsEvent) {
                    var tooltip = '<div class="tooltipevent" style="position:absolute;z-index:10001;background:#ccc;">' + calEvent.description + '</div>';
                    var $tooltip = $(tooltip).appendTo('body');

                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $tooltip.fadeIn('500');
                        $tooltip.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tooltip.css('top', e.pageY + 20);
                        $tooltip.css('left', e.pageX - 50);
                    });
                },

                eventMouseout: function (calEvent, jsEvent) {
                    $(this).css('z-index', 8);
                    $('.tooltipevent').remove();
                },
            };

        }

        $scope.btncolor = function (color) {
            $scope.event_color = color;
            document.getElementById("mh").style.backgroundColor = color;
        }

        $scope.btncolor1 = function (color) {
            $scope.editplantype = color;
            document.getElementById("mh2").style.backgroundColor = color;
        }

        $scope.addPlan = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }

            if ($scope.event_title) {
                urlData.title = $scope.event_title;
                urlData.start = $("#startd").val();
                urlData.end = $("#endd").val();
                urlData.type = $scope.event_color;
                urlData.viewers = $('#tags').val();

                urlData.viewers.push($scope.dashboard.values.accountid);


                if (urlData.type == undefined) {
                    $scope.event_color = '#0070c0';
                    urlData.type = '#0070c0';
                }

                $http.post(apiUrl + 'admin/emp/planner/addplan.php', urlData)
                    .then(function (response, status) {
                        $.notify("New Plan Added", "success");
                        $("#eventCreate").modal("hide");
                        $scope.plans();
                        $('#planevents').fullCalendar('refetchEvents');
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            } else {
                $.notify("Please Add Event Title", "warn");
            }
        };

        $scope.editPlan = function (data) {
            if (data == 'modal') {
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }

                urlData.modal = 'set';
                urlData.id = $("#eventid").val();
                urlData.title = $("#eventtitle").val();
                urlData.type = $scope.editplantype;
                urlData.viewers = $('#edittags').val();

                urlData.viewers.push($scope.dashboard.values.accountid);

                $http.post(apiUrl + 'admin/emp/planner/editplan.php', urlData)
                    .then(function (response, status) {
                        $.notify("Plan Updated", "success");
                        $("#editPlanmodal").modal("hide");

                        $scope.plans();
                        $('#planevents').fullCalendar('refetchEvents');
                    }, function (response) {
                        $rootScope.modalDanger();
                    });


            } else {
                $http.post(apiUrl + 'admin/emp/planner/editplan.php', data)
                    .then(function (response, status) {

                        $.notify("Plan Updated", "success");
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }

        }

        // $scope.planner = function () {
        //     var urlData = {
        //         'accountid': $scope.dashboard.values.accountid
        //     }
        //     $http.post(apiUrl + 'admin/emp/planner/planner.php', urlData)
        //         .then(function (response, status) {
        //             var data = response.data;
        //             if (data.status == 'error') {
        //                 $rootScope.modalDanger();
        //             } else {
        //                 $scope.events = data;
        //                 $scope.calendarOptions = {
        //                     selectable: true,
        //                     eventLimit: true,
        //                     eventLimitText: 'Plan',
		// 					header: {
        //                         left: ' today prev,next title',
        //                         center: '',
        //                         right: ''
		// 					},
		// 					buttonText: {
		// 						today: 'Today' 
		// 					},
        //                     editable: true,
        //                     droppable: true,
        //                     eventResizableFromStart: true,
        //                     eventReceive: function (draggedEl) {

        //                         urlData.id = draggedEl.id;
        //                         urlData.title = draggedEl.title;

        //                     },

        //                     eventMouseover: function (calEvent, jsEvent) {
        //                         var tooltip = '<div class="tooltipevent" style="position:absolute;z-index:10001;background:#ccc;">' + calEvent.title + '</div>';
        //                         var $tooltip = $(tooltip).appendTo('body');

        //                         $(this).mouseover(function (e) {
        //                             $(this).css('z-index', 10000);
        //                             $tooltip.fadeIn('500');
        //                             $tooltip.fadeTo('10', 1.9);
        //                         }).mousemove(function (e) {
        //                             $tooltip.css('top', e.pageY + 20);
        //                             $tooltip.css('left', e.pageX - 50);
        //                         });
        //                     },
        //                     eventMouseout: function (calEvent, jsEvent) {
        //                         $(this).css('z-index', 8);
        //                         $('.tooltipevent').remove();
        //                     },

        //                     eventResize: function (delta) {
        //                         console.log(delta.id);
        //                         console.log(delta.start.format("YYYY-MM-DD"));
        //                         console.log(delta.end.format("YYYY-MM-DD"));

        //                         var urlData = {
        //                             'accountid': $scope.dashboard.values.accountid
        //                         }
        //                         urlData.id = delta.id;
        //                         urlData.start = delta.start.format("YYYY-MM-DD");
        //                         urlData.end = delta.end.format("YYYY-MM-DD");

        //                         $scope.editPlan(urlData);
        //                     },
        //                     eventDrop: function (event) {

        //                         if (event.end == null) {
        //                             var myDate = new Date(event.start);
        //                             myDate.setDate(myDate.getDate() + 1);
        //                             event.end = formatDate(myDate);
        //                         } else {
        //                             event.end = event.end.format("YYYY-MM-DD");
        //                         }

        //                         var urlData = {
        //                             'accountid': $scope.dashboard.values.accountid
        //                         }
        //                         urlData.id = event.id;
        //                         urlData.start = event.start.format("YYYY-MM-DD");
        //                         urlData.end = event.end;

        //                         $scope.editPlan(urlData);
        //                     },
        //                     eventClick: function (event) {

        //                     },
        //                     eventRender: function (event, element) {

        //                     },

        //                 };
        //             }
        //         }, function (response) {
        //             $rootScope.modalDanger();
        //         });
        // }
        // $scope.editPlan = function (data) {
        //     if (data == 'modal') {
        //         var urlData = {
        //             'accountid': $scope.dashboard.values.accountid
        //         }

        //         urlData.modal = 'set';
        //         urlData.id = $("#eventid").val();
        //         urlData.title = $("#eventtitle").val();
        //         urlData.type = $("#bgcolor").val();

        //         $http.post(apiUrl + 'admin/emp/planner/editplan.php', urlData)
        //             .then(function (response, status) {
        //                 $.notify("Plan Updated", "success");

        //                 $("#editPlanmodal").modal("hide");

        //                 setTimeout(function () {
        //                     window.location.reload();
        //                     $scope.$digest();
        //                 }, 500);
        //             }, function (response) {
        //                 $rootScope.modalDanger();
        //             });


        //     } else {
        //         $http.post(apiUrl + 'admin/emp/planner/editplan.php', data)
        //             .then(function (response, status) {

        //                 $.notify("Plan Updated", "success");
        //             }, function (response) {
        //                 $rootScope.modalDanger();
        //             });
        //     }

        // }

        // $scope.addplanevents = function () {

        // }

        // $scope.addplanbtn = '#03b9f6';

        // $scope.btncolor = function (color) {
        //     $scope.addplanbtn = color;
        // }

        // $scope.geteventlist = function () {
        //     var urlData = {
        //         'accountid': $scope.dashboard.values.accountid
        //     }
        //     $http.post(apiUrl + 'admin/emp/planner/events.php', urlData)
        //         .then(function (response, status) {
        //             $scope.eventlist = response.data;
        //         }, function (response) {
        //             $rootScope.modalDanger();
        //         });

        // }



        // $(document).on('mouseover', ".dl", function () {
        //     $('.dl').draggable({
        //         revert: true,
        //         helper: 'clone', start: function (e, ui) {

        //             $('.fc-day').droppable({
        //                 over: function () {
        //                     $('.ui-draggable-dragging').removeClass('btn-block');
        //                     $('.ui-draggable-dragging').addClass('dw');
        //                 },

        //                 out: function () {
        //                     $('.ui-draggable-dragging').removeClass('dw');
        //                     $('.ui-draggable-dragging').addClass('btn-block');
        //                 }
        //             });
        //         }
        //     });
        //     $(".fc-right").html(`<i id="trash" class="fa fa-trash danger " style="font-size: 40px; color: red;" aria-hidden="true"></i>`);
        // });

    

        $scope.allEmployeeFunc = function () {
            $scope.allEmployee = '';
            if ($scope.allEmployee == '') {
                var urlData = {
                    'accountid': $scope.dashboard.values.accountid
                }
                $http.post("/dbic/assets/php/allEmployee.php", urlData)
                    .then(function (result) {
                        if (result.data.status == "empty") {
                            $scope.allEmployee = [];
                        } else {
                            $scope.allEmployee = result.data;
                        }
                    }, function (error) { }).finally(function () { });
            }

        }

        
   
        
        $scope.dashboard.setup();

        $(document).ready(function () {
            $(".fc-right").html(`<i id="trash" class="fa fa-trash danger " style="font-size: 40px; color: red;" aria-hidden="true"></i>`);
        });

    }]);