

ivh-treeview-mgr.js
120
removed call to ivhTreeviewBfs
this would cause the parent to be checked if all children are checked and all children to be checked if parent is checked
we do not want this functionality 





ivh-treeview-node.js
43
changed return getChildren().length > 0;
to  return !trvw.isLeaf(node);
this is so leaf status can be determined by property instead of if children = 0



ivh-treeview.js
338
changed return trvw.children(node).length === 0;
to return (node.hasOwnProperty(localOpts.leafAttribute)) ? node[localOpts.leafAttribute] : trvw.children(node).length === 0;
this is so leaf status can be determined by property instead of if children = 0


ivh-treeview-options.js
added leafAttribute

/**
     * Collection item attribute to use for determining if node is leaf or not.
     * If not specified then we will count the children to determine if leaf or not.
     */
    leafAttribute: 'leaf',