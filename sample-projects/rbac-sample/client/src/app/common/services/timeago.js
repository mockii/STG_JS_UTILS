'use strict';

(function () {

    angular.module('rbac.sample.common.services.timeago', [])
        .factory('timeAgoService', ['$filter', 'TIMEAGO_CONSTANTS', function ($filter, TIMEAGO_CONSTANTS) {
            var timeAgoService = {};

            timeAgoService.inWords = function (distanceMillis) {

                var $l = TIMEAGO_CONSTANTS.strings,
                    suffix = $l.suffixAgo,
                    seconds = Math.abs(distanceMillis) / 1000,
                    minutes = seconds / 60,
                    hours = minutes / 60,
                    days = hours / 24,
                    years = days / 365,
                    separator = $l.wordSeparator;

                function substitute(stringOrFunction, number) {
                    var string = angular.isFunction(stringOrFunction) ?
                        stringOrFunction(number, distanceMillis) : stringOrFunction,
                        value = ($l.numbers && $l.numbers[number]) || number;

                    return string.replace(/%d/i, value);
                }

                var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
                    seconds < 90 && substitute($l.minute, 1) ||
                    minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
                    minutes < 90 && substitute($l.hour, 1) ||
                    hours < 24 && substitute($l.hours, Math.round(hours)) ||
                    hours < 42 && substitute($l.day, 1) ||
                    days < 30 && substitute($l.days, Math.round(days)) ||
                    days < 45 && substitute($l.month, 1) ||
                    days < 365 && substitute($l.months, Math.round(days / 30)) ||
                    years < 1.5 && substitute($l.year, 1) ||
                    substitute($l.years, Math.round(years));

                return [words, suffix].join(separator).trim();
            };

            return timeAgoService;
        }]);
})();