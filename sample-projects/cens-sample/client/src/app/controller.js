'use strict';

(function () {

    angular.module('sample.controller', [])
    .controller('AppController', ['SAMPLE_CONSTANTS',
        function(SAMPLE_CONSTANTS) {

            var appController = this;


            function initialize() {
                appController.logo = SAMPLE_CONSTANTS.APPLICATION_LOGO;
                // appController.logoClasses = 'col-md-4 col-sm-7 col-xs-6';
                // appController.topNavigationClasses = 'col-md-4 col-md-push-4 col-sm-5 col-xs-6';

                appController.menuItems = [
                    {
                        state: "home",
                        pageName: "Home"
                    }
                ];
            }


            initialize();

        }]);

})();
