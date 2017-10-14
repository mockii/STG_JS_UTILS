var constants = (function() {

    return {
        RBAC_PROFILE: {
            USER_NAME: 'user_name',
            FIRST_NAME: 'first_name',
            LAST_NAME: 'last_name',
            EMAIL: 'email_address',
            WORK_PHONE: 'work_phone',
            COST_CENTER: 'cost_center_name',
            PROFILE_TYPE: 'RBAC'
        },
        OAUTH_PROFILE: {
            ATTRIBUTES: 'attributes',
            USER_NAME: 'id',
            FIRST_NAME: 'FirstName',
            LAST_NAME: 'LastName',
            EMAIL: 'Email',
            TELEPHONE: 'Telephone',
            COST_CENTER: 'CostCenter',
            PROFILE_TYPE: 'OAUTH'
        },
        ACTUATE: {
            ADMIN_USERNAME: 'RESTAdmin',
            ADMIN_PASSWORD: 'rest@dm!n',
            PASSWORD_CONTENT_TEMPLATE: '&password={password}',
            USER_PASSWORD_TEMPLATE: 'Pa55w0rd f0R u53r {username}'
        }
    };

})();

module.exports = constants;
