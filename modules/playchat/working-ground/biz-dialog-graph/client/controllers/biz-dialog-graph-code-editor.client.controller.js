(function()
{
    angular.module('playchat').controller('BizDialogGraphCodeEditorController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout', '$location', '$rootScope', 'LanguageService', 'BizDialogGraph', 'CaretService', function ($window, $scope, $resource, $cookies, $element, $timeout, $location, $rootScope, LanguageService, BizDialogGraph, CaretService)
    {
        var DialogGraphsService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

        var chatbot = $cookies.getObject('chatbot');

        var editors = {};

        $scope.myBotAuth = chatbot.myBotAuth;
        $scope.currentFileName = undefined;
        $scope.mode = '';
        $scope.saveError = '';

        var fileName = $location.search().fileName;

        var editor = undefined;

        (function()
        {
            window.addEventListener('keydown', function(e)
            {
                if(location.href.indexOf('/playchat/development/biz-dialog-graph') == -1 || angular.element('.dialog-graph-code-editor').is(':visible') == false)
                    return;

                if(e.path[0].nodeName == 'TEXTAREA' && (!e.path[0].parentElement || e.path[0].parentElement.className != 'dialog-editor-output-text'))
                {
                    console.log('=========================== sample log line ===============');
                    var check = false;
                    for(var i=0; i<e.path.length; i++)
                    {
                        if(e.path[i].className.indexOf('CodeMirror') != -1)
                        {
                            check = true;
                            break;
                        }
                    }

                    if(!check)
                    {
                        return;
                    }

                    if(e.keyCode == 83 && (e.ctrlKey || e.metaKey))
                    {
                        $scope.save();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });

            $scope.$on('saveCodeEditor', function()
            {
                $scope.save();
            });
        })();

        function openCodeEditor(fileName, options)
        {
            if(!options)
            {
                options = {};
            }

            $scope.mode = '';
            $scope.sourceFileName = options.sourceFileName;

            angular.element('.dialog-graph-code-editor-body textarea+.CodeMirror').hide();

            editor = editors[fileName];
            if(options.refresh)
                editor = undefined;

            angular.element('#codeSaveButton').attr('disabled', true);
            
            if(!editor)
            {
                angular.element('.dialog-graph-code-editor-body').prepend('<textarea style="display: none;"></textarea>');
                editors[fileName] = editor = CodeMirror.fromTextArea($element.find('textarea:first').get(0),
                {
                    lineNumbers: true,
                    smartIndent: true,
                    autofocus: true
                });

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
                                if(split[i].indexOf(options.target) != -1)
                                {
                                    editor.setCursor({line: i, ch: 1});
                                }
                            }
                        }
                        else if(options.isCreate)
                        {
                            $scope.mode = options.mode;
                            angular.element('.dialog-graph-code-editor-controller').addClass('edit');
                            result = result.data.substring(0, result.data.lastIndexOf('};')) + '\n' + options.code + '\n};';
                            editor.setValue(result);
                            editor.focus();
                            editor.setCursor({line: result.split('\n').length + 1, ch: 1});
                        }
                        else if(options.mode == 'graphsource')
                        {
                            $scope.mode = options.mode;
                            editor.setValue(result.data);
                        }
                        else
                        {
                            editor.setValue(result.data);
                        }
                    }
                    else
                    {
                        editor.setValue(result.data);
                    }

                    editor.focus();

                    $scope.currentFileName = fileName;

                    editors[fileName].on('change',function(cMirror)
                    {
                        angular.element('#codeSaveButton').removeAttr('disabled');
                    });
                },
                function(err)
                {
                    alert(err.data.message);
                });
            }
            else
            {
                $scope.mode = options.mode;

                $scope.currentFileName = fileName;
                angular.element(editor.getTextArea()).next().show();
                angular.element('.dialog-graph-code-editor').show();

                if(options)
                {
                    if (options.isView)
                    {
                        var content = editor.getValue();
                        editor.focus();

                        var split = content.split('\n');
                        for (var i = 0; i < split.length; i++)
                        {
                            if (split[i].indexOf(options.target) != -1)
                            {
                                editor.setCursor({line: i, ch: 1});
                                return;
                            }
                        }
                    }
                    else if(options.isCreate)
                    {
                        $scope.mode = options.mode;
                        angular.element('.dialog-graph-code-editor-controller').addClass('edit');

                        var content = editor.getValue();
                        var index = content.lastIndexOf('};');

                        var result = content.substring(0, index) + options.code + '\n};';
                        editor.setValue(result);
                        editor.focus();
                        editor.setCursor({line: result.split('\n').length + 1, ch: 1});
                    }
                }

                var cursor = editor.getCursor();
                console.log('커서 : ', cursor);
                editor.focus();
                editor.setCursor({line: cursor.line, ch: cursor.ch});
            }

            angular.element('.dialog-graph-code-editor-controller').removeClass('edit');

            if(angular.element('#graphDialogEditor').css('right') == '0px')
            {
                angular.element('.dialog-graph-code-editor-controller').addClass('edit');
            }
        };

        if(fileName && fileName.endsWith('.js') && !fileName.endsWith('.graph.js'))
        {
            openCodeEditor(fileName);
        }

        angular.element('.dialog-graph-code-editor').get(0).openCodeEditor = openCodeEditor;

        $scope.save = function()
        {
            DialogGraphsService.save({ botId: chatbot.id, fileName: $scope.currentFileName, data: editor.getValue() }, function()
            {
                $rootScope.$broadcast('simulator-build');

                // if($scope.mode == 'graphsource')
                // {
                //     angular.element('.graph-controller .alert-success').show();
                //     $timeout(function()
                //     {
                //         angular.element('.graph-controller .alert-success').css('opacity', 1);
                //         $timeout(function()
                //         {
                //             angular.element('.graph-controller .alert-success').css('opacity', 0);
                //             $timeout(function()
                //             {
                //                 angular.element('.graph-controller .alert-success').hide();
                //             }, 600);
                //         }, 1500);
                //     }, 5);
                // }
                // else
                // {
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
                // }

                angular.element('#codeSaveButton').attr('disabled', true);
            },
            function()
            {
                alert(err.data.message);
            });
        };

        $scope.backToGraph = function()
        {
            if($scope.sourceFileName)
            {
                console.log('vkdlfdu : ', $scope.sourceFileName);
                $rootScope.$broadcast('selectTab', $scope.sourceFileName);
            }

            // $rootScope.$broadcast('refreshGraph', { fileName: $scope.sourceFileName });

            angular.element('.dialog-graph-code-editor').hide();
        };

        $scope.closeError = function()
        {
            $timeout(function()
            {
                angular.element('.dialog-graph-code-editor .alert-error').css('opacity', 0);
                $timeout(function()
                {
                    angular.element('.dialog-graph-code-editor .alert-error').hide();
                }, 600);
            }, 5);
        };

        $scope.lan=LanguageService;
    }]);
})();
