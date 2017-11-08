var constants = (function() {

    return {
        USER_PROFILE_ATTRIBUTES: {
            USERNAME: 'user_name',
            FIRST_NAME: 'first_name',
            LAST_NAME: 'last_name',
            EMAIL: 'email_address',
            WORK_PHONE: 'work_phone',
            COST_CENTER: 'cost_center',
            PERNO: 'personnel_number'
        },
        OAUTH_ATTRIBUTES: {
            FIRST_NAME: 'FirstName',
            LAST_NAME: 'LastName',
            EMAIL: 'Email',
            WORK_PHONE: 'Telephone',
            COST_CENTER: 'CostCenter',
            PERNO: 'Perno'
        },
        httpStatusCode: ['500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '598', '599']
    };

})();

module.exports = constants;