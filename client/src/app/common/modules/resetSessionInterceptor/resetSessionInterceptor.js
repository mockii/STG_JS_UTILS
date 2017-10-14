(function () {
    'use strict';
    angular
        .module('common.modules.resetsession', [])
        .factory('ResetSessionInterceptor', ['$log', 'stgOAuth2', '$window', function ($log, stgOAuth2, $window) {

            var resetSessionInterceptor = {
                'request': function(config) {
                    
                    if (!config.cache || config.url === '/ui/auth/logout') {
                        //reset oauth session timer
                        stgOAuth2.resetSessionExpire();
                        $window.parent.postMessage('resetSession', '*');
                    }
                    
                    return config;
                }

                
            };

            return resetSessionInterceptor;

        }]);
})();