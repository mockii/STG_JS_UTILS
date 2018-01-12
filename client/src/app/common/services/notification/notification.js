
angular.module('common.services.Notification', [
    'common.services.Notification.constant',
    'common.services.Notification.proxy',
    'common.url'
])

    .factory('StgNotificationService', ['$rootScope', '$http', '$q', 'SERVER_URL_SPACE', 'NOTIFICATION_CONSTANTS', 'NotificationProxy',
        function($rootScope, $http, $q, SERVER_URL_SPACE, NOTIFICATION_CONSTANTS, NotificationProxy) {

            var APP_CONFIG = $rootScope.applicationConfiguration;

            
            function getNotificationForApplication(applicationName, page, limit, search, current) {
                var deferred = $q.defer();
                NotificationProxy.getNotificationByApplication(applicationName, page, limit, search, current).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }
            
            function getUserNotifications(userName, page, limit, search, current) {
                var deferred = $q.defer();
                NotificationProxy.getUserNotifications(userName, page, limit, search, current).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }
            
            function getUserApplicationNotifications(userName, applicationName, page, limit, search, current) {
                var deferred = $q.defer();
                NotificationProxy.getUserApplicationNotifications(userName, applicationName, page, limit, search, current).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }
            
            function getGroupNotifications(groupReference, page, limit, search, current) {
                var deferred = $q.defer();
                NotificationProxy.getGroupNotifications(groupReference, page, limit, search, current).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }
            
            function createAppNotification(notification) {
                var deferred = $q.defer();
                console.log(notification);
                NotificationProxy.createAppNotification(notification).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }
            
            function updateNotification(notification) {
                var deferred = $q.defer();
                NotificationProxy.updateNotification(notification).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }
            
            function deleteNotification(notificationId) {
                var deferred = $q.defer();
                NotificationProxy.deleteNotification(notificationId).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }


            function createUserNotification(userName, groupReference, notification) {
                var deferred = $q.defer();
                NotificationProxy.createUserNotification(userName, groupReference, notification).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }

            function deleteUserNotification(userName, groupReference) {
                var deferred = $q.defer();
                NotificationProxy.deleteUserNotification(userName, groupReference).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }


            function createGroupNotification(groupReference, notification) {
                var deferred = $q.defer();
                NotificationProxy.createGroupNotification(groupReference, notification).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }

            function deleteGroupNotification(groupReference) {
                var deferred = $q.defer();
                NotificationProxy.deleteGroupNotification(groupReference).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }

            function updateUserNotifications(userName, notifications) {
                var deferred = $q.defer();
                NotificationProxy.updateUserNotifications(userName, notifications).then(
                    function(data){
                        deferred.resolve(data);
                    },
                    handleNotificationException
                );
                return deferred.promise;
            }



            /** private function **/
            function handleNotificationException(error) {
                console.error('An error occurred while attempting to communicate with Notification services');
                console.error(error);
            }
            
            return {
                getNotificationForApplication : getNotificationForApplication,
                getUserNotifications : getUserNotifications,
                getUserApplicationNotifications : getUserApplicationNotifications,
                getGroupNotifications : getGroupNotifications,
                createAppNotification : createAppNotification,
                updateNotification : updateNotification,
                deleteNotification : deleteNotification,
                createUserNotification : createUserNotification,
                deleteUserNotification : deleteUserNotification,
                createGroupNotification : createGroupNotification,
                deleteGroupNotification : deleteGroupNotification,
                updateUserNotifications : updateUserNotifications
            };

        }]);
