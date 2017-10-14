
/**
 * Global options for ivhTreeview
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('common.services.treeview.ivh-treeview-options', []).provider('ivhTreeviewOptions', function() {
  'use strict';

  var options = {
    /**
     * ID attribute
     *
     * For selecting nodes by identifier rather than reference
     */
    idAttribute: 'id',

    /**
     * Collection item attribute to use for labels
     */
    labelAttribute: 'label',

    /**
     * Collection item attribute to use for child nodes
     */
    childrenAttribute: 'children',

    /**
     * Collection item attribute to use for selected state
     */
    selectedAttribute: 'selected',

    /**
     * Collection item attribute to use for blocked state
     */
    blockedAttribute: 'blocked',

    /**
     * Collection item attribute to use for determining if node is leaf or not.
     * If not specified then we will count the children to determine if leaf or not.
     */
    leafAttribute: 'leaf',

    /**
     * Controls whether branches are initially expanded or collapsed
     *
     * A value of `0` means the tree will be entirely collapsd (the default
     * state) otherwise branches will be expanded up to the specified depth. Use
     * `-1` to have the tree entirely expanded.
     */
    expandToDepth: 0,

    /**
     * Whether or not to use checkboxes
     *
     * If `false` the markup to support checkboxes is not included in the
     * directive.
     */
    useCheckboxes: true,

    /**
     * Whether or not directive should validate treestore on startup
     */
    validate: true,

    /**
     * (internal) Collection item attribute to track intermediate states
     */
    indeterminateAttribute: '__ivhTreeviewIndeterminate',

    /**
     * (internal) Collection item attribute to track expanded status
     */
    expandedAttribute: '__ivhTreeviewExpanded',

    /**
     * Default selected state when validating
     */
    defaultSelectedState: true,

    /**
     * Template for expanded twisties
     */
    twistieExpandedTpl: '(-)',

    /**
     * Template for collapsed twisties
     */
    twistieCollapsedTpl: '(+)',

    /**
     * Template for leaf twisties (i.e. no children)
     */
    twistieLeafTpl: 'o',

    /**
     * Template for tree nodes
     */
    nodeTpl: [
      '<div class="ivh-treeview-node-content" title="{{trvw.label(node)}}" >',
        '<div ng-class="{\'highlight-nodelabel\': trvw.isSelected(node) && trvw.useHighlightSelected()}"  class="nodeview">',
          '<span class="twistie" ivh-treeview-toggle>',
            '<span class="ivh-treeview-twistie-wrapper" ivh-treeview-twistie></span>',
          '</span>',
          '<span class="ivh-treeview-checkbox-wrapper" ng-if="trvw.useCheckboxes()"',
              'ivh-treeview-checkbox>',
          '</span>',
          '<span class="ivh-treeview-node-label" ivh-treeview-toggle>',
            '{{trvw.label(node)}}',
          '</span>',
        '</div>',
        '<div ivh-treeview-children></div>',
      '</div>'
    ].join('\n')
  };

  /**
   * Update global options
   *
   * @param {Object} opts options object to override defaults with
   */
  this.set = function(opts) {
    angular.extend(options, opts);
  };

  this.$get = function() {
    /**
     * Get a copy of the global options
     *
     * @return {Object} The options object
     */
    return function() {
      return angular.copy(options);
    };
  };
});
