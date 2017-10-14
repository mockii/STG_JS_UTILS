
module.exports = function(appConfig) {

    var log4js = require('log4js'),
        logger = log4js.getLogger('dynatrace'),
        isDynatraceNeeded,
        server,
        agentLocation,
        agentName;


    function setup() {
        logger.debug('Attempting to enable Dynatrace monitoring');
        try {
            processEnvironmentConfiguration();
            if (isDynatraceNeeded) {
                logger.debug('Starting Dynatrace using agent', agentLocation);
                require(agentLocation)(buildDynatraceConfigObject());
            } else {
                logger.debug('Dynatrace monitoring is not enabled for this application, moving on');
            }
        } catch (err) {
            console.error(err.toString());
        }
    }


    function processEnvironmentConfiguration() {
        logger.debug('processing environment configuration');

        var dynatraceEnvironmentConfig;
        if (process.env.dynatrace) {
            dynatraceEnvironmentConfig = JSON.parse(process.env.dynatrace);
        }

        if (!appConfig.config.dynatrace) {
            appConfig.config.dynatrace = {};
        }

        isDynatraceNeeded = dynatraceEnvironmentConfig ? dynatraceEnvironmentConfig.enabled : !!appConfig.config.dynatrace.enabled;
        server = dynatraceEnvironmentConfig ? dynatraceEnvironmentConfig.server : appConfig.config.dynatrace.server;
        agentLocation = dynatraceEnvironmentConfig ? dynatraceEnvironmentConfig.agentLocation : appConfig.config.dynatrace.agentLocation;
        agentName = dynatraceEnvironmentConfig ? dynatraceEnvironmentConfig.agentName : appConfig.config.dynatrace.agentName;

        logger.debug('using the following values:', {enabled: isDynatraceNeeded, server: server, agentLocation: agentLocation, agentName: agentName});
    }


    function buildDynatraceConfigObject() {
        var dynatraceConfig = {
            server: server,
            agentName: agentName
        };
        logger.debug('Using the following config for Dynatrace', dynatraceConfig);
        return dynatraceConfig;
    }


    //export public functions
    return {
        setup: setup
    }
};

