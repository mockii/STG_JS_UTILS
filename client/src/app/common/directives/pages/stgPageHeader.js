angular.module('common.directives.pages.STGPageHeader',['common.services.states'])
    .controller('STGPageHeaderController', ['$rootScope', '$scope', '$state', '$location', '$stateParams', 'StgStatesService',
        function($rootScope, $scope, $state, $location, $stateParams, StgStatesService) {

            var pageHeaderController = this;

            pageHeaderController.backButton = false;



            $rootScope.$on("$stateChangeSuccess", function () {
                pageHeaderController.showBackButton();
            });

            pageHeaderController.showPageHeader = function() {
                var urlParams = $location.search();
                if(urlParams.hasOwnProperty('pageHeader')){
                    return urlParams.pageHeader;
                }
                return $state.current.data && $state.current.data.hasOwnProperty('showPageHeader') && StgStatesService.hasBackState() ?
                    $state.current.data.showPageHeader : true;
            };

            pageHeaderController.currentPageTitle = function() {
                return $state.current.data && $state.current.data.pageTitle ? $state.current.data.pageTitle : "";
            };

            pageHeaderController.currentPageSubTitle = function() {
                return $state.current.data && $state.current.data.pageSubTitle ? $state.current.data.pageSubTitle : "";
            };

            pageHeaderController.showBackButton = function() {
                var urlParams = $location.search();
                if(urlParams.hasOwnProperty('pageBackButton')){
                    return urlParams.pageBackButton;
                }
                pageHeaderController.backButton = StgStatesService.hasBackState();
                return pageHeaderController.backButton;
            };

            pageHeaderController.onBackClick = function(event) {
                StgStatesService.goToBackState();
            };

            $scope.$watch(function() {
                return $state.current.data && $state.current.data.rightContent ? $state.current.data.rightContent : "";
            }, function(html) {
                $scope.addHTML(html);
            });

    }])
    .directive('stgPageHeader', ['$compile', '$location', function($compile, $location) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'common/directives/pages/stgPageHeader.tpl.html',
            controller: 'STGPageHeaderController as pageHeaderController',
            link: function (scope, element, attrs) {
                //hide the header if menu=false is passed as query parameter
                var qs = $location.search();
                if (qs.page_title === 'false') {
                    element.hide();
                }

                scope.addHTML = function(html) {
                    var rightContent = element.find("#rightContent");
                    rightContent.html(html);
                    $compile(rightContent.contents())(scope);
                };
            }
        };
    }]);
