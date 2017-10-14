'use strict';

(function () {

    angular.module('common.directives.notificationMessages', [])
        .controller('NotificationMessagesModalController', ['$rootScope', '$scope', '$uibModalInstance', 'message', 'messageIndex',
            function($rootScope, $scope, $uibModalInstance, messages, messageIndex) {
                var notificationMessagesModalController = this;

                function initialize() {
                    notificationMessagesModalController.alerts = messages;
                    notificationMessagesModalController.alert = messages[messageIndex];
                    notificationMessagesModalController.hasMoreAlerts = messages.length > 1 ? true : false;
                    notificationMessagesModalController.alertIndex = messageIndex;
                }


                notificationMessagesModalController.showPriorAlert = function() {

                    if (notificationMessagesModalController.alert.isNew) {
                        notificationMessagesModalController.alert.isNew = false;
                        $rootScope.$broadcast('dismissAlert', notificationMessagesModalController.alert);
                    }

                    notificationMessagesModalController.alertIndex--;
                    notificationMessagesModalController.alert = notificationMessagesModalController.alerts[notificationMessagesModalController.alertIndex];
                    notificationMessagesModalController.hasMoreAlerts = (notificationMessagesModalController.alertIndex + 1) < notificationMessagesModalController.alerts.length ? true : false;
                };

                notificationMessagesModalController.showNextAlert = function() {

                    if (notificationMessagesModalController.alert.isNew) {
                        notificationMessagesModalController.alert.isNew = false;
                        $rootScope.$broadcast('dismissAlert', notificationMessagesModalController.alert);
                    }

                    if (!notificationMessagesModalController.hasMoreAlerts) {
                        notificationMessagesModalController.close();
                    } else {
                        notificationMessagesModalController.alertIndex++;
                        notificationMessagesModalController.alert = notificationMessagesModalController.alerts[notificationMessagesModalController.alertIndex];
                        notificationMessagesModalController.hasMoreAlerts = (notificationMessagesModalController.alertIndex + 1) < notificationMessagesModalController.alerts.length ? true : false;
                    }

                };

                notificationMessagesModalController.dismissAlert = function(alert) {
                    $rootScope.$broadcast('dismissAlert', alert);
                    $uibModalInstance.dismiss('cancel');
                };

                notificationMessagesModalController.close = function() {
                    $uibModalInstance.dismiss('cancel');
                };


                initialize();
            }
        ]);
})();