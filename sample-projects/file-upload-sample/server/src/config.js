module.exports = function(){
    switch(process.env.NODE_ENV){

        default:
            return {
                application: {
                    name: 'File Upload Sample',
                    disableRbacSecurity: true
                },
                oauth: {
                    clientID: "File Upload Sample",
                    clientSecret: "evZf7MGAutmCMqyjmYvZ@3NYTNL623=r",
                    url: "https://ssodev.compassmanager.com/oauth2.0",
                    autoLogoutOnSessionExpired: "true"
                },
                server: {
                    port: 3012,
                    rootContext: '/ui',
                    logPath: __dirname + '/logs'
                },
                urls: {
                    sso: 'https://ssodev.compassmanager.com'
                },
                ga: {
                    id: ''
                },
                clientLogger: {
                    enableLogService: false
                },
                dynatrace: {
                    enabled: false
                }
            };
    }
};
