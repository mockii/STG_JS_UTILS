'use strict';

(function () {

    angular.module('rbac.sample.common.services.team', [
            'common.services.RBAC'
        ])
        .factory('TeamService', ['$q', '$http', 'RBACService', 'RBAC_SAMPLE_URL_SPACE', function($q, $http, RBACService, RBAC_SAMPLE_URL_SPACE) {
            var teamService = {};

            teamService.getTeamsForRole = function() {
                var deferred = $q.defer(),
                    username = RBACService.getCurrentProfile().user_name,
                    roleName = RBACService.getCurrentRoleName(),
                    url = RBAC_SAMPLE_URL_SPACE.urls.local.userTeamsForRole.replace('{username}', username).replace('{roleName}', roleName);


                if (!roleName) {
                    deferred.reject('Error determining the role for the current user');
                } else {
                    $http.get(url).then(function (response) {
                        deferred.resolve(response.data);
                    }, function () {
                        deferred.reject('An error occurred getting teams for role ' + roleName);
                    });
                }


                return deferred.promise;
            };

            return teamService;
        }]);
})();








