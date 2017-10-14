
/**
 * Wrapper for a checkbox directive
 *
 * Basically exists so folks creeting custom node templates don't need to attach
 * their node to this directive explicitly - i.e. keeps consistent interface
 * with the twistie and toggle directives.
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('common.directives.treeview.ivh-treeview-checkbox', []).directive('ivhTreeviewCheckbox', [function() {
  'use strict';
  return {
    restrict: 'AE',
    require: '^ivhTreeview',
    template: '<span ng-show="node.isBlocked" class="glyphicon glyphicon-ok-circle blocked-checkbox"></span><span ng-hide="node.isBlocked" ivh-treeview-checkbox-helper="node"></span>'
  };
}]);
