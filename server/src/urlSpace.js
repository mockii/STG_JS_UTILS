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
                }
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

            }
        },
        headers: {
            adams: {
                accept: {
                    v1: 'application/vnd.adams-v1.0+json',
                    v2: 'application/vnd.adams-v2.0+json'
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