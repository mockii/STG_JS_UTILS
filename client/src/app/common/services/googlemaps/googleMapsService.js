angular.module('common.services.googlemaps', [
    'common.modules.logging',
    'common.services.googlemaps.constant',
    'common.url'
])
    .factory("StgGoogleMapsService", ['$rootScope', '$state', '$httpParamSerializer', '$stateParams', '$location', '$log', '$q', 'SERVER_URL_SPACE', 'GOOGLEMAPS_CONSTANTS', 'RBACService', '$http', '$window',
        function($rootScope, $state, $httpParamSerializer, $stateParams, $location, $log, $q, SERVER_URL_SPACE, GOOGLEMAPS_CONSTANTS, RBACService, $http, $window) {

            var googleMapsService = {},
                googleMapScriptLoaded = false;

            googleMapsService.hasGoogleMapScriptLoaded = function(){
              return !!googleMapScriptLoaded;
            };

            googleMapsService.getGoogleScript = function(element){
                var scriptTag = angular.element('<script />');
                scriptTag.attr('charset', 'utf-8');
                scriptTag.async = true;
                scriptTag.attr('src', $rootScope.applicationConfiguration.googlemaps.url +
                    SERVER_URL_SPACE.urls.local.googlemaps.scriptEndpoint
                        .replace('{key}', $rootScope.applicationConfiguration.googlemaps.clientId));
                console.log(scriptTag);
                element.append(scriptTag);
            };

            googleMapsService.lazyLoadScript = function(callBackFunction){
                var deferred = $q.defer();
                $window.initialize = function () {
                    deferred.resolve();
                };
                if ($window.attachEvent) {
                    $window.attachEvent('onload', callBackFunction);
                } else {
                    $window.addEventListener('load', callBackFunction, false);
                }
                return deferred.promise;
            };

            /*
            * returns -- Formatted address, along with latlong
            * */
            googleMapsService.getGeoCodeByAddress = function(address){
                // Syntax - http://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
                // Ex for JSON o/p: - https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
                // return GoogleMapsProxy.getGeoCodeByAddress(encodeURI(JSON.stringify(address)));
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.googlemaps.getGeoCodeByAddress.replace('{address}', address)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while fetching address ' + address);
                    });

                return deferred.promise;
            };

            /*
            *  Get address based on lat-long
            * */
            googleMapsService.getReverseGeoCode = function(latlng){
                // Ex: https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
                return {};
            };

            return googleMapsService;
        }]);