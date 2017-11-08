var serverSettings = (function() {

    var fs = require('fs'),
        Promise = require('promise'),
        serverSettingsData = [],
        envPath = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';


    function initialize() {
        readServerSettingsDataFromFileSystem().then(function(data){
            serverSettingsData = data;
        });
    }


    function readServerSettingsDataFromFileSystem() {

        var promise = new Promise(function(resolve, reject) {
            fs.readFile(__dirname + '/data/' + envPath + '/server-settings.json', 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(data));
            });

        });

        return promise;
    }


    function getAllServerSettings() {
        return serverSettingsData;
    }


    function getSettingByName(name) {
        var settings = [];
        for (var i = 0; i < serverSettingsData.length; i++) {
            var setting = serverSettingsData[i];
            if (setting.name === name) {
                settings.push(setting);
            }
        }
        return settings;
    }



    initialize();


    var service =  {
        getAllServerSettings : getAllServerSettings,
        getSettingByName: getSettingByName
    };

    return service;

})();

module.exports = serverSettings;