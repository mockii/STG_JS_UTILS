'use strict';

(function () {

    angular.module('rbac.sample', [
        'STGWebUtils',
        'rbac.sample.controller',
        'rbac.sample.service',
        'rbac.sample.data',
        'rbac.sample.common.services',
        'rbac.sample.common.filters',
        'rbac.sample.common.directives',
        'rbac.sample.common.constants',
        'rbac.sample.common.url',
        'templates.app',
        'rbac.sample.dashboard',
        'rbac.sample.applications',
        'rbac.sample.sampleForm',
        'rbac.sample.settings'
    ])

    .config(['$httpProvider', '$urlRouterProvider', '$uibTooltipProvider', function($httpProvider, $urlRouterProvider, $uibTooltipProvider) {
        $urlRouterProvider.otherwise(function($injector){
            $injector.get('$state').go('dashboard');
        });

        $uibTooltipProvider.setTriggers({
            'mouseenter': 'mouseleave',
            'click': 'click',
            'outsideClick': 'outsideClick',
            'focus': 'blur',
            'show': 'hide'
        });


        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }])

    .run(['$rootScope', function ($rootScope) {

    }]);

})();
