
angular.module('common.url', [])
    .constant('SERVER_URL_SPACE', {
        urls: {
            local: {
                clientLogger: '/ui/api/client/logger',
                rbacUserProfileForRole: '/ui/api/users/profiles',
                childrenForTeam: '/ui/api/hierarchy/{teamName}/children/{sourceSystemId}',
                applicationConfiguration: '/ui/api/application/configuration',
                userAdminUI: '/ui/#useradministration?menu=false&appName={appName}&roleName={roleName}&rbac_app_name={rbac_app_name}&rbac_role_name={rbac_role_name}&access_attributes={access_attributes}',
                actuate: {
                    login: '/ui/api/actuate/login',
                    user: '/ui/api/actuate/users',
                    searchUser: '/ui/api/actuate/users?search={username}',
                    searchFolderByPath: '/ui/api/actuate/files?search={reportFolder}',
                    searchReportFile: '/ui/api/actuate/files/{folderId}/search?name={reportFileName}',
                    downloadOutputFile: '/ui/api/actuate/files/{fileId}/download?base64={base64}',
                    scheduleReportNow: '/ui/api/actuate/jobs/schedule/now/{reportId}',
                    searchJobs: '/ui/api/actuate/jobs?search={appUserSearchTerm}&type={status}&fetchSize={fetchSize}&fetchHandle={fetchHandle}&fetchDirection={fetchDirection}',
                    getJobStatus: '/ui/api/actuate/jobs/{jobId}/status',
                    deleteJob: '/ui/api/actuate/jobs/{jobId}?type={deleteType}',
                    searchFiles: '/ui/api/actuate/files/{folderId}/search?name={searchTerm}&fetchSize={fetchSize}&fetchHandle={fetchHandle}',
                    deleteFile: '/ui/api/actuate/files/{fileId}'
                },
                teamsHierarchy: '/ui/api/users/applications/{application}/roles/{role}/hierarchicalteams',
                costCenters: '/ui/api/cost_centers',
                googlemaps: {
                    getGeoCodeByAddress: '/ui/api/googlemaps/addressbygeocode?address={address}',
                    scriptEndpoint: '/api/js?key={key}&libraries=places&sensor=false'
                }
            },
            actuate: {
                iHubReportViewer: '/iportal/iv?__report={reportOutputFileName}&sso=y'
            }
        },
        headers: {
            contentType: {
                name: 'Content-Type',
                json: 'application/json',
                html: 'text/html',
                stream: 'application/octet-stream',
                form: 'application/x-www-form-urlencoded'
            }
        }
    });