'use strict';

(function () {

    angular.module('sample.home.controller', [
        'common.services.Notification',
        'sample.home.alerts.alerts.modal.controller'
    ])
        .controller('HomeController', ['$rootScope', 'CompassToastr', 'StgNotificationService', 'userNotifications', 'appNotifications', 'groupNotifications', '$uibModal', 'blockUI',
            function($rootScope, CompassToastr, StgNotificationService, userNotifications, appNotifications, groupNotifications, $uibModal, blockUI) {
            var homeController = this;

                homeController.application = $rootScope.applicationConfiguration.application;

                homeController.userNotifications = userNotifications;
                homeController.groupNotifications = groupNotifications;
                homeController.appNotifications = appNotifications;

               homeController.createNotificationByUser = function(){
                   var modalInstance = $uibModal.open({
                       templateUrl: 'home/alerts/add.alerts.modal.tpl.html',
                       controller: 'AddAlertsModalController as addAlertsModalController',
                       size: 'lg',
                       backdrop: 'static',
                       resolve: {
                           notificationType: function() {
                               return "User";
                           }
                       }
                   });

                   //refresh featured apps list
                   modalInstance.result.then(function (result) {
                       blockUI.instances.get("current-alerts-data-table").start();


                       blockUI.instances.get("current-alerts-data-table").stop();

                   });
                };

                homeController.createNotificationByGroup = function(){
                    var modalInstance = $uibModal.open({
                        templateUrl: 'home/alerts/add.alerts.modal.tpl.html',
                        controller: 'AddAlertsModalController as addAlertsModalController',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            notificationType: function() {
                                return "Group";
                            }
                        }
                    });

                    //refresh featured apps list
                    modalInstance.result.then(function (result) {
                        blockUI.instances.get("current-alerts-data-table").start();


                        blockUI.instances.get("current-alerts-data-table").stop();

                    });
                };

                homeController.createNotificationByApplication = function(){
                    var modalInstance = $uibModal.open({
                        templateUrl: 'home/alerts/add.alerts.modal.tpl.html',
                        controller: 'AddAlertsModalController as addAlertsModalController',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            notificationType: function() {
                                return "Application";
                            }
                        }
                    });

                    //refresh featured apps list
                    modalInstance.result.then(function (result) {
                        blockUI.instances.get("current-alerts-data-table").start();


                        blockUI.instances.get("current-alerts-data-table").stop();

                    });
                };

                homeController.notificationTypes = [{id:10001, name:"User"},{id:10002, name:"Group"},{id:10003, name:"Application"}];

                homeController.openAddAlertsModal = function(alertsMessage, readOnly) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'home/alerts/add.alerts.modal.tpl.html',
                        controller: 'AddAlertsModalController as addAlertsModalController',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            notificationTypes: function() {
                                return homeController.notificationTypes;
                            }
                        }
                    });

                    //refresh featured apps list
                    modalInstance.result.then(function (result) {
                        blockUI.instances.get("current-alerts-data-table").start();


                        blockUI.instances.get("current-alerts-data-table").stop();

                    });
                };

            }
    ]);
})();