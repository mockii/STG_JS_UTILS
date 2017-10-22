'use strict';

angular.module('common.directives.ShowEmptyMsg', [])

    .directive('showEmptyMsg', ['$compile', '$timeout', function($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                hideMsg: "@"
            },
            link: function postLink(scope, element, attr, controller) {
                console.log("scope.hideMsg", scope.hideMsg);
                var msg = 'No Records Found',
                    hideMsg = (scope.hideMsg === 'true'),
                    template = "<p class='no-data-found'><b>" + msg + "</b></p>";

                if($('.no-data-found').length === 0 /*&& hideMsg*/) {
                    $($('.ui-grid-viewport')[0]).append(template);
                }
                else if (!hideMsg) {
                    $('.no-data-found').remove();
                }
            }

        };
    }]);
