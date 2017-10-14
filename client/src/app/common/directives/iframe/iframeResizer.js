/**
 * Created by ChouhR01 on 2/7/2017.
 */
(function () {
    'use strict';

    angular
        .module('common.directives.iframeResizer', [])
        .directive('iframeResizer', iframeResizerFunction);

    iframeResizerFunction.$inject = ['$window'];

    /* @ngInject */
    function iframeResizerFunction($window) {
        var scrollHeight,
            scrollWidth,
            iframe;

        var directive = {
            bindToController: true,
            controller: iframeController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
            iFrameResize({
                log:false,
                checkOrigin: false
            }, element[0]);
        }
    }

    iframeController.$inject = [];

    /* @ngInject */
    function iframeController() {

    }

})();

