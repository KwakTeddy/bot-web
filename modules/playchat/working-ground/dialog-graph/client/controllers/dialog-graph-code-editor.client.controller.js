(function()
{
    angular.module('playchat').controller('DialogGraphCodeEditorController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout','LanguageService', function ($window, $scope, $resource, $cookies, $element, $timeout, LanguageService)
    {
        var DialogGraphsService = $resource('/api/:botId/dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

        var chatbot = $cookies.getObject('chatbot');

        var editor = CodeMirror.fromTextArea($element.find('textarea').get(0),
        {
            lineNumbers: true,
            smartIndent: true
        });

        $scope.currentFileName = undefined;

        angular.element('.dialog-graph-code-editor').get(0).openCodeEditor = function(fileName)
        {
            DialogGraphsService.get({ botId: chatbot.id, fileName: fileName}, function(result)
            {
                angular.element('.dialog-graph-code-editor').show();
                editor.setValue(result.data);
                $scope.currentFileName = fileName;
            },
            function(err)
            {
                alert(err.data.message);
            });
        };

        $scope.save = function()
        {
            DialogGraphsService.save({ botId: chatbot.id, fileName: $scope.currentFileName, data: editor.getValue() }, function()
            {
                angular.element('.dialog-graph-code-editor .alert-success').show();
                $timeout(function()
                {
                    angular.element('.dialog-graph-code-editor .alert-success').css('opacity', 1);
                    $timeout(function()
                    {
                        angular.element('.dialog-graph-code-editor .alert-success').css('opacity', 0);
                        $timeout(function()
                        {
                            angular.element('.dialog-graph-code-editor .alert-success').hide();
                        }, 600);
                    }, 1500);
                }, 5);
            },
            function()
            {
                alert(err.data.message);
            });
        };

        $scope.lan=LanguageService;
    }]);
})();
