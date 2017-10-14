angular.module('common.services.Actuate.constant', [])
    .constant('ACTUATE_CONSTANTS', {
        ADMIN_USERNAME: 'RESTAdmin',
        APP_USER_SEARCH_TERM_TEMPLATE: '{environment} {appName} {username} ',
        JOB_NAME_TEMPLATE: '{appUserSearchTerm}{jobName}',
        OUTPUT_FOLDER_TEMPLATE: '{reportFolder}/output',
        LOGIN_SESSION: {
            TOKEN: 'authToken'
        },
        JOBS_STATUS: {
            ALL: 'completed',
            SCHEDULED: 'scheduled'
        },
        DELETE_TYPE: {
            CANCEL_PENDING: 'cancel',
            DELETE_COMPLETED: 'delete',
            DELETE_SCHEDULED: 'deleteSchedule'
        },
        DEFAULT_FILE_TYPE: 'rptdocument',
        DEFAULT_OUTPUT_FILE_FORMAT: 'RPTDOCUMENT',
        DEFAULT_JOB_FETCH_SIZE: '50',
        DEFAULT_FETCH_DIRECTION: 'false',
        HEADER: {
            AUTH_TOKEN: 'AuthToken'
        },
        JOB_STATE: {
            PENDING: 'Pending',
            RUNNING: 'Running',
            SUCCEEDED: 'Succeeded',
            FAILED: 'Failed',
            CANCELLED: 'Cancelled',
            EXPIRED: 'Expired'
        }
    });