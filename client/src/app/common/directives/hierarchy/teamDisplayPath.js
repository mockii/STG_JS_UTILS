'use strict';

(function () {

    angular.module('common.directives.teamDisplayPath', [])
        .directive('teamDisplayPath', ['$document', '$timeout', '$compile', function($document, $timeout, $compile) {
            return {
                restrict: 'A',
                scope: {
                    teamPath: "="
                },
                link: function (scope, element, attrs) {

                    var teamPath,
                        ul = '<ul class="team-path-list">',
                        li = '<li class="team-path-list-item"><i class="fa fa-minus" aria-hidden="true"></i>',
                        teamElement = ul,
                        listItems = 0;
                    
                    teamPath = scope.teamPath.replace(/\/$/, "").split('/');

                    for(var i=0; i<teamPath.length; i++){
                        if (i > 0){
                            teamElement += ul;
                            listItems++;
                        }
                        teamElement += li + teamPath[i] + '</li>';
                    }

                    while (listItems > 1) {
                        teamElement += '</ul>';
                        listItems--;
                    }

                    teamElement += '</ul>';

                    element.append(angular.element(teamElement));
                    $compile(element)(scope);
                }
            };
        }]);
})();