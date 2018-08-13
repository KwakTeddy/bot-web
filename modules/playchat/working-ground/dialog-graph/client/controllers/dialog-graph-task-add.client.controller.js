(function()
{
    angular.module('playchat').controller('DialogGraphTaskAddController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout','LanguageService', function ($window, $scope, $resource, $cookies, $element, $timeout, LanguageService)
    {
        var TaskService = $resource('/api/:botId/tasks/:fileName', { botId: '@botId', fileName: '@fileName' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');
        var formElement = $element.get(0);

        $scope.task = {};

        var editor = CodeMirror.fromTextArea($element.find('#dialogGraphEditorTaskLogic').get(0),
        {
            lineNumbers: true,
            smartIndent: true
        });

        $scope.save = function()
        {
            var logic = editor.getValue();

            var content = "var " + $scope.task.name + " = {\r\n";
            content += "    name: '" + $scope.task.name + "',\r\n";
            content += "    action: function(task, context, callback) {\r\n";
            content += logic + '\r\n';
            content += 'callback(task, context);\r\n';
            content += "    }\r\n";
            content += "};\r\n";
            content += "bot.setTask('" + $scope.task.name + "', " + $scope.task.name + ");";

            TaskService.save({ botId: chatbot.id, name: $scope.task.name, content: content, fileName: 'default.js' }, function()
            {
                $element.get(0).saveCallback($scope.task.name);
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
            $element.find('.intent-management-add-input:first').focus();
        };

        formElement.openCallback = function(name)
        {
            $scope.$apply(function()
            {
                $scope.task = {
                    name: name
                };
            });
        };
        $scope.lan=LanguageService;
    }]);
})();
