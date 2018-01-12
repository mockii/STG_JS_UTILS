angular.module('common.services.googlemaps', [
    'common.modules.logging',
    'common.services.googlemaps.constant',
    'common.url'
])
    .factory("StgGoogleMapsService", ['$log', '$q', 'SERVER_URL_SPACE', '$http', '$rootScope', 'GOOGLEMAPS_CONSTANTS',
        function($log, $q, SERVER_URL_SPACE, $http, $rootScope, GOOGLEMAPS_CONSTANTS) {

            var googleMapsService = {};
            googleMapsService.googleMapScriptLoaded = false;

            /*
            * Check to see if the Google Maps Api was already loaded.
            *
            * @returns boolean
            * */
            googleMapsService.hasGoogleMapScriptLoaded = function(){
              return !!googleMapsService.googleMapScriptLoaded;
            };

            /*
            * Gets Geo Code Address, formatted address, lattitude, longitude, geometry, viewport, address components, etc..
            *
            * @params - Full address with space delimited.
            * @returns - Formatted address, along with latlong
            *
            * Syntax - http://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
            * Ex for JSON o/p: - https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
            *
            * */
            googleMapsService.getGeoCodeByAddress = function(address){
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
                        var formattedAddress;
                        if(response.data.status !== GOOGLEMAPS_CONSTANTS.ZERO_RESULTS && response.data.results.length === 1){
                            $rootScope.$broadcast('verifyAddressChange', response.data.results[0]);
                            formattedAddress = googleMapsService.getFormattedAddress(response.data.results[0]);
                        } else if(response.data.status !== GOOGLEMAPS_CONSTANTS.ZERO_RESULTS && response.data.results.length > 1){
                            var formattedAddresses = [];
                            angular.forEach(response.data.results, function(addressComponent){
                                formattedAddresses.push(googleMapsService.getFormattedAddress(addressComponent));
                            });
                            response.data.formattedAddresses = formattedAddresses;
                        }
                        deferred.resolve(formattedAddress || response.data);
                    }, function (error) {
                        $log.error('An error occurred while fetching address ' + address, error);
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

            googleMapsService.getFormattedAddress = function(place){
                var formattedAddress = {};
                if(place){
                    angular.forEach(place.address_components, function(addressComponent){
                        angular.forEach(addressComponent.types, function(type){
                            switch(type) {
                                case 'street_number':
                                    formattedAddress.streetNumber = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                case 'route':
                                    formattedAddress.streetName = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                case 'locality':
                                    formattedAddress.city = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                case 'administrative_area_level_2':
                                    formattedAddress.county = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                case 'administrative_area_level_1':
                                    formattedAddress.state = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                case 'country':
                                    formattedAddress.country = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                case 'postal_code':
                                    formattedAddress.zip = addressComponent.short_name || addressComponent.long_name;
                                    break;

                                default:
                                    break;
                            }
                        });
                    });
                    formattedAddress.lattitude = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
                    formattedAddress.longitude = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
                    formattedAddress.placeId = place.place_id || '' ;
                }
                return formattedAddress;
            };

            return googleMapsService;
        }]);