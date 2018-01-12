
angular.module('common.services.RBAC', [
    'common.url'
])
    .factory('RBACService', ['stgOauthSettings', '$rootScope', '$state', '$stateParams', '$http', '$q', 'SERVER_URL_SPACE', 'orderByFilter', 'STG_CONSTANTS',
        function(stgOauthSettings, $rootScope, $state, $stateParams, $http, $q, SERVER_URL_SPACE, orderBy, STG_CONSTANTS) {
        var DEFAULT_ACCESS_TYPE = 'BLOCKED',
            PROFILE_TYPES = {
                OAUTH: 'OAUTH',
                RBAC: 'RBAC'
            },
            currentProfile = stgOauthSettings.currentRbacProfile,
            applicationName,
            access_attributes = [];

        function getCurrentProfile() {
            return currentProfile;
        }

        function getRBACAppName(){
            return applicationName || $rootScope.applicationConfiguration.application.name;
        }

        function setCurrentProfile(profile) {
            currentProfile = profile;
        }

        function getUsername() {
            return currentProfile.user_name;
        }

        function getProfileType() {
            return currentProfile.profile_type;
        }

        function getCurrentRole() {
            try {
                return currentProfile.current_role;
            } catch (e) {
                return undefined;
            }
        }

        function getCurrentRoleName() {
            try {
                return currentProfile.current_role.role_name;
            } catch (e) {
                return undefined;
            }
        }

        function getDefaultRole() {
            try {
                return currentProfile.default_role;
            } catch(e) {
                return undefined;
            }
        }

        function getDefaultRoleName() {
            try {
                return currentProfile.default_role.role_name;
            } catch(e) {
                return undefined;
            }
        }

        function getAllRoles() {
            try {
                return currentProfile.all_roles;
            } catch (e) {
                return undefined;
            }
        }

        function getTeams() {
            try {
                return currentProfile.teams;
            } catch(e) {
                return [];
            }
        }

        function getSelectedTeam() {
            try {
                if (!currentProfile.selected_team) {
                    setDefaultSelectedTeam();
                }
                return currentProfile.selected_team;
            } catch(e) {
                return undefined;
            }


        }

        function setSelectedTeam(team) {
            //TODO:  we need to add validation here that the team provided is valid for the user
            if (!team) {
                throw Error('The selected teams provided does not exist in the list of available teams, this is not allowed');
            }

            currentProfile.selected_team = team;
            addSelectedTeam();
        }

        function setDefaultSelectedTeam() {
            for (var i=0; i < currentProfile.teams.length; i++) {
                if (currentProfile.teams[i].default_team) {
                    currentProfile.selected_team = currentProfile.teams[i];
                    break;
                }
                else {
                    currentProfile.selected_team = null;
                }
            }
            if(!currentProfile.selected_team) {
                var selectedTeam = orderBy(currentProfile.teams, "team_name");
                currentProfile.selected_team = selectedTeam[0];
            }

            addSelectedTeam();
        }

        function getSelectedTeamName() {
            var selectedTeam = getSelectedTeam();
            return selectedTeam ? selectedTeam.team_name : null;
        }

        function getSelectedTeamDisplayName() {
            var selectedTeam = getSelectedTeam();
            return selectedTeam ? selectedTeam.team_name + ' - ' + selectedTeam.team_description : null;
        }



        function getAllSecuredObjects() {
            try {
                return currentProfile.secured_objects;
            } catch (e) {
                return undefined;
            }
        }

        function getSecuredObject(objectName) {
            try {
                for (var i=0; i < currentProfile.secured_objects.length; i++) {
                    if (objectName === currentProfile.secured_objects[i].object_name) {
                        return currentProfile.secured_objects[i];
                    }
                }
                return undefined;
            } catch (e) {
                return undefined;
            }
        }

        function hasSecuredObject(objectName) {
            try {
                var hasObject = false;
                for (var i=0; i < currentProfile.secured_objects.length; i++) {
                    if (objectName === currentProfile.secured_objects[i].object_name) {
                        hasObject = true;
                        break;
                    }
                }
                return hasObject;
            } catch (e) {
                return undefined;
            }
        }

        function getDefaultAccessType() {
            return DEFAULT_ACCESS_TYPE;
        }

        function getAccessTypeForSecuredObject(objectName) {
            if (hasSecuredObject(objectName)) {
                return getSecuredObject(objectName).access_type;
            } else {
                return getDefaultAccessType();
            }
        }

        function switchCurrentRole(roleName) {

            getRbacProfileForRole(roleName).then(function(data){
                stgOauthSettings.currentRbacProfile.data = data;
                currentProfile = data;

                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });

                setDefaultSelectedTeam();

                $rootScope.$broadcast('rbacProfileChanged', data);
                $rootScope.$broadcast('selectedTeamChanged', getSelectedTeam());
            });
        }

        function switchSelectedTeam(team) {
            setSelectedTeam(team);
            $rootScope.selectedTeam = getSelectedTeam();
            $rootScope.$broadcast('selectedTeamChanged', getSelectedTeam());
        }

        function isRbacProfile() {
            return (PROFILE_TYPES.RBAC === getProfileType()) ? true : false;
        }

        function changeRbacProfile(qs) {
            var roleName = qs.rbac_role_name,
                appName = qs.rbac_app_name,
                accessAttributes = qs.access_attributes;

            if (appName && roleName) {
                rebuildRbacProfileForRole(appName, roleName, accessAttributes).then(function(data){
                    stgOauthSettings.currentRbacProfile.data = data;
                    currentProfile = data;
                    applicationName = appName;

                    if ($state.current.name) {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }

                    setDefaultSelectedTeam();

                    $rootScope.$broadcast('rbacProfileChanged', data);
                    $rootScope.$broadcast('selectedTeamChanged', getSelectedTeam());
                });
            }
        }

        function getCurrentAccessAttributes() {
            try {
                return currentProfile.access_attributes;
            } catch (e) {
                return undefined;
            }
        }

        function addAttributes(attributes) {
            for (var y = 0; y < attributes.length; y++) {
                for (var key in attributes[y]) {
                    if (checkAttributeExists(attributes[y], key)) {
                        delete attributes[y][key];
                        if (Object.keys(attributes[y]).length === 0) {
                            attributes.splice(y, 1);
                        }
                    }
                }
            }

            for (var i = 0; i < attributes.length; i++) {
                access_attributes.push(attributes[i]);
            }
            currentProfile.access_attributes = access_attributes;
        }

        function removeAttributes(attributes) {
            removeAttributeExists(attributes);
        }


        /** private function **/
        function getRbacProfileForRole(roleName) {

            var deferred = $q.defer(),
                appName = getRBACAppName(),
                url = SERVER_URL_SPACE.urls.local.rbacUserProfileForRole;

            url = url + '?roleName=' + roleName + '&appName=' + appName;
            url = encodeURI(url);

            $http.get(url).then(
                function handleSuccess(response) {
                deferred.resolve(response.data);
            }, function handleError(response) {
                deferred.reject('An unknown error occurred.');
            });

            return deferred.promise;
        }

        function rebuildRbacProfileForRole(appName, roleName, accessAttributes) {

            var deferred = $q.defer(),
                url = SERVER_URL_SPACE.urls.local.rbacUserProfileForRole;

            if (accessAttributes) {
                url = url + '?roleName=' + roleName + '&appName=' + appName + '&accessAttributes=' + accessAttributes;
            }
            else {
                url = url + '?roleName=' + roleName + '&appName=' + appName;
            }

            url = encodeURI(url);

            $http.get(url).then(
                function handleSuccess(response) {
                    deferred.resolve(response.data);
                }, function handleError(response) {
                    deferred.reject('An unknown error occurred.');
                });

            return deferred.promise;
        }

        function addSelectedTeam() {
            var attributes = {};
            access_attributes = [];
            attributes.attribute_name = STG_CONSTANTS.ACCESS_ATTRIBUTES.SELECTED_TEAM;
            attributes.attribute_value = currentProfile.selected_team.team_name;
            attributes.attribute_source_system_id = currentProfile.selected_team.source_system_id;
            access_attributes.push(attributes);
            currentProfile.access_attributes = access_attributes;
        }

        function checkAttributeExists(attribute, key) {
            for (var x = 0; x < access_attributes.length; x++) {
                if (access_attributes[x].hasOwnProperty(key)) {
                    access_attributes[x][key] = attribute[key];
                    return true;
                }
            }
            return false;
        }

        function removeAttributeExists(attributes) {
            for (var x = 0; x < access_attributes.length; x++) {
                for (var y = 0; y < attributes.length; y++) {
                    for (var key in attributes[y]) {
                        if (access_attributes[x].hasOwnProperty(key)) {
                            delete access_attributes[x][key];
                            access_attributes.splice(x, 1);

                            if (Object.keys(access_attributes[x]).length === 0) {
                                access_attributes.splice(x, 1);
                            }
                        }
                    }
                }
            }
            currentProfile.access_attributes = access_attributes;
        }

        return {
            getCurrentProfile : getCurrentProfile,
            getRBACAppName : getRBACAppName,
            setCurrentProfile : setCurrentProfile,
            getUsername : getUsername,
            getProfileType : getProfileType,
            getCurrentRole : getCurrentRole,
            getCurrentRoleName : getCurrentRoleName,
            getDefaultRole : getDefaultRole,
            getDefaultRoleName : getDefaultRoleName,
            getAllRoles : getAllRoles,
            getTeams : getTeams,
            getSelectedTeam : getSelectedTeam,
            setSelectedTeam : setSelectedTeam,
            setDefaultSelectedTeam : setDefaultSelectedTeam,
            getSelectedTeamName : getSelectedTeamName,
            getSelectedTeamDisplayName: getSelectedTeamDisplayName,
            hasSecuredObject : hasSecuredObject,
            getSecuredObject : getSecuredObject,
            getDefaultAccessType : getDefaultAccessType,
            getAccessTypeForSecuredObject : getAccessTypeForSecuredObject,
            getAllSecuredObjects : getAllSecuredObjects,
            switchCurrentRole : switchCurrentRole,
            switchSelectedTeam : switchSelectedTeam,
            isRbacProfile : isRbacProfile,
            changeRbacProfile : changeRbacProfile,
            getCurrentAccessAttributes : getCurrentAccessAttributes,
            addAttributes : addAttributes,
            removeAttributes : removeAttributes
        };
    }]);

