var urlSpace = (function() {

    return {

        urls: {
            local: {
                applications: '/ui/api/applications',
                applicationByName: '/ui/api/applications/:name',
                applicationsForCategory: '/ui/api/categories/:name/applications',
                featuredApplications: '/ui/api/featured_applications',

                messagesForApplication: '/ui/api/applications/:applicationName/messages',
                messagesByType: '/ui/api/message_types/:messageType/messages',
                messages: '/ui/api/messages',
                message: '/ui/api/messages/:messageId',
                messageTypes: '/ui/api/message_types',

                metricsFeedback: '/ui/api/feedback/metrics',

                quickLinks: '/ui/api/quick_links',
                serverSettings: '/ui/api/server_settings',
                serverSettingByName: '/ui/api/server_settings/:name',




                /** METRIC ROUTES **/
                financialMetrics: '/api/metrics/financial',
                laborMetrics: '/api/metrics/labor',

                /** USER PROFILE ROUTES **/
                userProfile: '/api/users/:username',
                associate: '/api/associates/:perno',
                teamsForRole: '/api/users/:username/teams/:roleName',

                /** USER QUICK LINKS ROUTES **/
                userQuickLinks: '/api/users/:username/quick_links',

                /** Features **/
                features: '/ui/api/features'

            },
            adams: {
                associate: '/api/employees/{perno}',
                user: '/api/users/{username}',
                userTeams: '/api/users/{username}/teams?application_name={applicationName}&role_name={roleName}',
                childTeams: '/api/hierarchy/{teamName}/children'
            },
            jira: {
                metricsIssueCollector: 'https://ess-development.atlassian.net/rest/collectors/1.0/template/custom/54948e62'
            },
            oms: {
                applications: '/api/applications',
                application: '/api/applications/{name}',
                applicationsForCategory: '/api/categories/{name}/applications',
                featuredApplications: '/api/featured_applications',
                featuredApplication: '/api/featured_applications/{applicationName}',
                messageTypes: '/api/messages/types',
                messages: '/api/messages',
                message: '/api/messages/{messageId}',
                messagesByType: '/api/messages/types/{messageType}?current=true',
                messagesForApplication: '/api/applications/{applicationName}/messages',
                quickLinks: '/api/quick_links',
                quickLink: '/api/quick_links/{applicationName}',
                serverSettings: '/api/server_settings',
                serverSetting: '/api/server_settings/{name}',
                userQuickLinks: '/api/users/{username}/quick_links',
                features: '/api/features'
            }
        },
        headers: {
            adams: {
                accept: {
                    v1: 'application/vnd.adams-v1.0+json'
                }
            },
            oms: {
                accept: {
                    v1: 'application/vnd.oms-v1.0+json'
                }
            },
            contentType: {
                name: 'Content-Type',
                json: 'application/json',
                html: 'text/html'

            }
        }
    };

})();

module.exports = urlSpace;