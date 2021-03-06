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
    'ui.select',
    'ngCookies'
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


.run(['$rootScope', '$state', '$stateParams', '$location', 'stgOAuth2', 'STGAppService', 'STGLogService', "RBACService", '$window', '$document', 'ApplicationConfigurationService',
    function ($rootScope, $state, $stateParams, $location, stgOAuth2, STGAppService, STGLogService, RBACService, $window, $document, ApplicationConfigurationService) {

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

    ApplicationConfigurationService.checkMenuState();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromStateParams) {

        if (fromState.name === 'stgUserAdministration') {
            var iFrame;
            iFrame = $document.find('#user-admin-iframe');
            if (iFrame[0] && iFrame[0].iFrameResizer) {
                iFrame[0].iFrameResizer.close();
            }
        }

        if (ApplicationConfigurationService.isMenuHidden()) {
            toParams.menu = false;
        }

        if (ApplicationConfigurationService.isPageTitleHidden()) {
            toParams.page_title = false;
        }


        if (fromState.name === 'commPreferences') {
            var elem = $document.find('.page-content');
            elem = angular.element(elem);
            elem.removeClass('hide-page-content');
        }

        if (ApplicationConfigurationService.shouldLoadApplicationConfiguration()) {
            event.preventDefault();

            ApplicationConfigurationService.initializeApplicationConfiguration()
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

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.name === 'commPreferences' && toParams && toParams.page_title === false && toParams.menu === false) {
            var elem = $document.find('.page-content');
            elem = angular.element(elem);
            elem.addClass('hide-page-content');
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
