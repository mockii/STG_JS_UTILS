module.exports = function(){
    switch(process.env.NODE_ENV){
        default:
            return {
                application: {
                    name: 'STAFF'
                },
                oauth: {
                    clientID: "MySTAFF Local",
                    clientSecret: "evrbUZF4gz!=427bLGdsV2m_D#n!utCaDTz8",
                    url: "https://ssodev.compassmanager.com/oauth2.0",
                    autoLogoutOnSessionExpired: "true"
                },
                server: {
                    port: 3008,
                    rootContext: '/ui',
                    logPath: __dirname + '/logs'
                },
                urls: {
                    cens: 'http://localhost:5026',
                    adams : 'https://adamsdev.compassmanager.com',
                    sso: 'https://ssodev.compassmanager.com'
                },
                ga: {
                    id: ''
                },
                clientLogger: {
                    flushInterval: 600000, // 10 mins
                    maxLogLength: 10000,
                    isDebugEnabled: true,
                    enableLogService: false
                }
            };
    }
};
