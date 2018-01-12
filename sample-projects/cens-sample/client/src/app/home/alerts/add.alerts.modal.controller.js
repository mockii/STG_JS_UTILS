'use strict';

(function () {

    angular.module('sample.home.alerts.alerts.modal.controller', [
        'common.services.Notification'
    ])
        .controller('AddAlertsModalController', ['$rootScope', '$scope', '$uibModalInstance', 'blockUI', 'notificationType', 'StgNotificationService',
            function($rootScope, $scope, $uibModalInstance, blockUI, notificationType, StgNotificationService) {
                var addAlertsModalController = this;

                function initialize() {

                    addAlertsModalController.message = {
                        appName : ""
                    };
                    addAlertsModalController.message.appName = $rootScope.applicationConfiguration.application.name;
                    addAlertsModalController.message.category = notificationType;
                    if(notificationType === "User"){
                        addAlertsModalController.message.showUser = notificationType;
                    }
                    if(notificationType === "Group") {
                        addAlertsModalController.message.showGroup = notificationType;
                    }
                    addAlertsModalController.startDatePopup = {
                        opened: false
                    };

                    addAlertsModalController.endDatePopup = {
                        opened: false
                    };

                    addAlertsModalController.messageFieldConfig = {
                        height: 190,
                        toolbar: [
                            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                            ['textsize', ['fontsize']],
                            ['fontclr', ['color']],
                            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                            ['height', ['height']],
                            ['table', ['table']],
                            ['insert', ['link','video','hr']],
                            ['view', ['codeview']]
                        ]
                    };

                }

                /* Handlers for opening the various date components */

                addAlertsModalController.openStartDatePopup = function() {
                    addAlertsModalController.startDatePopup.opened = true;
                };

                addAlertsModalController.openEndDatePopup = function() {
                    addAlertsModalController.endDatePopup.opened = true;
                };

                /* END date component handlers */


                addAlertsModalController.close = function() {
                    $uibModalInstance.dismiss('cancel');
                };

                addAlertsModalController.changeNotificationType = function () {
                    console.log(addAlertsModalController.message.type);
                    if(addAlertsModalController.message.type === "Group"){
                        addAlertsModalController.showGroup = true;
                    }else{
                        addAlertsModalController.showGroup = false;
                    }
                };
                addAlertsModalController.submit = function() {
                    blockUI.instances.get("add-alerts-modal").start();

                    var edate = new Date(addAlertsModalController.message.end_time);
                    addAlertsModalController.message.etime = edate.getFullYear() + '-' + (parseInt(edate.getMonth())+1) + '-'  + edate.getDate();
                    var sdate = new Date(addAlertsModalController.message.start_time);
                    addAlertsModalController.message.stime = sdate.getFullYear() + '-' + (parseInt(sdate.getMonth())+1) + '-'  + sdate.getDate();
                    addAlertsModalController.message.type = "Alert";
                    console.log(addAlertsModalController.message);
                    if(addAlertsModalController.message.category === "Group") {
                        StgNotificationService.createGroupNotification(addAlertsModalController.gref, addAlertsModalController.message);
                    }else if(addAlertsModalController.message.category === "User"){
                        StgNotificationService.createUserNotification(addAlertsModalController.message);
                    }else{
                        StgNotificationService.createAppNotification(addAlertsModalController.message);
                    }

                    $uibModalInstance.close();

                    blockUI.instances.get("add-alerts-modal").stop();
                };


                initialize();
            }
        ]);
})();