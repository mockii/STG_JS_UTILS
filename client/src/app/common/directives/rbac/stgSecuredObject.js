angular.module('common.directives.RBAC', [
        'common.services.RBAC'
    ])
    .constant('RBAC_CONSTANTS', {
        ATTRIBUTE_NAMES: {
            STG_SECURED_OBJECT: 'stg-secured-object',
            STG_EXCLUDE_SECURITY_HANDLING: 'stg-exclude-security-handling',
            RBAC_ACCESS_TYPE: 'rbac-access-type',
            READONLY: 'readonly',
            DISABLED: 'disabled'
        },
        ACCESS_TYPES: {
            READ_ONLY: 'READ',
            WRITE: 'WRITE',
            BLOCKED: 'BLOCKED'
        },
        READ_ONLY_INPUT_TYPES: [
            "date",
            "datetime",
            "datetime-local",
            "email",
            "date",
            "image",
            "month",
            "number",
            "password",
            "range",
            "search",
            "tel",
            "text",
            "time",
            "url",
            "week"
        ],
        DIRECTIVES_TO_BLOCK: [
            "ng-click",
            "ng-disabled",
            "ng-sortable"
        ]
    })

    .directive('stgSecuredObject', ['$rootScope', '$timeout', 'stgSecuredObjectService', function($rootScope, $timeout, stgSecuredObjectService) {
        return {
            restrict: 'A',
            scope: {
                stgSecuredObject: '@',
                customGetAccessTypeFn: "&",
                ngClick: "&",
                rbacRemovedNgClick: "&"
            },
            link : function($scope, element) {
                $scope.customGetAccessTypeFn = $scope.customGetAccessTypeFn();

                $timeout(function(){
                    stgSecuredObjectService.applyRbacSecurity($scope, element);
                }, 1000);

                $scope.$on('rbacProfileChanged', function(){
                    $timeout(function(){
                        stgSecuredObjectService.applyRbacSecurity($scope, element);
                    }, 1000);
                });

                $scope.$on('refreshRbacSecurity', function(){
                    $timeout(function(){
                        stgSecuredObjectService.applyRbacSecurity($scope, element);
                    }, 1000);
                });

                $rootScope.$on('refreshRbacSecurity', function(){
                    $timeout(function(){
                        stgSecuredObjectService.applyRbacSecurity($scope, element);
                    }, 1000);
                });
            }
        };
    }])

    .service('stgSecuredObjectService', ['$compile', 'RBACService', 'RBAC_CONSTANTS', function($compile, RBACService, RBAC_CONSTANTS){

        function applyRbacSecurity($scope, element) {

            var securedObjectName = $scope.stgSecuredObject,
                accessType = ($scope.customGetAccessTypeFn) ? $scope.customGetAccessTypeFn(securedObjectName) :
                    RBACService.getAccessTypeForSecuredObject(securedObjectName);

            //if there is no secured object name defined then do nothing
            if (!securedObjectName) {
                return;
            }

            //if there is no access type setup then set the default access type
            if (!accessType) {
                RBACService.getDefaultAccessType();
            }

            //remove any prior rbac attributes that had been applied
            removeAnyPriorRbacSecuritySettings($scope, element, accessType);

            //apply the appropriate level of access to the element
            switch (accessType) {
                case RBAC_CONSTANTS.ACCESS_TYPES.WRITE:
                    applyWriteAccessToElement(element);
                    break;
                case RBAC_CONSTANTS.ACCESS_TYPES.READ_ONLY:
                    applyReadOnlyAccessToElement($scope, element);
                    break;
                case RBAC_CONSTANTS.ACCESS_TYPES.BLOCKED:
                    applyBlockedAccessToElement(element);
                    break;
                default:
                    throw('Error determining access type for secured object');
            }

        }


        /** private function **/
        function applyWriteAccessToElement(element) {
            element.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.RBAC_ACCESS_TYPE, RBAC_CONSTANTS.ACCESS_TYPES.WRITE);
        }

        /** private function **/
        function applyReadOnlyAccessToElement($scope, element) {
            element.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.RBAC_ACCESS_TYPE, RBAC_CONSTANTS.ACCESS_TYPES.READ_ONLY);
            element.bind('click', disableClickForReadOnlyElements);

            if (elementSupportsReadOnly(element)) {
                element.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.READONLY, true);
            } else {
                element.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.DISABLED, true);
            }

            blockAngularDirectives($scope, element);

            applyReadOnlySecurityToChildren($scope,element);
        }

        /** private function **/
        function blockAngularDirectives($scope, element) {
            var recompileNeeded = false;

            for (var i=0; i< RBAC_CONSTANTS.DIRECTIVES_TO_BLOCK.length; i++) {
                var directiveName = RBAC_CONSTANTS.DIRECTIVES_TO_BLOCK[i],
                    blockedDirectiveName = 'rbac-removed-' + directiveName;

                if (element.attr(directiveName)) {
                    if (directiveName !== 'ng-click') {
                        recompileNeeded = true;
                    }
                    var directiveValue = element.attr(directiveName);
                    element.attr(blockedDirectiveName, directiveValue);
                    element.removeAttr(directiveName);
                }
            }

            if (recompileNeeded) {
                var updatedElement = $compile(element[0].outerHTML)($scope);
                element.replaceWith(updatedElement);
            }
        }

        /** private function **/
        function unblockAngularDirectives($scope, element) {

            var recompileNeeded = false;

            for (var i=0; i< RBAC_CONSTANTS.DIRECTIVES_TO_BLOCK.length; i++) {
                var directiveName = RBAC_CONSTANTS.DIRECTIVES_TO_BLOCK[i],
                    blockedDirectiveName = 'rbac-removed-' + directiveName;

                if (element.attr(blockedDirectiveName)) {
                    if (directiveName !== 'ng-click') {
                        recompileNeeded = true;
                    }
                    var directiveValue = element.attr(blockedDirectiveName);
                    element.removeAttr(blockedDirectiveName);
                    element.attr(directiveName, directiveValue);
                }
            }

            if (recompileNeeded) {
                var updatedElement = $compile(element[0].outerHTML)($scope);
                element.replaceWith(updatedElement);
            }
        }

        /**private function **/
        function disableClickForReadOnlyElements() {
            //this will prevent the default action of an element from getting triggered
            return false;
        }

        /** private function **/
        function elementSupportsReadOnly(element, childElement) {
            var supportsReadOnly = false,
                type = (childElement) ? element.type : element.attr('type');

            if (type && RBAC_CONSTANTS.READ_ONLY_INPUT_TYPES.indexOf(type) > -1) {
                supportsReadOnly = true;
            }

            return supportsReadOnly;
        }

        /** private function **/
        function applyReadOnlySecurityToChildren($scope, element) {
            if (element[0].nodeType !== 8) {

                if (element[0].children.length > 0) {
                    for (var i=0; i < element[0].children.length; i++) {

                        //if the child is not a comment
                        if (element[0].children[i].nodeType !== 8) {
                            var childElement = angular.element(element[0].children[i]);
                            if (isChildEligibleForSecurityHandling(childElement)) {
                                applyReadOnlyAccessToElement($scope, childElement);
                            }
                        }
                    }
                }
            }
        }

        /** private function **/
        function isChildEligibleForSecurityHandling(childElement) {
            var isEligible = true,
                stgSecuredObjectAttribute = childElement.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.STG_SECURED_OBJECT),
                stgExcludeSecurityHandlingAttribute = childElement.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.STG_EXCLUDE_SECURITY_HANDLING);

            if (stgSecuredObjectAttribute !== undefined || stgExcludeSecurityHandlingAttribute !== undefined) {
                isEligible = false;
            }

            return isEligible;
        }

        /** private function **/
        function applyBlockedAccessToElement(element) {
            element.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.RBAC_ACCESS_TYPE, RBAC_CONSTANTS.ACCESS_TYPES.BLOCKED);
            element.hide();
        }

        /** private function **/
        function removeAnyPriorRbacSecuritySettings($scope, element, accessType) {
            var priorAccessType = element.attr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.RBAC_ACCESS_TYPE);

            if (priorAccessType && priorAccessType !== accessType) {
                element.removeAttr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.RBAC_ACCESS_TYPE);

                switch (priorAccessType) {
                    case RBAC_CONSTANTS.ACCESS_TYPES.WRITE:
                        //nothing needed for removing write access
                        break;
                    case RBAC_CONSTANTS.ACCESS_TYPES.READ_ONLY:
                        removeReadOnlyAccessAttributesFromElement($scope, element);
                        break;
                    case RBAC_CONSTANTS.ACCESS_TYPES.BLOCKED:
                        removeBlockedAccessAttributesFromElement(element);
                        break;
                    default:
                        throw('Error determining prior access type for secured object');
                }
            }

        }

        /** private function **/
        function removeReadOnlyAccessAttributesFromElement($scope, element) {
            element.removeAttr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.RBAC_ACCESS_TYPE);
            element.removeAttr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.READONLY);
            element.removeAttr(RBAC_CONSTANTS.ATTRIBUTE_NAMES.DISABLED);
            element.unbind('click', disableClickForReadOnlyElements);

            unblockAngularDirectives($scope, element);

            removeReadOnlySecurityFromChildren($scope, element);
        }

        /** private function **/
        function removeReadOnlySecurityFromChildren($scope, element) {
            if (element[0].nodeType !== 8) {

                if (element[0].children.length > 0) {
                    for (var i=0; i < element[0].children.length; i++) {

                        //if the child is not a comment
                        if (element[0].children[i].nodeType !== 8) {
                            var childElement = angular.element(element[0].children[i]);
                            if (isChildEligibleForSecurityHandling(childElement)) {
                                removeReadOnlyAccessAttributesFromElement($scope, childElement);
                            }
                        }
                    }
                }
            }
        }

        /** private function **/
        function removeBlockedAccessAttributesFromElement(element) {
            element.show();
        }


        return {
            applyRbacSecurity : applyRbacSecurity
        };

    }]);
