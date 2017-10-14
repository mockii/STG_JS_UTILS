angular.module('common.directives.stgGoogleMapsAutocomplete', ['common.services.googlemaps', 'common.modules.logging'])
.directive('stgGoogleMapsAutocomplete', ['$location', 'StgGoogleMapsService', '$document', '$log', function($location, StgGoogleMapsService, $document, $log){
    return {
        require: 'ngModel', // Check what attributes are required.
        scope: {
          autoCompleteDetails: '=?',
          resultData: '=?'
        },
        link: {
            /*pre: function(scope, element){

            },*/
            post: function(scope, element, attrs, controller){
                var googlemap, autoCompleteService, map, marker, inputElement = element[0];
                if(!StgGoogleMapsService.hasGoogleMapScriptLoaded()){
                    StgGoogleMapsService.getGoogleScript(element).then(function(response){
                        StgGoogleMapsService.googleMapScriptLoaded = true;
                        console.log("inputElement", inputElement);
                        console.log("attrs.mapElementById", attrs.mapelementbyid);
                        if(!googlemap){
                            googlemap = new google.maps();
                        }
                        if(!autoCompleteService && !map && !marker){
                            autoCompleteService = new google.maps.places.Autocomplete(inputElement, {});
                            map = googlemap.Map($document.getElementById(attrs.mapelementbyid), {
                                center: {lat: -33.8688, lng: 151.2195},
                                zoom: 13,
                                disableDefaultUI: true
                            });
                            marker = googlemap.Marker({
                                map: map,
                                anchorPoint: googlemap.Point(0, -29)
                            });
                            map.addListener("click", function(event){event.preventDefault();});
                            autoCompleteService.bindTo('bounds', map);
                        }

                        googlemap.event.addListener(autoCompleteService, 'place_changed', function() {
                            var place = autoCompleteService.getPlace();
                            if (place !== undefined) {
                                console.log(place);
                            }

                            if (!place.geometry) {
                                // User entered the name of a Place that was not suggested and
                                // pressed the Enter key, or the Place Details request failed.
                                return;
                            }

                            // If the place has a geometry, then present it on a map.
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);  // Why 17? Because it looks good.
                            }
                            marker.setPosition(place.geometry.location);
                            marker.setVisible(true);
                        }, function(error){
                            $log.error(error);
                        });
                    });
                } else {
                    // Do nothing
                }

            }
        }
    };
}]);