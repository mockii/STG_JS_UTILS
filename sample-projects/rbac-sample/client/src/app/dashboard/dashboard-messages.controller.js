'use strict';

(function () {

    angular.module('rbac.sample.dashboardmessages.controller', [])
        .controller('DashboardMessagesModalController', ['$rootScope', '$scope', '$uibModalInstance', 'applicationMessage', 'applicationName', 'messageType',
            function($rootScope, $scope, $uibModalInstance, applicationMessage, applicationName, messageType) {
                var dashboardMessagesModalController = this;

                function initialize() {

                    dashboardMessagesModalController.applicationMessage = applicationMessage;
                    dashboardMessagesModalController.applicationName = applicationName;
                    dashboardMessagesModalController.messageType = messageType;

                    dashboardMessagesModalController.close = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                }

                initialize();
            }
        ]);
})();