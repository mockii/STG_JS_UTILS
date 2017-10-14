/*

SAMPLE CONFIG/ENVIRONMENT FILE TO GET THINGS STARTED

 */

module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'production':
            return {
                oauth: {
                    clientID: "OAuth Test Client",
                    clientSecret: "this is just a test",
                    url: "https://dev.compassmanager.com/oauth2.0"
                }
            };

        case 'development':
        default:
            return {
                oauth: {
                    clientID: "OAuth Test Client",
                    clientSecret: "this is just a test",
                    url: "https://dev.compassmanager.com/oauth2.0"
                }
            };
    }
};
