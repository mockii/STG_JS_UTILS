
var rbac = (function() {


    var log4js = require('log4js'),
        logger = log4js.getLogger('rbac'),
        utils = require('./utils'),
        urlSpace = require('./urlSpace'),
        CONSTANTS = require('./constants');



    function getRbacUserProfileFromToken(oauthProfile, token, config) {
        logger.debug('Executing getRbacUserProfileFromToken for token ' + token + ' and profile ' + JSON.stringify(oauthProfile));

        var username = oauthProfile.id,
            urlPath = urlSpace.urls.adams.rbacUserProfile.replace('{application}', config.application.name),
            url = config.urls.adams.concat(urlPath);

        return getRbacProfile(url, token, config, oauthProfile);
    }


    function getRbacUserProfileForRole(oauthProfile, token, roleName, config, appName) {
        logger.debug('Executing getRbacUserProfileForRole for token ' + token + ' and role name ' + roleName + ' and profile ' + JSON.stringify(oauthProfile));

        var username = oauthProfile.id,
            urlPath = urlSpace.urls.adams.rbacUserProfileForRole.replace('{application}', appName || config.application.name).replace('{roleName}', roleName),
            url = config.urls.adams.concat(urlPath);

        return getRbacProfile(url, token, config, oauthProfile, appName);
    }


    function createRbacUserProfileFromOAuthProfile(oauthProfile) {
        logger.debug('Executing createRbacUserProfileFromOAuthProfile for profile ' + JSON.stringify(oauthProfile));
        var userName, firstName, lastName,
            email, telephone, costCenter;

        for (var i in oauthProfile) {
            if (i === CONSTANTS.OAUTH_PROFILE.USER_NAME) {
                userName = oauthProfile[i];
            }
            if (i === CONSTANTS.OAUTH_PROFILE.ATTRIBUTES) {
                for (var j = 0; j < oauthProfile[i].length; j++) {
                    var cobj = oauthProfile[i][j];
                    if (CONSTANTS.OAUTH_PROFILE.EMAIL in cobj) {
                        email = cobj[CONSTANTS.OAUTH_PROFILE.EMAIL];
                    }
                    if (CONSTANTS.OAUTH_PROFILE.FIRST_NAME in cobj) {
                        firstName = cobj[CONSTANTS.OAUTH_PROFILE.FIRST_NAME];
                    }
                    if (CONSTANTS.OAUTH_PROFILE.LAST_NAME in cobj) {
                        lastName = cobj[CONSTANTS.OAUTH_PROFILE.LAST_NAME];
                    }
                    if (CONSTANTS.OAUTH_PROFILE.TELEPHONE in cobj) {
                        telephone = cobj[CONSTANTS.OAUTH_PROFILE.TELEPHONE];
                    }
                    if (CONSTANTS.OAUTH_PROFILE.COST_CENTER in cobj) {
                        costCenter = cobj[CONSTANTS.OAUTH_PROFILE.COST_CENTER];
                    }
                }
            }
        }


        var userProfile = {};
        userProfile[CONSTANTS.RBAC_PROFILE.USER_NAME] = userName;
        userProfile[CONSTANTS.RBAC_PROFILE.FIRST_NAME] = firstName;
        userProfile[CONSTANTS.RBAC_PROFILE.LAST_NAME] = lastName;
        userProfile[CONSTANTS.RBAC_PROFILE.EMAIL] = email;
        userProfile[CONSTANTS.RBAC_PROFILE.WORK_PHONE] = telephone;
        userProfile[CONSTANTS.RBAC_PROFILE.COST_CENTER] = costCenter;

        userProfile.default_role = {};
        userProfile.current_role = {};
        userProfile.all_roles = [];
        userProfile.secured_objects = [];
        userProfile.teams = [];

        userProfile.profile_type = CONSTANTS.OAUTH_PROFILE.PROFILE_TYPE;

        logger.debug('returning the following profile ' + JSON.stringify(userProfile));

        return userProfile
    }


    /** private function **/
    function getRbacProfile(url, token, config, oauthProfile, appName) {
        logger.debug('Executing getRbacProfile with url ' + url + ' for token ' + token);
        var accept = urlSpace.headers.adams.accept.v1;

        return utils.makeApiCallWithOAuthToken(url, token, accept).then(
            function (profile) {
                logger.debug('Inside callback for getRbacProfile for token ' + token);
                logger.debug('Got the following profile for the token ' + JSON.stringify(profile));

                if (!profile.user_name) {
                    return createRbacUserProfileFromOAuthProfile(oauthProfile);
                }

                profile.profile_type = CONSTANTS.RBAC_PROFILE.PROFILE_TYPE;

                return getTeamsBasedOnRbacProfile(token, config, profile, appName).then(
                    function (teams) {
                        logger.debug('Inside callback for getTeamsBasedOnRbacProfile for token ' + token);
                        logger.debug('Got the following teams for this profile ' + JSON.stringify(teams));

                        profile.teams = teams;
                        return profile;
                    },
                    function (error) {
                        logger.error('An error occurred while getting teams for profile with token' + token);
                        logger.error(error);
                    }
                );
            },
            function (error) {
                logger.debug('No profile available from ADAMS for token ' + token + ' will try to return OAuth profile instead');
                logger.debug(error);
                return createRbacUserProfileFromOAuthProfile(oauthProfile);
            }
        );
    }


    /** private function **/
    function getTeamsBasedOnRbacProfile(token, config, profile, appName) {
        logger.debug('Executing getTeamsBasedOnRbacProfile for token ' + token);

        var urlPath = urlSpace.urls.adams.userTeams.replace('{username}', profile.user_name).replace('{applicationName}', appName || config.application.name).replace('{roleName}', profile.current_role.role_name),
            url = config.urls.adams.concat(urlPath),
            accept = urlSpace.headers.adams.accept.v1;

        return utils.makeApiCallWithOAuthToken(url, token, accept);
    }



    var service = {
        getRbacUserProfileFromToken: getRbacUserProfileFromToken,
        getRbacUserProfileForRole: getRbacUserProfileForRole,
        createRbacUserProfileFromOAuthProfile: createRbacUserProfileFromOAuthProfile
    };

    return service;

})();

module.exports = rbac;