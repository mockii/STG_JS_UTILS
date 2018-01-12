var urlSpace = (function() {

    return {

        urls: {
            local: {
                rbacUserProfileForRole: '/ui/api/users/profiles',
                childrenForTeam: '/ui/api/hierarchy/:teamName/children/:sourceSystemId',

                applicationConfiguration: '/ui/api/application/configuration',
                heapdump: '/ui/api/system/heapdump',
                teamsHierarchy: '/ui/api/users/applications/:application/roles/:role/hierarchicalteams',
                costCenters: '/ui/api/cost_centers',

                // GOOGLE MAPS
                googlemaps: {
                    getGeoCodeByAddress: '/ui/api/googlemaps/addressbygeocode'
                },
                getApplicationNotifications: '/ui/api/notifications/applications',
                createAppNotification: '/ui/api/notifications/categories/application',
                updateNotification: '/ui/api/notifications/{notification_id}',
                deleteNotification: '/ui/api/notifications/{notification_id}',
                getUserNotifications: '/ui/api/users/notifications',
                getUserApplicationNotifications: '/ui/api/users/{user_name}/applications/{application_name}/notifications?limit={limit}&page={page}&search={search}',
                createUserNotification: '/ui/api/notifications/categories/user',
                deleteUserNotification: '/ui/api/users/{user_name}/group_references/{group_reference}',
                getGroupNotifications: '/ui/api/groups/group_references',
                createGroupNotification: '/ui/api/notifications/categories/group',
                deleteGroupNotification: '/ui/api/groups/group_references/{group_reference}',
                updateUserNotifications: '/ui/api/users/notifications'
            },
            adams: {
                rbacUserProfile: '/api/users/profile?app_name={application}',
                rbacUserProfileForRole: '/api/users/profile?app_name={application}&user_role={roleName}',
                userTeams: '/api/users/{username}/applications/{applicationName}/roles/{roleName}/teams',
                childTeams: '/api/hierarchy/{teamName}/children?source_system_id={sourceSystemId}',
                teamsHierarchy: '/api/users/applications/{application}/roles/{role}/hierarchicalteams?limit={limit}&page={page}&searchTeamName={searchTeamName}&searchTeamDescription={searchTeamDescription}&searchTeamType={searchTeamType}&sorts={sorts}',
                costCenters: '/api/cost_centers/?fields={fields}&limit={limit}&page={page}&sorts={sorts}&search={costCenterSearchInput}',

            },
            // GOOGLE MAPS
            googlemaps: {
                getGeoCodeByAddress: '/api/geocode/json?address={address}&key={clientId}'

            },
            notification: {
                getApplicationNotifications: '/api/notifications/applications/{application_name}?limit={limit}&page={page}&search={search}',
                createAppNotification: '/api/notifications/categories/application',
                updateNotification: '/api/notifications/{notification_id}',
                deleteNotification: '/api/notifications/{notification_id}',
                getUserNotifications: '/api/users/{user_name}/notifications?limit={limit}&page={page}&search={search}',
                getUserApplicationNotifications: '/api/users/{user_name}/applications/{application_name}/notifications?limit={limit}&page={page}&search={search}',
                createUserNotification: '/api/notifications/categories/user',
                deleteUserNotification: '/api/users/{user_name}/group_references/{group_reference}',
                getGroupNotifications: '/api/groups/group_references/{group_reference}?limit={limit}&page={page}&search={search}',
                createGroupNotification: '/api/notifications/categories/group',
                deleteGroupNotification: '/api/groups/group_references/{group_reference}',
                updateUserNotifications: '/api/users/{user_name}/notifications?notifications={notifications}'
            },

        },
        headers: {
            adams: {
                accept: {
                    v1: 'application/vnd.adams-v1.0+json',
                    v2: 'application/vnd.adams-v2.0+json'
                }
            },
            cens: {
                accept: {
                    v1: 'application/vnd.cens-v1.0+json'
                }
            },
            actuate: {
              authToken: 'AuthToken'
            },
            contentType: {
                name: 'Content-Type',
                json: 'application/json',
                html: 'text/html',
                form: 'application/x-www-form-urlencoded'
            }
        }
    };

})();

module.exports = urlSpace;