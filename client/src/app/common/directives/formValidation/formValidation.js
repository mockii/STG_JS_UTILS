'use strict';

(function () {

    angular.module('common.directives.formValidation', [])
        .directive('stgFormValidation', ['$document', '$timeout', '$compile', function($document, $timeout, $compile) {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: {
                    post: function postLink(scope, element, attr, ctrl) {

                        var newElement,
                            parentElement,
                            validationType,
                            validation,
                            notRequired,
                            notRequiredField,
                            lookup,
                            lookupField,
                            validationMessage,
                            validationFn,
                            parentCtrl,
                            ctrlFn,
                            customMessage,
                            re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im,
                            // Normal Exp 01/01/2016
                            // dateExp = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/][12][0-9]{3}$/,
                            // date exp for leap year check
                            dateExp = /^(((02)[/](0[1-9]|1[0-9]|2[0-8])|(04|06|09|11)[/](0[1-9]|[12][0-9]|30)|(01|03|05|07|08|10|12)[/](0[1-9]|[12][0-9]|3[01]))[/]([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]|[0-9][1-9][0-9]{2}|[1-9][0-9]{3}))|(((02)[/](29))[/](([0-9]{2}([02468][48]|[13579][26]|[2468]0))|(([02468][048]|[13579][26])00)))/im,
                            currenyExp = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/,
                            ssnExp = /^\d{4,4}$/,
                            // Allows all numbers and special characters without any set max length.
                            phoneRegExp = /(?!0)[0-9()-+]+[^A-Za-z]*$/,
                            elementValue,
                            check = '<i class="fa fa-check custom-icon"></i>',
                            warning = '<i class="fa fa-warning custom-icon" tooltip-class="validation-info-icon"></i>';

                        //get validation type & messsage passed to directive
                        scope.$watch('formValidation', function () {
                            validationType = attr.validationType.toUpperCase();
                            
                            if (attr.lookupField) {
                                lookup = attr.lookupField.toUpperCase();
                            }
                            
                            if (attr.notRequired) {
                                notRequired = attr.notRequired.toUpperCase();
                            }

                            lookupField = (lookup === "TRUE");
                            notRequiredField = (notRequired === "TRUE");
                            validationMessage = attr.validationMessage;
                            customMessage = validationMessage;

                            validationFn = attr.validationFn;

                            if (!element.data('initial-value')) {
                                element.data('initial-value', element.val());
                            }
                        });



                        // clear other sibling icons under parent
                        function removeSiblings() {
                            var parent = element.parent();
                            parent.find("i.custom-icon").remove();
                            parent.find("span.help-block").remove();
                        }

                        // clear other sibling icons under parent
                        function removeParentSiblings() {
                            var parent = element.parent().parent();
                            parent.find("span.help-block").remove();
                        }

                        function addSuccessIcon() {
                            removeSiblings();
                            removeParentSiblings();

                            newElement = angular.element(check);
                            newElement.insertBefore(element);
                            
                            parentElement = getParentwithClassRow(element);
                            parentElement.removeClass("has-error");
                            parentElement.addClass("has-success");

                            ctrl.$setValidity(validationType, true);
                        }

                        function addWarningIcon(msg, lookUp, hideCustomMessage) {
                            removeSiblings();
                            removeParentSiblings();
                            
                            var message;

                            //For Email Reg Ex Validation Message to show to override the Custom Message
                            if (hideCustomMessage) {
                                validationMessage = '';
                            }

                            if (validationMessage) {
                                message = '<span class="help-block help-block-error">' + validationMessage + '</span>';
                            }
                            else {
                                message = '<span class="help-block help-block-error">' + msg + '</span>';
                            }

                            newElement = angular.element(warning);
                            newElement.insertBefore(element);

                            if (lookUp) {
                                newElement = angular.element(message);
                                newElement.insertAfter(element.parent());
                            }
                            else {
                                newElement = angular.element(message);
                                newElement.insertAfter(element);
                            }

                            parentElement = getParentwithClassRow(element);
                            parentElement.removeClass("has-success");
                            parentElement.addClass("has-error");

                            ctrl.$setValidity(validationType, false);
                        }

                        function removeWarningIcon(hideCustomMessage) {
                            if(notRequiredField) {
                                removeSiblings();
                                removeParentSiblings();

                                parentElement = getParentwithClassRow(element);
                                parentElement.removeClass("has-error");
                                parentElement.removeClass("has-success");

                                ctrl.$setValidity(validationType, true);
                            }
                            else {
                                addWarningIcon('This field is required', lookupField, hideCustomMessage);
                            }
                        }

                        function getParentwithClassRow(el) {
                            while ((el = el.parent()) && !el.hasClass("row")){
                                
                            }

                            return el;
                        }

                        function addValidation(onBlurFlag) {
                            elementValue = element[0].value;
                            switch (validationType) {
                                case 'REQUIRED':
                                    if (elementValue.length > 0) {
                                        addSuccessIcon();
                                    }
                                    else {
                                        /* jshint expr: true */
                                        elementValue.length > 0 ? addWarningIcon('This field is required', lookupField) : removeWarningIcon();
                                    }
                                    break;
                                case 'EMAIL':
                                    if (elementValue.length > 0 && re.test(elementValue)) {
                                        if(validationFn && typeof onBlurFlag === 'boolean' && onBlurFlag) {
                                            parentCtrl = validationFn.substring(0, validationFn.indexOf("."));
                                            ctrlFn = validationFn.substring(validationFn.indexOf(".") + 1);

                                            if(parentCtrl && ctrlFn) {
                                                for (var key in scope) {
                                                    if (key === parentCtrl) {
                                                        for (var x in scope[key]) {
                                                            if(x === ctrlFn) {
                                                                callScopeFn();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                scope[validationFn]().then(
                                                    function(response) {
                                                        if (response) {
                                                            elementValue.length > 0 ? addWarningIcon(customMessage || 'Please enter a valid email address.', lookupField) : removeWarningIcon();
                                                        }
                                                        else {
                                                            addSuccessIcon();
                                                        }
                                                    }, function (error) {
                                                        throw "An error occurred while userValidCheck. " + error;
                                                    }
                                                );
                                            }
                                        }
                                        else {
                                            addSuccessIcon();
                                        }
                                    }
                                    else {
                                        /* jshint expr: true */
                                        elementValue.length > 0 ? addWarningIcon('Please enter a valid email address.', lookupField, true) : removeWarningIcon(true);
                                    }
                                    break;
                                case 'DATE':
                                    if (elementValue.length > 0 && dateExp.test(elementValue)) {
                                        addSuccessIcon();
                                    }
                                    else {
                                        elementValue.length > 0 ? addWarningIcon('Please enter date in valid format mm/dd/yyyy.', lookupField) : removeWarningIcon();
                                    }
                                    break;
                                case 'CURRENCY':
                                    if (elementValue.length > 0 && currenyExp.test(elementValue)) {
                                        addSuccessIcon();
                                    }
                                    else {
                                        addWarningIcon('Please enter currency in valid format XXXX.XX.', lookupField);
                                    }
                                    break;
                                case 'SSN':
                                    if (elementValue.length > 0 && ssnExp.test(elementValue)) {
                                        addSuccessIcon();
                                    }
                                    else {
                                        addWarningIcon('Please enter last four SSN: XXXX.', lookupField);
                                    }
                                    break;
                                case 'PHONE':
                                    if (elementValue.length > 0 && phoneRegExp.test(elementValue)) {
                                        addSuccessIcon();
                                    }
                                    else {
                                        /* jshint expr: true */
                                        elementValue.length > 0 ? addWarningIcon('Please enter valid Phone Number.', lookupField): '';
                                    }
                                    break;
                            }

                            return elementValue;
                        }

                        function callScopeFn() {
                            scope[parentCtrl][ctrlFn]().then(
                                function(response) {
                                    if (response) {
                                        if (elementValue.length > 0) {
                                            addWarningIcon(customMessage || 'Please enter a valid email address.', lookupField);
                                        }
                                        else {
                                            removeWarningIcon();
                                        }
                                    }
                                    else {
                                        addSuccessIcon();
                                    }
                                }, function (error) {
                                    throw "An error occurred while userValidCheck. " + error;
                                }
                            );
                        }

                        scope.$watch(attr.ngModel, function(newValue, oldValue) {
                            if (newValue !== oldValue && !element[0].hasAttribute('readonly')) {
                                element.data('old-value', oldValue);
                                addValidation(false);
                            }

                        });

                        element.bind('blur', function () {
                            if (element.data('initial-value') !== element.val() && !element[0].hasAttribute('readonly')) {
                                addValidation(true);
                            }
                            else {
                                addValidation(false);
                            }
                        });

                        ctrl.$parsers.push(addValidation);

                }
                }
            };
        }]);
})();