'use strict';

angular.module('sample.common.url', [])
    .constant('SAMPLE_URL_SPACE', {
        urls: {
            local: {
                upload: '/ui/api/upload'
            }
        }
    });