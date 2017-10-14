/**
 * Created by ChouhR01 on 11/17/2016.
 */
(function () {
    'use strict';
    angular
        .module('common.modules.logging', ['common.modules.logging.service', 'common.modules.logging.interceptor'])
        .config(['$provide', function($provide) {
            $provide.decorator('$log', ['$delegate', 'STGLogService', '$filter', function($delegate, STGLogService, $filter) {

                var now = $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss Z');

                var methods = {
                    error: function() {
                        if (STGLogService.enabled) {
                            var args = [].slice.call(arguments);
                            args[0] = subStr("{0} -  {1}", [ now, args[0] ]);
                            $delegate.error.apply(null, arguments);
                            STGLogService.error.apply(null, args);
                        }
                    },
                    debug: function() {
                        if (STGLogService.enabled) {
                            var args = [].slice.call(arguments);
                            args[0] = subStr("{0} - {1}", [ now, args[0] ]);
                            $delegate.debug.apply(null, arguments);
                            STGLogService.debug.apply(null, args);
                        }
                    },
                    log: function() {
                        if (STGLogService.enabled) {
                            var args = [].slice.call(arguments);
                            args[0] = subStr("{0} - {1}", [ now, args[0] ]);
                            $delegate.log.apply(null, arguments);
                            STGLogService.log.apply(null, args);
                        }
                    },
                    info: function() {
                        if (STGLogService.enabled) {
                            var args = [].slice.call(arguments);
                            args[0] = subStr("{0} - {1}", [ now, args[0] ]);
                            $delegate.info.apply(null, arguments);
                            STGLogService.info.apply(null, args);
                        }
                    },
                    warn: function() {
                        if (STGLogService.enabled) {
                            var args = [].slice.call(arguments);
                            args[0] = subStr("{0} - {1}", [ now, args[0] ]);
                            $delegate.warn.apply(null, arguments);
                            STGLogService.warn.apply(null, args);
                        }
                    }
                };

                var subStr =  function( template, values, pattern ) {
                    pattern = pattern || /\{([^\{\}]*)\}/g;

                    return template.replace(pattern, function(a, b) {
                        var p = b.split('.'),
                            r = values;

                        try {
                            for (var s in p) { r = r[p[s]];  }
                        } catch(e){
                            r = a;
                        }

                        return (typeof r === 'string' || typeof r === 'number') ? r : a;
                    });
                };

                return methods;
            }]);
        }]);
})();