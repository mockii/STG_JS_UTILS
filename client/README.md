STGWebUtils-Client-Libs
================

Contains all client/ui related Web Utilities



Why?
----

To consolidate common elements (directives, styles, libraries, themes, etc) for all STG related products.

This library contains both STGWebUtils and the STG Version of the Metronic theme



Installation
------------

    npm install stgwebutils-client-libs --save

 
### Using Libs
If you used the auto-building script to create a skeleton, everything is built-in and ready to go.

If you did NOT use the auto-building script, then you will need to manually copy some files around.

### STGWebUtils
Contains a handful of directives, filters, services, and utilities.

#### Directives
Package | Directive | Description
------- | --------- | -----------
common.directives.STGHeader | stg-header | Common header bar (logo, user menu, alarms, tasks, etc)
common.directives.STGNavBar | stg-nav-bar | Navigation bar (May include custom search directive: ```<div stg-nav-bar><custom-search class="search-form"/></div>``` - recommend using ```class="search-form"``` for alignment/positioning)
common.directives.pages.STGPageHeader | stg-page-header | White bar that displays current page name
common.directives.STGFooter | stg-footer | Common footer bar (copyright, countdown)
common.directives.utilities.SpinnerBar | spinner-bar | Waiting progress icon to display during wait periods
common.directives.utilities.SpyStyle | spy-style | Watches a style on an element and call a method
common.directives.inputs.checkbox | input type="checkbox" | If ng-model changes, waits for next digest cycle and tells uniformJS to update its components
common.directives.anchors.aDisabled | a-disabled="true" | Disables/Enables an anchor element

#### Services
Package | Name | Methods | Description
------- | ---- | --------- | -----------
common.directives.ModalDialog | ModalDialogService | ```alert(msg or config object)``` and ```confirm(msg or config object)``` | displays an alert or confirm dialog
common.services.stgOAuth2 | stgOAuth2 | ```isLoggedIn()```, ```getTimeLeft()```, ```currentToken```, ```logout()```, ```reauth()```, ```resetSessionExpire()``` | All things OAuth2 related
common.services.CompassToastr | CompassToastr | ```warning(msg)```, ```success``` | Displays a toastr message in the top right corner

#### Filters
Package | Name | Description
------- | ---- | -----------
common.filters.CountdownTimerFilter | CountdownTimerFilter | Converts timeInSeconds to friendly display (224 => 3:44)

#### Libraries

Library | Version
------- | -------
[angular.min.js](https://angularjs.org/) | 1.4.7
[angular-animate.min.js](https://angularjs.org/) | 1.4.7
[angular-sanitize.min.js](https://angularjs.org/) | 1.4.7
[angular-ui-router.min.js](https://angularjs.org/) | 0.2.15
[angular-animate.min.js](https://angularjs.org/) | 1.4.7
[ag-grid.min.js](http://www.ag-grid.com/) | 2.3.2
[angular-shims-placeholder.min.js](https://github.com/cvn/angular-shims-placeholder) | 0.4.5
[angular-translate.min.js](https://github.com/angular-translate/angular-translate) | 2.8.1
[angulartics.min.js](http://luisfarzati.github.io/angulartics) | 0.19.2
[angulartics-google-analytics](http://luisfarzati.github.io/angulartics) | 10/10/2015
compass-ng-sortable.min.js based on https://github.com/a5hik/ng-sortable | 1.3.0 (integrated)
[es5-shim.min.js](https://github.com/es-shims/es5-shim) | 4.1.14
[es5-sham.min.js](https://github.com/es-shims/es5-shim) | 4.1.14
[lodash.min.js](http://lodash.com) | 3.10.1
[ngToast.min.js](https://github.com/tameraydin/ngToast) | 1.5.6
[ocLazyLoad.min.js](https://github.com/ocombe/ocLazyLoad) | 1.0.6
[ui-bootstrap-tpls](http://angular-ui.github.io/bootstrap/) | 1.1.2
[angular-block-ui](http://angular-block-ui.nullest.com/#!/) | 0.2.1
