'use strict';

(function () {

    angular.module('rbac.sample.sampleForm.controller', [])
        .controller('SampleFormController', ['$rootScope', '$scope', 'RBAC_SAMPLE_CONSTANTS', 'SampleFormService',
            function($rootScope, $scope, RBAC_SAMPLE_CONSTANTS, SampleFormService) {

                var sampleFormController = this;


                function initialize() {

                }

                initialize();
            }
        ]);
})();
