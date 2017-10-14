
/**
 * Selection management logic for treeviews with checkboxes
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('common.directives.treeview.ivh-treeview-checkbox-helper', []).directive('ivhTreeviewCheckboxHelper', ['ivhTreeviewBfs', function(ivhTreeviewBfs) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewCheckboxHelper'
    },
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {
      var node = scope.node,
          opts = trvw.opts(),
          indeterminateAttr = opts.indeterminateAttribute,
          selectedAttr = opts.selectedAttribute;

      // Set initial selected state of this checkbox
      scope.isSelected = node[selectedAttr];
      scope.isBlocked = false;

      // Local access to the parent controller
      scope.trvw = trvw;

      // Enforce consistent behavior across browsers by making indeterminate
      // checkboxes become checked when clicked/selected using spacebar
      scope.resolveIndeterminateClick = function() {
        if(node[indeterminateAttr]) {
          trvw.select(node, true);
        }
      };

      // Update the checkbox when the node's selected status changes
      scope.$watch('node.' + selectedAttr, function(newVal, oldVal) {
        scope.isSelected = newVal;
      });

      // Update the checkbox when the node's indeterminate status changes
      scope.$watch('node.' + indeterminateAttr, function(newVal, oldVal) {
        element.find('input').prop('indeterminate', newVal);
      });

      scope.$watch('node.isBlocked', function(newVal, oldVal) {
        var blocked = newVal;

        if (scope.isSelected === true) {
          blocked = false;
        } else {
          if (undefined === newVal) {
            ivhTreeviewBfs(scope.trvw.root(), scope.trvw.opts(), function(n, p){
              if (scope.node[scope.trvw.opts().idAttribute] === n[scope.trvw.opts().idAttribute]) {
                if (p[0] && (p[0][scope.trvw.opts().selectedAttribute] || p[0][scope.trvw.opts().blockedAttribute])) {
                  scope.node[scope.trvw.opts().blockedAttribute] = true;
                  scope.isBlocked = true;
                  scope.node.isBlocked = true;
                }
              }
            });
          }
        }

        scope.node[scope.trvw.opts().blockedAttribute] = blocked;
        scope.isBlocked = blocked;
      });

    },
    template: [
      '<input type="checkbox"',
        'class="ivh-treeview-checkbox"',
        'ng-model="isSelected"',
        'ng-click="resolveIndeterminateClick()"',
        'ng-change="trvw.select(node, isSelected)" />'
    ].join('\n')
  };
}]);

