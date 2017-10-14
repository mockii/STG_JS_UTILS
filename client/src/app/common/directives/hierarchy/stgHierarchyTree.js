'use strict';


angular.module('common.directives.hierarchy.STGHierarchyTree', [
    'common.directives.treeview'
])
    .config(['ivhTreeviewOptionsProvider',
        function(ivhTreeviewOptionsProvider) {

            ivhTreeviewOptionsProvider.set(
                {
                    idAttribute: 'id',
                    labelAttribute: 'team_display_name',
                    childrenAttribute: 'children',
                    selectedAttribute: 'selected',
                    defaultSelectedState: false,
                    validate: false,
                    twistieCollapsedTpl: '<span class="fa fa-angle-right"></span>',
                    twistieExpandedTpl: '<span class="fa fa-caret-down"></span>',
                    twistieLeafTpl: ''
                }
            );
        }
    ])

    .controller('STGHierarchyTreeController', ['$rootScope', '$scope', 'ivhTreeviewMgr', 'ivhTreeviewBfs', 'ivhTreeviewOptions', 'RBACService', 'UtilsService', 'STGHierarchyTreeService',
        function ($rootScope, $scope, ivhTreeviewMgr, ivhTreeviewBfs, ivhTreeviewOptions, RBACService, UtilsService, STGHierarchyTreeService) {
            var hirTreeCtrl = this,
                treeOpts = ivhTreeviewOptions();

            function initialize() {

                //setup default values
                $scope.refId = ($scope.refId) ? $scope.refId : 'treeview-'+Date.now();
                $scope.fetchChildrenEveryTime = $scope.fetchChildrenEveryTime ? UtilsService.convertToBoolean($scope.fetchChildrenEveryTime) : false;
                $scope.enableMultiSelect = $scope.enableMultiSelect ? UtilsService.convertToBoolean($scope.enableMultiSelect) : false;
                $scope.selectGlobalSelectedTeamByDefault = $scope.selectGlobalSelectedTeamByDefault ? UtilsService.convertToBoolean($scope.selectGlobalSelectedTeamByDefault) : false;
                $scope.broadcastEmptySelection = $scope.broadcastEmptySelection ? UtilsService.convertToBoolean($scope.broadcastEmptySelection) : false;
                $scope.blockChildrenOnParentSelect = $scope.blockChildrenOnParentSelect ? UtilsService.convertToBoolean($scope.blockChildrenOnParentSelect) : true;

                $scope.disableTreeToggle = $scope.disableTreeToggle ? UtilsService.convertToBoolean($scope.disableTreeToggle) : false;
                if ($scope.disableTreeToggle === true) {
                    $scope.treeviewOptions = {
                        twistieCollapsedTpl: '<span></span>',
                        twistieExpandedTpl: '<span></span>',
                        twistieLeafTpl: '<span></span>',
                        expandToDepth: $scope.expandToDepth
                    };
                }
                
                $scope.treeData = STGHierarchyTreeService.getCurrentTeams($scope.selectGlobalSelectedTeamByDefault);
                $scope.getChildTeamsFn = $scope.getChildTeamsFn();
                $scope.useCustomGetChildTeamsFunction = $scope.getChildTeamsFn ? true : false;

                //set scope items onto controller
                hirTreeCtrl.refId = $scope.refId;
                hirTreeCtrl.fetchChildrenEveryTime = $scope.fetchChildrenEveryTime;
                hirTreeCtrl.enableMultiSelect = $scope.enableMultiSelect;
                hirTreeCtrl.selectGlobalSelectedTeamByDefault = $scope.selectGlobalSelectedTeamByDefault;
                hirTreeCtrl.broadcastEmptySelection = $scope.broadcastEmptySelection;
                hirTreeCtrl.blockChildrenOnParentSelect = $scope.blockChildrenOnParentSelect;
                hirTreeCtrl.disableTreeToggle = $scope.disableTreeToggle;
                hirTreeCtrl.treeviewOptions = $scope.treeviewOptions;
                hirTreeCtrl.expandToDepth = $scope.expandToDepth || 1;

                if ($scope.selectGlobalSelectedTeamByDefault === true || $scope.selectGlobalSelectedTeamByDefault === "true") {
                    hirTreeCtrl.selectedTeam = $rootScope.selectedTeam;
                    hirTreeCtrl.selectedTeamDisplayName = ($rootScope.selectedTeam) ? $rootScope.selectedTeam.team_name + ' - ' + $rootScope.selectedTeam.team_description : 'No Teams Available';
                }

                hirTreeCtrl.treeData = $scope.treeData;
                if(hirTreeCtrl.treeData && hirTreeCtrl.expandToDepth) {
                    hirTreeCtrl.expand(hirTreeCtrl.treeData[0], hirTreeCtrl.expandToDepth);
                }
            }


            /**
             *
             * @param node
             * @param isExpanded
             * @param tree
             * @returns {*}
             */
            hirTreeCtrl.treeviewOnToggle = function(node, isExpanded, tree) {
                if (isExpanded) {
                    return STGHierarchyTreeService.getChildrenForNode($scope, node).then(
                        function(childTeams){
                            node[treeOpts.childrenAttribute] = childTeams;
                        },
                        function(error){
                            throw new Error('An error occurred while fetching child teams for ' + node.team_name);
                        });
                }
            };


            /**
             * Recursively Gets children of the parent node to a given depth level.
             *
             * @param node
             * @param depthLevel
             * @returns {*}
             */
            hirTreeCtrl.expand = function(node, depthLevel) {
                if(depthLevel === 0) {
                    return;
                }

                STGHierarchyTreeService.getChildrenForNode($scope, node).then(
                    function(childTeams){
                        node[treeOpts.childrenAttribute] = childTeams;
                        depthLevel--;
                        hirTreeCtrl.expand(childTeams[0], depthLevel);
                    },
                    function(error){
                        throw new Error('An error' + error + ' occurred while fetching child teams for ' + node.team_name);
                    });
            };


            /**
             *
             * @param node
             * @param isSelected
             * @param tree
             */
            hirTreeCtrl.treeviewSelectionChange = function(node, isSelected, tree) {
                //set selection for the current node
                ivhTreeviewMgr.select(tree, node, treeOpts, isSelected);

                if (isSelected) {
                    ivhTreeviewMgr.validateSelectionChange(tree, node, treeOpts, $scope.enableMultiSelect);
                }

                if ($scope.blockChildrenOnParentSelect === true || $scope.blockChildrenOnParentSelect === "true") {
                    hirTreeCtrl.blockChildrenForSelect(tree, node, isSelected);
                }

                $scope.$emit('hierarchyTreeTeamSelectionChange', $scope.refId, isSelected, node);
            };


            hirTreeCtrl.blockChildrenForSelect = function(tree, node, blocked) {
                //traverse child nodes and block/unblock children as needed
                ivhTreeviewBfs(node, treeOpts, function(n){
                    //check to ensure we are not evaluating the top level node
                    if (n[treeOpts.idAttribute] !== node[treeOpts.idAttribute]) {
                        n.isBlocked=blocked;
                    }
                });
            };


            hirTreeCtrl.getSelectedTeams = function() {
                var selectedTeams = [];

                //traverse the entire tree and find all selected nodes
                ivhTreeviewBfs(hirTreeCtrl.treeData, treeOpts, function(node){
                    if (node[treeOpts.selectedAttribute] === true) {
                        selectedTeams.push(node);
                    }
                });

                return selectedTeams;
            };


            /**
             * Listen for changes to RBAC profile so we can update the treedata with the new teams list
             */
            $scope.$on('rbacProfileChanged', function(){
                $scope.treeData = STGHierarchyTreeService.getCurrentTeams($scope.selectGlobalSelectedTeamByDefault);
                hirTreeCtrl.treeData = $scope.treeData;
                $scope.$ctrl.treeData = $scope.treeData;

                if ($scope.selectGlobalSelectedTeamByDefault === true || $scope.selectGlobalSelectedTeamByDefault === "true") {
                    var selectedTeam = RBACService.getSelectedTeam();
                    hirTreeCtrl.selectedTeam = selectedTeam;
                    hirTreeCtrl.selectedTeamDisplayName = (selectedTeam) ? selectedTeam.team_name + ' - ' + selectedTeam.team_description : 'No Teams Available';
                }

                if(hirTreeCtrl.treeData && hirTreeCtrl.expandToDepth) {
                    hirTreeCtrl.expand(hirTreeCtrl.treeData[0], hirTreeCtrl.expandToDepth);
                }
            });

            /**
             * Listen for a call to deselect all currently selected nodes
             */
            $scope.$on('treeviewDeselectAll', function(event, refId) {
                if (refId === $scope.refId) {
                    ivhTreeviewMgr.deselectAll($scope.treeData);
                }
            });


            initialize();
        }])

    .factory('STGHierarchyTreeService', ['$q', '$http', '$filter', 'ivhTreeviewOptions', 'RBACService', 'SERVER_URL_SPACE',
        function ($q, $http, $filter, ivhTreeviewOptions, RBACService, SERVER_URL_SPACE) {

            var treeOpts = ivhTreeviewOptions();

            function getCurrentTeams(selectGlobalSelectedTeamByDefault) {
                var teams = angular.copy(formatTeamDataForHierarchyTree(RBACService.getTeams()));

                if (selectGlobalSelectedTeamByDefault === true || selectGlobalSelectedTeamByDefault === "true") {
                    teams = selectCurrentTeam(teams);
                }

                return teams;
            }

            function getChildrenForNode($scope, node) {
                var deferred = $q.defer(),
                    fetchChildrenEveryTime = $scope.fetchChildrenEveryTime,
                    teamName = node.team_name,
                    sourceSystemId = node.source_system_id,
                    url = SERVER_URL_SPACE.urls.local.childrenForTeam.replace('{teamName}', teamName).replace('{sourceSystemId}', sourceSystemId);

                //if the node doesn't current have any children the call API to load them
                if (fetchChildrenEveryTime === true || node[treeOpts.childrenAttribute].length === 0) {
                    //check to see if custom function was provided for getting child teams
                    if ($scope.useCustomGetChildTeamsFunction) {
                        $scope.getChildTeamsFn($scope, node).then(function (customChildren) {
                            var customChildrenTeams = formatTeamDataForHierarchyTree(customChildren);
                            deferred.resolve(customChildrenTeams);
                        }, function () {
                            deferred.reject('An error occurred getting child teams for team ' + teamName);
                        });
                    } else {
                        $http.get(url).then(function (response) {
                            var childTeams = formatTeamDataForHierarchyTree(response.data);
                            deferred.resolve(childTeams);
                        }, function () {
                            deferred.reject('An error occurred getting child teams for team ' + teamName);
                        });
                    }
                } else {
                    //children already exist so I will just return the existing children
                    deferred.resolve(node[treeOpts.childrenAttribute]);
                }

                return deferred.promise;
            }

            function formatTeamDataForHierarchyTree(teams) {
                var orderedTeams;
                if (teams) {
                    for (var i=0; i < teams.length; i++) {
                        var team = teams[i],
                            teamType = team.team_type_description || team.team_type_name || team.team_type || '';
                        team[treeOpts.labelAttribute] = team.team_name + ' - ' + team.team_description;
                        team[treeOpts.childrenAttribute] = [];

                        //sync id
                        if (team.hasOwnProperty('adams_id')) {
                            team[treeOpts.idAttribute] = team.adams_id;
                        }
                        
                        //TODO: refactor this once ADAMS updates the API to include indicator for has children
                        team.leaf = ('UNIT' === teamType.toUpperCase()) ? true : false;
                    }

                    //order teams by team name
                    orderedTeams = $filter('orderBy')(teams, 'team_name');
                }

                return orderedTeams;
            }

            function selectCurrentTeam(teams) {
                var selectedTeam = RBACService.getSelectedTeam();
                if (teams && selectedTeam) {
                    for (var i=0; i<teams.length; i++) {
                        if (teams[i].team_name === selectedTeam.team_name) {
                            teams[i][treeOpts.selectedAttribute] = true;
                            break;
                        }
                    }
                }

                return teams;
            }

            return {
                getCurrentTeams : getCurrentTeams,
                getChildrenForNode : getChildrenForNode
            };
        }])

    .directive('stgHierarchyTree', [function() {
        return {
            restrict: 'EA',
            scope: {
                refId: "=",
                fetchChildrenEveryTime: "=",
                enableMultiSelect: "=",
                broadcastEmptySelection: "=",
                selectGlobalSelectedTeamByDefault: "=",
                blockChildrenOnParentSelect: "=",
                disableTreeToggle: "=",
                getChildTeamsFn: "&",
                treeviewOptions: "=",
                expandToDepth: "="
            },
            require: '^?stgHierarchySelectButton',
            templateUrl: 'common/directives/hierarchy/stgHierarchyTree.tpl.html',
            controller: 'STGHierarchyTreeController as hirTreeCtrl',
            link: function($scope, $element, $attrs, $ctrl, $transclude) {
                if($ctrl) {
                    $ctrl.treeData = $scope.treeData;
                    $scope.$ctrl = $ctrl;
                }
            }
        };
    }])

;
