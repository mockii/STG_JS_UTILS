angular.module('common.directives.stgGoogleMapsAutocomplete', ['common.services.googlemaps', 'common.modules.logging'])
.directive('stgGoogleMapsAutocomplete', ['StgGoogleMapsService', '$log', '$rootScope', 'SERVER_URL_SPACE', 'UtilsService', 'GOOGLEMAPS_CONSTANTS',
    function(StgGoogleMapsService, $log, $rootScope, SERVER_URL_SPACE, UtilsService, GOOGLEMAPS_CONSTANTS){
    return {
        require: 'ngModel',
        scope: {
          resultData: '=?',
          lattitude: '=',
          longitude: '='
        },
        link: function(scope, element, attributes, ngModelController){
                var scriptSrc,
                    autoCompleteService,
                    map,
                    mapElement,
                    mapElementWidth,
                    mapElementHeight,
                    marker,
                    address1Only,
                    formattedAddress,
                    inputElement = element[0],
                    lattitude = Number(scope.lattitude) || GOOGLEMAPS_CONSTANTS.US_BOUND_LATTITUDE,
                    longitude = Number(scope.longitude) || GOOGLEMAPS_CONSTANTS.US_BOUND_LONGITUDE;

                if(!$rootScope.applicationConfiguration){
                    $log.error("Application Configuration is not defined");
                    return;
                } else if(!$rootScope.applicationConfiguration.googlemaps){
                    $log.error("Google Maps is not defined in Application Configuration");
                    return;
                } else if(!$rootScope.applicationConfiguration.googlemaps.url){
                    $log.error("Google Maps API is not defined in Application Configuration");
                    return;
                } else if(!$rootScope.applicationConfiguration.googlemaps.clientId){
                    $log.error("Client Id for Google Maps API key is not defined");
                    return;
                }
                else {
                    // Do nothing
                }

                scriptSrc = $rootScope.applicationConfiguration.googlemaps.url +
                    SERVER_URL_SPACE.urls.local.googlemaps.scriptEndpoint
                        .replace('{key}', $rootScope.applicationConfiguration.googlemaps.clientId);

                address1Only = attributes.address1Only.toUpperCase() === 'TRUE';

                $rootScope.$on('verifyAddressChange', function ($event, place) {
                    placeChanged(place);
                });

                if(!scriptSrc){
                    $log.error("Script Source is not defined. Please check the Application Configuration for the script source" + scriptSrc);
                    return;
                }

                if(StgGoogleMapsService.hasGoogleMapScriptLoaded()){
                    startGoogleMapsApiService();
                } else {
                    UtilsService.loadScript(scriptSrc)
                        .then(function (response) {
                            $log.info("Script Source has been loaded successfully", response);
                            StgGoogleMapsService.googleMapScriptLoaded = true;
                            startGoogleMapsApiService();
                        }, function(error){
                            $log.info("An error occurred while loading Script Source", error);
                        });
                }

                function startGoogleMapsApiService(){
                    if(!autoCompleteService && !map){
                        autoCompleteService = new google.maps.places.Autocomplete(inputElement, {});
                        mapElement = document.getElementById(attributes.mapelementbyid);
                        mapElementWidth = mapElement.offsetWidth;
                        mapElementHeight = mapElement.offsetHeight;
                        map = new google.maps.Map(mapElement, {
                            center: {lat: lattitude, lng: longitude},
                            zoom: 13,
                            disableDefaultUI: true,
                            gestureHandling: 'greedy'
                        });
                        map.addListener("click", function(event){
                            var center = map.getCenter(),
                                mapDiv = map.getDiv();
                            console.log(mapElement);
                            mapDiv.style.position = "fixed";
                            mapDiv.style.width = "100%";
                            mapDiv.style.height = "100%";
                            mapDiv.style.top = "0";
                            mapDiv.style.left = "0";
                            mapDiv.style.zIndex = "100";
                            document.body.style.overflow = "hidden";
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(new google.maps.LatLng(lattitude, longitude));
                            map.setZoom(17);

                            // event.preventDefault();
                            /*mapElement.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;";
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(new google.maps.LatLng(lattitude, longitude));
                            map.setZoom(17);*/
                        });
                        setMarker();
                        autoCompleteService.bindTo('bounds', map);
                    }

                    autoCompleteService.addListener('place_changed', placeChanged);
                }

                function placeChanged(location) {
                    var place = location || autoCompleteService.getPlace();
                    if (!place || !place.geometry) {
                        $log.info("User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.");
                        place = getPlace(place);
                    }
                    // If the place has a geometry, then present it on a map.
                    if(!place){
                        scope.resultData = null;
                        map.setCenter(new google.maps.LatLng(lattitude, longitude));
                        map.setZoom(1);
                        // return;
                    } else if (place && place.geometry && place.geometry.location) {
                        map.setCenter(place.geometry.location);
                        map.setZoom(13);
                    } else if (place && place.geometry && place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                        map.setZoom(13);
                    } else {
                        // Do nothing
                    }

                    setMarker(place);
                    scope.resultData = place;
                    formattedAddress = StgGoogleMapsService.getFormattedAddress(place);
                    if(address1Only){
                        ngModelController.$setViewValue(((formattedAddress.streetNumber || '') + " " + (formattedAddress.streetName || '')).trimLeft());
                        ngModelController.$render();
                    }
                    $rootScope.$emit('googleMapsAutoCompleteData', place, formattedAddress);
                }

                function setMarker(place){
                    if (marker && marker.setMap) {
                        marker.setMap(null);
                    }
                    marker = new google.maps.Marker({
                        map: map,
                        anchorPoint: new google.maps.Point(0, -29),
                        icon: ' ',
                        label: {
                            fontFamily: 'Fontawesome',
                            text: '\uf276',
                            color: '#b70000'
                        }
                    });
                    if(place && place.geometry){
                        marker.setPosition(place.geometry.location);
                    } else{
                        marker.setPosition(new google.maps.LatLng(lattitude, longitude));
                    }
                    marker.setVisible(true);
                }

                function getPlace(inputValue) {
                    var autoCompletePlaceService = new google.maps.places.AutocompleteService();
                    if (inputValue.name.length > 0){
                        autoCompletePlaceService.getPlacePredictions(
                            {
                                input: inputValue.name,
                                offset: inputValue.name.length
                            },
                            function listentoresult(list, status) {
                                if(list === null || list.length === 0 || status === GOOGLEMAPS_CONSTANTS.ZERO_RESULTS) {
                                    return null;
                                } else {
                                    var placesService = new google.maps.places.PlacesService(element[0]);
                                    placesService.getDetails(
                                        {'reference': list[0].reference},
                                        function detailsresult(result, placesServiceStatus) {

                                            if (placesServiceStatus === google.maps.GeocoderStatus.OK) {
                                                scope.$apply(function () {
                                                    inputElement.on('focusout', function(event) {
                                                        inputElement.val(scope.resultData.formatted_address || '');
                                                        inputElement.unbind('focusout');
                                                    });
                                                });
                                                return result;
                                            }
                                        }
                                    );
                                }
                            });
                    }
                    return null;
                }
            }
    };
}]);