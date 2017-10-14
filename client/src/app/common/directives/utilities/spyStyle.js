angular.module("common.directives.utilities.SpyStyle", [

])
    .directive('spyStyle', [function() {
        return {
            restrict: 'A',
            scope: {
                onChange: "=spyOnChange"
            },
            link: function(scope, element, attrs) {
                scope.$watch(function () {
                        if (attrs.hasOwnProperty('spyAttribute')) {
                            return element.css(attrs.spyAttribute);
                        } else {
                            return;
                        }
                    },  styleChangedCallBack,
                    true);

                function styleChangedCallBack(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (scope.hasOwnProperty('onChange')) {
                            scope.onChange(newValue, oldValue);
                        }
                    }
                }
            }
        };
    }]);