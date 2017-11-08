'use strict';

(function () {

    angular.module('rbac.sample.common.directives.time', [])
        .directive('myStartTime', ['$interval', '$filter', 'TIMEAGO_CONSTANTS', function($interval, $filter, TIMEAGO_CONSTANTS) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    var formatTime,
                        stopTime,
                        filter = $filter('timeAgoDate');

                    // used to update the UI
                    function updateTime() {
                        element.text(filter(formatTime));
                    }

                    // watch the expression, and update the UI on change.
                    scope.$watch(attrs.myStartTime, function (value) {
                        formatTime = value;
                        updateTime();
                    });

                    stopTime = $interval(updateTime, TIMEAGO_CONSTANTS.refreshMillis);

                    // listen on DOM destroy (removal) event, and cancel the next UI update
                    // to prevent updating time after the DOM element was removed.
                    element.on('$destroy', function () {
                        $interval.cancel(stopTime);
                    });

                }
            };
        }]);
})();