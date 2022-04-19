// JavaScript Document
app.config(function ($interpolateProvider, $httpProvider, $routeProvider, $locationProvider) {
    $httpProvider.defaults.userXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requeste-With'];
    $httpProvider.defaults.headers.common['Accept'] = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $locationProvider.hashPrefix("");

    $routeProvider
        //LOGIN
        .when('/', {
            templateUrl: './view/login/index.html?v=dbic07202020',
            controller: 'LoginController',
            resolve: {
                app: NotAuthenticated
            }
        })
        .when('/login', {
            templateUrl: './view/login/index.html?v=dbic07202020',
            controller: 'LoginController',
            resolve: {
                app: NotAuthenticated
            }
        })

        //Admin's Portal
        .when('/admin/', {
            templateUrl: './view/admin/home/index.html?v=dbic07202020',
            controller: 'AdmHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/home', {
            templateUrl: './view/admin/home/index.html?v=dbic07202020',
            controller: 'AdmHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org', {
            templateUrl: './view/admin/org/units/index.html?v=dbic07202020',
            controller: 'BusinessUnitsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/units', {
            templateUrl: './view/admin/org/units/index.html?v=dbic07202020',
            controller: 'BusinessUnitsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/labor', {
            templateUrl: './view/admin/org/labor/index.html?v=dbic07202020',
            controller: 'LaborTypesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/posi', {
            templateUrl: './view/admin/org/position/index.html?v=dbic07202020',
            controller: 'PositionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/struct', {
            templateUrl: './view/admin/org/structure/index2.html?v=dbic07202020',
            controller: 'StructureController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/company', {
            templateUrl: './view/admin/org/company/index.html?v=dbic07202020',
            controller: 'CompanyController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/activities', {
            templateUrl: './view/admin/org/activities/index.html?v=dbic07202020',
            controller: 'CompanyActController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/matrix', {
            templateUrl: './view/admin/org/matrix/index.html?v=dbic07202020',
            controller: 'MatrixController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/org/uploader', {
            templateUrl: './view/admin/org/uploader/index.html?v=dbic07202020',
            controller: 'UploaderController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr', {
            templateUrl: './view/admin/hr/home/index.html?v=dbic07202020',
            controller: 'HRHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr/dashboard', {
            templateUrl: './view/admin/hr/home/index.html?v=dbic07202020',
            controller: 'HRHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr/employees', {
            templateUrl: './view/admin/hr/employees/index.html?v=dbic07202020',
            controller: 'HREmployeeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr/cln', {
            templateUrl: './view/admin/hr/cln/index.html?v=dbic07102020C',
            controller: 'HREmployeeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr/preference', {
            templateUrl: './view/admin/hr/setup/index.html?v=dbic07102020C',
            controller: 'HRPreferenceController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr/emp/report', {
            templateUrl: './view/admin/hr/employees/report.html?v=dbic07202020',
            controller: 'HRReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/compensation', {
            templateUrl: './view/admin/hr/report/compensation.html?v=dbic07202020',
            controller: 'HRCompensationController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/empTemp', {
            templateUrl: './view/admin/hr/report/empTemp.html?v=dbic07202020',
            controller: 'HREmployeeTemperatureController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/leaveConvertion', {
            templateUrl: './view/admin/hr/report/leaveConvertion.html?v=dbic07202020',
            controller: 'HRleaveConvertionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/resignDetail', {
            templateUrl: './view/admin/hr/report/resignDetail.html?v=dbic07202020',
            controller: 'HRresignDetailController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/employmentRecord', {
            templateUrl: './view/admin/hr/report/employmentRecord.html?v=dbic07202020',
            controller: 'HRemploymentRecordController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/hiredEmployees', {
            templateUrl: './view/admin/hr/report/hiredEmployees.html?v=dbic07202020',
            controller: 'HRhiredEmployeesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/birthday', {
            templateUrl: './view/admin/hr/report/birthday.html?v=dbic07202020',
            controller: 'HRbirthdayController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/ageDistribution', {
            templateUrl: './view/admin/hr/report/ageDistribution.html?v=dbic07202020',
            controller: 'HRageDistributionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/skillsInventory', {
            templateUrl: './view/admin/hr/report/skillsInventory.html?v=dbic07102020C',
            controller: 'HRskillsInventoryController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/awardsReceived', {
            templateUrl: './view/admin/hr/report/awardsReceived.html?v=dbic07102020C',
            controller: 'HRawardsReceivedController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/licenses', {
            templateUrl: './view/admin/hr/report/licenses.html?v=dbic07102020C',
            controller: 'HRlicensesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/trainingsTaken', {
            templateUrl: './view/admin/hr/report/trainingsTaken.html?v=dbic07102020C',
            controller: 'HRTrainingsTakenController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/disciplinaryActions', {
            templateUrl: './view/admin/hr/report/disciplinaryActions.html?v=dbic07102020C',
            controller: 'HRdisciplinaryActionsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/commendations', {
            templateUrl: './view/admin/hr/report/commendations.html?v=dbic07102020C',
            controller: 'HRCommendationsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/employeeMovement', {
            templateUrl: './view/admin/hr/report/employeeMovement.html?v=dbic07102020C',
            controller: 'HREmployeeMovementController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/propertyAccountability', {
            templateUrl: './view/admin/hr/report/propertyAccountability.html?v=dbic07102020C',
            controller: 'HRpropertyAccountabilityController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/educationalAttainment', {
            templateUrl: './view/admin/hr/report/educationalAttainment.html?v=dbic07102020C',
            controller: 'HREducationalAttainmentController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/examinationsSummary', {
            templateUrl: './view/admin/hr/report/examinationsSummary.html?v=dbic07102020C',
            controller: 'HRExaminationsSummaryController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/employmentHistory', {
            templateUrl: './view/admin/hr/report/employmentHistory.html?v=dbic07102020C',
            controller: 'HRemploymentHistoryController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/hr/weeklyHeadCountCompRep', {
            templateUrl: './view/admin/hr/report/weeklyHeadCountCompRep.html?v=dbic07202020',
            controller: 'HRWeeklyHeadCountController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/hr/personnelaction', {
            templateUrl: './view/admin/hr/personnelaction/index.html?v=dbic07202020',
            controller: 'HRPersonnelActionController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/lateral-transfer---current---', {
            templateUrl: './view/admin/hr/personnelaction/lateraltransfer/current/index.html?v=dbic07202020',
            controller: 'HRLateralTransferController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/lateral-transfer---archive---', {
            templateUrl: './view/admin/hr/personnelaction/lateraltransfer/archive/index.html?v=dbic07202020',
            controller: 'HRLateralTransferController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/lateral-transfer---approversetup---', {
            templateUrl: './view/admin/hr/personnelaction/lateraltransfer/approversetup/index.html?v=dbic07202020',
            controller: 'HRLateralTransferController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/wage-increase---current---', {
            templateUrl: './view/admin/hr/personnelaction/wageincrease/current/index.html?v=dbic07202020',
            controller: 'HRWageIncreaseController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/wage-increase---archive---', {
            templateUrl: './view/admin/hr/personnelaction/wageincrease/archive/index.html?v=dbic07202020',
            controller: 'HRWageIncreaseController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/wage-increase---approversetup---', {
            templateUrl: './view/admin/hr/personnelaction/wageincrease/approversetup/index.html?v=dbic07202020',
            controller: 'HRWageIncreaseController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/promotion-and-upgradation---current---', {
            templateUrl: './view/admin/hr/personnelaction/promotion/current/index.html?v=dbic190108',
            controller: 'HRPromotionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/promotion-and-upgradation---archive---', {
            templateUrl: './view/admin/hr/personnelaction/promotion/archive/index.html?v=dbic190108',
            controller: 'HRPromotionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/mass-data-update', {
            templateUrl: './view/admin/hr/massupdate/index.html?v=dbic07102020C',
            controller: 'HRMassUpdaterController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/promotion-and-upgradation---approversetup---', {
            templateUrl: './view/admin/hr/personnelaction/promotion/approversetup/index.html?v=dbic190108',
            controller: 'HRPromotionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk', {
            templateUrl: './view/admin/tk/home/index.html?v=dbic07202020',
            controller: 'TKHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/dashboard', {
            templateUrl: './view/admin/tk/home/index.html?v=dbic07202020',
            controller: 'TKHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/timesheet', {
            templateUrl: './view/admin/tk/timesheet/index.html?v=dbic07202020',
            controller: 'TKTimesheetController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/timeprocess', {
            templateUrl: './view/admin/tk/timeprocess/index.html?v=dbic07202020',
            controller: 'TKTimeprocessController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/timeclosing', {
            templateUrl: './view/admin/tk/timeclosing/index.html?v=dbic07202020',
            controller: 'TKTimeclossingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/link', {
            templateUrl: './view/admin/tk/link/index.html?v=dbic07202020',
            controller: 'TKTimelinkController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/pair', {
            templateUrl: './view/admin/tk/link/pair.html?v=dbic07202020',
            controller: 'TKTimelinkController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app', {
            templateUrl: './view/admin/tk/app/leaves/index.html?v=dbic07202020',
            controller: 'TKAppLeavesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app/leaveapp', {
            templateUrl: './view/admin/tk/app/leaves/index.html?v=dbic07202020',
            controller: 'TKAppLeavesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app/adjustapp', {
            templateUrl: './view/admin/tk/app/adjustment/index.html?v=dbic07202020',
            controller: 'TKAppAdjustmentController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app/overtimeapp', {
            templateUrl: './view/admin/tk/app/overtime/index.html?v=dbic07202020',
            controller: 'TKAppOvertimeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app/changeshiftapp', {
            templateUrl: './view/admin/tk/app/changeshift/index.html?v=dbic07202020',
            controller: 'TKAppOvertimeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app/obtripapp', {
            templateUrl: './view/admin/tk/app/ob/index.html?v=dbic07202020',
            controller: 'TKAppOvertimeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/app/dutyroster', {
            templateUrl: './view/admin/tk/app/dutyroster/index.html?v=dbic07202020',
            controller: 'TKAppDutyRosterController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup', {
            templateUrl: './view/admin/tk/setup/leaves/index.html?v=dbic07202020',
            controller: 'TKSetupLeavesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/leaves', {
            templateUrl: './view/admin/tk/setup/leaves/index.html?v=dbic07202020',
            controller: 'TKSetupLeavesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/leaverecords/leavemain', {
            templateUrl: './view/admin/tk/setup/leaverecords/index.html?v=dbic07202020',
            controller: 'TKSetupLeaveRecordsController',
            resolve: {
                app: Authenticated
            }
        })
        /*.when('/admin/tk/setup/overtimes',{
            templateUrl: './view/admin/tk/setup/overtimes/index.html?v=dbic07202020',
            controller: 'TKSetupOvertimeController',
            resolve: {
                app: Authenticated	
            }
        })*/
        .when('/admin/tk/setup/shifts', {
            templateUrl: './view/admin/tk/setup/shifts/index.html?v=dbic07202020',
            controller: 'TKSetupShiftsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/calendars', {
            templateUrl: './view/admin/tk/setup/calendar/index.html?v=dbic07202020',
            controller: 'TKSetupCalendarController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/holidays', {
            templateUrl: './view/admin/tk/setup/holiday/index.html?v=dbic07202020',
            controller: 'TKSetupHolidayController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/recorder', {
            templateUrl: './view/admin/tk/setup/recorder/index.html?v=dbic07202020',
            controller: 'TKSetupRecorderController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/preferences', {
            templateUrl: './view/admin/tk/setup/preference/index.html?v=dbic07202020',
            controller: 'TKSetupPreferencesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/leavemaster', {
            templateUrl: './view/admin/tk/setup/leavemaster/index.html?v=dbic07202020',
            controller: 'TKSetupLeaveMasterController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/tk/setup/overtimerates', {
            templateUrl: './view/admin/tk/setup/overtimerates/index.html?v=dbic07202020',
            controller: 'TKSetupOvertimeRatesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/nightdiff', {
            templateUrl: './view/admin/tk/setup/nightdiff/index.html?v=dbic07202020',
            controller: 'TKSetupNightDiffController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/premiumclass', {
            templateUrl: './view/admin/tk/setup/premiumclass/index.html?v=dbic07202020',
            controller: 'TKSetupPremiumClassController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/setup/leaveconversion', {
            templateUrl: './view/admin/tk/setup/conversion/index.html?v=dbic07202020',
            controller: 'TKSetupConversionController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/absenteeism', {
            templateUrl: './view/admin/tk/report/absenteeism.html?v=dbic07202020',
            controller: 'TKAbsenteeismController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/tk/report/leaveBalance', {
            templateUrl: './view/admin/tk/report/leaveBalance.html?v=dbic07202020',
            controller: 'TKLeaveBalanceController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/tk/report/overtimeHours', {
            templateUrl: './view/admin/tk/report/overtimeHours.html?v=dbic07202020',
            controller: 'TKOvertimeHoursController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/tk/report/rptsheet', {
            templateUrl: './view/admin/tk/report/index.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/overtimeRates', {
            templateUrl: './view/admin/tk/report/overtimeRates.html?v=dbic07202020',
            controller: 'TKOvertimeRatesController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/pay/report/government/hdmfMonthlyCon', {
            templateUrl: './view/admin/pay/report/government/hdmfMonthlyCon.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/hdmfMForm', {
            templateUrl: './view/admin/pay/report/government/hdmfMForm.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/hdmfLoans', {
            templateUrl: './view/admin/pay/report/government/hdmfLoans.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/sssMonthlyPre', {
            templateUrl: './view/admin/pay/report/government/sssMonthlyPre.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/sssLoans', {
            templateUrl: './view/admin/pay/report/government/sssLoans.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/philhealthReport', {
            templateUrl: './view/admin/pay/report/government/philhealthReport.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/birMonthlyITW', {
            templateUrl: './view/admin/pay/report/government/birMonthlyITW.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/birform', {
            templateUrl: './view/admin/pay/report/government/birform.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/bircform', {
            templateUrl: './view/admin/pay/report/government/bircform.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/alphalistnew', {
            templateUrl: './view/admin/pay/report/government/alphalistnew.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/government/alphalistneww', {
            templateUrl: './view/admin/pay/report/government/alphalistneww.html?v=dbic190108',
            controller: 'PMMonthlyConController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/absences', {
            templateUrl: './view/admin/tk/report/absences.html?v=dbic07202020',
            controller: 'TKAbsencesController',
            resolve: {
                app: Authenticated
            }
        })

        // .when('/admin/tk/report/leaveBalance', {
        //     templateUrl: './view/admin/tk/report/leaveBalance.html?v=dbic07202020',
        //     controller: 'TKAbsencesController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/overtimeHours', {
        //     templateUrl: './view/admin/tk/report/overtimeHours.html?v=dbic07202020',
        //     controller: 'TKAbsencesController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/overtimeRates', {
        //     templateUrl: './view/admin/tk/report/overtimeRates.html?v=dbic07202020',
        //     controller: 'TKAbsencesController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        .when('/admin/tk/report/perfectAttendance', {
            templateUrl: './view/admin/tk/report/perfectAttendance.html?v=dbic07202020',
            controller: 'TKPerfectAttendanceController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/tardinessDetail', {
            templateUrl: './view/admin/tk/report/tardinessDetail.html?v=dbic07202020',
            controller: 'TKAbsencesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/tardinessSummary', {
            templateUrl: './view/admin/tk/report/tardinessSummary.html?v=dbic07202020',
            controller: 'TKAbsencesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/totalAvailableHours', {
            templateUrl: './view/admin/tk/report/totalAvailableHours.html?v=dbic07202020',
            controller: 'TKAbsencesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/hdmfMonthlyCon', {
            templateUrl: './view/admin/tk/report/hdmfMonthlyCon.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/hdmfMForm', {
            templateUrl: './view/admin/tk/report/hdmfMForm.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/hdmfLoans', {
            templateUrl: './view/admin/tk/report/hdmfLoans.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/tk/report/sssLoans', {
            templateUrl: './view/admin/tk/report/sssLoans.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/philhealthReport', {
            templateUrl: './view/admin/tk/report/philhealthReport.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/birMonthlyITW', {
            templateUrl: './view/admin/tk/report/birMonthlyITW.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/birform', {
            templateUrl: './view/admin/tk/report/birform.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/bircform', {
            templateUrl: './view/admin/tk/report/bircform.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/alphalistnew', {
            templateUrl: './view/admin/tk/report/alphalistnew.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/alphalistneww', {
            templateUrl: './view/admin/tk/report/alphalistneww.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        // .when('/admin/tk/report/absences', {
        //     templateUrl: './view/admin/tk/report/absences.html?v=dbic07202020',
        //     controller: 'TKAbsencesController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/absenteeism', {
        //     templateUrl: './view/admin/tk/report/absenteeism.html?v=dbic07202020',
        //     controller: 'TKAbsenteeismController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/leaveBalance', {
        //     templateUrl: './view/admin/tk/report/leaveBalance.html?v=dbic07202020',
        //     controller: 'TKReportController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/overtimeHours', {
        //     templateUrl: './view/admin/tk/report/overtimeHours.html?v=dbic07202020',
        //     controller: 'TKReportController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/overtimeRates', {
        //     templateUrl: './view/admin/tk/report/overtimeRates.html?v=dbic07202020',
        //     controller: 'TKReportController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        // .when('/admin/tk/report/perfectAttendance', {
        //     templateUrl: './view/admin/tk/report/perfectAttendance.html?v=dbic07202020',
        //     controller: 'TKReportController',
        //     resolve: {
        //         app: Authenticated
        //     }
        // })
        .when('/admin/tk/report/tardinessDetail', {
            templateUrl: './view/admin/tk/report/tardinessDetail.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/tardinessSummary', {
            templateUrl: './view/admin/tk/report/tardinessSummary.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/timesheetSummary', {
            templateUrl: './view/admin/tk/report/timesheetSummary.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/availableHours', {
            templateUrl: './view/admin/tk/report/availableHours.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/tk/report/weeklyHeadcount', {
            templateUrl: './view/admin/tk/report/weeklyHeadcount.html?v=dbic07202020',
            controller: 'TKReportController',
            resolve: {
                app: Authenticated
            }
        })


        .when('/admin/mng/dashboard', {
            templateUrl: './view/admin/mng/home/index.html?v=dbic07202020',
            controller: 'MNGHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/timesheet', {
            templateUrl: './view/admin/mng/home/timesheet.html?v=dbic190108',
            controller: 'MNGHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/multi', {
            templateUrl: './view/admin/mng/home/multi.html?v=dbic190108',
            controller: 'MNGHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/multidad', {
            templateUrl: './view/admin/mng/home/multidad.html?v=dbic190108',
            controller: 'MNGHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/app/timekeeping/adjustapp', {
            templateUrl: './view/admin/mng/app/timekeeping/adjustment/index.html?v=dbic07202020',
            controller: 'MNGAppAdjustmentController',
            resolve: {
                app: Authenticated
            }
        })
        /*.when('/admin/mng/app/leaveapp',{
            templateUrl: './view/admin/mng/app/leaves/index.html?v=dbic07202020',
            controller: 'MNGAppLeaveController',
            resolve: {
                app: Authenticated
            }
        })
          .when('/admin/mng/app/leaves/leaveapp', {
            templateUrl: './view/admin/mng/app/leaves/index.html?v=dbic07202020',
            controller: 'MNGAppLeaveController',
            resolve: {
                app: Authenticated
            }
        })*/
        .when('/admin/mng/app/timekeeping/changeshiftapp', {
            templateUrl: './view/admin/mng/app/timekeeping/changeshift/index.html?v=dbic07202020',
            controller: 'MNGAppChangeShiftController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/app/timekeeping/overtimeapp', {
            templateUrl: './view/admin/mng/app/timekeeping/overtime/index.html?v=dbic07202020',
            controller: 'MNGAppOvertimeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/app/timekeeping/obapp', {
            templateUrl: './view/admin/mng/app/timekeeping/businesstrip/index.html?v=dbic07202020',
            controller: 'MNGAppOBController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/app/timekeeping/leaveapp', {
            templateUrl: './view/admin/mng/app/timekeeping/leaves/index.html?v=dbic07202020',
            controller: 'MNGAppLeaveController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/app/timekeeping/apptime', {
            templateUrl: './view/admin/mng/filling/ta/index.html?v=dbic07202020',
            controller: 'MNGTimeFillingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/app/timekeeping/appleave', {
            templateUrl: './view/admin/mng/filling/la/index.html?v=dbic07202020',
            controller: 'MNGLeaveFillingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/scheduler/shiftsched', {
            templateUrl: './view/admin/mng/scheduler/index.html?v=dbic07202020',
            controller: 'MNGSchedulerShiftSched',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/comprehensive/attendancetoday', {
            templateUrl: './view/admin/mng/comprehensive/attendance/index.html?v=dbic07202020',
            controller: 'MNGAttendanceTodayController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/comprehensive/myteam', {
            templateUrl: './view/admin/mng/comprehensive/team/index.html?v=dbic07202020',
            controller: 'MNGMyTeamController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/staffprofile', {
            templateUrl: './view/admin/emp/staffprofile/index.html?v=dbic07202020',
            controller: 'MNGMyTeamController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/comprehensive/timesheetrecord', {
            templateUrl: './view/admin/mng/comprehensive/timesheetrecord/index.html?v=dbic07202020',
            controller: 'MNGTimesheetRecordController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/report/tardinreport', {
            templateUrl: './view/admin/mng/report/tardiness.html?v=dbic07202020',
            controller: 'MNGTardinessReportController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/report/resocent', {
            templateUrl: './view/admin/mng/report/resocent.html?v=dbic07202020',
            controller: 'MNGResoCenterController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/mng/report/yrtdasr', {
            templateUrl: './view/admin/mng/report/yrtdasr.html?v=dbic07202020',
            controller: 'MNGYTDASRController',
            resolve: {
                app: Authenticated
            }
        })


        .when('/admin/emp/profile', {
            templateUrl: './view/admin/emp/profile/index.html?v=dbic07202020',
            controller: 'EPProfileController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/profile/editprofile', {
            templateUrl: './view/admin/emp/profile/editprofile.html?v=dbic07202020',
            controller: 'EPProfileController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/payslip', {
            templateUrl: './view/admin/emp/payslip/index.html?v=dbic07202020',
            controller: 'EPPaySlipController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/timesheet', {
            templateUrl: './view/admin/emp/timesheet/index.html?v=dbic07202020',
            controller: 'EPTimesheetController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/dashboard', {
            templateUrl: './view/admin/emp/dashboard/index.html?v=dbic07202020',
            controller: 'EPDashboardController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/emp/timekeeping', {
            templateUrl: './view/admin/emp/timesheet/timekeeping.html?v=dbic190108',
            controller: 'EPTimekeepingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/timekeeping2', {
            templateUrl: './view/admin/emp/timesheet/timekeeping2.html?v=dbic190108',
            controller: 'EPTimekeepingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/stafftimekeeping', {
            templateUrl: './view/admin/emp/stafftimekeeping/index.html?v=dbic07202020',
            controller: 'EPTimesheetController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/staffprofile', {
            templateUrl: './view/admin/emp/staffprofile/index.html?v=dbic07202020',
            controller: 'EPProfileController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/payslip', {
            templateUrl: './view/admin/emp/payslip/index.html?v=dbic190108',
            controller: 'EPPayslipController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/loans', {
            templateUrl: './view/admin/emp/payslip/loans.html?v=dbic190108',
            controller: 'EPPayslipController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/benefits', {
            templateUrl: './view/admin/emp/payslip/benefits.html?v=dbic190108',
            controller: 'EPPayslipController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/last', {
            templateUrl: './view/admin/emp/payslip/last.html?v=dbic190108',
            controller: 'EPPayslipController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/leaveapp', {
            templateUrl: './view/admin/emp/app/leaves/index.html?v=dbic07202020',
            controller: 'EPAppLeaveController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/leaveapp/accumulation', {
            templateUrl: './view/admin/emp/app/leaves/accumulation.html?v=dbic07202020',
            controller: 'EPAppLeaveController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/planner', {
            templateUrl: './view/admin/emp/planner/index.html?v=dbic07202020',
            controller: 'EPPlannerController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/adjustapp', {
            templateUrl: './view/admin/emp/app/adjustment/index.html?v=dbic07202020',
            controller: 'EPAppAdjustmentController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/overtimeapp', {
            templateUrl: './view/admin/emp/app/overtime/index.html?v=dbic07202020',
            controller: 'EPAppOvertimeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/announcement', {
            templateUrl: './view/admin/emp/announcement/index.html?v=dbic07202020',
            controller: 'EPAnnouncementController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/announcement/view', {
            templateUrl: './view/admin/emp/announcement/view.html?v=dbic07202020',
            controller: 'EPAnnouncementController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/cashadvance-current', {
            templateUrl: './view/admin/emp/cashadvance/current/index.html?v=dbic07202020',
            controller: 'EPCashAdvanceController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/cashadvance-archive', {
            templateUrl: './view/admin/emp/cashadvance/archive/index.html?v=dbic07202020',
            controller: 'EPCashAdvanceController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/emp/app/cashadvance-approvers', {
            templateUrl: './view/admin/emp/cashadvance/approversetup/index.html?v=dbic07202020',
            controller: 'EPCashAdvanceController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/home', {
            templateUrl: './view/admin/pay/home/index.html?v=dbic07202020',
            controller: 'PMHomeController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/timesheetsummary', {
            templateUrl: './view/admin/pay/entries/index.html?v=dbic07202020',
            controller: 'PMTimesheetSummaryController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/batchentries', {
            templateUrl: './view/admin/pay/entries/batchentries.html?v=dbic07202020',
            controller: 'PMBatchEntriesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/recurring', {
            templateUrl: './view/admin/pay/entries/recurring.html?v=dbic07202020',
            controller: 'PMRecurringTransactionsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/employeeloans', {
            templateUrl: './view/admin/pay/entries/employeeloans.html?v=dbic07202020',
            controller: 'PMEmployeeLoansController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/bonuses', {
            templateUrl: './view/admin/pay/entries/bonuses.html?v=dbic07202020',
            controller: 'PMBonusesController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/payrollprocess', {
            templateUrl: './view/admin/pay/entries/payrollprocess.html?v=dbic07202020',
            controller: 'PMPayrollProcessController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/payrollregister', {
            templateUrl: './view/admin/pay/entries/payrollregister.html?v=dbic07202020',
            controller: 'PMPayrollRegisterController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/bankremittance', {
            templateUrl: './view/admin/pay/entries/bankremittance.html?v=dbic07202020',
            controller: 'PMBankRemittanceController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/payrollclosing', {
            templateUrl: './view/admin/pay/entries/payrollclosing.html?v=dbic07202020',
            controller: 'PMPayrollClosingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/entries/distribution', {
            templateUrl: './view/admin/pay/entries/distribution.html?v=dbic07202020',
            controller: 'PMDistributionController',
            resolve: {
                app: Authenticated
            }
        })

        .when('/admin/pay/process', {
            templateUrl: './view/admin/pay/process/index.html?v=dbic07202020',
            controller: 'PMProcessController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/process/retroactive', {
            templateUrl: './view/admin/pay/process/retroactive.html?v=dbic07202020',
            controller: 'PMProcessRetroactiveController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/process/finalpay', {
            templateUrl: './view/admin/pay/process/finalpay.html?v=dbic07202020',
            controller: 'PMProcessFinalPayController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/process/13month', {
            templateUrl: './view/admin/pay/process/13month.html?v=dbic07202020',
            controller: 'PMProcess13monthController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/process/yearend', {
            templateUrl: './view/admin/pay/process/yearend.html?v=dbic07202020',
            controller: 'PMProcessYearendController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/government/hdmf', {
            templateUrl: './view/admin/pay/government/hdmf.html?v=dbic07202020',
            controller: 'PMHdmfController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/government/sss', {
            templateUrl: './view/admin/pay/government/sss.html?v=dbic07202020',
            controller: 'PMSssController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/government/philhealth', {
            templateUrl: './view/admin/pay/government/philhealth.html?v=dbic07202020',
            controller: 'PMPhilhealthController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/government/bir', {
            templateUrl: './view/admin/pay/government/bir.html?v=dbic07202020',
            controller: 'PMBirController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/file/payrollperiods', {
            templateUrl: './view/admin/pay/file/payrollperiods.html?v=dbic07202020',
            controller: 'PMPayrollPeriodsController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/file/bank', {
            templateUrl: './view/admin/pay/file/bank.html?v=dbic07202020',
            controller: 'PMBankController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/closing', {
            templateUrl: './view/admin/pay/closing/index.html?v=dbic07202020',
            controller: 'PMClosingController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report', {
            templateUrl: './view/admin/pay/report/register/index.html?v=dbic07202020',
            controller: 'PMRegisterController',
            resolve: {
                app: Authenticated
            }
        })
        .when('/admin/pay/report/register', {
            templateUrl: './view/admin/pay/report/register/index.html?v=dbic07202020',
            controller: 'PMRegisterController',
            resolve: {
                app: Authenticated
            }
        })

        //Employee's Portal
        /*.when('/tmsmems/',{
            templateUrl: './view/employee/tmsmems/home/index.html?v=dbic07202020',
            controller: 'HomeController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/tmsmems/home',{
            templateUrl: './view/employee/tmsmems/home/index.html?v=dbic07202020',
            controller: 'HomeController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/tmsmems/dtr',{
            templateUrl: './view/employee/tmsmems/dtr/index.html?v=dbic07202020',
            controller: 'DTRController',
            resolve: {
                app: Authenticated	
            }
        })*/

        //ADMIN OR PERSONNEL
        /*.when('/portal/',{
            templateUrl: './view/portal/home/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/home',{
            templateUrl: './view/portal/home/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/hired',{
            templateUrl: './view/portal/hired/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/applications',{
            templateUrl: './view/portal/applications/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/archived',{
            templateUrl: './view/portal/applications/archived.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/job',{
            templateUrl: './view/portal/jobs/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/edu',{
            templateUrl: './view/portal/edu/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/acct',{
            templateUrl: './view/portal/acct/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/portal/approver',{
            templateUrl: './view/portal/approver/index.html?v=dbic07202020',
            controller: 'DashboardController',
            resolve: {
                app: Authenticated	
            }
        })
    	
        //APPLICANT
        .when('/my/',{
            templateUrl: './view/user/jobs/index.html?v=dbic07202020',
            controller: 'UserController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/my/jobs',{
            templateUrl: './view/user/jobs/index.html?v=dbic07202020',
            controller: 'UserController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/my/cv',{
            templateUrl: './view/user/profile/index.html?v=dbic07202020',
            controller: 'UserController',
            resolve: {
                app: Authenticated	
            }
        })
        .when('/my/hist',{
            templateUrl: './view/user/history/index.html?v=dbic07202020',
            controller: 'UserController',
            resolve: {
                app: Authenticated	
            }
        })*/

        //ERROR
        .when('/permission', {
            templateUrl: './view/error/403.html?v=dbic07202020',
            controller: '404Controller'
        }).otherwise({
            templateUrl: './view/error/404.html?v=dbic07202020',
            controller: '404Controller'
        });
});