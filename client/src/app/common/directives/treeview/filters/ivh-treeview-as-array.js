
angular.module('common.filters.treeview.ivh-treeview-as-array', []).filter('ivhTreeviewAsArray', function() {
  'use strict';
  return function(arr) {
    if(!angular.isArray(arr) && angular.isObject(arr)) {
      return [arr];
    }
    return arr;
  };
});
