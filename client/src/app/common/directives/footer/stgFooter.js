/* global Layout */
angular.module('common.directives.STGFooter', [
    'common.services.stgOAuth2'
])
    .controller('STGFooterController', ['$scope', 'stgOAuth2',
        function ($scope, stgOAuth2) {
            var footerCtrl = this;

            footerCtrl.adjustForScrollToTop = false;

            footerCtrl.timeLeft = stgOAuth2.getTimeLeft;

            footerCtrl.displayChange = function(newValue, oldValue) {
                footerCtrl.adjustForScrollToTop = (newValue === "block");
            };

            Layout.initFooter();
        }])

    .directive('stgFooter', ['$location', function($location) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                notifications: "=",
                tasks: "=",
                inbox: "=",
                userMenuItems: "=",
                logo: "="
            },
            //require: "ngModel",
            templateUrl: 'common/directives/footer/stgFooter.tpl.html',
            controller: 'STGFooterController as footerCtrl',
            link: function($scope, $element, $attrs, $ctrl, $transclude) {
                $transclude(function(clone){
                    $scope.hasTranscludedContent = (clone.length > 0);
                });

                //hide the footer if menu=false is passed as query parameter
                var qs = $location.search();
                if (qs.menu === 'false') {
                    $element.hide();
                }
            }
        };
    }])


;
