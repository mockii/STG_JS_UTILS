'use strict';

angular.module('common.directives.hierarchy.STGHierarchySelectButton', ['common.directives.hierarchy.teams.controller'])
    .controller('STGHierarchySelectButtonController', ['$rootScope', '$scope', 'ivhTreeviewBfs', 'ivhTreeviewOptions', 'RBACService', '$uibModal',
        function ($rootScope, $scope, ivhTreeviewBfs, ivhTreeviewOptions, RBACService, $uibModal) {
            var hirSelectBtnCtrl = this,
                treeOpts = ivhTreeviewOptions();

            function initialize() {
                //set scope items onto controller
                hirSelectBtnCtrl.refId = $scope.refId;
                hirSelectBtnCtrl.fetchChildrenEveryTime = $scope.fetchChildrenEveryTime;
                hirSelectBtnCtrl.enableMultiSelect = $scope.enableMultiSelect;
                hirSelectBtnCtrl.selectGlobalSelectedTeamByDefault = $scope.selectGlobalSelectedTeamByDefault;
                hirSelectBtnCtrl.broadcastEmptySelection = $scope.broadcastEmptySelection;
                hirSelectBtnCtrl.syncGlobalTeamSelectionOnClose = $scope.syncGlobalTeamSelectionOnClose;
                hirSelectBtnCtrl.blockChildrenOnParentSelect = $scope.blockChildrenOnParentSelect;
                hirSelectBtnCtrl.disableTreeToggle = $scope.disableTreeToggle;
                hirSelectBtnCtrl.treeviewOptions = $scope.treeviewOptions;
                hirSelectBtnCtrl.getChildTeamsFn = $scope.getChildTeamsFn;
                hirSelectBtnCtrl.getGridTeamsFn = $scope.getGridTeamsFn;
                hirSelectBtnCtrl.treeViewSelected = true;

                if ($scope.selectGlobalSelectedTeamByDefault === true || $scope.selectGlobalSelectedTeamByDefault === "true") {
                    hirSelectBtnCtrl.selectedTeam = $rootScope.selectedTeam;
                    hirSelectBtnCtrl.selectedTeamDisplayName = ($rootScope.selectedTeam) ? $rootScope.selectedTeam.team_name + ' - ' + $rootScope.selectedTeam.team_description : 'No Teams Available';
                }
            }

            hirSelectBtnCtrl.openTeamsModal = function() {
                var modalInstance = $uibModal.open({
                    templateUrl: 'common/directives/hierarchy/teams-modal.tpl.html',
                    controller: 'TeamsController as teamsController',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        getGridTeamsFn: function() {
                            return hirSelectBtnCtrl.getGridTeamsFn;
                        }
                    }
                });
                
                modalInstance.result.then(function (selectedTeams) {
                    //traverse the entire tree and unselect any selected nodes
                    ivhTreeviewBfs(hirSelectBtnCtrl.treeData, treeOpts, function(node){
                        if (node[treeOpts.selectedAttribute] === true) {
                            node[treeOpts.selectedAttribute] = false;
                        }
                    });

                    hirSelectBtnCtrl.treeViewSelected = false;
                    if (selectedTeams.length > 0 || $scope.broadcastEmptySelection === true) {
                        $scope.$emit('hierarchyTreeTeamSelectionChange', hirSelectBtnCtrl.refId, true, selectedTeams[0]);
                        $rootScope.$broadcast('hierarchySelectionButtonMenuClosed', hirSelectBtnCtrl.refId, selectedTeams[0]);

                        //if we need to sync global selection and there was a selection change the sync global
                        if (($scope.syncGlobalTeamSelectionOnClose === true || $scope.syncGlobalTeamSelectionOnClose === 'true') && selectedTeams.length === 1) {
                            var selectedTeam = selectedTeams[0],
                                selectedTeamName = selectedTeam.team_name,
                                currentTeamName = RBACService.getSelectedTeamName();
                            if (selectedTeam && selectedTeamName !== currentTeamName) {
                                RBACService.switchSelectedTeam(selectedTeam);
                            }
                        } else {
                            //otherwise broadcast the selected teams so others can do something with this information
                            if (selectedTeams.length > 0 || $scope.broadcastEmptySelection === true) {
                                $rootScope.$broadcast('hierarchySelectionButtonMenuClosed', $scope.refId, selectedTeams);
                            }
                        }

                        if (($scope.enableMultiSelect === false || $scope.enableMultiSelect === 'false') && selectedTeams.length === 1) {
                            hirSelectBtnCtrl.selectedTeam = selectedTeams[0];
                            hirSelectBtnCtrl.selectedTeamDisplayName = selectedTeams[0].team_name + ' - ' + selectedTeams[0].team_description;
                        }
                    }
                }, function () {
                    hirSelectBtnCtrl.treeViewSelected = false;
                });
            };
            
            
            /**
             *
             */
            hirSelectBtnCtrl.handleSelectedTeams = function() {
                var selectedTeams = [];
                
                //traverse the entire tree and find all selected nodes
                ivhTreeviewBfs(hirSelectBtnCtrl.treeData, treeOpts, function(node){
                    if (node[treeOpts.selectedAttribute] === true) {
                        selectedTeams.push(node);
                    }                    
                });

                //if we need to sync global selection and there was a selection change the sync global
                if (($scope.syncGlobalTeamSelectionOnClose === true || $scope.syncGlobalTeamSelectionOnClose === 'true') && selectedTeams.length === 1) {
                    var selectedTeam = selectedTeams[0],
                        selectedTeamName = selectedTeam.team_name,
                        currentTeamName = RBACService.getSelectedTeamName();
                    if (selectedTeam && selectedTeamName !== currentTeamName) {
                        RBACService.switchSelectedTeam(selectedTeam);
                    }
                } else {
                    //otherwise broadcast the selected teams so others can do something with this information
                    if (selectedTeams.length > 0 || $scope.broadcastEmptySelection === true) {
                       $rootScope.$broadcast('hierarchySelectionButtonMenuClosed', $scope.refId, selectedTeams);
                    }
                }
                
                //if multi select is not enabled then update the display name
                if (($scope.enableMultiSelect === false || $scope.enableMultiSelect === 'false') && selectedTeams.length === 1 && hirSelectBtnCtrl.treeViewSelected) {
                    hirSelectBtnCtrl.selectedTeam = selectedTeams[0];
                    hirSelectBtnCtrl.selectedTeamDisplayName = selectedTeams[0].team_name + ' - ' + selectedTeams[0].team_description;
                }
                hirSelectBtnCtrl.treeViewSelected = true;
            };

            /**
             * Listen for dropdown menu to close and then deal with the selected team
             */
            $scope.$on('menuClosed', function(){
                hirSelectBtnCtrl.handleSelectedTeams();
            });

            /**
             * Listen for RBAC profile changes so we can updated the selected team
             */
            $scope.$on('rbacProfileChanged', function(){
                if ($scope.selectGlobalSelectedTeamByDefault === true || $scope.selectGlobalSelectedTeamByDefault === "true") {
                    var selectedTeam = RBACService.getSelectedTeam();
                    hirSelectBtnCtrl.selectedTeam = selectedTeam;
                    hirSelectBtnCtrl.selectedTeamDisplayName = (selectedTeam) ? selectedTeam.team_name + ' - ' + selectedTeam.team_description : 'No Teams Available';
                }
            });

            initialize();
        }])

    .directive('stgHierarchySelectButton', [function() {
        return {
            restrict: 'EA',
            scope: {
                refId: "@",
                fetchChildrenEveryTime: "@",
                enableMultiSelect: "@",
                broadcastEmptySelection: "@",
                selectGlobalSelectedTeamByDefault: "@",
                syncGlobalTeamSelectionOnClose: "@",
                blockChildrenOnParentSelect: "@",
                disableTreeToggle: "@",
                getChildTeamsFn: "&",
                getGridTeamsFn: "&",
                treeviewOptions: "="
            },
            templateUrl: 'common/directives/hierarchy/stgHierarchySelectButton.tpl.html',
            controller: 'STGHierarchySelectButtonController as hirSelectBtnCtrl',
            link: function($scope, $element) {
                $element.bind('hide.bs.dropdown', function(){
                    $scope.$broadcast('menuClosed');
                });

                $scope.$on('hierarchyTreeTeamSelectionChange', function(event, refId, isSelected, node){
                    if ($scope.enableMultiSelect === false || $scope.enableMultiSelect === 'false') {
                        $element.find('.dropdown-toggle').dropdown('toggle');
                    }
                });
            }
        };
    }])

;
