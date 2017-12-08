(function()
{
    angular.module('playchat').controller('DialogGraphCodeEditorController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout', '$location','LanguageService', function ($window, $scope, $resource, $cookies, $element, $timeout, $location, LanguageService)
    {
        var DialogGraphsService = $resource('/api/:botId/dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

        var chatbot = $cookies.getObject('chatbot');

        var editor = CodeMirror.fromTextArea($element.find('textarea').get(0),
        {
            lineNumbers: true,
            smartIndent: true
        });

        $scope.currentFileName = undefined;
        $scope.mode = '';
        $scope.saveError = '';

        var fileName = $location.search().fileName;
        function openCodeEditor(fileName, options)
        {
            angular.element('.dialog-graph-code-editor-controller').removeClass('edit');

            if(angular.element('#graphDialogEditor').css('right') == '0px')
            {
                angular.element('.dialog-graph-code-editor-controller').addClass('edit');
            }

            DialogGraphsService.get({ botId: chatbot.id, fileName: fileName}, function(result)
            {
                angular.element('.dialog-graph-code-editor').show();

                if(options)
                {
                    if(options.isView)
                    {
                        editor.setValue(result.data);
                        editor.focus();

                        var split = result.data.split('\n');
                        for(var i=0; i<split.length; i++)
                        {
                            if(split[i].indexOf('var ' + options.target) != -1)
                            {
                                editor.setCursor({line: i, ch: 1});
                            }
                        }
                    }
                    else if(options.isCreate)
                    {
                        angular.element('.dialog-graph-code-editor-controller').addClass('edit');
                        editor.setValue(result.data + '\n\n' + options.code);
                        editor.focus();
                        editor.setCursor({line: result.data.split('\n').length + 1, ch: 1});
                    }
                    else if(options.mode == 'graphsource')
                    {
                        $scope.mode = options.mode;
                        editor.setValue(result.data);
                    }
                }
                else
                {
                    editor.setValue(result.data);
                }

                $scope.currentFileName = fileName;
            },
            function(err)
            {
                alert(err.data.message);
            });
        };

        if(fileName && fileName.endsWith('.js') && !fileName.endsWith('.graph.js'))
        {
            openCodeEditor(fileName);
        }

        angular.element('.dialog-graph-code-editor').get(0).openCodeEditor = openCodeEditor;

        $scope.save = function()
        {
            var code = editor.getValue();

            try
            {
                var dialogsMatch = code.match(/var dialogs[^;]*/gi);
                var commonDialogsMatch = code.match(/var commonDialogs[^;]*/gi);

                if(dialogsMatch)
                {
                    JSON.parse(dialogsMatch[0].replace(/var dialogs[^=]*=/gi, '').replace(';', ''));
                }
                else
                {
                    throw new Error('Dialogs is not defined.');
                }

                if(commonDialogsMatch)
                {
                    JSON.parse(commonDialogsMatch[0].replace(/var commonDialogs[^=]*=/gi, '').replace(';', ''));
                }
                else
                {
                    throw new Error('Dialogs is not defined.');
                }
            }
            catch(err)
            {
                console.error(err);

                $scope.saveError = err.message;

                angular.element('.dialog-graph-code-editor .alert-error').show();
                $timeout(function()
                {
                    angular.element('.dialog-graph-code-editor .alert-error').css('opacity', 1);
                    $timeout(function()
                    {
                        angular.element('.dialog-graph-code-editor .alert-error').css('opacity', 0);
                        $timeout(function()
                        {
                            angular.element('.dialog-graph-code-editor .alert-error').hide();
                        }, 600);
                    }, 1500);
                }, 5);

                return;
            }

            DialogGraphsService.save({ botId: chatbot.id, fileName: $scope.currentFileName, data: editor.getValue() }, function()
            {
                if($scope.mode == 'graphsource')
                {
                    angular.element('.dialog-graph-code-editor').hide();

                    angular.element('.graph-controller .alert-success').show();
                    $timeout(function()
                    {
                        angular.element('.graph-controller .alert-success').css('opacity', 1);
                        $timeout(function()
                        {
                            angular.element('.graph-controller .alert-success').css('opacity', 0);
                            $timeout(function()
                            {
                                angular.element('.graph-controller .alert-success').hide();
                            }, 600);
                        }, 1500);
                    }, 5);
                }
                else
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
                }
            },
            function()
            {
                alert(err.data.message);
            });
        };

        $scope.lan=LanguageService;
    }]);
})();
