angular.module('common.directives.ModalDialog', [
    'ngSanitize',
    'ui.bootstrap'
])
    .service("ModalDialogService", ['$q', '$uibModal', function($q, $uibModal) {

        /*
        Options:
         bodyText: "Would you like to continue?"
         cancelText: cancel
         okText: ok
         */

        this.alert = function(configObject) {
            var deferred = $q.defer();

            configObject = setupConfigObject(configObject);
            configObject.title = configObject.title || "Alert!";
            configObject.size = configObject.size || "sm";
            configObject.hideCancelButton = true;

            var modalObject = getBaseModalObject(configObject);

            var modalInstance = $uibModal.open(modalObject);

            modalInstance.result.then(function() {
                deferred.resolve();
            }, function(result) {
                deferred.reject();
            });

            return deferred.promise;
        };

        this.confirm = function(configObject) {
            var deferred = $q.defer();

            configObject = setupConfigObject(configObject);
            configObject.title = configObject.title || "Confirm Action";
            configObject.size = configObject.size || "sm";

            var modalObject = getBaseModalObject(configObject);

            var modalInstance = $uibModal.open(modalObject);

            modalInstance.result
                .then(function(response) {
                    deferred.resolve(response);
                }, function(result) {
                    deferred.reject();
                });

            return deferred.promise;
        };

        function getBaseModalObject(configObject) {
            return {
                templateUrl: 'common/directives/modalDialog/modalDialog.tpl.html',
                controller: 'ModalDialogController',
                controllerAs: 'dialogController',
                windowClass: configObject.windowClass,
                backdropClass: configObject.backdropClass,
                windowTopClass: configObject.windowTopClass,
                animation: configObject.animation,
                backdrop: configObject.backdrop,
                keyboard: configObject.keyboard,
                windowTemplateUrl: configObject.windowTemplateUrl,
                size: configObject.size,
                openedClass: configObject.openedClass,
                resolve: {
                    configObject: function () {
                        return configObject;
                    }
                }
            };
        }

        function setupConfigObject(configObject) {
            if (Object.prototype.toString.call(configObject) === "[object String]") {
                configObject = {
                    bodyText:configObject
                };
            }

            return {
                bodyText: configObject.bodyText || "Are you sure?",
                bodyHTML: configObject.bodyHTML || "",
                cancelText: configObject.cancelText || "Cancel",
                okText: configObject.okText || "Ok",
                title: configObject.title || "",
                hideCancelButton: configObject.hideCancelButton || false,
                windowClass: configObject.windowClass || "stg-modal-dialog",
                backdropClass: configObject.backdropClass || "",
                windowTopClass: configObject.windowClass || "",
                animation: configObject.animation || true,
                backdrop: configObject.backdrop || true,
                keyboard: configObject.keyboard || true,
                windowTemplateUrl: configObject.windowTemplateUrl || "",
                size: configObject.size || "",
                openedClass: configObject.openedClass || "",
                showDontShow: configObject.showDontShow || false
            };
        }
    }])

    .controller('ModalDialogController', ['$scope', 'configObject', '$uibModalInstance',
        function ($scope, configObject, $uibModalInstance) {
            var dialogController = this;
            dialogController.title = configObject.title;
            dialogController.bodyText = configObject.bodyText;
            dialogController.bodyHTML = configObject.bodyHTML;
            dialogController.cancelText = configObject.cancelText;
            dialogController.okText = configObject.okText;
            dialogController.hideCancelButton = configObject.hideCancelButton || false;
            dialogController.showDontShow = configObject.showDontShow || false;
            dialogController.dontShow = false;

            dialogController.cancelSelected = function() {
                $uibModalInstance.dismiss(false);
            };

            dialogController.okSelected = function() {
                $uibModalInstance.close({windowClose:true, dontShow: dialogController.dontShow});
            };
        }])

;