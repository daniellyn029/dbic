app.controller('HRCLNController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'textAngularManager', '$templateRequest', '$sce', '$compile',
    function ($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, textAngularManager, $templateRequest, $sce) {

        $scope.headerTemplate = "view/admin/header/index.html";
        $scope.leftNavigationTemplate = "view/admin/hr/sidebar/index.html";
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
                leaves: [],
                period: [],
                daterange: '',
                late_tbl: [],
                absent_tbl: [],
                late_details: [],
                absent_details: [],
                present_tbl: [],
                present_details: [],
                leaves_tbl: [],
                applications_data: [],
                bdates: [],
                dept_ctr: [],
                dept_choose: ''
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
                        $scope.dashboard.values.leaves = data.leaves;
                        $scope.dashboard.values.period = data.period;
                        $scope.dashboard.values.daterange = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');

                        $("#picker1").daterangepicker({
                            startDate: moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY'),
                            endDate: moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY'),
                            locale: {
                                cancelLabel: 'Clear',
                                format: 'MM/DD/YYYY'
                            }
                        });
                        $("#picker1").on('apply.daterangepicker', function (ev, picker) {
                            $timeout(function () {
                                $scope.attendance_counter();
                                $scope.dept_attendance_ctr();
                                //$scope.applications_functions();
                                return;
                            }, 100);
                        });
                        $("#picker1").on('cancel.daterangepicker', function (ev, picker) {
                            $timeout(function () {
                                var dateText = moment($scope.dashboard.values.period.pay_start).format('MM/DD/YYYY') + ' - ' + moment($scope.dashboard.values.period.pay_end).format('MM/DD/YYYY');
                                $("#picker1").val(dateText);
                                $scope.dashboard.values.daterange = dateText;
                                $scope.attendance_counter();
                                $scope.dept_attendance_ctr();
                                //$scope.applications_functions();
                                return;
                            }, 100);

                        });
                        $scope.docutemplates();
                    }, function (response) {
                        $rootScope.modalDanger();
                    });
            }
        };


        $scope.issuance = function () {
            $scope.issuancetype1 = 'Prepared By';
            $scope.issuancetype2 = 'Reviewed By';
            $scope.issuancetype3 = 'Approved By';

            tinymce.PluginManager.add('mailto', function (editor, url) {
                editor.addButton('email', {
                    tooltip: 'Email',
                    image: tinymce.baseURL + '/plugins/email/icons/email.png',
                    onclick: function () {
                        $('#emailcontent').modal('show');
                    }
                });
            });


            if (tinyMCE.execCommand('mceRemoveEditor', false, 'previewdocument')) {
                tinymce.init({
                    selector: "#previewdocument",
                    plugins: "preview print powerpaste mailto",
                    menubar: false,
                    statusbar: false,
                    // toolbar: false,

                    toolbar: "print email",
                    formats: { 'letterSpacing': { inline: 'span', styles: { 'letter-spacing': '%value' } } },
                    content_style: "body {margin: 90px}",
                    height: "350",
                    content_css: "assets/css/contents.css",
                    content_style: "body { font-size: 14pt; font-family: Arial; }",
                    powerpaste_allow_local_images: true,
                    powerpaste_word_import: 'prompt',
                    powerpaste_html_import: 'prompt',
                    readonly: 1,
                    //saveToPdfHandler: 'assets/php/admin/hr/cln/savetopdf/savetopdf.php'

                });
            };

            $("#datecreated").datepicker({ dateFormat: "yy-mm-dd" }).datepicker("setDate", moment());

            $scope.issuancelistf();
        }


        $scope.insertcln = function () {
            if ($scope.clnaction == 'Insert') {
                $scope.cln.content = tinymce.get('contents').getContent();
                if ($scope.cln.content != '' && $scope.cln.type != undefined && $scope.cln.type != '' && $scope.cln.status != undefined && $scope.cln.status != '') {
                    var urlData = {
                        'accountid': $scope.dashboard.values.accountid,
                        'cln': $scope.cln
                    };

                    console.log($scope.cln);
                    $http.post(apiUrl + 'admin/hr/cln/addcln.php', urlData)
                        .then(function (response, status) {
                            var data = response.data;

                            $scope.clnlistf();

                        }, function (response) {
                            $rootScope.modalDanger();
                        });

                } else {
                    if ($scope.cln.content == '') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Please input contents";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                    }
                    if ($scope.cln.status == undefined || $scope.cln.status == '') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Please select status";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                    }
                    if ($scope.cln.type == undefined || $scope.cln.type == '') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Please select type";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                    }


                }
            }
            if ($scope.clnaction == 'Update') {

                $scope.cln.content = tinymce.get('contents').getContent();

                if ($scope.cln.content != '' && $scope.cln.type != undefined && $scope.cln.type != '' && $scope.cln.status != undefined && $scope.cln.status != '') {
                    var urlData = {
                        'accountid': $scope.dashboard.values.accountid,
                        'cln': $scope.cln
                    };

                    $http.post(apiUrl + 'admin/hr/cln/updatecln.php', urlData)
                        .then(function (response, status) {
                            var data = response.data;
                            $scope.clnlistf();
                        }, function (response) {
                            $rootScope.modalDanger();
                        });

                } else {

                    if ($scope.cln.content == '') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Please input contents";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                    }
                    if ($scope.cln.status == undefined || $scope.cln.status == '') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Please select status";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                    }
                    if ($scope.cln.type == undefined || $scope.cln.type == '') {
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodaltitle = "Warning!";
                        $rootScope.dymodalmsg = "Please select type";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                        $("#dymodal").modal("show");
                    }


                }
            }

        };

        $scope.updatecln = function (c) {
            $scope.cln.id = c.id;
            $scope.cln.name = c.name;
            $scope.cln.type = c.type;
            $scope.cln.status = c.status;
            $scope.cln.remarks = c.remarks;
            $scope.cln.content = c.content;
            tinymce.get('contents').setContent($scope.cln.content);

            console.log(tinymce.get('contents').getContent());

            $scope.clnaction = 'Update';
        };

        $scope.discardcln = function (c) {
            $scope.cln.id = '';
            $scope.cln.name = '';
            $scope.cln.type = '';
            $scope.cln.status = '';
            $scope.cln.remarks = '';
            $scope.cln.content = '';
            tinymce.get('contents').setContent($scope.cln.content);

            $scope.clnaction = 'Insert';
        };


        $scope.discardissuance = function (c) {
            $scope.issued = '';
            tinymce.get('previewdocument').setContent('');
        };


        $scope.clnlistf = function () {
            $scope.clnaction = 'Insert';
            $scope.cln.name = '';
            $scope.cln.type = '';
            $scope.cln.status = '';
            $scope.cln.remarks = '';
            $scope.cln.content = '';


            tinymce.PluginManager.add('spacing', function (editor, url) {
                editor.addButton('example1', {
                    text: 'Increase letter spacing',
                    icon: false,
                    onclick: function () {

                        var currentSpacing = 0;
                        var $selectedContent = $(tinyMCE.activeEditor.selection.getContent({ 'format': 'html' }));

                        if ($selectedContent.is("span") && $selectedContent.css('letter-spacing')) {
                            currentSpacing = +($selectedContent.css('letter-spacing').replace('px', ''));
                        }

                        currentSpacing += 1;

                        tinymce.activeEditor.formatter.apply('letterSpacing', { value: currentSpacing + 'px' });

                        var spanNode = tinyMCE.activeEditor.selection.getStart();
                        tinymce.activeEditor.selection.select(spanNode);

                    }
                });

                editor.addButton('example2', {
                    text: 'Decrease letter spacing',
                    icon: false,
                    onclick: function () {

                        var currentSpacing = 0;
                        var $selectedContent = $(tinyMCE.activeEditor.selection.getContent({ 'format': 'html' }));

                        if ($selectedContent.is("span") && $selectedContent.css('letter-spacing')) {
                            currentSpacing = +($selectedContent.css('letter-spacing').replace('px', ''));
                        }

                        currentSpacing -= 1;

                        tinymce.activeEditor.formatter.apply('letterSpacing', { value: currentSpacing + 'px' });

                        var spanNode = tinyMCE.activeEditor.selection.getStart();
                        tinymce.activeEditor.selection.select(spanNode);

                    }
                });

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


            if (tinyMCE.execCommand('mceRemoveEditor', false, 'contents')) {
                tinymce.init({
                    selector: "#contents",
                    plugins: "spacing preview print powerpaste ",
                    menubar: false,
                    toolbar: "print | example1 example2 undo redo | styleselect fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                    formats: { 'letterSpacing': { inline: 'span', styles: { 'letter-spacing': '%value' } } },
                    content_style: "body {margin: 90px}",
                    height: "350",
                    content_css: "assets/css/contents.css",
                    content_style: "body { font-size: 14pt; font-family: Arial; }",
                    powerpaste_allow_local_images: true,
                    powerpaste_word_import: 'prompt',
                    powerpaste_html_import: 'prompt',

                });

            };


            $scope.docutemplates();
            tinymce.get('contents').setContent('');
        };

        $scope.docutemplates = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
            };
            $http.post(apiUrl + 'admin/hr/cln/clnlist.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.clnlist = data;
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }




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

        $scope.allBusinessunitFunc = function () {
            $scope.allDepartment = [];
            var urlData = {
                'accountid': $scope.dashboard.values.accountid
            }

            $http.post("/dbic/assets/php/allBusinessunit.php", urlData)
                .then(function (result) {
                    if (result.data.status == "empty") {
                        $scope.allBusinessunit = [];
                    } else {
                        $scope.allBusinessunit = result.data;
                    }
                }, function (error) { }).finally(function () { });
        }

        $('#template').change(function () {
            var type = ($(this).find(':selected').attr('data-type'));
            if (type == 'lan') {
                $scope.issuancetype1 = 'Sinatory 1';
                $scope.issuancetype2 = 'Sinatory 2';
                $scope.issuancetype3 = 'Sinatory 3';

            } else {
                $scope.issuancetype1 = 'Prepared By';
                $scope.issuancetype2 = 'Reviewed By';
                $scope.issuancetype3 = 'Approved By';
            }


        });
        $(document).on("change", "#empid", function () {
            var id = ($(this).find(':selected').attr('data-type'));

            var date = new Date();
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + (date.getDate())).slice(-2);

            newdate = month + "" + year;

            $scope.issued.id = ('0000' + id).slice(-4) + "" + newdate;
            $scope.issued.date_created = year + '-' + month + '-' + day;
        });

        $(document).on("change", "#depid", function () {
            var id = ($(this).find(':selected').attr('data-type'));

            var date = new Date();
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + (date.getDate())).slice(-2);

            newdate = month + "" + year;

            $scope.issued.id = ('0000' + id).slice(-4) + "" + newdate;
            $scope.issued.date_created = year + '-' + month + '-' + day;
        });

        $scope.issued = {};
        $scope.issued.depid = 0;
        $scope.issued.empid = 0;

        $scope.insertissuance = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
                'issued': $scope.issued
            };
            console.log(urlData);

            $http.post(apiUrl + 'admin/hr/cln/addissuance.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.issued = [];
                    $scope.issuancelistf();

                    $timeout(function () {
                        $('#template').val(null).trigger('change');
                        $('#issuedto').val(null).trigger('change');
                        $('#empid').val(null).trigger('change');
                        $('#depid').val(null).trigger('change');
                        $('#issuancetype1').val(null).trigger('change');
                        $('#issuancetype2').val(null).trigger('change');
                        $('#issuancetype3').val(null).trigger('change');
                    })

                }, function (response) {
                    $scope.issued = [];
                    $scope.issuancelistf();
                });

        }


        $scope.issuancelistf = function () {
            var urlData = {
                'accountid': $scope.dashboard.values.accountid,
            };
            $http.post(apiUrl + 'admin/hr/cln/issuancelist.php', urlData)
                .then(function (response, status) {
                    var data = response.data;
                    $scope.issuancelist = data;
                }, function (response) {
                    $rootScope.modalDanger();
                });
        }

        $scope.viewtemplate = function (i) {
            tinymce.get('previewdocument').setContent('');
            if (i.department == null) {
                $scope.pdftitle = i.template + '-' + i.firstname + ' ' + i.middleinitial + ' ' + i.lastname;

                var str = i.content;
                var res = str;

                if (i.firstname)
                    res = res.split("{first name}").join(i.firstname);
                else
                    res = res.split("{first name}").join('');

                if (i.middleinitial)
                    res = res.split("{middle initial}").join(i.middleinitial + '.');
                else
                    res = res.split("{middle initial}").join('');

                if (i.lastname)
                    res = res.split("{last name}").join(i.lastname);
                else
                    res = res.split("{last name}").join('');


                if (i.suffix)
                    res = res.split("{suffix}").join(i.suffix);
                else
                    res = res.split("{suffix}").join('');

                if (i.company)
                    res = res.split("{company}").join(i.company);
                else
                    res = res.split("{company}").join('');

                if (i.SheorHe)
                    res = res.split("{She/He}").join(i.SheorHe);
                else
                    res = res.split("{She/He}").join('');


                if (i.hireddate)
                    res = res.split("{hired date}").join(moment(i.hireddate).format("MMMM DD, yyyy"));
                else
                    res = res.split("{hired date}").join('');


                if (i.position)
                    res = res.split("{position}").join(i.position);
                else
                    res = res.split("{position}").join('');


                if (i.department)
                    res = res.split("{department}").join(i.department);
                else
                    res = res.split("{department}").join('');

                if (i.date_issued)
                    res = res.split("{date issued}").join(ordinal_suffix_of(moment(i.date_issued).format("D")) + " day of " + moment(i.date_issued).format("MMMM, yyyy"));
                else
                    res = res.split("{date issued}").join('');

                var n = parseFloat(i.annualpay).toFixed(2);

                if (i.annualpay)
                    res = res.split("{annual gross pay}").join(numberWithCommas(n));
                else
                    res = res.split("{annual gross pay}").join('');


                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: left;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea1 + ' ' + i.lnamea1 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a1pos + '</p></div></div>');

                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: center;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea2 + ' ' + i.lnamea2 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a2pos + '</p></div></div>');

                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: center;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea3 + ' ' + i.lnamea3 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a3pos + '</p></div></div>');

                tinymce.get('previewdocument').setContent(res);
            } else {
                $scope.pdftitle = i.template + '-' + i.department;
                var str = i.content;
                var res = str;

                var urlData = {
                    'accountid': $scope.dashboard.values.accountid,
                    'department': i.department
                };
                $http.post(apiUrl + 'admin/hr/cln/allunits.php', urlData)
                    .then(function (response, status) {
                        var data = response.data;

                        angular.forEach(data, function (value, key) {
                            if (key > 0) {
                                res = res.concat(`<img class="mce-pagebreak" data-mce-resize="false" data-mce-placeholder="" data-mce-selected="1">` + str);

                                if (value.fname)
                                    res = res.split("{first name}").join(value.fname);
                                else
                                    res = res.split("{first name}").join('');

                                if (value.middleinitial)
                                    res = res.split("{middle initial}").join(value.middleinitial + ".");
                                else
                                    res = res.split("{middle initial}").join('');

                                if (value.lname)
                                    res = res.split("{last name}").join(value.lname);
                                else
                                    res = res.split("{last name}").join('');

                                if (value.suffix)
                                    res = res.split("{suffix}").join(value.suffix);
                                else
                                    res = res.split("{suffix}").join('');

                                if (value.company)
                                    res = res.split("{company}").join(value.company);
                                else
                                    res = res.split("{company}").join('');

                                if (value.SheorHe)
                                    res = res.split("{She/He}").join(value.SheorHe);
                                else
                                    res = res.split("{She/He}").join('');


                                if (value.hireddate)
                                    res = res.split("{hired date}").join(moment(value.hireddate).format("MMMM DD, yyyy"));
                                else
                                    res = res.split("{hired date}").join('');


                                if (value.position)
                                    res = res.split("{position}").join(value.position);
                                else
                                    res = res.split("{position}").join('');


                                if (value.department)
                                    res = res.split("{department}").join(value.department);
                                else
                                    res = res.split("{department}").join('');


                                var n = parseFloat(value.annualpay).toFixed(2);
                                if (value.annualpay)
                                    res = res.split("{annual gross pay}").join(numberWithCommas(n));
                                else
                                    res = res.split("{annual gross pay}").join('');


                                if (i.date_issued)
                                    res = res.split("{date issued}").join(ordinal_suffix_of(moment(i.date_issued).format("D")) + " day of " + moment(i.date_issued).format("MMMM, yyyy"));
                                else
                                    res = res.split("{date issued}").join('');

                                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: left;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea1 + ' ' + i.lnamea1 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a1pos + '</p></div></div>');

                                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: center;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea2 + ' ' + i.lnamea2 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a2pos + '</p></div></div>');

                                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: center;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea3 + ' ' + i.lnamea3 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a3pos + '</p></div></div>');

                                tinymce.get('previewdocument').setContent(res);

                            } else {
                                if (value.fname)
                                    res = res.split("{first name}").join(value.fname);
                                else
                                    res = res.split("{first name}").join('');

                                if (value.middleinitial)
                                    res = res.split("{middle initial}").join(value.middleinitial + '.');
                                else
                                    res = res.split("{middle initial}").join('');

                                if (value.lname)
                                    res = res.split("{last name}").join(value.lname);
                                else
                                    res = res.split("{last name}").join('');

                                if (value.suffix)
                                    res = res.split("{suffix}").join(value.suffix);
                                else
                                    res = res.split("{suffix}").join('');

                                if (value.company)
                                    res = res.split("{company}").join(value.company);
                                else
                                    res = res.split("{company}").join('');

                                if (value.SheorHe)
                                    res = res.split("{She/He}").join(value.SheorHe);
                                else
                                    res = res.split("{She/He}").join('');


                                if (value.hireddate)
                                    res = res.split("{hired date}").join(moment(value.hireddate).format("MMMM DD, yyyy"));
                                else
                                    res = res.split("{hired date}").join('');


                                if (value.position)
                                    res = res.split("{position}").join(value.position);
                                else
                                    res = res.split("{position}").join('');


                                if (value.department)
                                    res = res.split("{department}").join(value.department);
                                else
                                    res = res.split("{department}").join('');


                                var n = parseFloat(value.annualpay).toFixed(2);
                                if (value.annualpay)
                                    res = res.split("{annual gross pay}").join(numberWithCommas(n));
                                else
                                    res = res.split("{annual gross pay}").join('');


                                if (i.date_issued)
                                    res = res.split("{date issued}").join(ordinal_suffix_of(moment(i.date_issued).format("D")) + " day of " + moment(i.date_issued).format("MMMM, yyyy"));
                                else
                                    res = res.split("{date issued}").join('');

                                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: left;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea1 + ' ' + i.lnamea1 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a1pos + '</p></div></div>');

                                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: center;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea2 + ' ' + i.lnamea2 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a2pos + '</p></div></div>');

                                res = res.concat('<div style="width:100%;margin-top: 80px"><div style="width:33.33%; float: left; text-align: center;"><p style="margin-bottom: 0px;"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.fnamea3 + ' ' + i.lnamea3 + '</span></p><p style="margin:0px"><span style="font-size: 12pt;" data-mce-style="font-size: 12pt;">' + i.a3pos + '</p></div></div>');

                                tinymce.get('previewdocument').setContent(res);
                            }

                        });

                    }, function (response) {
                        $rootScope.modalDanger();
                    });





            }
        }

        $scope.issuedtype = '';
        $scope.$watch('typeissued', function () {
            if ($scope.typeissued == 'sa') {
                $scope.issuedtype = 'Employee';
                $scope.allEmployeeFunc();

            }
            if ($scope.typeissued == 'bu') {
                $scope.issuedtype = 'Classification';
                $scope.allBusinessunitFunc();
                $scope.allEmployeeFunc();
            }
        });

        function ordinal_suffix_of(i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        }

        $(function () {
            $("#tab").tabs();
        });

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        $scope.dashboard.setup();
    }]);
