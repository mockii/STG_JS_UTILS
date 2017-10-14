angular.module('STGWebUtils', [
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'ng.shims.placeholder',
    'ui.bootstrap',
    'ui.router',
    'ngToast',
    'oc.lazyLoad',
    'blockUI',
    'summernote',
    'ui.grid',
    'ui.grid.grouping',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.pagination',
    'ui.grid.expandable',
    'common.directives',
    'common.services',
    'common.filters',
    'common.modules',
    'common.templates.app',
    'common.url',
    'common.constants',
    'ui.select'
])

.controller("STGAppController", [function() {
    //this is not being called in any way, do not put anything here
}])

.config(['$ocLazyLoadProvider', 'blockUIConfig', '$httpProvider', 'uiSelectConfig', function($ocLazyLoadProvider, blockUIConfig, $httpProvider, uiSelectConfig) {

    $ocLazyLoadProvider.config({
        // global configs go here
    });

    blockUIConfig.delay = 0;
    blockUIConfig.autoBlock = false;
    blockUIConfig.blockBrowserNavigation = true;
    blockUIConfig.template = '<div class="loader-wrapper"><div class="page-spinner-bar loader">' +
        '<div class="bounce1"></div>' +
        '<div class="bounce2"></div>' +
        '<div class="bounce3"></div>' +
        '</div></div>';

    $httpProvider.interceptors.push('STGLoggingInterceptor');
    $httpProvider.interceptors.push('ResetSessionInterceptor');
    
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;

}])

.factory('STGAppService', ['$http', '$filter', '$analytics', 'SERVER_URL_SPACE', 'RBACService', function($http, $filter, $analytics, SERVER_URL_SPACE, RBACService) {
    var appService = {};

    appService.initializeApplicationConfiguration = function() {
        return $http.get(SERVER_URL_SPACE.urls.local.applicationConfiguration).then(function(response) {
            return response.data;
        }, function() {
            throw 'An error occurred while getting application configuration object from the server';
        });
    };

    appService.enableUserTrackingForAnalytics = function() {
        if (RBACService.getUsername()) {
            $analytics.setUserProperties({
                "id": RBACService.getUsername().toUpperCase(),
                "email": RBACService.getCurrentProfile().email_address,
                "name": RBACService.getCurrentProfile().first_name + ' ' + RBACService.getCurrentProfile().last_name
            });
            $analytics.setUsername(RBACService.getUsername().toUpperCase());
        } else {
            console.error('Unable to retrieve the username from the RBAC service, analytics tracking will not be enabled');
        }
    };


    return appService;
}])


.run(['$rootScope', '$state', '$stateParams', '$location', 'stgOAuth2', 'STGAppService', 'STGLogService', "RBACService", '$window', function ($rootScope, $state, $stateParams, $location, stgOAuth2, STGAppService, STGLogService, RBACService, $window) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.settings = {
        layout: {
            pageAutoScrollOnLoad: 1000
        },
        layoutImgPath: Metronic.getAssetsPath() + "admin/layout3/img/",
        layoutCssPath: Metronic.getAssetsPath() + "admin/layout3/css/"
    };

    var qs = $location.search();
    if (qs) {
        RBACService.changeRbacProfile(qs);
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromStateParams) {

        if (!$rootScope.applicationConfiguration) {
            event.preventDefault();

            STGAppService.initializeApplicationConfiguration()
                .then(function(config){
                    $rootScope.applicationConfiguration = config;
                    STGLogService.configureLogService();
                    STGAppService.enableUserTrackingForAnalytics();
                    $state.go(toState, toParams);
                });
        } else {

            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, toParams);
            }

            //reset oauth session timer on state change
            stgOAuth2.resetSessionExpire();
        }

    });

    // Create IE + others compatible event handler
    var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = $window[eventMethod];
    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";


    eventer(messageEvent,function(event) {
        // handle messages received from iframe and parent
        //reset oauth session timer on state change
        switch(event.data) {
            case 'resetSession':
                stgOAuth2.resetSessionExpire();
                break;
            case 'resetIframeSession':
                stgOAuth2.resetSessionExpire();
                break;
            default:
                break;
        }
    });

}]);
