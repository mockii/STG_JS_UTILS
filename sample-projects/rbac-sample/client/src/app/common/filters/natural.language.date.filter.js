'use strict';

(function () {

    angular.module('rbac.sample.filters.naturallanguagedate', [])
        .filter('naturallanguagedate', ['DateTimeService', function(DateTimeService) {
            return function(input) {

                if(input == null){
                    return "";
                }

                var date = new Date(input),
                    newDate = DateTimeService.convertDateToNaturalText(date);

                return newDate;

            };
        }]);

})();
