/*jslint browser:true */
angular.module("common.settings.oauth", [])
    .service("stgOauthSettings", [function() {
        this.clientTimeout = 0;
        this.currentToken = "";
        this.currentRbacProfile = {};
        this.logoutUrl = "";
        this.autoLogoutOnSessionExpired = "false";
        this.oauthEnabled = false;
    }]);

angular.module("common.services.stgOAuth2", [
    'common.services.CompassToastr',
    'common.directives.ModalDialog',
    'angulartics',
    'angulartics.google.analytics'
])
    .factory("stgOAuth2", ["$rootScope", "$interval", "$injector", "$window", "$q", "$analytics", "$timeout", "stgOauthSettings", "$document",
        function($rootScope, $interval, $injector, $window, $q, $analytics, $timeout, stgOauthSettings, $document) {
            var oauthSettings = {},
                _tokenRefreshLength,
                _expireTime,
                _timeLeft,
                _isLoggedIn,
                timeInterval;

            if ((typeof stgOauthSettings.oauthEnabled !== 'undefined') &&  stgOauthSettings.oauthEnabled === false) {
                oauthSettings.oauthEnabled = stgOauthSettings.oauthEnabled;
            }
            else {
                oauthSettings.oauthEnabled = true;
            }

            initialize();

            function initialize() {
                $rootScope.$broadcast('sessionInitialized');
                _tokenRefreshLength = (parseInt(stgOauthSettings.clientTimeout, 10) || 30);
                _expireTime = new Date(new Date().getTime() + _tokenRefreshLength);
                _timeLeft = _tokenRefreshLength;

                oauthSettings.currentToken = stgOauthSettings.currentToken;
                oauthSettings.pendingReauth = false;

                timeInterval = $interval(sessionCountdown, 1000);
                _isLoggedIn = true;
            }

            oauthSettings.getTimeLeft = function() {
                return _timeLeft;
            };

            function sessionCountdown() {
                if (_timeLeft > 0) {
                    _timeLeft -= 1000;

                    if (!oauthSettings.pendingReauth && _timeLeft > 179000 && _timeLeft < 181000) {
                        // display timeout warning
                        $analytics.eventTrack("Pop-up", {category:"SessionTimeout", label:"Pop-up"});
                        var ModalDialogService = $injector.get("ModalDialogService");
                        ModalDialogService.confirm({
                            title: "Session Timeout",
                            bodyText: "Your session will end in less than 3 minutes. Would you like to continue?",
                            okText: "Continue"
                        }).then(function(response) {
                            oauthSettings.resetSessionExpire();
                            $window.parent.postMessage('resetSession', '*');
                            var iframe = $document.find("iframe");
                            for (var i = 0; i < iframe.length; i++) {
                                iframe[i].contentWindow.postMessage('resetIframeSession', '*');
                            }

                            $analytics.eventTrack("Extended", {category:"SessionTimeout", label:"Extended"});
                        }, function(response) {
                            $analytics.eventTrack("Cancelled Extension", {category:"SessionTimeout", label:"Cancelled Extension"});
                        });
                    }

                } else {
                    _timeLeft = 0;
                    $injector.get("$uibModalStack").dismissAll();
                    $interval.cancel(timeInterval);
                    _isLoggedIn = false;

                    if (stgOauthSettings.autoLogoutOnSessionExpired === 'false') {
                        oauthSettings.showSessionExpired();
                    } else {
                        $analytics.eventTrack("Auto-logged out", {category:"SessionTimeout", label:"Auto-logged out"});
                        oauthSettings.logout();
                    }

                }
            }



            oauthSettings.logout = function(redirectURL) {
                    $rootScope.$broadcast('sessionLogout');
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                
                $analytics.eventTrack("Logged out", {category:"Logout", label:"Logged out"});

                // delay for analytics post
                $timeout(function() {
                    $injector.get("$http").get("/ui/auth/logout").then(function() {
                        var rootContext = $rootScope.applicationConfiguration.server.rootContext || '',
                            logoutUrl = rootContext + '/logout';

                        $window.location.href = redirectURL || logoutUrl;
                    });
                }, 500); // allow for tracking to post
            };

            oauthSettings.reauth = function() {
                $rootScope.$broadcast('sessionReauth');
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                
                var deferred = $q.defer();

                oauthSettings.prepareForReauth();
                $injector.get('oauthModal').showModal()
                    .then(function(authObject) {
                        oauthSettings.reauthComplete(authObject.newToken, authObject.newProfile);
                        deferred.resolve();
                    }, function(error) {
                        deferred.reject();
                    });

                return deferred.promise;
            };

            oauthSettings.showNoAccess = function() {
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                $injector.get('oauthModal').showNoAccess(stgOauthSettings.logoutUrl);
            };

            oauthSettings.showSessionExpired = function() {
                $rootScope.$broadcast('sessionExpired');
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                var deferred = $q.defer();

                $injector.get('oauthModal').showSessionExpired(stgOauthSettings.logoutUrl).then(
                    function(response){
                        deferred.resolve(response);
                    },
                    function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            };


            oauthSettings.resetSessionExpire = function() {
                $rootScope.$broadcast('resetSessionExpire');
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                _isLoggedIn = true;
                _expireTime = new Date(new Date().getTime() + _tokenRefreshLength);
                _timeLeft = _tokenRefreshLength;
                $interval.cancel(timeInterval);
                timeInterval = $interval(sessionCountdown, 1000);
            };

            oauthSettings.prepareForReauth = function() {
                oauthSettings.currentToken = undefined;
                oauthSettings.pendingReauth = true;
            };

            oauthSettings.reauthComplete = function(newToken, newProfile) {
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                oauthSettings.currentToken = newToken;
                oauthSettings.currentRbacProfile = newProfile;
                oauthSettings.pendingReauth = false;
                oauthSettings.resetSessionExpire();
            };


            oauthSettings.isLoggedIn = function() {
                if (oauthSettings.oauthEnabled === false) {
                    return;
                }
                return (!_isLoggedIn || !oauthSettings.pendingReauth);
            };

            return oauthSettings;
        }])

    .controller("oauthRenewTokenController", ['$uibModalInstance', '$window', function($uibModalInstance, $window) {
        var oauthRenewal = this;

        oauthRenewal.oauthUrl = $window.location.origin + $window.location.pathname + "auth/reauth";

        // will run on every uri change - needs to be on window
        window.checkForToken = function(iframe) {
            try {
                var newToken = document.getElementById("oauthIFrame").contentWindow.document.getElementById("newToken").innerHTML,
                    newProfile = document.getElementById("oauthIFrame").contentWindow.document.getElementById("newProfile").innerHTML;

                $uibModalInstance.close(newToken, newProfile);
            } catch(err) {
                // do nothing
            }
        };
    }])

    .controller("oauthNoPermissionsController", ["logout", function(logout) {
        var noPermissions = this;
        this.logout = logout;
    }])

    .controller("sessionExpiredController", ['$uibModalInstance', '$analytics', 'stgOAuth2', 'logout', function($uibModalInstance, $analytics, stgOAuth2, logout) {
        var sessionExpired = this;

        sessionExpired.logout = function() {
            $analytics.eventTrack("Logout", {category:"SessionExpired", label:"Logout"});
            $uibModalInstance.close('logout');
            stgOAuth2.logout(logout);
        };

        sessionExpired.reauth = function() {
            $analytics.eventTrack("Log back in", {category:"SessionExpired", label:"Continue working"});
            $uibModalInstance.close('reauth');
            stgOAuth2.reauth();
        };

    }])

    .service("oauthModal", ['$q', '$uibModal', function($q, $uibModal) {
        this.showModal = function() {
            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                templateUrl: 'common/services/oauth2/getUpdatedToken.tpl.html',
                controller: 'oauthRenewTokenController',
                controllerAs: 'oauthRenewal',
                windowClass: "oauthRenewModal",
                backdrop: 'static'
            });

            modalInstance.result.then(function(newToken, newProfile) {
                if (newToken && newToken.length > 5) {
                    deferred.resolve({newToken: newToken, newProfile: newProfile});
                } else {
                    deferred.resolve();
                }
            }, function(result) {
                // do something on dismissal of iframe modal
                deferred.reject();
            });

            return deferred.promise;
        };

        this.showNoAccess = function(logoutURL) {
            var modalInstance = $uibModal.open({
                templateUrl: 'common/services/oauth2/noPermissions.tpl.html',
                controller: 'oauthNoPermissionsController',
                controllerAs: 'noPermissions',
                windowClass: "oauthRenewModal",
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    logout: function() {
                        return logoutURL;
                    }
                }
            });
        };

        this.showSessionExpired = function(logoutURL) {
            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                templateUrl: 'common/services/oauth2/sessionExpired.tpl.html',
                controller: 'sessionExpiredController',
                controllerAs: 'sessionExpired',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    logout: function() {
                        return logoutURL;
                    }
                }
            });

            modalInstance.result.then(
                function(result){
                    deferred.resolve(result);
                },
                function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    }])

    .factory("oauthInterceptor", ["$q", '$location', '$injector', 'stgOAuth2', 'CompassToastr',
        function($q, $location, $injector, stgOAuth2, CompassToastr) {
            var canceller = $q.defer();

            var queuedRejections = [];

            var reauthAttempts = [];
            var stopDueToReauthErrors = false;

            var oauthInterceptor = {
                'request': function(config) {
                    // append token to header
                    config.headers.Authorization = ("Bearer " + stgOAuth2.currentToken).trim();

                    // check if in un-auth mode
                    if (stgOAuth2.pendingReauth) {
                        config.headers.Authorization = '';
                        config.timeout = 0;
                    }

                    return config;
                },
                'responseError': function(rejection) {
                    var displayText = "";
                    if (rejection.status === 401) {
                        var deferred = $q.defer();

                        if (queuedRejections.length > 0) {
                            queuedRejections.push({rejection: rejection, deferred: deferred});
                        } else if (queuedRejections.length > 100) {
                            // TODO: do nothing, should exit application
                            var tooManyInQueue = new Error("Too many queued RPCs - ignoring");
                            deferred.reject(tooManyInQueue);

                            throw tooManyInQueue;
                        } else {
                            queuedRejections.push({rejection: rejection, deferred: deferred});

                            var currentTime = (new Date()).getTime();

                            reauthAttempts.push(currentTime);
                            _.remove(reauthAttempts, function(item) {return item < (currentTime - (2 * 60 * 1000));});

                            if (reauthAttempts.length > 2) {
                                var reauthsInLast2Minutes = _.filter(reauthAttempts, function(item) {return item < currentTime;});
                                if (!stopDueToReauthErrors && reauthsInLast2Minutes.length >= 2) {
                                    stopDueToReauthErrors = true;
                                    stgOAuth2.showNoAccess();
                                }
                            } else {
                                stopDueToReauthErrors = false;
                            }

                            if (stopDueToReauthErrors) {
                                deferred.reject();
                                return;
                            }

                            stgOAuth2.reauth()
                                .then(function() {
                                    while (queuedRejections.length !== 0) {
                                        retryRPC(queuedRejections.shift());
                                    }
                                }, function() {
                                    while (queuedRejections.length !== 0) {
                                        $q.reject(queuedRejections.shift());
                                    }
                                });
                        }

                        return deferred.promise;
                    } else {
                        return $q.reject(rejection);
                    }
                },
                'response': function(response) {
                    // only reset if remote service call (html gets cached)
                    if (response.headers()["remote-api"] && response.headers()["remote-api"] === "true") {
                        stgOAuth2.resetSessionExpire();
                    }
                    return response;
                }
            };

            function retryRPC(currentReject) {
                var $http = $injector.get('$http');

                $http(currentReject.rejection.config)
                    .then(function(resp) {
                        if (resp) {
                            currentReject.deferred.resolve(resp);
                        } else {
                            currentReject.deferred.reject(resp);
                        }
                    }, function(resp) {
                        currentReject.deferred.reject(resp);
                    });
            }

            return oauthInterceptor;
        }])

    .config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.unshift('oauthInterceptor');
        }]);