
angular.module('common.services.Actuate', [
    'common.services.Actuate.constant',
    'common.services.Actuate.proxy',
    'common.url'
])

    .factory('ActuateService', ['$rootScope', '$http', '$httpParamSerializer', '$q', 'SERVER_URL_SPACE', 'ACTUATE_CONSTANTS', 'RBACService', 'UtilsService', 'ActuateProxy',
        function($rootScope, $http, $httpParamSerializer, $q, SERVER_URL_SPACE, ACTUATE_CONSTANTS, RBACService, UtilsService, ActuateProxy) {

            var APP_CONFIG = $rootScope.applicationConfiguration,
                APP_NAME = APP_CONFIG.application.name,
                REPORT_FOLDER_PATH = APP_CONFIG.actuate.reportFolderPath;


            function getAuthTokenForUser() {
                return ActuateProxy.startAdminSession()
                    .then(ActuateProxy.ensureUserExists, handleActuateException)
                    .then(ActuateProxy.startUserSession, handleActuateException);
            }

            function scheduleReportNow(token, reportFileName, reportParameters, outputFileFormat, jobName, outputFileName) {
                return ActuateProxy.getReportFolderId(token, REPORT_FOLDER_PATH)
                    .then(function(folderId){
                        return ActuateProxy.getReportId(token, folderId, reportFileName);
                    }, handleActuateException)

                    .then(function(reportId) {
                        var outputFileName = getOutputFileName(reportFileName, outputFileName),
                            formattedJobName = getJobName(reportFileName, jobName);
                        return ActuateProxy.scheduleJobNow(token, reportId, reportParameters, formattedJobName, outputFileName, outputFileFormat);
                    }, handleActuateException);
            }

            function getAllJobsForUser(token, fetchSize, fetchHandle, fetchDirection) {
                var deferred = $q.defer();
                ActuateProxy.searchJobs(token, getAppUserSearchTerm(), ACTUATE_CONSTANTS.JOBS_STATUS.ALL, fetchSize, fetchHandle, fetchDirection).then(
                    function(data){
                        deferred.resolve(enrichJobData(data));
                    },
                    handleActuateException
                );
                return deferred.promise;
            }

            function getPendingJobsForUser(token, fetchSize, fetchHandle, fetchDirection) {
                var deferred = $q.defer();
                ActuateProxy.searchJobs(token, getAppUserSearchTerm(), ACTUATE_CONSTANTS.JOBS_STATUS.SCHEDULED, fetchSize, fetchHandle, fetchDirection).then(
                    function(data){
                        deferred.resolve(enrichJobData(data));
                    },
                    handleActuateException
                );
                return deferred.promise;
            }

            function deleteJob(jobId) {
                var adminToken,
                    jobStatusData;

                return ActuateProxy.startAdminSession()
                    .then(function(adminSession){
                        adminToken = adminSession[ACTUATE_CONSTANTS.LOGIN_SESSION.TOKEN];
                        return ActuateProxy.getJobStatus(adminToken, jobId);
                    }, handleActuateException)
                    .then(function(data){
                        jobStatusData = data;
                        return invokeProperJobDeleteMethod(adminToken, jobStatusData);
                    }, handleActuateException)
                    .then(function(){
                        return ActuateProxy.deleteFile(adminToken, jobStatusData.job.actualOutputFileId);
                    }, handleActuateException);
            }

            function searchFiles(token, searchTerm, fetchSize, fetchHandle) {
                searchTerm = formatSearchTerm(searchTerm);

                return ActuateProxy.getReportFolderId(token, getOutputFolder())
                    .then(function(folderId){
                        return ActuateProxy.searchFiles(token,folderId, searchTerm, fetchSize, fetchHandle);
                    }, handleActuateException);
            }

            function downloadReport(token, fileId, base64) {
                return ActuateProxy.downloadOutputFile(token, fileId, base64);
            }




            /** private function **/
            function getOutputFolder() {
                return ACTUATE_CONSTANTS.OUTPUT_FOLDER_TEMPLATE.replace('{reportFolder}', REPORT_FOLDER_PATH);
            }

            /** private function **/
            function getOutputFileName(reportFileName, outputFileName) {
                var name = (outputFileName) ? outputFileName : UtilsService.removeFileExtension(reportFileName);
                return getOutputFolder() + '/' + getAppUserSearchTerm() + name;
            }

            /** private function **/
            function getJobName(reportFileName, jobName) {
                var name = (jobName) ? jobName : UtilsService.removeFileExtension(reportFileName);
                return getAppUserSearchTerm() + getCurrentTimestamp() + ' ' + name;
            }

            /** private function **/
            function getAppUserSearchTerm() {
                return ACTUATE_CONSTANTS.APP_USER_SEARCH_TERM_TEMPLATE.replace('{environment}', APP_CONFIG.environment).replace('{appName}', APP_NAME).replace('{username}', RBACService.getUsername());
            }

            /** private function **/
            function enrichJobData(jobsData) {
                for (var i=0; i < jobsData.jobs.length; i++) {
                    var job = jobsData.jobs[i];

                    job.jobDisplayName = job.jobName.substring(getAppUserSearchTerm().length + 15);
                    job.reportViewerUrl = encodeURI(APP_CONFIG.urls.base_urls.actuate + SERVER_URL_SPACE.urls.actuate.iHubReportViewer.replace('{reportOutputFileName}', job.actualOutputFileName));
                }

                return jobsData;
            }

            /** private function **/
            function invokeProperJobDeleteMethod(adminToken, jobStatusData) {
                var deferred = $q.defer(),
                    jobId = jobStatusData.job.jobId;

                if (jobStatusData && jobStatusData.job && jobStatusData.job.state) {

                    switch(jobStatusData.job.state) {
                        case ACTUATE_CONSTANTS.JOB_STATE.CANCELLED:
                        case ACTUATE_CONSTANTS.JOB_STATE.EXPIRED:
                        case ACTUATE_CONSTANTS.JOB_STATE.FAILED:
                        case ACTUATE_CONSTANTS.JOB_STATE.SUCCEEDED:
                            return ActuateProxy.deleteJob(adminToken, jobId, ACTUATE_CONSTANTS.DELETE_TYPE.DELETE_COMPLETED);
                        case ACTUATE_CONSTANTS.JOB_STATE.PENDING:
                        case ACTUATE_CONSTANTS.JOB_STATE.RUNNING:
                            return ActuateProxy.deleteJob(adminToken, jobId, ACTUATE_CONSTANTS.DELETE_TYPE.CANCEL_PENDING);
                        default:
                            deferred.reject('Unable to determine job state');
                    }

                } else {
                    deferred.reject('Unable to determine job state');
                }

                return deferred.promise;
            }

            /** private function **/
            function formatSearchTerm(searchTerm) {
                return getAppUserSearchTerm() + '*' + searchTerm.replace(' ', '*') + '*';
            }

            /** private function **/
            function getCurrentTimestamp() {
                var date = new Date(),
                    year = date.getFullYear(),
                    month = '00' + (date.getMonth() + 1),
                    day = '00' + date.getDate(),
                    hours = '00' + date.getHours(),
                    minutes = '00' + date.getMinutes(),
                    seconds = '00' + date.getSeconds();

                //substrings of last 2 characters
                var MM = month.substring(month.length - 2),
                    dd = day.substring(day.length - 2),
                    HH = hours.substring(hours.length - 2),
                    mm = minutes.substring(minutes.length - 2),
                    ss = seconds.substring(seconds.length - 2);

                return year + MM + dd + HH + mm + ss;
            }


            /** private function **/
            function handleActuateException(error) {
                console.error('An error occurred while attempting to communicate with Actuate');
                console.error(error);
            }



            return {
                getAuthTokenForUser : getAuthTokenForUser,
                scheduleReportNow : scheduleReportNow,
                getAllJobsForUser : getAllJobsForUser,
                getPendingJobsForUser : getPendingJobsForUser,
                deleteJob : deleteJob,
                searchFiles : searchFiles,
                downloadReport : downloadReport
            };

        }]);
