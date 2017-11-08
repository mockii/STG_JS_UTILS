'use strict';

(function () {

    angular.module('rbac.sample.sampleForm', [
        'rbac.sample.sampleForm.controller',
        'rbac.sample.sampleForm.service'
    ])
        .config(['$stateProvider', 'RBAC_SAMPLE_CONSTANTS', function($stateProvider, RBAC_SAMPLE_CONSTANTS){
            $stateProvider.state('sampleForm', {
                url: "/sample/form",
                templateUrl: "sample-form/sampleForm.tpl.html",
                controller: "SampleFormController as sampleFormController",
                data: {
                    pageTitle: "Sample Form"
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'sampleForm',
                            insertBefore: '#ng_load_plugins_after',
                            files: [
                                'css/sample-form.css'
                            ]
                        });
                    }],

                    teams: function($q, TeamService) {
                        var deferred = $q.defer();

                        TeamService.getTeamsForRole().then(function(data){
                            deferred.resolve(data);
                        }, function() {
                            deferred.resolve(null);
                        });

                        return deferred.promise;
                    }
                }
            });
        }
        ]);
})();