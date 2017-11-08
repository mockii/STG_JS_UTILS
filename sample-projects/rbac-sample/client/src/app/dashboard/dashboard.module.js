'use strict';

(function () {

    angular.module('rbac.sample.dashboard', [
        'rbac.sample.dashboard.controller',
        'rbac.sample.dashboard.service',
    ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider.state('dashboard', {
                url: "/dashboard",
                templateUrl: "dashboard/dashboard.tpl.html",
                controller: "DashboardController as dashboardController",
                data: {
                    pageTitle: "Dashboard",
                    pageSubTitle: 'statistics & reports'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'dashboard',
                            insertBefore: '#ng_load_plugins_after',
                            files: [
                                'css/dashboard.css'
                            ]
                        });
                    }]
                }
            });
            }
        ]);
})();