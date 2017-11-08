'use strict';

(function () {

    angular.module('rbac.sample.filters.timeagodate', [])
        .filter('timeAgoDate', ['timeAgoService', function (timeAgoService) {
            return function (date) {
                var nowTime,
                    diff;
                nowTime = Date.now();
                diff = nowTime - date;
                return timeAgoService.inWords(diff);
            };
        }]);

})();