'use strict';

(function () {

    angular.module('sample', [
        'STGWebUtils',
        'templates.app',
        'sample.controller',
        'sample.service',
        'sample.common.services',
        'sample.common.filters',
        'sample.common.directives',
        'sample.common.constants',
        'sample.common.url',
        'sample.home'
    ])

    .config(['$urlRouterProvider', '$httpProvider',
        function($urlRouterProvider, $httpProvider) {
            $httpProvider.defaults.cache = false;
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }
            // disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
            $urlRouterProvider.otherwise(function($injector){
                $injector.get('$state').go('home');
            });
        }
    ])

    .run([
        function () {
            //nothing needed here yet
        }]
    );

})();
