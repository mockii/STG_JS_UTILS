/**
 * Created by ChouhR01 on 12/14/2016.
 */
(function () {
    'use strict';

    angular
        .module('common.directives.scroll', [])
        .directive('scrollId', scrollFunction);

    scrollFunction.$inject = ['$timeout', '$interval'];

    /* @ngInject */
    function scrollFunction($timeout, $interval) {
        var directive = {
            bindToController: true,
            controller: scrollController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
            $interval(function(){
                if(element[0].scrollHeight > element.height() || element[0].scrollHeight > element[0].clientHeight){
                    element[0].scrollTop = element[0].scrollHeight;
                }
            });
        }
    }

    scrollController.$inject = [];

    /* @ngInject */
    function scrollController(dependency) {

    }

})();

