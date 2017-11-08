'use strict';

angular.module('rbac.sample.common.url', [])
    .constant('RBAC_SAMPLE_URL_SPACE', {
        urls: {
            local: {
                application: '/ui/api/applications/{name}',
                applicationByCategory: '/ui/api/categories/{category}/applications',
                applications: '/ui/api/applications',
                associateProfile: '/ui/api/associates/{perno}',
                featuredApplications: '/ui/api/featured_applications',

                messagesForApplication: '/ui/api/applications/{applicationName}/messages',
                messagesByType: '/ui/api/message_types/{messageType}/messages',
                messages: '/ui/api/messages',
                message: '/ui/api/messages/{messageId}',
                messageTypes: '/ui/api/message_types',

                metricsFeedback: '/ui/api/feedback/metrics',
                financialMetrics: '/ui/api/metrics/financial',
                laborMetrics: '/ui/api/metrics/labor',

                quickLinks: '/ui/api/quick_links',
                serverSetting: '/ui/api/server_settings/{name}',

                userProfile: '/ui/api/users/{username}',
                userQuickLinks: '/ui/api/users/{username}/quick_links',
                userTeamsForRole: '/ui/api/users/{username}/teams/{roleName}',

                serviceManagementUI: '/services/manage.html',
                
                features: '/ui/api/features'
            }
        }
    });