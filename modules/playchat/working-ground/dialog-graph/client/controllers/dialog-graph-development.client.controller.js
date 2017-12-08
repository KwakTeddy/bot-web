angular.module('playchat').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'DialogGraph', 'DialogGraphEditor', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, DialogGraph, DialogGraphEditor, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Graph', '/modules/playchat/gnb/client/imgs/scenario.png');

    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var DialogGraphsService = $resource('/api/:botId/dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.fromFailedDialog = false;
    $scope.failedDialogSaved = false;

    // 실제 그래프 로직이 들어있는 서비스
    DialogGraph.setScope($compile, $scope);
    DialogGraph.setDialogTemplate(angular.element('#dialogGraphTemplate').html());
    DialogGraph.setCanvas('#graphDialogCanvas');
    DialogGraph.setMenu('.dialog-menu');
    DialogGraph.setEditor(DialogGraphEditor);
    DialogGraph.setDirtyCallback(function(dirty)
    {
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' )
        {
            $scope.isDirty = dirty;
        }
        else
        {
            $scope.$apply(function()
            {
                $scope.isDirty = dirty;
            })
        }
    });

    (function()
    {
        $scope.$parent.loaded('working-ground');

        $scope.$on('makeNewType', function(context, name)
        {
            var text = 'var ' + name + ' = {\n' +
                       '  typeCheck: function (text, type, task, context, callback) {\n' +
                       '    var matched = true;\n' +
                       '    \n' +
                       '    callback(text, task, matched);\n' +
                       '\t}\n' +
                       '};\n' +
                       '\n' +
                       'bot.setType(\'' + name + '\', ' + name + ');';
            for(var i=0; i<$scope.fileList.length; i++)
            {
                if($scope.fileList[i].endsWith('.js') && !$scope.fileList[i].endsWith('.bot.js') && !$scope.fileList[i].endsWith('.graph.js'))
                {
                    angular.element('.tab-body .select_tab').removeClass('select_tab');
                    angular.element('#' + $scope.fileList[i].replace(/\./gi, '\\.')).addClass('select_tab');

                    $location.search().fileName = $scope.fileList[i];

                    angular.element('.dialog-graph-code-editor').get(0).openCodeEditor($scope.fileList[i], text);
                    break;
                }
            }
        });

        $scope.$on('makeNewTask', function(context, name)
        {
            var text = 'var ' + name + ' = {\n' +
                       '  action: function (task,context,callback) {\n' +
                       '    callback(task,context);\n' +
                       '\t}\n' +
                       '};\n' +
                       '\n' +
                       'bot.setTask(\'' + name + '\', ' + name + ');';
            for(var i=0; i<$scope.fileList.length; i++)
            {
                if($scope.fileList[i].endsWith('.js') && !$scope.fileList[i].endsWith('.bot.js') && !$scope.fileList[i].endsWith('.graph.js'))
                {
                    angular.element('.tab-body .select_tab').removeClass('select_tab');
                    angular.element('#' + $scope.fileList[i].replace(/\./gi, '\\.')).addClass('select_tab');

                    $location.search().fileName = $scope.fileList[i];

                    angular.element('.dialog-graph-code-editor').get(0).openCodeEditor($scope.fileList[i], text);
                    break;
                }
            }
        });

        $scope.$on('$locationChangeStart', function(event, next, current)
        {
            if(DialogGraph.isDirty())
            {
                if(!confirm('변경사항이 저장되지 않았습니다. 이동하시겠습니까?'))
                {
                    event.preventDefault();
                }
            }
        });

        $scope.checkFailedDialog = function()
        {
            var dialog = $location.search().dialog;
            var preDialogId = $location.search().preDialogId;

            if(!dialog || !preDialogId)
            {
                DialogGraph.removeOnLoad();
                return;
            }

            $scope.fromFailedDialog = true;

            DialogGraph.onLoad(function()
            {
                var data = {
                    input: [{ text: dialog }]
                };
                DialogGraph.focusById(preDialogId);

                setTimeout(function()
                {
                    DialogGraph.openEditorForFocused();
                    DialogGraphEditor.setSaveCallback(function(data)
                    {
                        for(var i=0; i<data.input.length; i++)
                        {
                            if(data.input[i].text == dialog)
                            {
                                $scope.failedDialogSaved = true;
                                break;
                            }
                        }
                    });
                }, 100);

                setTimeout(function()
                {
                    DialogGraph.bindDataToEditor(data);
                }, 500);
            });
        };

        $scope.backToFailedDialog = function()
        {
            $location.url('/playchat/operation/failed-dialogs#failedDialogGraph');
        };

        $scope.initialize = function()
        {
            $scope.compactMode = 'Compact';
            $scope.zoom = 1;
            $scope.searchedDialogs = [];
            $scope.searchedDialogFocus = 0;
            $scope.graphHistory = [];
            $scope.graphHistoryIndex = -1;
            $scope.isDirty = false;
            $scope.saveState = 'ready';
        };

        $scope.getFileList = function()
        {
            DialogGraphsService.query({ botId: chatbot.id, templateId: chatbot.templateId ? chatbot.templateId.id : '' }, function(fileList)
            {
                $scope.fileList = fileList;

                var fileName = $location.search().fileName;

                if(fileName)
                {
                    $scope.currentTabName = fileName;

                    if(fileName.endsWith('.graph.js'))
                    {
                        angular.element('.dialog-graph-code-editor').hide();
                        $scope.loadFile(fileName);
                    }
                }
                else
                {
                    for(var i=0; i<fileList.length; i++)
                    {
                        if(fileList[i].endsWith('graph.js'))
                        {
                            $scope.currentTabName = fileList[i];
                            $scope.loadFile($scope.currentTabName);
                            break;
                        }
                    }
                }
            },
            function(err)
            {
                console.error(err);
            });
        };

        $scope.prevTab = function(e)
        {
            var tabBody = e.currentTarget.nextElementSibling;
            tabBody.scrollLeft -= 100;
        };

        $scope.nextTab = function(e)
        {
            var tabBody = e.currentTarget.previousElementSibling;
            tabBody.scrollLeft += 100;
        };

        $scope.selectTab = function(e, fileName)
        {
            angular.element('.tab-body .select_tab').removeClass('select_tab');
            angular.element(e.currentTarget).addClass('select_tab');

            $location.search().fileName = fileName;

            if(fileName.endsWith('.graph.js'))
            {
                angular.element('.dialog-graph-code-editor').hide();

                if(!DialogGraph.isDirty())
                    $scope.loadFile(fileName);
            }
            else
            {
                angular.element('.dialog-graph-code-editor').get(0).openCodeEditor(fileName);
            }
        };

        $scope.loadFile = function(fileName)
        {
            $scope.initialize();

            angular.element('.graph-body').append('<div class="dialog-graph-error"><h1>Loading...</h1></div>');
            DialogGraphsService.get({ botId: chatbot.id, templateId: chatbot.templateId ? chatbot.templateId.id : '', fileName: fileName }, function(result)
            {
                angular.element('.graph-body .dialog-graph-error').remove();

                var data = result.data;
                if(data)
                {
                    //최초 로딩한거 history에 넣어둠.
                    $scope.graphHistory.push(data);
                    $scope.graphHistoryIndex = $scope.graphHistory.length-1;

                    var result = DialogGraph.loadFromFile(data, fileName);
                    if(!result)
                    {
                        angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>그래프 로드 실패</h1></div>');
                    }
                }
            },
            function(err)
            {
                if(err.status == 404)
                {
                    angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>파일을 찾을 수 없습니다</h1></div>');
                }
            });
        };

        $scope.toggleChild = function(e)
        {
            if(e.currentTarget.className.indexOf('folded') != -1)
            {
                e.currentTarget.className = 'graph-fold';
            }
            else
            {
                e.currentTarget.className = 'graph-fold folded';
            }

            var target = e.currentTarget.parentElement.nextElementSibling;
            DialogGraph.toggleChild(target);
        };

        $scope.toggleCompactMode = function()
        {
            if($scope.compactMode == 'Detail')
            {
                // to Detail
                $scope.compactMode = 'Compact';

                angular.element('.graph-dialog-input').show();
                angular.element('.graph-dialog-output').show();
                angular.element('.graph-dialog-buttons').show();
            }
            else
            {
                // to Compact
                $scope.compactMode = 'Detail';

                angular.element('.graph-dialog-input').hide();
                angular.element('.graph-dialog-output').hide();
                angular.element('.graph-dialog-buttons').hide();
            }

            DialogGraph.refreshButtonsPosition();
            DialogGraph.refreshLine();
        };

        $scope.$watch('zoom', function(after, before)
        {
            angular.element('.graph-zoom-controller button').removeAttr('disabled');

            if(after >= 1.3)
            {
                angular.element('.graph-zoom-in').attr('disabled', 'true');
            }
            else if(after <= 0.7)
            {
                angular.element('.graph-zoom-out').attr('disabled', 'true');
            }
        });

        $scope.zoomIn = function(e)
        {
            $scope.zoom += 0.1;
            angular.element('#graphDialogCanvas').css('zoom', $scope.zoom);
            if($scope.zoom >= 1)
            {
                angular.element('svg line').attr('shape-rendering', 'crispEdges');
            }

            DialogGraph.refreshLine();
        };

        $scope.zoomOut = function(e)
        {
            $scope.zoom -= 0.1;
            angular.element('#graphDialogCanvas').css('zoom', $scope.zoom);

            if($scope.zoom < 1)
            {
                // 1 이하로 줌이 내려가면 line이 사라지는 현상 해결용 코드
                angular.element('svg line').attr('shape-rendering', 'geometricPrecision');
            }

            DialogGraph.refreshLine();
        };

        window.addEventListener('wheel', function(e)
        {
            if(e.ctrlKey || e.metaKey)
            {
                if(e.deltaY > 0)
                {
                    $scope.zoomIn();
                }
                else
                {
                    $scope.zoomOut();
                }
            }
        });

        $scope.searchDialog = function(e)
        {
            var value = e.currentTarget.value;

            if(e.keyCode == 13)
            {
                if(value)
                {
                    if($scope.searchedDialogs.length == 0)
                    {
                        $scope.searchedDialogs = angular.element("#graphDialogCanvas .graph-dialog-header > span:contains('" + value + "')").parent().parent();
                        $scope.searchedDialogFocus = 0;
                    }
                    else
                    {
                        if($scope.searchedDialogs.length-1 == $scope.searchedDialogFocus)
                        {
                            $scope.searchedDialogFocus = 0;
                        }
                        else
                        {
                            $scope.searchedDialogFocus++;
                        }
                    }

                    DialogGraph.focus($scope.searchedDialogs[$scope.searchedDialogFocus]);
                }

                e.preventDefault();
            }

            if(!value)
            {
                $scope.searchedDialogs = [];
            }
        };

        $scope.save = function()
        {
            var data = DialogGraph.getCompleteData();

            var fileName = $location.search().fileName || 'default.graph.js';
            DialogGraphsService.save({ data: data, botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : ''), fileName: fileName }, function()
            {
                //저장할때마다 history 업데이트
                $scope.graphHistory.splice($scope.graphHistoryIndex + 1, $scope.graphHistory.length - $scope.graphHistoryIndex - 1);

                $scope.graphHistory.push(data);
                $scope.graphHistoryIndex = $scope.graphHistory.length-1;

                DialogGraph.setDirty(false);

                if($scope.fromFailedDialog && $scope.failedDialogSaved)
                {
                    FailedDialogService.update({ botId: chatbot._id, _id: $location.search().userDialogId }, function()
                    {
                    },
                    function(err)
                    {
                        alert(err.data.error || err.data.message);
                    });
                }

                $rootScope.$broadcast('simulator-build');

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
            }, function(error)
            {
                alert($scope.lan('저장 실패 : ') + error.message);
            });
        };

        $scope.undo = function()
        {
            if($scope.graphHistoryIndex <= 0)
            {
                return;
            }

            var data = $scope.graphHistory[--$scope.graphHistoryIndex];
            var result = DialogGraph.loadFromFile(data);
            if(!result)
            {
                angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>그래프 로드 실패</h1></div>');
            }

            DialogGraph.setDirty(true);
        };

        $scope.redo = function()
        {
            if($scope.graphHistoryIndex == $scope.graphHistory.length-1)
            {
                return;
            }

            var data = $scope.graphHistory[++$scope.graphHistoryIndex];
            var result = DialogGraph.loadFromFile(data);
            if(!result)
            {
                angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>그래프 로드 실패</h1></div>');
            }

            if($scope.graphHistoryIndex == $scope.graphHistory.length-1)
            {
                //리두 하고 나서 history의 마지막 데이터가 되면 저장할 필요 없어짐. 왜냐 마지막 세이브 이후 다시 저장하지 않는한 history의 마지막 데이터가 최신이다.
                DialogGraph.setDirty(false);
            }
            else
            {
                DialogGraph.setDirty(true);
            }
        };
    })();

    $scope.checkFailedDialog();
    $scope.initialize();
    $scope.getFileList();
    $scope.lan=LanguageService;
}]);
