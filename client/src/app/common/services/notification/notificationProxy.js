
angular.module('common.services.Notification.proxy', [
    'common.services.Notification.constant',
    'common.url'
])

    .factory('NotificationProxy', ['$rootScope', '$http', '$httpParamSerializer', '$q', 'SERVER_URL_SPACE', 'NOTIFICATION_CONSTANTS',
        function($rootScope, $http, $httpParamSerializer, $q, SERVER_URL_SPACE, NOTIFICATION_CONSTANTS) {

            var APP_CONFIG = $rootScope.applicationConfiguration;


            function getNotificationByApplication(applicationName, page, limit, search) {
                
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.getApplicationNotifications+"?appName="+applicationName+"&page="+page+"&limit="+limit+"&search="+search),
                        method: 'GET'
                    };
                console.log("called");
                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find notifications by user ');
                    });

                return deferred.promise;
            }
            
            function getUserNotifications(userName, page, limit, search) {
                
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.getUserNotifications+"?userName="+userName+"&page="+page+"&limit="+limit+"&search="+search),
                        method: 'GET'
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find notifications by user ');
                    });

                return deferred.promise;
            }
            
            function getUserApplicationNotifications(userName, applicationName, page, limit, search) {
                
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.getUserApplicationNotifications.replace('{user_name}', userName).replace('{application_name}', applicationName).replace('{page}', page).replace('{limit}', limit).replace('{search}', search)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.notification.accept.v1
                        }
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find notifications by user ');
                    });

                return deferred.promise;
            }
            
            function getGroupNotifications(groupReference, page, limit, search) {
                
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.getGroupNotifications+"?groupReference="+groupReference+"&page="+page+"&limit="+limit+"&search="+search),
                        method: 'GET'
                    };


                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find notifications by group ');
                    });

                return deferred.promise;
            }

            function createAppNotification(notification) {
                var deferred = $q.defer();
                var url = SERVER_URL_SPACE.urls.local.notification.createAppNotification;
                var reqObj = {
                    appName : notification.appName,
                    type: notification.type,
                    stime : notification.stime,
                    etime : notification.etime,
                    sref : notification.sref,
                    subject : notification.subject,
                    body : notification.body
                };
                $http.post(url, notification, {params: reqObj})
                    .then(function(response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to create notification ');
                    });

                return deferred.promise;
            }
            
            function updateNotification(notification) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.updateNotification),
                        method: 'PUT',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.form
                        },
                        data: $httpParamSerializer({
                            subject: notification.subject,
                            body: notification.body
                        })
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to update notification ');
                    });

                return deferred.promise;
            }
            
            
            function deleteNotification(notificationId) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.deleteNotification.replace('{notification_id}', notificationId)),
                        method: 'DELETE',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.notification.accept.v1
                        }
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to delete notification ');
                    });

                return deferred.promise;
            }


            function createUserNotification(userName, groupReference, notification) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.createUserNotification+"?appName="+notification.appName+"&type="+notification.type+"&stime="+notification.stime+"&etime="+notification.etime+"&sref="+notification.gref+"&subject="+notification.subject+"&body="+notification.body+"&userName="+notification.userName),
                        method: 'POST'
                    };

                $http(httpOptions, notification).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to create notification ');
                    });

                return deferred.promise;
            }

            function deleteUserNotification(userName, groupReference) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.deleteUserNotification.replace('{group_reference}', groupReference).replace('{user_name}', userName)),
                        method: 'DELETE',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.notification.accept.v1
                        }
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to delete notification ');
                    });

                return deferred.promise;
            }


            function createGroupNotification(groupReference, notification) {
                var deferred = $q.defer();
                var url = SERVER_URL_SPACE.urls.local.notification.createGroupNotification;
                var reqObj = {
                    appName : notification.appName,
                    type: notification.type,
                    stime : notification.stime,
                    etime : notification.etime,
                    sref : notification.sref,
                    subject : notification.subject,
                    body : notification.body,
                    gref : groupReference,
                    users : [notification.users]
                };
                $http.post(url, notification, {params: reqObj})
                    .then(function(response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to create group notification ');
                    });

                return deferred.promise;
            }

            function deleteGroupNotification(groupReference) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.notification.deleteGroupNotification.replace('{group_reference}', groupReference)),
                        method: 'DELETE',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.notification.accept.v1
                        }
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to delete notification ');
                    });

                return deferred.promise;
            }

            function updateUserNotifications(userName, notifications) {
                var deferred = $q.defer();
                var url = SERVER_URL_SPACE.urls.local.notification.updateUserNotifications;
                var reqObj = {
                    userName : userName,
                    notifications: notifications
                };
                $http.put(url, reqObj, {params: reqObj})
                    .then(function(response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to create group notification ');
                    });

                return deferred.promise;
            }
            
            
            return {
                getNotificationByApplication : getNotificationByApplication,
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
