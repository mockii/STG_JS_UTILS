/*! STGWebUtils - version:0.1.0 - 2015-10-30 * Copyright (c) 2015 Compass Group;*/
angular.module('STGWebUtils', [
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'ng.shims.placeholder',
    'ui.bootstrap',
    'ui.router',
    'ngToast',
    'common.directives',
    'common.services',
    'common.filters',
    'common.templates.app'
])

.controller("AppController", ['$rootScope', '$scope', function($rootScope, $scope) {

}])

.run(['$rootScope', '$state', '$location', function ($rootScope, $state) {

}]);



angular.module('common.directives', [
    'common.directives.ModalDialog',
    'common.directives.STGHeader'
]);

angular.module('common.directives.STGHeader', [
    'common.directives.STGPageHeader'
])
    .controller('HeaderController', ['$scope',
        function ($scope) {
            var headerController = this;

            headerController.notifications = $scope.notifications;
            headerController.tasks = $scope.tasks;
            headerController.inbox = $scope.inbox;
            headerController.userMenuItems = $scope.userMenuItems;
            headerController.logo = $scope.logo;

            headerController.doSomething = function() {
                alert("hi");
            };

        }])

    .directive('stgHeader', [function() {
        return {
            restrict: 'EA',
            scope: {
                notifications: "=",
                tasks: "=",
                inbox: "=",
                userMenuItems: "=",
                logo: "@"
            },
            require: "ngModel",
            templateUrl: 'common/directives/header/stgHeader.tpl.html',
            controller: 'HeaderController as headerCtrl'
        };
    }]);

/* global Layout */
angular.module('common.directives.STGPageHeader', [
])
    .controller('PageHeaderController', ['$scope',
        function ($scope) {
            var pageHeaderController = this;

            console.log("init header...");
            Layout.initHeader(); // init header
        }])

    .directive('stgPageHeader', [function() {
        return {
            restrict: 'EA',
            scope: {
                menuItems: "="
            },
            require: "ngModel",
            templateUrl: 'common/directives/header/stgPageHeader.tpl.html',
            controller: 'PageHeaderController as pageHeaderCtrl'
        };
    }]);

angular.module('common.directives.ModalDialog', [
    'ngSanitize',
    'ui.bootstrap'
])
    .service("ModalDialogService", ['$q', '$uibModal', function($q, $uibModal) {

        /*
        Options:
         bodyText: "Would you like to continue?"
         cancelText: cancel
         okText: ok
         */

        this.alert = function(configObject) {
            var deferred = $q.defer();

            configObject = setupConfigObject(configObject);
            configObject.title = configObject.title || "Alert!";

            // overrides
            configObject.size = "sm";
            configObject.hideCancelButton = true;

            var modalObject = getBaseModalObject(configObject);

            var modalInstance = $uibModal.open(modalObject);

            modalInstance.result.then(function() {
                deferred.resolve();
            }, function(result) {
                deferred.reject();
            });

            return deferred.promise;
        };

        this.confirm = function(configObject) {
            var deferred = $q.defer();

            configObject = setupConfigObject(configObject);
            configObject.title = configObject.title || "Confirm Action";

            // overrides
            configObject.size = "sm";

            var modalObject = getBaseModalObject(configObject);

            var modalInstance = $uibModal.open(modalObject);

            modalInstance.result.then(function() {
                deferred.resolve();
            }, function(result) {
                deferred.reject();
            });

            return deferred.promise;
        };

        function getBaseModalObject(configObject) {
            return {
                templateUrl: 'common/directives/modalDialog/modalDialog.tpl.html',
                controller: 'ModalDialogController',
                controllerAs: 'dialogController',
                windowClass: configObject.windowClass,
                backdropClass: configObject.backdropClass,
                animation: configObject.animation,
                backdrop: configObject.backdrop,
                keyboard: configObject.keyboard,
                windowTemplateUrl: configObject.windowTemplateUrl,
                size: configObject.size,
                openedClass: configObject.openedClass,
                resolve: {
                    configObject: function () {
                        return configObject;
                    }
                }
            };
        }

        function setupConfigObject(configObject) {
            if (Object.prototype.toString.call(configObject) === "[object String]") {
                configObject = {
                    bodyText:configObject
                };
            }

            return {
                bodyText: configObject.bodyText || "Are you sure?",
                bodyHTML: configObject.bodyHTML || "",
                cancelText: configObject.cancelText || "Cancel",
                okText: configObject.okText || "Ok",
                title: configObject.title || "",
                hideCancelButton: configObject.hideCancelButton || false,
                windowClass: configObject.windowClass || "cg-modal-dialog",
                backdropClass: configObject.backdropClass || "",
                animation: configObject.animation || true,
                backdrop: configObject.backdrop || true,
                keyboard: configObject.keyboard || true,
                windowTemplateUrl: configObject.windowTemplateUrl || "",
                size: configObject.size || "",
                openedClass: configObject.openedClass || ""
            };
        }
    }])

    .controller('ModalDialogController', ['$scope', 'configObject', '$modalInstance',
        function ($scope, configObject, $modalInstance) {
            var dialogController = this;
            dialogController.title = configObject.title;
            dialogController.bodyText = configObject.bodyText;
            dialogController.bodyHTML = configObject.bodyHTML;
            dialogController.cancelText = configObject.cancelText;
            dialogController.okText = configObject.okText;
            dialogController.hideCancelButton = configObject.hideCancelButton || false;

            dialogController.cancelSelected = function() {
                $modalInstance.dismiss(false);
            };

            dialogController.okSelected = function() {
                $modalInstance.close(true);
            };
        }])

;
angular.module("common.filters.CountdownTimerFilter", [])
    .filter('CountdownTimerFilter', [function() {
    return function (timeInSeconds) {
        var formattedString = "";

        if (timeInSeconds) {
            var totalHours = 0;
            var totalMinutes = 0;
            var totalSeconds = 0;

            if ((timeInSeconds / 1000 / 60 / 60) >= 1) {
                totalHours = parseInt((timeInSeconds / 1000 / 60 /60), 10);
                timeInSeconds = (timeInSeconds - (totalHours * 1000 * 60 * 60));
            }

            if ((timeInSeconds / 1000 / 60) >= 1) {
                totalMinutes = parseInt((timeInSeconds / 1000 / 60), 10);
                timeInSeconds = (timeInSeconds - (totalMinutes * 1000 * 60));
            }

            if ((timeInSeconds / 1000) >= 1) {
                totalSeconds = parseInt((timeInSeconds / 1000), 10);
            }

            if (totalHours > 0) {
                formattedString = totalHours + ":" + ("0" + totalMinutes).slice(-2) + ":" + ("0" + totalSeconds).slice(-2);
            } else {
                formattedString += totalMinutes + ":" + ("0" + totalSeconds).slice(-2);

            }
        }

        return formattedString;
    };
}]);

angular.module('common.filters', [
    'common.filters.CountdownTimerFilter'
]);

angular.module("common.services.CompassToastr", ['ngToast'])
    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide'
        });
    }])

    .service('CompassToastr', ['ngToast', function (ngToast) {
        this.warning = function(message) {
            ngToast.create({
                className: 'danger',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 10000,
                animation: 'slide'
            });
        };

        this.success = function(message) {
            ngToast.create({
                className: 'success',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 3000,
                animation: 'slide'
            });
        };
    }]);
/*jslint browser:true */
angular.module("common.services.stgOAuth2", [
    'common.settings.oauth',
    'common.services.CompassToastr',
    'common.directives.ModalDialog',
    'angulartics',
    'angulartics.google.analytics'
])
    .factory("stgOAuth2", ["$interval", "$injector", "$window", "$q", "$analytics", "$timeout", "stgOauthSettings",
        function($interval, $injector, $window, $q, $analytics, $timeout, stgOauthSettings) {
            var oauthSettings = {};

            var _tokenRefreshLength = (parseInt(stgOauthSettings.clientTimeout, 10) || 30);
            var _expireTime = new Date(new Date().getTime() + _tokenRefreshLength);

            var _timeLeft = _tokenRefreshLength;

            oauthSettings.getTimeLeft = function() {
                return _timeLeft;
            };

            oauthSettings.currentToken = stgOauthSettings.currentToken;

            var timeInterval = $interval(function() {
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
                            $analytics.eventTrack("Extended", {category:"SessionTimeout", label:"Extended"});
                        }, function(response) {
                            $analytics.eventTrack("Cancelled Extension", {category:"SessionTimeout", label:"Cancelled Extension"});
                        });
                    }

                } else {
                    _timeLeft = 0;
                    $interval.cancel(timeInterval);
                    $injector.get("$modalStack").dismissAll();
                    _isLoggedIn = false;
                    $analytics.eventTrack("Auto-logged out", {category:"SessionTimeout", label:"Auto-logged out"});
                    oauthSettings.logout();
                }
            }, 1000);

            oauthSettings.logout = function(redirectURL) {
                $analytics.eventTrack("Logged out", {category:"Logout", label:"Logged out"});

                // delay for analytics post
                $timeout(function() {
                    $injector.get("$http").get("/auth/logout").then(function() {
                        $window.location.href = redirectURL || "/logout";
                    });
                }, 500); // allow for tracking to post
            };

            oauthSettings.reauth = function() {
                var deferred = $q.defer();

                oauthSettings.prepareForReauth();
                $injector.get('oauthModal').showModal()
                    .then(function(newToken) {
                        oauthSettings.reauthComplete(newToken);
                        deferred.resolve();
                    }, function(error) {
                        deferred.reject();
                    });

                return deferred.promise;
            };

            oauthSettings.resetSessionExpire = function() {
                _isLoggedIn = true;
                _expireTime = new Date(new Date().getTime() + _tokenRefreshLength);
                _timeLeft = _tokenRefreshLength;
            };

            oauthSettings.prepareForReauth = function() {
                oauthSettings.currentToken = undefined;
                oauthSettings.pendingReauth = true;
            };

            oauthSettings.reauthComplete = function(newToken) {
                oauthSettings.currentToken = newToken;
                oauthSettings.pendingReauth = false;
                oauthSettings.resetSessionExpire();
            };

            oauthSettings.pendingReauth = false;

            var _isLoggedIn = true;

            oauthSettings.isLoggedIn = function() {
                return (!_isLoggedIn || !oauthSettings.pendingReauth);
            };

            return oauthSettings;
        }])

    .controller("oauthRenewTokenController", ['$modalInstance', function($modalInstance) {
        var oauthRenewal = this;

        // will run on every uri change - needs to be on window
        window.checkForToken = function(iframe) {
            try {
                var newToken = document.getElementById("oauthIFrame").contentWindow.document.getElementById("newToken").innerHTML;

                $modalInstance.close(newToken);
            } catch(err) {
                // do nothing
            }
        };
    }])

    .service("oauthModal", ['$q', '$uibModal', function($q, $uibModal) {
        this.showModal = function() {
            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                templateUrl: 'common/services/oauth2/getUpdatedToken.tpl.html',
                controller: 'oauthRenewTokenController',
                controllerAs: 'oauthRenewal',
                windowClass: "oauthRenewModal"
            });

            modalInstance.result.then(function(newToken) {
                if (newToken && newToken.length > 5) {
                    deferred.resolve(newToken);
                } else {
                    deferred.resolve();
                }
            }, function(result) {
                // do something on dismissal of iframe modal
                deferred.reject();
            });

            return deferred.promise;
        };

    }])

    .factory("oauthInterceptor", ["$q", '$location', '$injector', 'stgOAuth2', 'CompassToastr',
        function($q, $location, $injector, stgOAuth2, CompassToastr) {
            var canceller = $q.defer();

            var oauthInterceptor = {
                'request': function(config) {
                    // append token to header
                    config.headers.Authorization = "token " + stgOAuth2.currentToken;

                    // check if in un-auth mode
                    if (stgOAuth2.pendingReauth) {
                        config.timeout = 0;
                    }

                    return config;
                },
                'responseError': function(rejection) {
                    var displayText = "";
                    if (rejection.status === 401) {
                        var deferred = $q.defer();

                        stgOAuth2.reauth()
                            .then(function() {
                                var $http = $injector.get('$http');
                                $http(rejection.config)
                                    .then(function(resp) {
                                        deferred.resolve(resp);
                                    }, function(resp) {
                                        deferred.reject(resp);
                                    });
                            }, function() {
                                $q.reject(rejection);
                            });

                        return deferred.promise;
                    }

                    return rejection || $q.when(rejection);
                },
                'response': function(response) {
                    // only reset if remote service call (html gets cached)
                    if (response.headers()["remote-api"] && response.headers()["remote-api"] === "true") {
                        stgOAuth2.resetSessionExpire();
                    }
                    return response;
                }
            };

            return oauthInterceptor;
        }])

    .config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.unshift('oauthInterceptor');
        }]);
angular.module('common.services', [
    'common.services.CompassToastr',
    'common.services.stgOAuth2'
]);

var en_US = {
    MAIN: {
        TITLE: "Application Name",
        COPYRIGHT: "Copyright &copy; 2015 - Compass Group"
    }
};


angular.module('common.templates.app', ['common/directives/header/stgHeader.tpl.html', 'common/directives/header/stgPageHeader.tpl.html', 'common/directives/modalDialog/modalDialog.tpl.html', 'common/services/oauth2/getUpdatedToken.tpl.html']);

angular.module("common/directives/header/stgHeader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/header/stgHeader.tpl.html",
    "<!-- BEGIN HEADER TOP -->\n" +
    "<div class=\"page-header-top\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <!-- BEGIN LOGO -->\n" +
    "        <div class=\"page-logo\">\n" +
    "            <a href=\"#/dashboard\"><img src=\"{{ headerCtrl.logo }}\" alt=\"logo\" class=\"logo-default\"></a>\n" +
    "        </div>\n" +
    "        <button ng-click=\"headerCtrl.doSomething()\">Click me</button>\n" +
    "        <!-- END LOGO -->\n" +
    "        <!-- BEGIN RESPONSIVE MENU TOGGLER -->\n" +
    "        <a href=\"javascript:;\" class=\"menu-toggler\"></a>\n" +
    "        <!-- END RESPONSIVE MENU TOGGLER -->\n" +
    "        <!-- BEGIN TOP NAVIGATION MENU -->\n" +
    "        <div class=\"top-menu\">\n" +
    "            <ul class=\"nav navbar-nav pull-right\">\n" +
    "                <!-- BEGIN NOTIFICATION DROPDOWN -->\n" +
    "                <li class=\"dropdown dropdown-extended dropdown-dark dropdown-notification\" id=\"header_notification_bar\">\n" +
    "                    <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-menu-hover data-toggle=\"dropdown\" data-close-others=\"true\">\n" +
    "                        <i class=\"icon-bell\"></i>\n" +
    "                        <span class=\"badge badge-default\">7</span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li class=\"external\">\n" +
    "                            <h3>You have <strong>12 pending</strong> tasks</h3>\n" +
    "                            <a href=\"javascript:;\">view all</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <ul class=\"dropdown-menu-list scroller\" style=\"height: 250px;\" data-handle-color=\"#637283\">\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">just now</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-success\">\n" +
    "									<i class=\"fa fa-plus\"></i>\n" +
    "									</span>\n" +
    "									New user registered. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">3 mins</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-danger\">\n" +
    "									<i class=\"fa fa-bolt\"></i>\n" +
    "									</span>\n" +
    "									Server #12 overloaded. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">10 mins</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-warning\">\n" +
    "									<i class=\"fa fa-bell-o\"></i>\n" +
    "									</span>\n" +
    "									Server #2 not responding. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">14 hrs</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-info\">\n" +
    "									<i class=\"fa fa-bullhorn\"></i>\n" +
    "									</span>\n" +
    "									Application error. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">2 days</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-danger\">\n" +
    "									<i class=\"fa fa-bolt\"></i>\n" +
    "									</span>\n" +
    "									Database overloaded 68%. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">3 days</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-danger\">\n" +
    "									<i class=\"fa fa-bolt\"></i>\n" +
    "									</span>\n" +
    "									A user IP blocked. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">4 days</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-warning\">\n" +
    "									<i class=\"fa fa-bell-o\"></i>\n" +
    "									</span>\n" +
    "									Storage Server #4 not responding dfdfdfd. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">5 days</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-info\">\n" +
    "									<i class=\"fa fa-bullhorn\"></i>\n" +
    "									</span>\n" +
    "									System Error. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "                                        <span class=\"time\">9 days</span>\n" +
    "									<span class=\"details\">\n" +
    "									<span class=\"label label-sm label-icon label-danger\">\n" +
    "									<i class=\"fa fa-bolt\"></i>\n" +
    "									</span>\n" +
    "									Storage server failed. </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <!-- END NOTIFICATION DROPDOWN -->\n" +
    "                <!-- BEGIN TODO DROPDOWN -->\n" +
    "                <li class=\"dropdown dropdown-extended dropdown-dark dropdown-tasks\" id=\"header_task_bar\">\n" +
    "                    <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-menu-hover data-toggle=\"dropdown\" data-close-others=\"true\">\n" +
    "                        <i class=\"icon-calendar\"></i>\n" +
    "                        <span class=\"badge badge-default\">3</span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu extended tasks\">\n" +
    "                        <li class=\"external\">\n" +
    "                            <h3>You have <strong>12 pending</strong> tasks</h3>\n" +
    "                            <a href=\"javascript:;\">view all</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <ul class=\"dropdown-menu-list scroller\" style=\"height: 275px;\" data-handle-color=\"#637283\">\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">New release v1.2 </span>\n" +
    "									<span class=\"percent\">30%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress\">\n" +
    "									<span style=\"width: 40%;\" class=\"progress-bar progress-bar-success\" aria-valuenow=\"40\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">40% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">Application deployment</span>\n" +
    "									<span class=\"percent\">65%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress\">\n" +
    "									<span style=\"width: 65%;\" class=\"progress-bar progress-bar-danger\" aria-valuenow=\"65\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">65% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">Mobile app release</span>\n" +
    "									<span class=\"percent\">98%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress\">\n" +
    "									<span style=\"width: 98%;\" class=\"progress-bar progress-bar-success\" aria-valuenow=\"98\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">98% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">Database migration</span>\n" +
    "									<span class=\"percent\">10%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress\">\n" +
    "									<span style=\"width: 10%;\" class=\"progress-bar progress-bar-warning\" aria-valuenow=\"10\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">10% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">Web server upgrade</span>\n" +
    "									<span class=\"percent\">58%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress\">\n" +
    "									<span style=\"width: 58%;\" class=\"progress-bar progress-bar-info\" aria-valuenow=\"58\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">58% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">Mobile development</span>\n" +
    "									<span class=\"percent\">85%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress\">\n" +
    "									<span style=\"width: 85%;\" class=\"progress-bar progress-bar-success\" aria-valuenow=\"85\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">85% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"javascript:;\">\n" +
    "									<span class=\"task\">\n" +
    "									<span class=\"desc\">New UI release</span>\n" +
    "									<span class=\"percent\">38%</span>\n" +
    "									</span>\n" +
    "									<span class=\"progress progress-striped\">\n" +
    "									<span style=\"width: 38%;\" class=\"progress-bar progress-bar-important\" aria-valuenow=\"18\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">38% Complete</span></span>\n" +
    "									</span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <!-- END TODO DROPDOWN -->\n" +
    "                <li class=\"droddown dropdown-separator\">\n" +
    "                    <span class=\"separator\"></span>\n" +
    "                </li>\n" +
    "                <!-- BEGIN INBOX DROPDOWN -->\n" +
    "                <li class=\"dropdown dropdown-extended dropdown-dark dropdown-inbox\" id=\"header_inbox_bar\">\n" +
    "                    <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-menu-hover data-toggle=\"dropdown\" data-close-others=\"true\">\n" +
    "                        <span class=\"circle\">3</span>\n" +
    "                        <span class=\"corner\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li class=\"external\">\n" +
    "                            <h3>You have <strong>7 New</strong> Messages</h3>\n" +
    "                            <a href=\"javascript:;\">view all</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <ul class=\"dropdown-menu-list scroller\" style=\"height: 275px;\" data-handle-color=\"#637283\">\n" +
    "                                <li>\n" +
    "                                    <a href=\"inbox.html?a=view\">\n" +
    "									<span class=\"photo\">\n" +
    "									<img src=\"images/avatars/avatar2.jpg\" class=\"img-circle\" alt=\"\">\n" +
    "									</span>\n" +
    "									<span class=\"subject\">\n" +
    "									<span class=\"from\">\n" +
    "									Lisa Wong </span>\n" +
    "									<span class=\"time\">Just Now </span>\n" +
    "									</span>\n" +
    "									<span class=\"message\">\n" +
    "									Vivamus sed auctor nibh congue nibh. auctor nibh auctor nibh... </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"inbox.html?a=view\">\n" +
    "									<span class=\"photo\">\n" +
    "									<img src=\"images/avatars/avatar3.jpg\" class=\"img-circle\" alt=\"\">\n" +
    "									</span>\n" +
    "									<span class=\"subject\">\n" +
    "									<span class=\"from\">\n" +
    "									Richard Doe </span>\n" +
    "									<span class=\"time\">16 mins </span>\n" +
    "									</span>\n" +
    "									<span class=\"message\">\n" +
    "									Vivamus sed congue nibh auctor nibh congue nibh. auctor nibh auctor nibh... </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"inbox.html?a=view\">\n" +
    "									<span class=\"photo\">\n" +
    "									<img src=\"images/avatars/avatar1.jpg\" class=\"img-circle\" alt=\"\">\n" +
    "									</span>\n" +
    "									<span class=\"subject\">\n" +
    "									<span class=\"from\">\n" +
    "									Bob Nilson </span>\n" +
    "									<span class=\"time\">2 hrs </span>\n" +
    "									</span>\n" +
    "									<span class=\"message\">\n" +
    "									Vivamus sed nibh auctor nibh congue nibh. auctor nibh auctor nibh... </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"inbox.html?a=view\">\n" +
    "									<span class=\"photo\">\n" +
    "									<img src=\"images/avatars/avatar2.jpg\" class=\"img-circle\" alt=\"\">\n" +
    "									</span>\n" +
    "									<span class=\"subject\">\n" +
    "									<span class=\"from\">\n" +
    "									Lisa Wong </span>\n" +
    "									<span class=\"time\">40 mins </span>\n" +
    "									</span>\n" +
    "									<span class=\"message\">\n" +
    "									Vivamus sed auctor 40% nibh congue nibh... </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href=\"inbox.html?a=view\">\n" +
    "									<span class=\"photo\">\n" +
    "									<img src=\"images/avatars/avatar3.jpg\" class=\"img-circle\" alt=\"\">\n" +
    "									</span>\n" +
    "									<span class=\"subject\">\n" +
    "									<span class=\"from\">\n" +
    "									Richard Doe </span>\n" +
    "									<span class=\"time\">46 mins </span>\n" +
    "									</span>\n" +
    "									<span class=\"message\">\n" +
    "									Vivamus sed congue nibh auctor nibh congue nibh. auctor nibh auctor nibh... </span>\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <!-- END INBOX DROPDOWN -->\n" +
    "                <!-- BEGIN USER LOGIN DROPDOWN -->\n" +
    "                <li class=\"dropdown dropdown-user dropdown-dark\">\n" +
    "                    <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-menu-hover data-toggle=\"dropdown\" data-close-others=\"true\">\n" +
    "                        <img alt=\"\" class=\"img-circle\" src=\"images/avatars/avatar9.jpg\">\n" +
    "                        <span class=\"username username-hide-mobile\">Nick</span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu dropdown-menu-default\">\n" +
    "                        <li>\n" +
    "                            <a href=\"#/profile/dashboard\">\n" +
    "                                <i class=\"icon-user\"></i> My Profile </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#\">\n" +
    "                                <i class=\"icon-calendar\"></i> My Calendar </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#\">\n" +
    "                                <i class=\"icon-envelope-open\"></i> My Inbox <span class=\"badge badge-danger\">\n" +
    "							3 </span>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#/todo\">\n" +
    "                                <i class=\"icon-rocket\"></i> My Tasks <span class=\"badge badge-success\">\n" +
    "							7 </span>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"divider\">\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"lock.html\">\n" +
    "                                <i class=\"icon-lock\"></i> Lock Screen </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#\">\n" +
    "                                <i class=\"icon-key\"></i> Log Out </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <!-- END USER LOGIN DROPDOWN -->\n" +
    "\n" +
    "                <!-- BEGIN QUICK SIDEBAR TOGGLER -->\n" +
    "                <li class=\"dropdown dropdown-extended quick-sidebar-toggler\">\n" +
    "                    <span class=\"sr-only\">Toggle Quick Sidebar</span>\n" +
    "                    <i class=\"icon-logout\"></i>\n" +
    "                </li>\n" +
    "                <!-- END QUICK SIDEBAR TOGGLER -->\n" +
    "\n" +
    "\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <!-- END TOP NAVIGATION MENU -->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- END HEADER TOP -->\n" +
    "");
}]);

angular.module("common/directives/header/stgPageHeader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/header/stgPageHeader.tpl.html",
    "<!-- BEGIN HEADER MENU -->\n" +
    "<div class=\"page-header-menu\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <!-- BEGIN HEADER SEARCH BOX -->\n" +
    "        <form class=\"search-form\" action=\"extra_search.html\" method=\"GET\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Search\" name=\"query\">\n" +
    "				<span class=\"input-group-btn\">\n" +
    "				<a href=\"javascript:;\" class=\"btn submit\"><i class=\"icon-magnifier\"></i></a>\n" +
    "				</span>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <!-- END HEADER SEARCH BOX -->\n" +
    "        <!-- BEGIN MEGA MENU -->\n" +
    "        <!-- DOC: Apply \"hor-menu-light\" class after the \"hor-menu\" class below to have a horizontal menu with white background -->\n" +
    "        <!-- DOC: Remove dropdown-menu-hover and data-close-others=\"true\" attributes below to disable the dropdown opening on mouse hover -->\n" +
    "        <div class=\"hor-menu\">\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/dashboard\">Dashboard</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/applications/businessmanagement\">Business Management</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/applications/peoplemanagement\">People Management</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/applications/communications\">Communications</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/applications/administrationsupport\">Administration & Support</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/applications/companywebsites\">Company Websites & Resources</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/applications/training\">Training</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a href=\"#/todo\">Tasks & Todos</a>\n" +
    "                </li>\n" +
    "\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <!-- END MEGA MENU -->\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END HEADER MENU -->");
}]);

angular.module("common/directives/modalDialog/modalDialog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/modalDialog/modalDialog.tpl.html",
    "<div class=\"panel panel-primary\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h3 class=\"panel-title\">{{ ::dialogController.title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\" ng-if=\"!dialogController.bodyHTML\">\n" +
    "                    {{ dialogController.bodyText }}\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\" ng-if=\"dialogController.bodyHTML\" ng-bind-html=\"dialogController.bodyHTML\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-footer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"btn-group btn-group-justified\" role=\"group\" aria-label=\"...\">\n" +
    "                    <div class=\"btn-group\" role=\"group\" ng-if=\"!dialogController.hideCancelButton\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"dialogController.cancelSelected()\">\n" +
    "                            {{ dialogController.cancelText }}\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"btn-group\" role=\"group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"dialogController.okSelected()\" ng-disabled=\"taskForm.$invalid\">\n" +
    "                            {{ dialogController.okText }}\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/services/oauth2/getUpdatedToken.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/services/oauth2/getUpdatedToken.tpl.html",
    "<div class=\"oauth_modal\">\n" +
    "    <iframe id=\"oauthIFrame\" src=\"/auth/reauth\" onload=\"checkForToken(this)\"></iframe>\n" +
    "</div>\n" +
    "");
}]);
