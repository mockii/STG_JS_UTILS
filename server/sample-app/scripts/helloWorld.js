angular.module("helloWord", ['helloWorld.templates'])
    .controller("HelloWorldController", ['ModalDialogService', function(ModalDialogService){
        var helloWorldController = this;

        helloWorldController.sayHello = function() {
            ModalDialogService.alert("Hello world!");
        };

    }]);

angular.module('helloWorld.templates', ['templates/helloWorld.tpl.html']);

angular.module("templates/helloWorld.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("templates/helloWorld.tpl.html",
        "<div>\n" +
        "    <h2>Hello World!</h2>\n" +
        "    <button ng-click='helloWorldController.sayHello()'>Say Hello</button>\n" +
        "</div>\n" +
        "");
}]);