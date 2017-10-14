angular.module("common.services.states", ['common.modules.logging'])
    .factory("StgStatesService", ['$rootScope', '$state', '$stateParams', '$location', '$log',
        function($rootScope, $state, $stateParams, $location, $log) {

        var managedStates = [],
            stateService = {};


        stateService.getUrlParams = function(){
            return $location.search();
        };

        stateService.getPath = function(){
            return $location.path();
        };

        stateService.getCurrentState = function(){
            return $state.current;
        };

        stateService.getPreviousState = function(){
            return $state.previous;
        };

        stateService.goToState = function(state, params){

            if(!params.hasOwnProperty('backState')){
                params.backState = stateService.getCurrentState().name;
            }

            managedStates.push({
                state: params.backState,
                params: angular.copy($stateParams)
            });

            $state.go(state, params);
        };

        stateService.goToBackState = function(){

            var backState,
                stateName,
                params;

            if (managedStates.length > 0) {
                backState = managedStates.pop();
                stateName = backState.state;
                params = backState.params;
            } else {
                stateName = $state.current.data.backState;
                params = null;
            }

            $state.go(stateName, params);
        };

        stateService.hasBackState = function(){
            return managedStates.length > 0 || !!$state.current.data.backState;
        };

        stateService.getInternalState = function(state){
            return $state.get(state.name).$$state;
        };

        stateService.clearStateStack = function() {
            if (managedStates.length > 0) {
                managedStates.splice(0, managedStates.length);
            }
        };


        return stateService;
    }])
;