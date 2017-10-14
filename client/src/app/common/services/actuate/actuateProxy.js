
angular.module('common.services.Actuate.proxy', [
    'common.services.Actuate.constant',
    'common.url'
])

    .factory('ActuateProxy', ['$rootScope', '$http', '$httpParamSerializer', '$q', 'SERVER_URL_SPACE', 'ACTUATE_CONSTANTS', 'RBACService',
        function($rootScope, $http, $httpParamSerializer, $q, SERVER_URL_SPACE, ACTUATE_CONSTANTS, RBACService) {

            var APP_CONFIG = $rootScope.applicationConfiguration,
                APP_NAME = APP_CONFIG.application.name,
                REPORT_FOLDER_PATH = APP_CONFIG.actuate.reportFolderPath;


            function startAdminSession() {
                var deferred = $q.defer();

                $http({
                    url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.login),
                    method: 'POST',
                    headers: {
                        'Content-Type' : SERVER_URL_SPACE.headers.contentType.form
                    },
                    data: $httpParamSerializer({
                        username: ACTUATE_CONSTANTS.ADMIN_USERNAME
                    })
                }).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to start an Admin session in Actuate.');
                    });

                return deferred.promise;
            }


            /**
             * This method will user the provided admin session to check to see if the user already exists in Actuate or not.
             * If the user does not yet exist then we must first create the user.
             *
             * @param adminSession
             * @returns
             */
            function ensureUserExists(adminSession) {
                var deferred = $q.defer(),
                    adminToken = adminSession[ACTUATE_CONSTANTS.LOGIN_SESSION.TOKEN],
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.searchUser.replace('{username}', RBACService.getUsername())),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add admin users authentication token
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = adminToken;

                //search for user
                $http(httpOptions).then(
                    function (response) {
                        if (response.data.users.length > 0) {
                            deferred.resolve(response.data);
                        } else {
                            return createUser(adminToken).then(
                                function (response) {
                                    deferred.resolve(response.data);
                                }, function (error) {
                                    deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to create user ' + RBACService.getUsername() + ' in Actuate');
                                });
                        }
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while searching Actuate for user ' + RBACService.getUsername());
                    });

                return deferred.promise;
            }


            function createUser(adminToken) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.user),
                        method: 'POST',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.form
                        },
                        data: $httpParamSerializer({
                            username: RBACService.getUsername()
                        })
                    };

                //add admin users authentication token
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = adminToken;

                //create user
                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred trying to create user ' + RBACService.getUsername() + ' in Actuate');
                    });

                return deferred.promise;
            }


            function startUserSession() {
                var deferred = $q.defer();

                $http({
                    url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.login),
                    method: 'POST',
                    headers: {
                        'Content-Type' : SERVER_URL_SPACE.headers.contentType.form
                    },
                    data: $httpParamSerializer({
                        username: RBACService.getUsername()
                    })
                }).then(
                    function (response) {
                        deferred.resolve(response.data[ACTUATE_CONSTANTS.LOGIN_SESSION.TOKEN]);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to start a user session in Actuate for user ' + RBACService.getUsername());
                    });

                return deferred.promise;
            }


            function getReportFolderId(token, reportFolder) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.searchFolderByPath.replace('{reportFolder}', reportFolder)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {

                        if (response && response.data && response.data.itemList && response.data.itemList.file && response.data.itemList.file.length === 1) {
                            deferred.resolve(response.data.itemList.file[0].id);
                        } else {
                            deferred.reject('Actuate search for report folder '+REPORT_FOLDER_PATH+' did not return the expected results');
                        }
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find the Actuate folder id for report path ' + REPORT_FOLDER_PATH);
                    });

                return deferred.promise;
            }


            function getReportId(token, folderId, reportFileName) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.searchReportFile.replace('{folderId}',folderId).replace('{reportFileName}',reportFileName)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        if (response && response.data && response.data.itemList && response.data.itemList.file && response.data.itemList.file.length === 1) {
                            deferred.resolve(response.data.itemList.file[0].id);
                        } else {
                            deferred.reject('Actuate search for report '+reportFileName+' did not return the expected results');
                        }
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find the Actuate file id for report ' + reportFileName + ' under folder ' + folderId);
                    });

                return deferred.promise;
            }


            function scheduleJobNow(token, reportId, reportParameters, jobName, outputFileName, outputFileFormat) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.scheduleReportNow.replace('{reportId}',reportId)),
                        method: 'POST',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.form
                        },
                        data: $httpParamSerializer({
                            paramValues: reportParameters,
                            jobName: jobName,
                            fileType: ACTUATE_CONSTANTS.DEFAULT_FILE_TYPE,
                            outputFileName: outputFileName,
                            replaceExisting: false,
                            outputFileFormat: (outputFileFormat) ? outputFileFormat : ACTUATE_CONSTANTS.DEFAULT_OUTPUT_FILE_FORMAT
                        })
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data.jobId);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to schedule report id ' + reportId + ' for user ' + RBACService.getUsername());
                    });

                return deferred.promise;
            }


            function searchJobs(token, appUserSearchTerm, status, fetchSize, fetchHandle, fetchDirection) {
                fetchHandle = (fetchHandle) ? fetchHandle : '';
                fetchDirection = (fetchDirection) ? fetchDirection : ACTUATE_CONSTANTS.DEFAULT_FETCH_DIRECTION;

                var deferred = $q.defer(),
                    pageSize = (fetchSize) ? fetchSize : ACTUATE_CONSTANTS.DEFAULT_JOB_FETCH_SIZE,
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.searchJobs.replace('{appUserSearchTerm}', appUserSearchTerm).replace('{status}',status)
                            .replace('{fetchSize}', pageSize).replace('{fetchHandle}', fetchHandle).replace('{fetchDirection}', fetchDirection)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to find Actuate jobs for user ' + RBACService.getUsername() + ' with status ' + status);
                    });

                return deferred.promise;
            }


            function getJobStatus(token, jobId) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.getJobStatus.replace('{jobId}', jobId)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to get the status of job' + jobId + ' from Actuate');
                    });

                return deferred.promise;
            }


            function deleteJob(token, jobId, deleteType) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.deleteJob.replace('{jobId}', jobId).replace('{deleteType}',deleteType)),
                        method: 'DELETE',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to ' + deleteType + ' job id ' + jobId + ' from Actuate');
                    });

                return deferred.promise;
            }


            function searchFiles(token, folderId, searchTerm, fetchSize, fetchHandle) {
                fetchHandle = (fetchHandle) ? fetchHandle : '';

                var deferred = $q.defer(),
                    pageSize = (fetchSize) ? fetchSize : ACTUATE_CONSTANTS.DEFAULT_JOB_FETCH_SIZE,
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.searchFiles.replace('{folderId}', folderId).replace('{searchTerm}', searchTerm)
                            .replace('{fetchSize}', pageSize).replace('{fetchHandle}', fetchHandle)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while searching for Actuate files for user ' + RBACService.getUsername() + ' with search term ' + searchTerm);
                    });

                return deferred.promise;
            }

            function deleteFile(token, fileId) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.deleteFile.replace('{fileId}', fileId)),
                        method: 'DELETE',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.json
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to delete file ' + fileId + ' from Actuate');
                    });

                return deferred.promise;
            }


            function downloadOutputFile(token, fileId, base64) {
                var deferred = $q.defer(),
                    httpOptions = {
                        url: encodeURI(SERVER_URL_SPACE.urls.local.actuate.downloadOutputFile.replace('{fileId}', fileId).replace('{base64}', base64)),
                        method: 'GET',
                        headers: {
                            'Content-Type' : SERVER_URL_SPACE.headers.contentType.stream
                        }
                    };

                //add authentication token to the header
                httpOptions.headers[ACTUATE_CONSTANTS.HEADER.AUTH_TOKEN] = token;

                $http(httpOptions).then(
                    function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject((error && error.data && error.data.message) ? error.data.message : 'An error occurred while attempting to download report output with id ' + fileId + ' from Actuate');
                    });

                return deferred.promise;
            }



            return {
                startAdminSession : startAdminSession,
                ensureUserExists : ensureUserExists,
                startUserSession : startUserSession,
                getReportFolderId : getReportFolderId,
                getReportId : getReportId,
                scheduleJobNow : scheduleJobNow,
                searchJobs : searchJobs,
                getJobStatus : getJobStatus,
                deleteJob : deleteJob,
                searchFiles : searchFiles,
                deleteFile : deleteFile,
                downloadOutputFile : downloadOutputFile
            };

        }]);
