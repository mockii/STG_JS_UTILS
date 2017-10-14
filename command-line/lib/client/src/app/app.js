(function() {
    'use strict';

    angular.module('%app%', [
        'STGWebUtils',
        'templates.app',
        'myapp.welcome'
    ])

    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$provide', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $translateProvider, $provide, $httpProvider) {
            $urlRouterProvider.otherwise("/");

            $translateProvider.translations("en", en_US);
            $translateProvider.fallbackLanguage("en");
            $translateProvider.preferredLanguage("en");
            $translateProvider.useSanitizeValueStrategy('sanitize');

            $provide.decorator('translateDirective', function($delegate) {
                var directive = $delegate[0];
                directive.terminal = true;

                return $delegate;
            });

            //initialize get if not there
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }

            //disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';

            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }])

    .controller("AppController", ['$rootScope', '$scope', function($rootScope, $scope) {
        var appController = this;

        appController.logo = "img/appLogo.png";

        $scope.$on('$viewContentLoaded', function() {
            Metronic.initComponents(); // init core components
        });
    }])

    .factory('settings', ['$rootScope', function($rootScope) {
        var settings = {
            layout: {
                pageAutoScrollOnLoad: 1000
            },
            layoutImgPath: "/img/",
            layoutCssPath: "/css/"
        };

        $rootScope.settings = settings;

        return settings;
    }])

    .run(['$rootScope', '$state', '$stateParams', 'settings',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]
    );


})();
