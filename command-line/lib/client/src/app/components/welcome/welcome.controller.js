(function() {
    "use strict";

    angular.module("myapp.welcome.controller", [])
        .controller("WelcomeController", [function() {
            var welcomeController = this;

            welcomeController.randomText = "Lorem ipsum";
        }]);

})();