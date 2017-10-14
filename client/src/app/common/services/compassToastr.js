angular.module("common.services.CompassToastr", ['ngToast'])
    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide'
        });
    }])

    .service('CompassToastr', ['ngToast', function (ngToast) {
        this.warning = function(message) {
            ngToast.create({
                className: 'warning',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 5000,
                animation: 'slide'
            });
        };

        this.error = function(message) {
            ngToast.create({
                className: 'danger',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 5000,
                animation: 'slide'
            });
        };

        this.success = function(message) {
            ngToast.create({
                className: 'success',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 3000,
                animation: 'slide'
            });
        };

        this.info = function(message) {
            ngToast.create({
                className: 'info',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 3000,
                animation: 'slide'
            });
        };
    }]);