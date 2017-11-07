(function()
{
    angular.module('playchat').controller('TaskAddController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout', function ($window, $scope, $resource, $cookies, $element, $timeout)
    {
        var TaskService = $resource('/api/:botId/tasks/:fileName', { botId: '@botId', fileName: '@fileName' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');

        $scope.task = {};

        var editor = CodeMirror.fromTextArea($element.find('#dialogGraphEditorTaskLogic').get(0),
        {
            lineNumbers: true,
            smartIndent: true
        });

        $element.get(0).openCallback = function()
        {
            // TaskService.query({ botId: chatbot.id }, function(list)
            // {
            //     console.log('리스트', list);
            // },
            // function(err)
            // {
            //     alert(err.data.message);
            // });
        };

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
    }]);
})();
