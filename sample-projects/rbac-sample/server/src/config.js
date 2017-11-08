module.exports = function(){
    switch(process.env.NODE_ENV){
        default:
            return {
                application: {
                    name: 'RBAC Sample'
                },
                oauth: {
                    clientID: "RBAC Sample",
                    clientSecret: "rbac sample application",
                    url: "https://ssodev.compassmanager.com/oauth2.0",
                    autoLogoutOnSessionExpired: "false"
                },
                server: {
                    port: 3009,
                    rootContext: '/ui',
                    logPath: __dirname + '/logs'
                },
                token: {
                    revalidateAfterMin: 30,
                    longestTimeToLiveHours: 8
                },
                urls: {
                    adams: 'https://adamsdev.compassmanager.com',
                    sso: 'https://ssodev.compassmanager.com',
                    oms: 'https://dev.compassmanager.com'
                },
                ga: {
                    id: ''
                }
            };
    }
};
