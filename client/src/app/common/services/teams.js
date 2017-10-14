
angular.module('common.services.teams', [
    'common.url'
])
    .factory('TeamsService', ['$rootScope', '$state', '$stateParams', '$http', '$q', 'SERVER_URL_SPACE', function($rootScope, $state, $stateParams, $http, $q, SERVER_URL_SPACE) {
        var teamsService = {};


        teamsService.getHierarchicalTeams = function(limit, page, application, role, searchTeamName, searchTeamDescription, searchTeamType, sort) {
            var userSearchDeferred = $q.defer(),
                url = encodeURI(SERVER_URL_SPACE.urls.local.teamsHierarchy.replace('{application}', application).replace('{role}', role));

            url = url + '?limit=' + limit + '&page=' + page + '&searchTeamName=' + searchTeamName + '&searchTeamDescription=' + searchTeamDescription + '&searchTeamType=' + searchTeamType + '&sort=' + sort;

            var request = $http({
                method: "get",
                url: url,
                timeout: userSearchDeferred.promise
            });

            var promise = request.then(
                function( response ) {
                    return response.data;
                },
                function() {
                    return [];
                }
            );

            promise.abort = function() {
                userSearchDeferred.resolve();
            };

            promise['finally'](
                function() {
                    promise.abort = angular.noop;
                    userSearchDeferred = request = promise = null;
                }
            );


            return( promise );
            
        };
        
        return teamsService;
    }]);

