'use strict';

(function () {

    angular.module('common.directives.selectPicker', [])
        .directive('loadSelectPicker', ['$document', '$timeout', function($document, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    $timeout(function() {
                        element.addClass('selectpicker');
                        $('body .selectpicker').selectpicker();
                    }, 20);
                    
                    scope.$watch((attrs.ngOptions.split(' in ')[1]).split(' ')[0],  function() {
                        scope.$applyAsync(function () {
                            element.selectpicker('refresh');
                        });
                    }, true);
                }
            };
        }]);
})();