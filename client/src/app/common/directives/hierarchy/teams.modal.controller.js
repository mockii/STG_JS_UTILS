'use strict';

angular.module('common.directives.hierarchy.teams.controller', [])
    .controller('TeamsController', ['$rootScope', '$scope', 'SERVER_URL_SPACE', '$uibModal', '$uibModalInstance', 'TeamsService', 'RBACService', 'getGridTeamsFn', '$q',
        function ($rootScope, $scope, SERVER_URL_SPACE, $uibModal, $uibModalInstance, TeamsService, RBACService, getGridTeamsFn, $q) {
            var teamsController = this;

            function initialize() {

                teamsController.appName = $rootScope.applicationConfiguration.application.name;
                teamsController.roleName = RBACService.getCurrentRole().role_name;
                teamsController.searchTeamName = '';
                teamsController.searchTeamDescription = '';
                teamsController.searchTeamType = '';
                teamsController.mySelectedRows = [];
                teamsController.getGridTeamsFn = getGridTeamsFn();
                teamsController.gridOptions = defineTeamsSearchGridOptions();
            }

            teamsController.getGridData = function(pageSize, pageNumber, sort, searchInput) {

                teamsController.searchTeamName = getSearchValue(searchInput, "team_name");
                teamsController.searchTeamDescription = getSearchValue(searchInput, "team_description");
                teamsController.searchTeamType = getSearchValue(searchInput, "team_type_name");

                if (typeof(teamsController.getGridTeamsFn) === typeof(Function)) {

                    return teamsController.getGridTeamsFn(pageSize, pageNumber, sort,
                        teamsController.appName, teamsController.roleName,
                        teamsController.searchTeamName, teamsController.searchTeamDescription,
                        teamsController.searchTeamType);

                }
                else {
                    return TeamsService.getHierarchicalTeams(pageSize, pageNumber, teamsController.appName, teamsController.roleName,
                        teamsController.searchTeamName, teamsController.searchTeamDescription, teamsController.searchTeamType, sort);
                }
            };

            function getSearchValue(searchInput, propertyName){
                var value = "";
                if(searchInput && angular.isArray(searchInput.search)){
                    angular.forEach(searchInput.search, function(searchObject){
                        if(searchObject.property === propertyName){
                            value = searchObject.value || "";
                        }
                    });
                }
                return value;
            }
            
            teamsController.close = function() {
                $uibModalInstance.dismiss('cancel');
            };

            teamsController.submit = function() {
                $uibModalInstance.close(teamsController.mySelectedRows);
            };

            $scope.$on('uiGridLoadDetails', function ($event, gridOptions, gridApi) {
                // emitted gridOptions and gridApi from Directive controller
                teamsController.gridApi = gridApi;
            });

            $scope.$on('uiGridSelectedRows', function ($event, mySelectedRows, selectionEvent) {
                // emitted selected rows and rowselectionEvent from Directive controller
                if (selectionEvent) {
                    var elemClass = selectionEvent.target.className || selectionEvent.srcElement.className;

                    if(elemClass.includes("ui-grid-icon-plus-squared") || elemClass.includes("ui-grid-icon-minus-squared")) {
                        teamsController.gridApi.selection.unSelectRow(mySelectedRows[0]);
                    }
                    else {
                        teamsController.mySelectedRows = mySelectedRows;
                    }
                }
            });

            initialize();

            /** PRIVATE FUNCTIONS **/
            function defineTeamsSearchGridOptions() {
                return {
                    paginationPageSizes: [25, 50, 75],
                    paginationPageSize: 25, // pagination out of box
                    virtualizationThreshold: 25,
                    useExternalPagination: true,
                    useExternalFiltering: true,
                    enableFiltering: true, //step1 to enable all grid columns filtering
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    modifierKeysToMultiSelect: false,
                    noUnselect: false,
                    showColumnFooter: false,
                    treeRowHeaderAlwaysVisible: true,
                    enableGridMenu: true, //true will display grid menu on top-right
                    enableSorting: true,
                    enableExpandable: true,
                    enableExpandableRowHeader : true,
                    expandableRowTemplate: '<div team-display-path team-path="row.entity.team_display_path"></div>',
                    expandableRowHeight: 125,
                    //subGridVariable will be available in subGrid scope
                    expandableRowScope: {
                        subGridVariable: 'subGridScopeVariable'
                    },
                    columnDefs: [
                        {   field: 'team_name',
                            displayName: "Team Name",
                            filter: {
                                placeholder: ''
                            }
                        },
                        {   field: 'team_description',
                            displayName: "Description",
                            filter: {
                                placeholder: ''
                            }
                        },
                        {   field: 'team_type_name',
                            displayName: "Type",
                            filter: {
                                placeholder: ''
                            }
                        }
                    ]
                };
            }

        }
    ]);
