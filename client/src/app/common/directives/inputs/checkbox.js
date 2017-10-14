(function() {
    "use strict";

    angular.module("common.directives.inputs.checkbox", [])
        .directive('input', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                require: '?ngModel',
                link: function (scope, element, attr, ngModel) {
                    if ((attr.type === 'checkbox' || attr.type === 'radio') && attr.ngModel && attr.noUniform === undefined) {
                        element.uniform({ useID: false });
                        scope.$watch(function () { return ngModel.$modelValue; }, function () {
                            $timeout(jQuery.uniform.update, 0);
                        });
                    }
                }
            };
        }]);
})();