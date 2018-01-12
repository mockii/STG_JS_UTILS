var urlSpace = (function () {

    return {

        urls: {
            local: {
                upload: '/api/upload',
                getApplicationNotifications: '/ui/api/notifications/applications/{application_name}?limit={limit}&page={page}&search={search}',
                createNotification: '/ui/api/notifications',
                updateNotification: '/ui/api/notifications/{notification_id}',
                deleteNotification: '/ui/api/notifications/{notification_id}',
                getUserNotifications: '/ui/api/users/notifications',
                getUserApplicationNotifications: '/ui/api/users/{user_name}/applications/{application_name}/notifications?limit={limit}&page={page}&search={search}',
                createUserNotification: '/ui/api/users/{user_name}/group_references/{group_reference}',
                deleteUserNotification: '/ui/api/users/{user_name}/group_references/{group_reference}',
                getGroupNotifications: '/ui/api/groups/group_references/{group_reference}?limit={limit}&page={page}&search={search}',
                createGroupNotification: '/ui/api/groups/group_references/{group_reference}',
                deleteGroupNotification: '/ui/api/groups/group_references/{group_reference}'
            },
            notification: {
                getApplicationNotifications: '/api/notifications/applications/{application_name}?limit={limit}&page={page}&search={search}',
                createNotification: '/api/notifications',
                updateNotification: '/api/notifications/{notification_id}',
                deleteNotification: '/api/notifications/{notification_id}',
                getUserNotifications: '/api/users/{user_name}/notifications?limit={limit}&page={page}&search={search}',
                getUserApplicationNotifications: '/api/users/{user_name}/applications/{application_name}/notifications?limit={limit}&page={page}&search={search}',
                createUserNotification: '/api/users/{user_name}/group_references/{group_reference}',
                deleteUserNotification: '/api/users/{user_name}/group_references/{group_reference}',
                getGroupNotifications: '/api/groups/group_references/{group_reference}?limit={limit}&page={page}&search={search}',
                createGroupNotification: '/api/groups/group_references/{group_reference}',
                deleteGroupNotification: '/api/groups/group_references/{group_reference}'
            }
        },
        headers: {
            adams: {
                accept: {
                    v1: 'application/vnd.adams-v1.0+json'
                }
            },
            cens: {
                accept: {
                    v1: 'application/vnd.cens-v1.0+json'
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