
/**
 * The iVantage Treeview module
 *
 * @package ivh.treeview
 */

angular.module('common.directives.treeview', [
    'common.directives.treeview.ivh-treeview',
    'common.directives.treeview.ivh-treeview-checkbox',
    'common.directives.treeview.ivh-treeview-checkbox-helper',
    'common.directives.treeview.ivh-treeview-children',
    'common.directives.treeview.ivh-treeview-node',
    'common.directives.treeview.ivh-treeview-toggle',
    'common.directives.treeview.ivh-treeview-twistie',
    'common.filters.treeview.ivh-treeview-as-array',
    'common.services.treeview.ivh-treeview-bfs',
    'common.services.treeview.ivh-treeview-compiler',
    'common.services.treeview.ivh-treeview-mgr',
    'common.services.treeview.ivh-treeview-options'
]);
