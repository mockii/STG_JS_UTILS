'use strict';

(function () {

    angular.module('rbac.sample.applications', [
        'rbac.sample.applications.controller',
        'rbac.sample.applications.service'
    ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('applications', {
                    url: "/applications",
                    templateUrl: "applications/applications.tpl.html",
                    redirectTo: 'applications.businessManagement',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }]
                    }
                })
                .state('applications.businessManagement', {
                    url: "/businessmanagement",
                    templateUrl: "applications/applications-tab-content.tpl.html",
                    controller: "ApplicationsController as applicationsController",
                    data: {
                        pageTitle: "Applications",
                        pageSubTitle: "business management & reporting tools",
                        category: "business"
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }],
                        applications: function(ApplicationsService) {
                            var category = this.data.category;
                            return ApplicationsService.getApplicationsByCategory(category);
                        }
                    }
                })
                .state('applications.peopleManagement', {
                    url: "/peoplemanagement",
                    templateUrl: "applications/applications-tab-content.tpl.html",
                    controller: "ApplicationsController as applicationsController",
                    data: {
                        pageTitle: "Applications",
                        pageSubTitle: "people management",
                        category: "people"
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }],
                        applications: function(ApplicationsService) {
                            var category = this.data.category;
                            return ApplicationsService.getApplicationsByCategory(category);
                        }
                    }
                })
                .state('applications.communication', {
                    url: "/communications",
                    templateUrl: "applications/applications-tab-content.tpl.html",
                    controller: "ApplicationsController as applicationsController",
                    data: {
                        pageTitle: "Applications",
                        pageSubTitle: "communications",
                        category: "communications"
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }],
                        applications: function(ApplicationsService) {
                            var category = this.data.category;
                            return ApplicationsService.getApplicationsByCategory(category);
                        }
                    }
                })
                .state('applications.administrationSupport', {
                    url: "/administrationsupport",
                    templateUrl: "applications/applications-tab-content.tpl.html",
                    controller: "ApplicationsController as applicationsController",
                    data: {
                        pageTitle: "Applications",
                        pageSubTitle: "administration & support",
                        category: "administration"
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }],
                        applications: function(ApplicationsService) {
                            var category = this.data.category;
                            return ApplicationsService.getApplicationsByCategory(category);
                        }
                    }
                })
                .state('applications.companyWebsites', {
                    url: "/companywebsites",
                    templateUrl: "applications/applications-tab-content.tpl.html",
                    controller: "ApplicationsController as applicationsController",
                    data: {
                        pageTitle: "Applications",
                        pageSubTitle: "company websites & resources",
                        category: "company"
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }],
                        applications: function(ApplicationsService) {
                            var category = this.data.category;
                            return ApplicationsService.getApplicationsByCategory(category);
                        }
                    }
                })
                .state('applications.training', {
                    url: "/training",
                    templateUrl: "applications/applications-tab-content.tpl.html",
                    controller: "ApplicationsController as applicationsController",
                    data: {
                        pageTitle: "Applications",
                        pageSubTitle: "application training",
                        category: "training"
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'applications',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'css/applications.css'
                                ]
                            });
                        }],
                        applications: function(ApplicationsService) {
                            var category = this.data.category;
                            return ApplicationsService.getApplicationsByCategory(category);
                        }
                    }
                });
        }

    ]);

})();