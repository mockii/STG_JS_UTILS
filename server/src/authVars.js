angular.module("common.settings.oauth", [])
    .service("stgOauthSettings", [function() {
        this.clientTimeout = (parseInt("%TIMEOUT_MINUTES%", 10) || 30) * 60 * 1000;
        this.currentToken = "%TOKEN%";
        this.currentRbacProfile = "%CURRENT_PROFILE%";
        this.logoutUrl = "%LOGOUT_URL%";
        this.autoLogoutOnSessionExpired = "%AUTO_LOGOUT_ON_SESSION_EXPIRED%";
    }]);