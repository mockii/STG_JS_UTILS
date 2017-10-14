
angular.module('common.services.adams', [
    'common.url'
])
    .factory('AdamsService', ['$rootScope', '$state', '$stateParams', '$http', '$q', 'SERVER_URL_SPACE', function($rootScope, $state, $stateParams, $http, $q, SERVER_URL_SPACE) {
        var adamsService = {};


        adamsService.getCostCenterDetails = function(limit, page, sort, costCenterSearchInput, fields) {
            var costCenterSearchDeferred = $q.defer(),
                url = SERVER_URL_SPACE.urls.local.costCenters + '?fields=' + fields + '&limit=' + limit + '&page=' + page + '&sort=' + sort + '&costCenterSearchInput=' + JSON.stringify(costCenterSearchInput);

            var request = $http({
                method: "get",
                url: url,
                timeout: costCenterSearchDeferred.promise
            });

            var promise = request.then(
                function( response ) {
                    return( response.data );
                },
                function(error) {
                    return error;
                }
            );

            promise.abort = function() {
                costCenterSearchDeferred.resolve();
            };

            promise['finally'](
                function() {
                    promise.abort = angular.noop;
                    costCenterSearchDeferred = request = promise = null;
                }
            );


            return( promise );
        };

        return adamsService;
    }]);

