angular.module("common.filters.CountdownTimerFilter", [])
    .filter('CountdownTimerFilter', [function() {
    return function (timeInSeconds) {
        var formattedString = "";

        if (timeInSeconds) {
            var totalHours = 0;
            var totalMinutes = 0;
            var totalSeconds = 0;

            if ((timeInSeconds / 1000 / 60 / 60) >= 1) {
                totalHours = parseInt((timeInSeconds / 1000 / 60 /60), 10);
                timeInSeconds = (timeInSeconds - (totalHours * 1000 * 60 * 60));
            }

            if ((timeInSeconds / 1000 / 60) >= 1) {
                totalMinutes = parseInt((timeInSeconds / 1000 / 60), 10);
                timeInSeconds = (timeInSeconds - (totalMinutes * 1000 * 60));
            }

            if ((timeInSeconds / 1000) >= 1) {
                totalSeconds = parseInt((timeInSeconds / 1000), 10);
            }

            if (totalHours > 0) {
                formattedString = totalHours + ":" + ("0" + totalMinutes).slice(-2) + ":" + ("0" + totalSeconds).slice(-2);
            } else {
                formattedString += totalMinutes + ":" + ("0" + totalSeconds).slice(-2);

            }
        }

        return formattedString;
    };
}]);
