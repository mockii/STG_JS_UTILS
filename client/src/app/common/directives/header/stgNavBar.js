/* global Layout */
angular.module('common.directives.STGNavBar', [
])
    .controller('STGNavBarController', ['$scope', '$state', '$location', 'StgStatesService',
        function ($scope, $state, $location, StgStatesService) {
            var navBarCtrl = this;

            navBarCtrl.menuItems = $scope.menuItems;


            navBarCtrl.navItemClick = function(item) {

                StgStatesService.clearStateStack();

                if (item.state) {
                    $state.go(item.state);
                } else if (!item.state && item.href) {
                    $location.path(item.href);
                } else {
                    //do nothing
                }
            };

            function initialize() {
                Metronic.init();
                Layout.initHeader();
            }

            initialize();
        }])

    .directive('stgNavBar', ['$location', function($location) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                menuItems: "="
            },
            templateUrl: 'common/directives/header/stgNavBar.tpl.html',
            controller: 'STGNavBarController as navBarCtrl',
            link: function($scope, $element, $attrs, $ctrl, $transclude) {
                $transclude(function(clone){
                    $scope.hasTranscludedContent = (clone.length > 0);
                });

                //hide the nav bar if menu=false is passed as query parameter
                var qs = $location.search();
                if (qs.menu === 'false') {
                    $element.hide();
                }
            }
        };
    }]);
