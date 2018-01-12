angular.module('common.directives.STGHeader', [
    'common.directives.STGNavBar',
    'common.services.RBAC',
    'common.directives.notificationMessages'
])
    .controller('STGHeaderController', ['$rootScope', '$scope', '$window', '$filter', 'stgOAuth2', 'RBACService', '$uibModal', '$timeout',
        function ($rootScope, $scope, $window, $filter, stgOAuth2, RBACService, $uibModal, $timeout) {
        var headerCtrl = this;

        headerCtrl.currentRbacProfile = RBACService.getCurrentProfile();
        headerCtrl.allRoles = RBACService.getAllRoles();
        headerCtrl.selectedRole = RBACService.getCurrentRoleName();
        headerCtrl.currentRoleName = RBACService.getCurrentRoleName();
        headerCtrl.notifications = $scope.notifications;
        headerCtrl.newNotifications = $filter('newAlertFilter')($scope.notifications);
        headerCtrl.tasks = $scope.tasks;
        headerCtrl.inbox = $scope.inbox;
        headerCtrl.userMenuItems = $scope.userMenuItems;
        headerCtrl.logo = $scope.logo;
        headerCtrl.logoText = $scope.logoText;
        headerCtrl.logoState = $scope.logoState;

        headerCtrl.enableTeamSelection = $scope.enableTeamSelection;
        headerCtrl.getChildTeamsFn = $scope.getChildTeamsFn;
        headerCtrl.getGridTeamsFn = $scope.getGridTeamsFn;

        headerCtrl.enableQuickSidebar = $scope.enableQuickSidebar;

        headerCtrl.teams = RBACService.getTeams();
        headerCtrl.selectedTeamName = RBACService.getSelectedTeamName();
        $rootScope.selectedTeam = RBACService.getSelectedTeam();

        headerCtrl.isActive = false;

        headerCtrl.showMessages = function(message, messageIndex) {
            var modalInstance = $uibModal.open({
                templateUrl: 'common/directives/header/notification-messages-modal.tpl.html',
                controller: 'NotificationMessagesModalController as notificationMessagesModalController',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    message: function () {
                        return message;
                    },
                    messageIndex: function () {
                        return messageIndex;
                    }
                }
            });
        };

        headerCtrl.getNotificationIconStyle = function(notification) {
            // success, danger, info, warning
            return "label-" + notification.status;
        };

        headerCtrl.getTaskIconStyle = function(task) {
            // success, danger, info, warning
            return "progress-bar progress-bar-" + task.status;
        };

        headerCtrl.logout = function() {
            stgOAuth2.logout();
        };

        headerCtrl.changeRole = function() {
            RBACService.switchCurrentRole(headerCtrl.selectedRole.role_name);
        };

        headerCtrl.switchSelectedTeam = function() {
            RBACService.switchSelectedTeam(headerCtrl.selectedTeamName);
        };

        headerCtrl.activeButton = function() {
            var elementResult = $window.document.getElementsByClassName("page-header-menu");

            if (elementResult[0].style.display === 'none' || elementResult[0].style.display === '') {
                headerCtrl.isActive = true;
            }
            else {
                headerCtrl.isActive = false;
            }
        };

        $scope.$on('rbacProfileChanged', function(){
            headerCtrl.allRoles = RBACService.getAllRoles();
            headerCtrl.selectedRole = RBACService.getCurrentRoleName();
            headerCtrl.currentRoleName = RBACService.getCurrentRoleName();

            headerCtrl.teams = RBACService.getTeams();
            headerCtrl.selectedTeamName = RBACService.getSelectedTeamName();
            $rootScope.selectedTeam = RBACService.getSelectedTeam();

            $timeout(function() {
                $('.selectpicker').val(' ').selectpicker('refresh');
            }, 100);

            if (!RBACService.isRbacProfile()) {
                $rootScope.$broadcast('rbacProfileNotAvailable');
            }
        });


        $scope.$watch('notifications', function(value){
            headerCtrl.notifications = value;
            headerCtrl.newNotifications = $filter('newAlertFilter')(value);

        });

        $scope.$watch('tasks', function(value){
            headerCtrl.tasks = value;
        });

        $scope.$watch('inbox', function(value){
            headerCtrl.inbox = value;
        });

        $scope.$watch('userMenuItems', function(value){
            headerCtrl.userMenuItems = value;
        });

        $scope.$watch('logo', function(value){
            headerCtrl.logo = value;
        });

        $scope.$watch('logoText', function(value){
            headerCtrl.logoText = value;
        });

        $scope.$watch('logoState', function(value){
            headerCtrl.logoState = value;
        });

        $scope.$watch('enableTeamSelection', function(value){
            headerCtrl.enableTeamSelection = value;
        });

        $scope.$watch('enableQuickSidebar', function(value){
            headerCtrl.enableQuickSidebar = value;
        });

    }])

    .directive('stgHeader', ['ApplicationConfigurationService', function(ApplicationConfigurationService) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                notifications: "=",
                tasks: "=",
                inbox: "=",
                userMenuItems: "=",
                logo: "=",
                logoText: "=",
                logoState: "=",
                enableTeamSelection: "=",
                getChildTeamsFn: "&",
                getGridTeamsFn: "&",
                enableQuickSidebar: "="
            },
            templateUrl: 'common/directives/header/stgHeader.tpl.html',
            controller: 'STGHeaderController as headerCtrl',
            link: function($scope, $element, $attrs, $ctrl, $transclude) {
                $transclude(function(clone){
                    $scope.hasTranscludedContent = (clone.length > 0);
                });

                //hide the header if menu=false is passed as query parameter
                if (ApplicationConfigurationService.isMenuHidden()) {
                    $element.hide();
                }
            }
        };
    }])

    .filter('newAlertFilter', [function() {
        return function(inputCollection) {
            var filteredResults = [];

            if (!inputCollection) {
                return filteredResults;
            }

            for (var i=0; i < inputCollection.length; i++) {
                var inputObject = inputCollection[i];
                if (inputObject.isNew) {
                    filteredResults.push(inputObject);
                }
            }

            return filteredResults;
        };
    }])

;
