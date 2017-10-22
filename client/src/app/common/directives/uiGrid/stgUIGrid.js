'use strict';

angular.module('common.directives.STGUIGrid', [])
    .controller('STGUIGridController', ['$rootScope', '$scope', 'STG_CONSTANTS', '$timeout', 'ModalDialogService', '$interval', '$log',
        function ($rootScope, $scope, STG_CONSTANTS, $timeout, ModalDialogService, $interval, $log) {
            var stgUIGridCtrl = this,
                searchGridPromise;

            function initialize() {
                //set scope items onto controller
                stgUIGridCtrl.refId = $scope.refId;
                stgUIGridCtrl.gridOptionsData = $scope.getGridOptions;
                stgUIGridCtrl.getGridDataFn = $scope.getGridData();
                stgUIGridCtrl.noRecordsFound = false;

                defineSearchGridOptions();

                stgUIGridCtrl.paginationOptions = {
                    pageSize: stgUIGridCtrl.gridOptionsData.paginationPageSize || STG_CONSTANTS.UI_GRID.LIMIT,
                    pageNumber: STG_CONSTANTS.UI_GRID.PAGE_NO,
                    sort: null
                };

                stgUIGridCtrl.sort = '';
                stgUIGridCtrl.searchInput = {};

                stgUIGridCtrl.callPagination = true;
                
                stgUIGridCtrl.gridOptions.onRegisterApi = function(gridApi){
                    stgUIGridCtrl.gridApi = gridApi;

                    stgUIGridCtrl.gridApi.selection.on.rowSelectionChanged($scope,function(row, event){
                        handleRowSelectionChange(event);
                    });

                    stgUIGridCtrl.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                        if (stgUIGridCtrl.gridOptions.useExternalSorting) {
                            handleSortChange(grid, sortColumns);
                        }                        
                    });

                    stgUIGridCtrl.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        if (stgUIGridCtrl.callPagination && stgUIGridCtrl.gridOptions.useExternalPagination) {
                            handlePaginationChange(newPage, pageSize);
                        }
                    });

                    stgUIGridCtrl.gridApi.core.on.filterChanged( $scope, function() {
                        if (stgUIGridCtrl.gridOptions.useExternalFiltering) {
                            handleFilterChange($scope, this.grid);    
                        }                        
                    });
                };
                
                stgUIGridCtrl.getGridData();
                
            }

            stgUIGridCtrl.getGridData = function() {
                stgUIGridCtrl.showLoading = true;
                stgUIGridCtrl.noRecordsFound = false;
                stgUIGridCtrl.gridOptions.data = [];
                if (searchGridPromise) {
                    searchGridPromise.abort();
                }

                searchGridPromise =  stgUIGridCtrl.getGridDataFn(stgUIGridCtrl.paginationOptions.pageSize,
                    stgUIGridCtrl.paginationOptions.pageNumber,
                    stgUIGridCtrl.sort,
                    stgUIGridCtrl.searchInput);

                searchGridPromise.then(
                    function(response) {
                        stgUIGridCtrl.isValidResponse(response);
                        stgUIGridCtrl.setGridTotalItems(response);
                        stgUIGridCtrl.checkPaginationShowLoadingSpinner(response);
                        stgUIGridCtrl.setGridResponse(response);
                    }, function (error) {
                        stgUIGridCtrl.callPagination = true;
                        stgUIGridCtrl.resetTotalItems = true;
                        stgUIGridCtrl.showLoading = false;
                        stgUIGridCtrl.noRecordsFound = true;
                        $log.error("An error occurred while getting data. " + error);
                        stgUIGridCtrl.gridOptions.data = [];
                        stgUIGridCtrl.errorMessage = "An error occurred while getting data.";
                        stgUIGridCtrl.errorHandling(stgUIGridCtrl.errorMessage);
                        throw "An error occurred while getting data. " + error;
                    }
                );
            };

            /* Ensuring response is valid.*/
            stgUIGridCtrl.isValidResponse = function(response){
                if(!response) {
                    stgUIGridCtrl.noRecordsFound = true;
                    $log.error('Response not received. ' + response);
                }
                else if(!angular.isArray(response.data) || !response.data){
                    stgUIGridCtrl.noRecordsFound = true;
                    $log.error('Response data is not of type array.' + response);
                }
                else if(response && response.data && angular.isArray(response.data) && response.data.length === 0 &&
                        response.metadata && response.metadata.http_status_code === '200' && response.metadata.resultCount === "0"){
                    stgUIGridCtrl.noRecordsFound = true;
                    $log.error('Response data is an empty array.' + response);
                }
                else {
                    stgUIGridCtrl.showLoading = false;
                    $log.info("Is response valid: " + response.hasOwnProperty("metadata") && response.hasOwnProperty("data"));
                }

                if ((response.data && response.data.length === 0 && response.metadata && response.metadata.http_status_code !== '200') ||
                    (response.data === '{}' && response.error && response.error.userErrorMessage && response.error.userErrorMessage.httpStatus !== '404')) {
                    stgUIGridCtrl.noRecordsFound = true;
                    stgUIGridCtrl.gridOptions.totalItems = 0;
                    stgUIGridCtrl.gridOptions.data = [];

                    if (response.error.userErrorMessage.httpStatus !== '404') {
                        $timeout(function() {
                            stgUIGridCtrl.noRecordsFound = true;
                            stgUIGridCtrl.errorMessage = 'An error occurred while getting data';
                            stgUIGridCtrl.errorHandling(stgUIGridCtrl.errorMessage);
                        }, 500);
                    }

                }
            };

            stgUIGridCtrl.setGridTotalItems = function(response) {
                if (response.metadata && (response.metadata.http_status_code === '200' || response.metadata.http_status_code === 'OK')){
                    if ((!stgUIGridCtrl.gridOptions.totalItems) || (!stgUIGridCtrl.gridOptions.totalItems &&
                        stgUIGridCtrl.gridOptions.totalItems < 1 && stgUIGridCtrl.callPagination) || stgUIGridCtrl.resetTotalItems) {
                        stgUIGridCtrl.gridOptions.totalItems = response.metadata ? response.metadata.resultCount : 0;
                    }
                    stgUIGridCtrl.gridOptions.data = response.data || [];
                    stgUIGridCtrl.loadDetails();
                }
            };

            stgUIGridCtrl.checkPaginationShowLoadingSpinner = function(response) {
                stgUIGridCtrl.showLoading = (response.data && response.data.http_status === 400) || (response.metadata) ? false : true;
            };

            stgUIGridCtrl.setGridResponse = function(response){
                stgUIGridCtrl.callPagination = true;
                stgUIGridCtrl.resetTotalItems = true;
                //adding interval for onRegisterApi event to fire before emitting the gridApi details.
                $interval( function() {
                    $scope.$emit('uiGridLoadDetails', stgUIGridCtrl.gridOptions, stgUIGridCtrl.gridApi, $scope.refId);
                }, 1, 1);

            };

            stgUIGridCtrl.loadDetails = function() {
                if (stgUIGridCtrl.gridOptions.autoRowSelection) {
                    // $interval whilst we wait for the grid to digest the data we just gave it
                    $interval( function() {
                        stgUIGridCtrl.gridApi.selection.selectRow(stgUIGridCtrl.gridOptions.data[0]);
                    }, 0, 1);
                }
            };

            $scope.$on('uiGridParameterChange', function ($event, refId) {
                if (refId === $scope.refId || typeof refId === 'undefined') {
                    resetPagination();
                    stgUIGridCtrl.getGridData();
                    if (typeof refId === 'undefined') {
                        $log.info('RefId is undefined, If you are needing to support mutliple grid in same page, RefId is required in the broadcast. Please refer to STG UI Grid Documentation.');    
                    }
                }
            });

            stgUIGridCtrl.errorHandling = function(errorMessage) {
                ModalDialogService.confirm({
                    bodyText: errorMessage,
                    title: 'Error Message',
                    okText: 'Ok'
                });
            };
            
            function handleRowSelectionChange(selectionEvent) {
                //Do something when a row is selected
                stgUIGridCtrl.mySelectedRows = stgUIGridCtrl.gridApi.selection.getSelectedRows();
                $scope.$emit('uiGridSelectedRows', stgUIGridCtrl.mySelectedRows, selectionEvent, $scope.refId);
            }

            function handleSortChange(grid, sortColumns) {
                var gridSorts = {'sorts': []};

                if (sortColumns.length === 0) {
                    stgUIGridCtrl.paginationOptions.sort = null;
                    stgUIGridCtrl.sort = '';
                } else {
                    for (var j = 0; j < sortColumns.length; j++) {
                        gridSorts.sorts.push({direction: sortColumns[j].sort.direction,
                            property: sortColumns[j].name});
                    }
                    stgUIGridCtrl.sort = JSON.stringify(gridSorts);
                }
                resetPagination();
                stgUIGridCtrl.getGridData();
            }

            function handlePaginationChange(newPage, pageSize) {
                stgUIGridCtrl.paginationOptions.pageNumber = newPage;
                stgUIGridCtrl.paginationOptions.pageSize = pageSize;
                stgUIGridCtrl.gridOptions.virtualizationThreshold =  stgUIGridCtrl.gridOptions.paginationPageSize;

                if (angular.isDefined($scope.filterTimeout)) {
                    $timeout.cancel($scope.filterTimeout);
                }
                $scope.filterTimeout = $timeout(function(){
                    stgUIGridCtrl.resetTotalItems = false;
                    stgUIGridCtrl.getGridData();
                },500);                
            }

            function handleFilterChange($scope, grid) {
                stgUIGridCtrl.searchInput = {};
                stgUIGridCtrl.searchInput.search = [];

                if(grid && grid.columns){
                    for(var i = 0; i < grid.columns.length; i++){
                        if (grid.columns[i].filters[0].hasOwnProperty('term') &&
                            grid.columns[i].filters[0].term !== null &&
                            grid.columns[i].filters[0].term !== '') {
                            stgUIGridCtrl.searchInput.search.push({
                                "property": grid.columns[i].field,
                                "value": grid.columns[i].filters[0].term,
                                "operator": ""
                            });
                        }
                    }
                }

                if (angular.isDefined($scope.filterTimeout)) {
                    $timeout.cancel($scope.filterTimeout);
                }
                $scope.filterTimeout = $timeout(function(){
                    resetPagination();
                    stgUIGridCtrl.getGridData();
                },500);
            }

            function resetPagination() {
                stgUIGridCtrl.paginationOptions.pageNumber = STG_CONSTANTS.UI_GRID.PAGE_NO;
                stgUIGridCtrl.gridOptions.paginationCurrentPage =  STG_CONSTANTS.UI_GRID.PAGE_NO;
                stgUIGridCtrl.callPagination = false;
                stgUIGridCtrl.resetTotalItems = true;
            }

            function defineSearchGridOptions() {
                stgUIGridCtrl.gridOptions = stgUIGridCtrl.gridOptionsData;

                stgUIGridCtrl.gridOptions.paginationPageSizes = stgUIGridCtrl.gridOptionsData.paginationPageSizes || [25, 50, 75];
                stgUIGridCtrl.gridOptions.paginationPageSize = stgUIGridCtrl.gridOptionsData.paginationPageSize || 25;
                stgUIGridCtrl.gridOptions.virtualizationThreshold = stgUIGridCtrl.gridOptionsData.virtualizationThreshold || 25;
                stgUIGridCtrl.gridOptions.useExternalPagination = setDefaultValue(stgUIGridCtrl.gridOptionsData.useExternalPagination);
                stgUIGridCtrl.gridOptions.useExternalFiltering = setDefaultValue(stgUIGridCtrl.gridOptionsData.useExternalFiltering);
                stgUIGridCtrl.gridOptions.useExternalSorting = setDefaultValue(stgUIGridCtrl.gridOptionsData.useExternalSorting);
                stgUIGridCtrl.gridOptions.autoRowSelection = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.autoRowSelection);
                stgUIGridCtrl.gridOptions.enableFiltering = setDefaultValue(stgUIGridCtrl.gridOptionsData.enableFiltering);
                stgUIGridCtrl.gridOptions.enableRowSelection = setDefaultValue(stgUIGridCtrl.gridOptionsData.enableRowSelection);
                stgUIGridCtrl.gridOptions.enableRowHeaderSelection = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.enableRowHeaderSelection);
                stgUIGridCtrl.gridOptions.multiSelect = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.multiSelect);
                stgUIGridCtrl.gridOptions.modifierKeysToMultiSelect = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.modifierKeysToMultiSelect);
                stgUIGridCtrl.gridOptions.noUnselect = setDefaultValue(stgUIGridCtrl.gridOptionsData.noUnselect);
                stgUIGridCtrl.gridOptions.showColumnFooter = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.showColumnFooter);
                stgUIGridCtrl.gridOptions.treeRowHeaderAlwaysVisible = setDefaultValue(stgUIGridCtrl.gridOptionsData.treeRowHeaderAlwaysVisible);
                stgUIGridCtrl.gridOptions.enableGridMenu = setDefaultValue(stgUIGridCtrl.gridOptionsData.enableGridMenu); //true will display grid menu on top-right
                stgUIGridCtrl.gridOptions.enableSorting = setDefaultValue(stgUIGridCtrl.gridOptionsData.enableSorting);
                
                stgUIGridCtrl.gridOptions.enableExpandable = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.enableExpandable);
                stgUIGridCtrl.gridOptions.enableExpandableRowHeader = setDefaultValueToFalse(stgUIGridCtrl.gridOptionsData.enableExpandableRowHeader);
                stgUIGridCtrl.gridOptions.expandableRowTemplate = stgUIGridCtrl.gridOptionsData.expandableRowTemplate || '';
                stgUIGridCtrl.gridOptions.expandableRowHeight = stgUIGridCtrl.gridOptionsData.expandableRowHeight || 0;
                stgUIGridCtrl.gridOptions.expandableRowScope = stgUIGridCtrl.gridOptionsData.expandableRowScope || {};
            }

            function setDefaultValue(value){
                return (typeof value !== 'undefined' && value !== null) ? value : true;
            }

            function setDefaultValueToFalse(value){
                return (typeof value !== 'undefined' && value !== null) ? value : false;
            }

            initialize();
        }])

    .directive('stgUiGrid', [function() {
        return {
            restrict: 'A',
            scope: {
                refId: "=",
                getGridOptions: "=",
                getGridData: "&"
            },
            templateUrl: 'common/directives/uiGrid/stgUIGrid.tpl.html',
            controller: 'STGUIGridController as stgUIGridCtrl',
            link: {
                post: function postLink(scope, element) {

                    scope.$watchGroup([
                        function() { return element[0].offsetWidth; }
                    ],  function(elemwidth) {
                        // Handle resize event ...                       
                        var pagerElem = element.find('.ui-grid-pager-panel'),
                            pagerCount = element.find('.ui-grid-pager-count-container');
                        
                        pagerElem = angular.element(pagerElem);
                        pagerCount = angular.element(pagerCount);

                        if (elemwidth[0] < 960) {
                            pagerElem.css('text-align', 'center');
                            pagerCount.css('display', 'none');
                        }
                        else {
                            pagerElem.css('text-align', 'inherit');
                            pagerCount.css('display', 'block');
                        }

                        if (elemwidth[0] < 421) {
                            pagerElem.addClass('stg-ui-grid-pager-panel');
                        }
                        else {
                            pagerElem.removeClass('stg-ui-grid-pager-panel');
                        }

                    });
                }
            }
        };
    }]);
