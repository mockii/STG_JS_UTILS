'use strict';

angular.module('common.directives.ShowEmptyMsg', [])

    .directive('showEmptyMsg', ['$compile', '$timeout', function($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                hideMsg: "@"
            },
            link: function postLink(scope, element, attr) {
                var msg = 'No Records Found',
                    hideMsg = (scope.hideMsg === 'true'),
                    template = "<p class='no-data-found'><b>" + msg + "</b></p>";

                if (element.parent().parent().parent().find('.no-data-found').length === 0 && hideMsg) {
                    var elem = element.parent().parent().parent().find('.ui-grid-viewport');
                    if (elem.length > 1) {
                        angular.element(elem[1]).append(template);
                    }
                    else
                    {
                        elem.append(template);
                    }
                }
                else if (!hideMsg) {
                    element.parent().parent().parent().find('.no-data-found').remove();
                }
            }
        };
    }]);
