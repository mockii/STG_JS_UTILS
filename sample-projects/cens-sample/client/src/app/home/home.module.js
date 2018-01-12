'use strict';

(function () {

    angular.module('sample.home', [
        'sample.home.controller',
        'common.services.Notification',
        'common.services.RBAC'
    ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "home/home.tpl.html",
                    controller: "HomeController as homeController",
                    data: {
                        pageTitle: "CENS"
                    },resolve: {
                        userNotifications: function(StgNotificationService, RBACService) {
                            return StgNotificationService.getUserNotifications(RBACService.getUsername(), 1, 10, 'test', true);
                        },
                        appNotifications: function(StgNotificationService, RBACService) {
                            return StgNotificationService.getNotificationForApplication(RBACService.getRBACAppName(), 1, 10, 'test', true);
                        },
                        groupNotifications: function(StgNotificationService, RBACService) {
                            return StgNotificationService.getGroupNotifications("grp", 1, 10, 'test', true);
                        }
                    }
                });

            }
        ]);
})();