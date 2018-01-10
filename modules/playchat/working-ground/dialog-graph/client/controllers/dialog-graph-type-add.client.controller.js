(function()
{
    angular.module('playchat').controller('DialogGraphTypeAddController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout', 'LanguageService',function ($window, $scope, $resource, $cookies, $element, $timeout, LanguageService)
    {
        var TaskService = $resource('/api/:botId/types/:fileName', { botId: '@botId', fileName: '@fileName' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');
        var formElement = $element.get(0);

        $scope.type = {};

        var editor = CodeMirror.fromTextArea($element.find('#dialogGraphEditorTypeLogic').get(0),
        {
            lineNumbers: true,
            smartIndent: true
        });

        $scope.save = function()
        {
            var logic = editor.getValue();

            var content = "var " + $scope.type.name + " = {\r\n";
            content += "    typeCheck: function(text, type, task, context, callback) {\r\n";
            content += logic + '\r\n';
            content += '\t\tcallback(task, context, matched);\r\n';
            content += "    }\r\n";
            content += "};\r\n";
            content += "bot.setType('" + $scope.type.name + "', " + $scope.type.name + ");";

            TaskService.save({ botId: chatbot.id, name: $scope.type.name, content: content, fileName: 'default.js' }, function()
            {
                $element.get(0).saveCallback($scope.type.name);
            }, function(err)
            {
                alert(err.data.message);
            });
        };

        $scope.close = function(e)
        {
            if(formElement.closeCallback)
            {
                formElement.closeCallback();
            }
        };

        formElement.open = function()
        {
            $element.find('.dialog-graph-instant-add-input.type-add').focus();
        };

        formElement.openCallback = function(name)
        {
            $scope.$apply(function()
            {
                $scope.type = {
                    name: name
                };
            });
        };

        $scope.lan=LanguageService;
    }]);
})();
