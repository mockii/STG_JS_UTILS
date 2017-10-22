angular.module('common.services.Utils', [])

    .factory('UtilsService', ['$rootScope', '$q', function($rootScope, $q) {


        /**
         * Convenience method that will convert a string object to a boolean
         *
         * @param valueToConvert
         * @returns {boolean}
         */
        function convertToBoolean(valueToConvert) {
            var result = false;

            if (valueToConvert === true || valueToConvert === "true") {
                result = true;
            }

            return result;
        }


        /**
         * Function to generate a UUID/GUID.
         *
         * @returns {string}
         */
        function generateGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        /**
         * Will remove the .extension for the given string.  If there is no instance of . then the
         * string will be returned as is.
         *
         * @param string
         * @returns updated string
         */
        function removeFileExtension(string) {
            return (string.lastIndexOf('.') > 0) ? string.substr(0, string.lastIndexOf('.')) : string;
        }

        function checkIfSearchObjectPresent(property, searchItems) {

            var isObjectPresent = false;
            if(searchItems && searchItems.length > 0){
                for (var i = 0; i < searchItems.length; i++) {
                    if(property === searchItems[i].property){
                        isObjectPresent = true;
                        break;
                    }
                }
            }
            return isObjectPresent;
        }

        function getSearchIndex(obj, index){
            return obj.property === this;
        }

        /**
         * Load script and return a promise
         *
         * @param string
         * @returns promise
         */
        function loadScript(src) {
            var deferred = $q.defer(),
                script = document.createElement('script');
            script.onload = function() {
                deferred.resolve();
            };
            script.onerror = function() {
                deferred.reject();
            };
            document.body.appendChild(script);
            script.src = src;
            return deferred.promise;
        }


        return {
            convertToBoolean : convertToBoolean,
            generateGuid : generateGuid,
            removeFileExtension : removeFileExtension,
            checkIfSearchObjectPresent : checkIfSearchObjectPresent,
            getSearchIndex : getSearchIndex,
            loadScript : loadScript
        };

    }])
;