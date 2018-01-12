angular.module("common.services.application.configuration",[])
    .factory('ApplicationConfigurationService', ['$location', '$http', 'SERVER_URL_SPACE', function ($location, $http, SERVER_URL_SPACE) {

        var applicationConfigurationService = {},
            isMenuHidden = false,
            isPageTitleHidden = false,
            isApplicationConfigurationLoaded = false,
            applicationConfiguration = {};

        applicationConfigurationService.isMenuHidden = function () {
            return isMenuHidden;
        };

        applicationConfigurationService.isPageTitleHidden = function () {
            return isPageTitleHidden;
        };

        applicationConfigurationService.shouldLoadApplicationConfiguration = function () {
            return !isApplicationConfigurationLoaded;
        };

        applicationConfigurationService.getApplicationConfiguration = function () {
            return applicationConfiguration;
        };

        applicationConfigurationService.getApplicationName = function () {
            if(isApplicationConfigurationLoaded && applicationConfiguration.application){
                return applicationConfiguration.application.name;
            }else{
                return '';
            }
        };

        applicationConfigurationService.checkMenuState = function () {
            var qs = $location.search();
            isMenuHidden = qs.menu === 'false';
            isPageTitleHidden = qs.page_title === 'false';
        };

        applicationConfigurationService.initializeApplicationConfiguration = function() {
            return $http.get(SERVER_URL_SPACE.urls.local.applicationConfiguration).then(function(response) {
                isApplicationConfigurationLoaded = true;
                applicationConfiguration = response.data;
                return applicationConfiguration;
            }, function() {
                throw 'An error occurred while getting application configuration object from the server';
            });
        };

        return applicationConfigurationService;
    }]);
