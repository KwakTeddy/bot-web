(function()
{
    angular.module('playchat').controller('DialogGraphCodeEditorController', ['$window', '$scope', '$resource', '$cookies', '$element', '$timeout', '$location','LanguageService', 'DialogGraph', 'CaretService', function ($window, $scope, $resource, $cookies, $element, $timeout, $location, LanguageService, DialogGraph, CaretService)
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

        (function()
        {
            window.addEventListener('keydown', function(e)
            {
                if(location.href.indexOf('/playchat/development/dialog-graph') == -1 || angular.element('.dialog-graph-code-editor').is(':visible') == false)
                    return;

                console.log(e.keyCode);

                console.log(e);

                if(e.path[0].nodeName == 'TEXTAREA')
                {
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


                    if(e.altKey && e.keyCode == 37)
                    {
                        console.log(DialogGraph.$scope.currentTabName.replace(/\./gi, '\\\\.'));

                        var prev = angular.element('#' + DialogGraph.$scope.currentTabName.replace(/\./gi, '\\.')).prev();
                        var id = prev.attr('id').replace(/\./gi, '\\\\.');

                        DialogGraph.$scope.selectTab({ currentTarget: '#' + id}, prev.attr('id'));
                        DialogGraph.$scope.currentTabName = prev.attr('id');
                    }
                    else if(e.altKey && e.keyCode == 39)
                    {
                        var next = angular.element('#' + DialogGraph.$scope.currentTabName.replace(/\./gi, '\\.')).next();
                        if(next.length == 1)
                        {
                            var id = next.attr('id').replace(/\./gi, '\\\\.');
                            DialogGraph.$scope.selectTab({ currentTarget: '#' + id}, next.attr('id'));
                            DialogGraph.$scope.currentTabName = next.attr('id');
                        }
                    }
                    else if(e.keyCode == 83 && (e.ctrlKey || e.metaKey))
                    {
                        $scope.save();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else
                    {
                        console.log(e.keyCode);
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
            $scope.mode = '';

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

                editor.focus();

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
            // 코드검사용인데 function이 들어가는 코드들도 있고 해서 고도화 필요함.
            // var code = editor.getValue();
            // try
            // {
            //     var dialogsMatch = code.match(/var dialogs[^;]*/gi);
            //     var commonDialogsMatch = code.match(/var commonDialogs[^;]*/gi);
            //
            //     if(dialogsMatch)
            //     {
            //         JSON.parse(dialogsMatch[0].replace(/var dialogs[^=]*=/gi, '').replace(';', ''));
            //     }
            //     else
            //     {
            //         throw new Error('Dialogs is not defined.');
            //     }
            //
            //     if(commonDialogsMatch)
            //     {
            //         JSON.parse(commonDialogsMatch[0].replace(/var commonDialogs[^=]*=/gi, '').replace(';', ''));
            //     }
            //     else
            //     {
            //         throw new Error('Dialogs is not defined.');
            //     }
            // }
            // catch(err)
            // {
            //     $scope.saveError = err.message;
            //
            //     if(confirm(LanguageService('JSON Format error detected. The chatbot may not work properly. Do you want to save it?')))
            //     {
            //
            //     }
            //     else
            //     {
            //         angular.element('.dialog-graph-code-editor .alert-error').show();
            //         $timeout(function()
            //         {
            //             angular.element('.dialog-graph-code-editor .alert-error').css('opacity', 1);
            //         }, 5);
            //
            //         return;
            //     }
            // }

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

        $scope.backToGraph = function()
        {
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
