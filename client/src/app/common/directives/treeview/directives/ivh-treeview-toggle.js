
/**
 * Toggle logic for treeview nodes
 *
 * Handles expand/collapse on click. Does nothing for leaf nodes.
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('common.directives.treeview.ivh-treeview-toggle', []).directive('ivhTreeviewToggle', [function() {
  'use strict';
  return {
    restrict: 'A',
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {

        var node = scope.node,
            toggleOnClick = true;

        element.addClass('ivh-treeview-toggle');


        //check to see if we need to toggle or select on click
        if (!trvw.useCheckboxes() && !element.hasClass('twistie')) {
            toggleOnClick = false;
        }

        if (toggleOnClick) {
            element.bind('click', function() {
                if(!trvw.isLeaf(node)) {
                    scope.$apply(function() {
                        trvw.toggleExpanded(node);
                        trvw.onToggle(node);
                    });
                }
            });

        } else {
            element.bind('click', function() {
                trvw.select(node, true);
            });
        }

    }
  };
}]);
