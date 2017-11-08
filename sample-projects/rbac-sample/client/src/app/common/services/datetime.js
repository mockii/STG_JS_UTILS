'use strict';

(function () {

    angular.module('rbac.sample.common.services.datetime', [])
        .factory('DateTimeService', ['DATE_CONSTANTS', function(DATE_CONSTANTS) {

            var dateTimeService = {},
                today = new Date();

            dateTimeService.convertDateToNaturalText = function(date) {
                if (dateTimeService.isLastWeek(date)) {
                    return dateTimeService.formatForLastWeek();
                } else if (dateTimeService.isThisWeek(date)) {
                    return dateTimeService.formatForThisWeek(date);
                } else if (dateTimeService.isNextWeek(date)) {
                    return dateTimeService.formatForNextWeek(date);
                } else {
                    return dateTimeService.formatDate(date);
                }
            };

            dateTimeService.getWeek = function(date) {

                today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                var day = today.getDay(),
                    weekStartDate,
                    weekEndDate = new Date(),
                    previousWeekStartDate = new Date(),
                    previousWeekEndDate = new Date(),
                    nextWeekStartDate = new Date(),
                    nextWeekEndDate = new Date(),
                    value;

                day = (day >= 0 ? day : day + 7);
                weekStartDate = new Date(today.getFullYear(),today.getMonth(),(today.getDate() - day));
                weekEndDate.setTime(weekStartDate.getTime() + 7  * 86400000);
                weekEndDate.setSeconds(weekEndDate.getSeconds() - 1);
                previousWeekStartDate.setTime(weekStartDate.getTime() - 7  * 86400000);
                previousWeekEndDate.setTime(weekEndDate.getTime() - 7  * 86400000);
                nextWeekStartDate.setTime(weekStartDate.getTime() + 7  * 86400000);
                nextWeekEndDate.setTime(weekEndDate.getTime() + 7  * 86400000);

                if(weekStartDate <= date && weekEndDate >= date) {
                    value = DATE_CONSTANTS.CURRENTWEEK;
                }
                else if(previousWeekStartDate <= date && previousWeekEndDate >= date) {
                    value = DATE_CONSTANTS.LASTWEEK;
                }
                else if(nextWeekStartDate <= date && nextWeekEndDate >= date) {
                    value = DATE_CONSTANTS.NEXTWEEK;
                }
                else {
                    value = '';
                }
                return value;
            };

            dateTimeService.getDayofWeek = function(date) {
                // gets the Day of the Week
                var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return daysOfWeek[new Date(date).getDay()];
            };

            dateTimeService.formatTime = function (inputdate) {
                // formats a javascript Date object into a 12h AM/PM time string
                var hour = inputdate.getHours(),
                    minute = inputdate.getMinutes(),
                    amPM = (hour > 11) ? 'pm' : 'am';

                if(hour > 12) {
                    hour -= 12;
                }
                else if(hour === 0) {
                    hour = '12';
                }
                if(minute < 10) {
                    minute = '0' + minute;
                }
                return hour + ':' + minute + amPM;
            };

            dateTimeService.isLastWeek = function(date) {
                return (dateTimeService.getWeek(date) === DATE_CONSTANTS.LASTWEEK) ? true : false;
            };

            dateTimeService.isThisWeek = function(date) {
                return (dateTimeService.getWeek(date) === DATE_CONSTANTS.CURRENTWEEK) ? true : false;
            };

            dateTimeService.isNextWeek = function(date) {
                return (dateTimeService.getWeek(date) === DATE_CONSTANTS.NEXTWEEK) ? true : false;
            };

            dateTimeService.formatForLastWeek = function() {
                return DATE_CONSTANTS.LASTWEEK;
            };

            dateTimeService.formatForThisWeek = function(date) {
                var yesterday = new Date(today),
                    tomorrow = new Date(today);

                yesterday.setDate(today.getDate() - 1);
                tomorrow.setDate(today.getDate() + 1);

                if(date.getDate() === yesterday.getDate()){
                    return DATE_CONSTANTS.YESTERDAY + ' at ' + dateTimeService.formatTime(date);
                }
                else if(date.getDate() === today.getDate()){
                    return DATE_CONSTANTS.TODAY + ' at ' + dateTimeService.formatTime(date);
                }
                else if(date.getDate() === tomorrow.getDate()){
                    return DATE_CONSTANTS.TOMORROW + ' at ' + dateTimeService.formatTime(date);
                }
                else if(date < today){
                    return 'Last ' + dateTimeService.getDayofWeek(date) + ' at ' + dateTimeService.formatTime(date);
                }
                else {
                    return dateTimeService.getDayofWeek(date) + ' at ' + dateTimeService.formatTime(date);
                }
            };

            dateTimeService.formatForNextWeek = function(date) {
                return 'Next ' + dateTimeService.getDayofWeek(date) + ' at ' + dateTimeService.formatTime(date);
            };

            dateTimeService.formatDate = function (date) {
                var month = date.getMonth() + 1,
                    day = date.getDate(),
                    formatDt;

                if(month < 10){
                    month = '0' + month;
                }

                if(day < 10){
                    day = '0' + day;
                }

                formatDt = month + '/' + day + '/' + date.getFullYear() + ' ' + dateTimeService.formatTime(date);
                return formatDt;
            };

            return dateTimeService;
        }]);


})();