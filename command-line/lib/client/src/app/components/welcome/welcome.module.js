(function() {
    "use strict";

    angular.module("myapp.welcome", [
        'myapp.welcome.controller'
    ])
        .config(['$stateProvider', function(stateProvider){
            stateProvider
                .state('welcome', {
                    url: "/",
                    templateUrl: "welcome/welcome.tpl.html",
                    controller: "WelcomeController as welcomeController",
                    data: {
                        pageTitle: "Welcome!"
                    }
                });
        }]);

})();