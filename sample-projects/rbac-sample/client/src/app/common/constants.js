'use strict';

angular.module('rbac.sample.common.constants', [])
    .constant('RBAC_SAMPLE_CONSTANTS', {
        APPLICATION_NAME: 'RBAC Sample',
        MODAL_ACTION_ADD: 'ADD',
        MODAL_ACTION_EDIT: 'EDIT',
        OMS_LOGO: 'images/oms-stacked.png',
        RBAC_LOGO: 'images/rbac-logo-small.png',
        RBAC_LOGO_TEXT: 'RBAC Sample Application',
        DEFAULT_PREVIOUS_STATE: 'dashboard'
    })
    .constant('DATE_CONSTANTS', {
            LASTWEEK: 'Last Week',
            CURRENTWEEK: 'Current Week',
            NEXTWEEK: 'Next Week',
            YESTERDAY: 'Yesterday',
            TODAY: 'Today',
            TOMORROW: 'Tomorrow'
    })
    .constant('TIMEAGO_CONSTANTS', {
            refreshMillis: 60000,
            strings: {
                    wordSeparator: ' ',
                    suffixAgo: 'ago',
                    seconds: 'a minute',
                    minute: 'a minute',
                    minutes: '%d minutes',
                    hour: 'an hour',
                    hours: '%d hours',
                    day: 'a day',
                    days: '%d days',
                    month: 'a month',
                    months: '%d months',
                    year: 'a year',
                    years: '%d years',
                    numbers: []
            }
    })
;