'use strict';

(function () {

    angular.module('sample.home.controller', [])
        .controller('HomeController', ['CompassToastr', 'FileUploadService', function(CompassToastr, FileUploadService) {
            var homeController = this;

            function initialize() {
                //nothing needed here yet
            }


            homeController.uploadFile = function() {
                var f = document.getElementById('myFileUploadId').files[0],
                    formData = new FormData();

                formData.append('file', f);

                FileUploadService.sendDataToServer(formData).then(
                    function(){
                        CompassToastr.success('Your file was successfully uploaded');
                    },
                    function(){
                        CompassToastr.error('An error occurred while trying to upload your file.');
                    }
                );
            };


            initialize();
        }
    ]);
})();