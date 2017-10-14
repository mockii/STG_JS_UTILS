// BEGIN SAMPLE APPLICATION

angular.module('oauthExample', [
    'STGWebUtils',
    'oc.lazyLoad',
    'oauthExampleModule'
])

    .config(['$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $provide, $httpProvider) {
            $urlRouterProvider.otherwise("/");
        }])

    .controller("AppController", ['$rootScope', '$scope', 'stgOAuth2', function($rootScope, $scope, stgOAuth2) {
        var appController = this;
        appController.menuCollapsed = true;
        appController.timeLeft = stgOAuth2.getTimeLeft;

        appController.doLogout = function() {
            // pass the url to redirect to after the remote call to delete the token
            stgOAuth2.logout("/logout");
        };
    }]);

angular.module("oauthExampleModule", [
    'oauth.home',
    'oauth.profile',
    'oauth.helloWorld'
]);

angular.module("oauth.home", [])
    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('home',{
                    url:"/",
                    templateUrl:"templates/home.tpl.html",
                    controller: "HomeController as homeController"
                });
        }])
    .controller("HomeController", ['$http', function($http) {
        var homeController = this;
        homeController.myTitle = "Hello!";

        $http.get("/api/profile")
            .then(function(result) {
                for (var i=0; i<result.data.attributes.length; i++) {
                    if (result.data.attributes[i].hasOwnProperty("FirstName")) {
                        homeController.myTitle = "Hello, " + result.data.attributes[i].FirstName;
                    }
                }
            })
    }]);

angular.module("oauth.profile", [])
    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('profile',{
                    url:"/profile",
                    templateUrl:"templates/profile.tpl.html",
                    controller: "ProfileController as profileController"
                });
        }])
    .controller("ProfileController", ['$http', function($http) {
        var profileController = this;
        profileController.myTitle = "Profile Info";
        profileController.profile = [];

        $http.get("/api/profile")
            .then(function(result) {
                profileController.profile = result.data;
            })
    }]);

// EXAMPLES OF DYNAMICALLY/LAZY-LOADED MODULE: CONTROLLER & CSS
angular.module("oauth.helloWorld", [])
    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('helloWorld', {
                    url:"/helloWorld",
                    controller: "HelloWorldController as helloWorldController",
                    templateUrl: "templates/helloWorld.tpl.html",
                    resolve: {
                        loadMyCtrl: function($ocLazyLoad) {
                            return $ocLazyLoad.load(["scripts/helloWorld.js",{type:"css", path:"css/helloWorld.css"}]);
                        }
                    }
                });
        }
    ]);