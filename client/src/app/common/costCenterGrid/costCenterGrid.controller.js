'use strict';

(function () {

    angular.module('common.cost.center.grid.controller', [])
        .controller('StgCostCenterGridController', ['$rootScope', '$scope', 'AdamsService', '$uibModalInstance', 'ModalDialogService', '$timeout', 'UtilsService', 'sourceSystemId',
            function($rootScope, $scope, AdamsService, $uibModalInstance, ModalDialogService, $timeout, UtilsService, sourceSystemId) {
                var stgCostCenterGridController = this,
                    searchProperty = "source_system_id";

                function initialize() {
                    stgCostCenterGridController.fields = 'cost_center, cost_center_description, cost_center_long_description, source_system_id, sector, division, region, complex';
                    stgCostCenterGridController.gridOptions = defineCostCenterSearchGridOptions();
                    stgCostCenterGridController.mySelectedRows = '';

                    if(sourceSystemId){
                        stgCostCenterGridController.searchPropertyValue = sourceSystemId;
                        stgCostCenterGridController.gridOptions.columnDefs[2].visible = false;
                    }
                }

                stgCostCenterGridController.getGridData = function(pageSize, pageNumber, sort, searchInput) {

                    if (!searchInput.search) {
                        searchInput.search = [];
                    }

                    // delete if exist
                    if(UtilsService.checkIfSearchObjectPresent(searchProperty, searchInput.search)){
                        var index = searchInput.search.findIndex(UtilsService.getSearchIndex, searchProperty);
                        searchInput.search.splice(index,1);
                    }

                    searchInput.search.push({
                        "property": searchProperty,
                        "value": !stgCostCenterGridController.searchPropertyValue ? '' : stgCostCenterGridController.searchPropertyValue,
                        "operator": ""
                    });

                    stgCostCenterGridController.search = searchInput;
                    return AdamsService.getCostCenterDetails(pageSize, pageNumber, sort, stgCostCenterGridController.search, stgCostCenterGridController.fields);
                };

                $scope.$on('uiGridSelectedRows', function ($event, mySelectedRows, selectionEvent, refId) {
                    stgCostCenterGridController.mySelectedRows = mySelectedRows;
                });
                
                stgCostCenterGridController.close = function() {
                    $uibModalInstance.dismiss('cancel');
                };

                stgCostCenterGridController.submit = function() {
                    $uibModalInstance.close(stgCostCenterGridController.mySelectedRows);
                };

                /** PRIVATE FUNCTIONS **/

                function defineCostCenterSearchGridOptions() {
                    return {
                        paginationPageSizes: [10, 20, 30],
                        paginationPageSize: 10, // pagination out of box
                        virtualizationThreshold: 10,
                        useExternalPagination: true,
                        useExternalFiltering: true,
                        enableFiltering: true, //step1 to enable all grid columns filtering
                        enableRowSelection: true,
                        enableRowHeaderSelection: false,
                        multiSelect: false,
                        modifierKeysToMultiSelect: false,
                        noUnselect: true,
                        showColumnFooter: false,
                        enableGridMenu: true, //true will display grid menu on top-right
                        enableSorting: true,
                        columnDefs: [
                            {   field: 'cost_center',
                                displayName: "Name",
                                filter: {
                                    placeholder: ''
                                }
                            },
                            {   field: 'cost_center_long_description',
                                displayName: "Description",
                                filter: {
                                    placeholder: ''
                                }
                            },
                            {   field: 'source_system_id',
                                filter: {
                                    placeholder: ''
                                }
                            },
                            {   field: 'sector',
                                filter: {
                                    placeholder: ''
                                },
                                visible: false
                            },
                            {   field: 'division',
                                filter: {
                                    placeholder: ''
                                },
                                visible: false
                            },
                            {   field: 'region',
                                filter: {
                                    placeholder: ''
                                },
                                visible: false
                            },
                            {   field: 'complex',
                                filter: {
                                    placeholder: ''
                                },
                                visible: false
                            }
                        ]
                    };
                }

                initialize();
            }
        ]);
})();