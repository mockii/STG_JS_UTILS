/**
 * Created by ChouhR01 on 11/17/2016.
 */
(function () {
    'use strict';
    angular
        .module('common.modules.logging.service', [])
        .factory('STGLogService',  [ '$window', 'SERVER_URL_SPACE', '$injector', function($window, SERVER_URL_SPACE, $injector) {

            // TODO: Remove this when we have client logger configuration in all other modules.
            var FLUSH_INTERVAL = 600000, // 10 mins;
                MAX_LOG_LENGTH = 10000,
                IS_DEBUG_ENABLED = true;

            var type,
                LOGGER_CONFIG,
                getTimeLeft,
                isLoggedIn,
                isDebugEnabled,
                $http,
                $interval,
                $rootScope,
                stgOAuth2;

            var service = {};

            $window.onbeforeunload = function () {
                writeLog('exit');
            };

            service.configureLogService = function () {
                if(!$interval || !$rootScope) {
                    $interval = $injector.get('$interval');
                    $rootScope = $injector.get('$rootScope');
                }

                LOGGER_CONFIG = $rootScope.applicationConfiguration.clientLogger || {flushInterval : FLUSH_INTERVAL, maxLogLength: MAX_LOG_LENGTH, isDebugEnabled: IS_DEBUG_ENABLED};

                service.enabled = LOGGER_CONFIG.enableLogService || false;

                $interval(function(){
                    writeLog('interval');
                }, LOGGER_CONFIG.flushInterval);
            };

            //Node log4js log levels - 'Trace','Debug','Info','Warn','Error','Fatal', 'Mark'
            //Angular $log log levels - log, info, warn, error, debug

            service.log = function () {
                    type = 'trace';
                    log.apply(this, arguments);
                };

            service.debug = function () {
                    if(LOGGER_CONFIG.isDebugEnabled) {
                        type = 'debug';
                        log.apply(this, arguments);
                    }
                };

            service.info = function () {
                    type = 'info';
                    log.apply(this, arguments);
                };

            service.warn = function () {
                    type = 'warn';
                    log.apply(this, arguments);
                };

            service.error = function () {
                    type = 'error';
                    log.apply(this, arguments);
                };

            service.logs = [];

            function log() {
                var logItem = {};
                logItem.type = type;

                if (typeof arguments === 'object') {
                    var arg = arguments[0];
                    logItem.message = arg;
                    service.logs.push(logItem);
                }
                else {
                    arguments.forEach(function (arg) {
                        if (typeof arg === 'object') {
                            arg = JSON.stringify(arg[0]);
                        }
                        service.logs.push(arg);
                    });
                    logItem.message = service.logs.join('\n');

                    service.logs.push(logItem);
                }
                writeLog();
            }

            function writeLog(type) {
                if(service.logs.length === 0) {
                    return;
                }

                if(!$rootScope || !$http || !stgOAuth2) {
                    $rootScope = $injector.get('$rootScope');
                    $http = $injector.get('$http');
                    stgOAuth2 = $injector.get('stgOAuth2');
                }

                LOGGER_CONFIG = $rootScope.applicationConfiguration.clientLogger || {flushInterval : FLUSH_INTERVAL, maxLogLength: MAX_LOG_LENGTH, isDebugEnabled: IS_DEBUG_ENABLED};

                getTimeLeft = stgOAuth2.getTimeLeft();
                isLoggedIn = stgOAuth2.isLoggedIn();

               if(!isLoggedIn || getTimeLeft <= 0 || service.logs.length > LOGGER_CONFIG.maxLogLength || type === "exit" || type === "interval") {
                    $http.post(SERVER_URL_SPACE.urls.local.clientLogger, service.logs).then(function (response) {
                        service.logs = [];
                    }, function (error) {
                        // TODO: Store logs in indexedDB or localStorage upon server downtime,
                        // then retrieve logs from indexedDB and then write it to node on application startup, finally flush logs array on startup.
                    });
                 }
            }

            return service;
        }]);
})();