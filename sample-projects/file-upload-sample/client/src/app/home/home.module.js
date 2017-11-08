'use strict';

(function () {

    angular.module('sample.home', [
        'sample.home.controller'
    ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "home/home.tpl.html",
                    controller: "HomeController as homeController",
                    data: {
                        pageTitle: "File Upload"
                    }
                });

            }
        ]);
})();