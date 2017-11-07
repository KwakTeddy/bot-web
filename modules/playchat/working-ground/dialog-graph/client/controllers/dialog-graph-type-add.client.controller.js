(function()
{
    angular.module('playchat').controller('TypeAddController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout', function ($window, $scope, $resource, $cookies, $element, $timeout)
    {
        var TaskService = $resource('/api/:botId/types/:fileName', { botId: '@botId', fileName: '@fileName' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');

        $scope.type = {};

        var editor = CodeMirror.fromTextArea($element.find('#dialogGraphEditorTypeLogic').get(0),
        {
            lineNumbers: true,
            smartIndent: true
        });

        $element.get(0).open = function()
        {

        };

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
    }]);
})();
