angular.module('playchat').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'DialogGraph', 'DialogGraphEditor', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, DialogGraph, DialogGraphEditor, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var DialogGraphsService = $resource('/api/:botId/dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
    var GraphFileService = $resource('/api/:botId/graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.myBotAuth = chatbot.myBotAuth;

    $scope.fromFailedDialog = false;
    $scope.failedDialogSaved = false;
    $scope.focus = true;

    DialogGraphEditor.myBotAuth = chatbot.myBotAuth;

    //topBar숨기기 default
    angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
    angular.element('#middle-container').css("top", "0px");
    angular.element('.video-popup').css('left', '75px');

    // 실제 그래프 로직이 들어있는 서비스
    DialogGraph.isFocused = true;
    DialogGraph.setScope($compile, $scope, $rootScope);
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

        $scope.$on('refreshGraph', function(context, data)
        {
            $scope.loadFile(data.fileName || 'default.graph.js');
        });

        $scope.$on('releaseGraphFocus', function()
        {
            $scope.focus = false;
            DialogGraph.isFocused = false;
        });

        $scope.$on('makeNewType', function(context, name, sourceFileName)
        {
            var text = '    bot.setType(\'' + name + '\',\n' +
                       '    {\n' +
                       '        typeCheck: function (dialog, context, callback)\n' +
                       '        {\n' +
                       '            var matched = false;\n' +
                       '            callback(matched);\n' +
                       '        }\n' +
                       '    });';
            for(var i=0; i<$scope.fileList.length; i++)
            {
                if($scope.fileList[i].endsWith('.js') && !$scope.fileList[i].endsWith('.bot.js') && !$scope.fileList[i].endsWith('.graph.js'))
                {
                    angular.element('.tab-body .select_tab').removeClass('select_tab');
                    angular.element('#' + $scope.fileList[i].replace(/\./gi, '\\.')).addClass('select_tab');

                    $location.search().fileName = $scope.fileList[i];

                    angular.element('.dialog-graph-code-editor').get(0).openCodeEditor($scope.fileList[i], { isCreate: true, code: text, mode: 'graphsource', sourceFileName: sourceFileName });
                    break;
                }
            }
        });

        $scope.$on('makeNewTask', function(context, name, sourceFileName)
        {
            var text = '\tbot.setTask(\'' + name + '\', \n\t{\n\t\taction: function (dialog, context, callback)\n\t\t{\n\t\t\tcallback();\n\t\t}\n\t});';
            for(var i=0; i<$scope.fileList.length; i++)
            {
                if($scope.fileList[i].endsWith('.js') && !$scope.fileList[i].endsWith('.bot.js') && !$scope.fileList[i].endsWith('.graph.js'))
                {
                    angular.element('.tab-body .select_tab').removeClass('select_tab');
                    angular.element('#' + $scope.fileList[i].replace(/\./gi, '\\.')).addClass('select_tab');

                    $location.search().fileName = $scope.fileList[i];

                    angular.element('.dialog-graph-code-editor').get(0).openCodeEditor($scope.fileList[i], { isCreate: true, code: text, mode: 'graphsource', sourceFileName: sourceFileName });
                    break;
                }
            }
        });

        $scope.$on('moveToTask', function(context, data)
        {
            angular.element('.tab-body .select_tab').removeClass('select_tab');
            angular.element('#' + data.fileName.replace(/\./gi, '\\.')).addClass('select_tab');

            $location.search().fileName = data.fileName;

            angular.element('.dialog-graph-code-editor').get(0).openCodeEditor(data.fileName, { isView: true, target: data.name });
        });

        // $scope.$on('$locationChangeStart', function(event, next, current)
        // {
        //     if(DialogGraph.isDirty())
        //     {
        //         if(!confirm('변경사항이 저장되지 않았습니다. 이동하시겠습니까?'))
        //         {
        //             event.preventDefault();
        //         }
        //     }
        // });

        $scope.$on('saveDialogGraph', function(context, data)
        {
            $scope.save(data.saveFileName, data.saveHistory);
        });

        $scope.isFocused = function()
        {
            return $scope.focus;
        };

        $scope.toFocus = function()
        {
            $scope.focus = true;
            DialogGraph.isFocused = true;

            $rootScope.$broadcast('focusToDialogGraph');
        };

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

            DialogGraph.focusById(preDialogId);

            setTimeout(function()
            {
                DialogGraph.openEditorForFocused(dialog);
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
        };

        $scope.backToFailedDialog = function()
        {
            $location.url('/playchat/operation/failed-dialogs#failedDialogGraph');
        };

        $scope.initialize = function()
        {
            $scope.compactMode = 'Compact';
            $scope.commonMode = 'Common';
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
                for(var i=0; i<fileList.length; i++)
                {
                    if(fileList[i].endsWith('bot.js'))
                    {
                        fileList.splice(i, 1);
                        break;
                    }
                }

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
                    else
                    {
                        angular.element('.graph-body').append($compile('<div class="dialog-graph-error"><div><h1>' + $scope.lan('There is an error in the graph file or an unsupported version of the graph file.') + '</h1><button type="button" class="blue-button" ng-click="viewGraphSource();">' + $scope.lan('View Source') + '</button></div></div>')($scope));
                    }
                }
                else
                {
                    var isLoad = false;
                    for(var i=0; i<fileList.length; i++)
                    {
                        if(fileList[i].endsWith('graph.js'))
                        {
                            isLoad = true;
                            $scope.currentTabName = fileList[i];
                            $scope.loadFile($scope.currentTabName);
                            break;
                        }
                    }

                    if(!isLoad && fileList.length > 0)
                    {
                        $scope.currentTabName = fileList[0];
                        if(fileList[0].endsWith('graph.js'))
                        {
                            $scope.loadFile($scope.currentTabName);
                        }
                        else
                        {
                            var timer = setInterval(function()
                            {
                                if(angular.element('.dialog-graph-code-editor').get(0))
                                {
                                    angular.element('.tab-body li:first').click();
                                    clearInterval(timer);
                                }
                            }, 50);
                        }
                    }
                }
            },
            function(err)
            {
                if(err.status == 404)
                {
                    alert($scope.lan('Bot files not found.'));
                    location.href = '/playchat/';
                }
                else
                {
                    console.error(err);
                }
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

        $scope.$on('selectTab', function(context, fileName)
        {
            angular.element('.tab-body .select_tab').removeClass('select_tab');
            angular.element('#' + fileName.replace(/\./gi, '\\.')).addClass('select_tab');

            $location.search().fileName = fileName;
            $scope.currentTabName = fileName;
        });

        $scope.selectTab = function(e, fileName)
        {
            angular.element('.tab-body .select_tab').removeClass('select_tab');
            angular.element(e.currentTarget).addClass('select_tab');

            $location.search().fileName = fileName;

            if(fileName.endsWith('.graph.js'))
            {
                angular.element('.dialog-graph-code-editor').hide();

                // if(!DialogGraph.isDirty())
                //     $scope.loadFile(fileName);
            }
            else
            {
                angular.element('.dialog-graph-code-editor').get(0).openCodeEditor(fileName);
            }

            $scope.currentTabName = fileName;
        };

        $scope.loadFile = function(fileName)
        {
            $scope.initialize();

            angular.element('.graph-body').append('<div class="dialog-graph-error"><h1>Loading...</h1></div>');
            GraphFileService.get({ botId: chatbot.id, templateId: chatbot.templateId ? chatbot.templateId.id : '', fileName: fileName }, function(result)
            {
                angular.element('.graph-body .dialog-graph-error').remove();
                angular.element('#graphDialogCanvas').html('');

                if(result && result.dialogs && result.commonDialogs)
                {
                    //최초 로딩한거 history에 넣어둠.
                    $scope.graphHistory.push(JSON.parse(JSON.stringify(result)));
                    $scope.graphHistoryIndex = $scope.graphHistory.length-1;

                    var result = DialogGraph.loadFromFile(result, fileName);
                    if(!result)
                    {
                        angular.element('.graph-body').append($compile('<div class="dialog-graph-error"><div><h1>' + $scope.lan('There is an error in the graph file or an unsupported version of the graph file.') + '</h1><button type="button" class="blue-button" ng-click="viewGraphSource();">' + $scope.lan('View Source') + '</button></div></div>')($scope));
                    }

                    $scope.checkFailedDialog();
                }
                else
                {
                    angular.element('.graph-body').append($compile('<div class="dialog-graph-error"><div><h1 style="line-height: 50px; margin-bottom: 20px;">' + $scope.lan('There is an unsupported version of the graph file. if you are using previous version, then please move below.') + '</h1><a style="font-size: 20px;" href="https://old.playchat.ai">https://old.playchat.ai</a></div></div>')($scope));
                }
            },
            function(err)
            {
                if(err.status == 404)
                {
                    angular.element('.graph-body').append('<div class="dialog-graph-error"><h1>' + $scope.lan('File not found') + '</h1></div>');
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
            DialogGraph.toggleChiwld(target);
        };

        $scope.toggleCommonMode = function()
        {
            // to Detail
            $scope.compactMode = 'Compact';

            angular.element('.graph-dialog-input').show();
            angular.element('.graph-dialog-output').show();
            angular.element('.graph-dialog-buttons').show();

            if($scope.commonMode == 'Common')
            {
                // to commonDialogs
                $scope.commonMode = 'Dialog';
                DialogGraph.changeToCommonDialogs();
            }
            else
            {
                $scope.commonMode = 'Common';
                DialogGraph.changeToDialogs();
            }
        };

        $scope.viewGraphSource = function()
        {
            var fileName = $scope.currentTabName;
            angular.element('.dialog-graph-code-editor').get(0).openCodeEditor(fileName, { mode: 'graphsource', refresh: true });
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

            angular.element('.dialog-menu').css('zoom', $scope.zoom);

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

            angular.element('.dialog-menu').css('zoom', $scope.zoom);

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

                    if($scope.searchedDialogs.length > 0)
                    {
                        DialogGraph.focus($scope.searchedDialogs[$scope.searchedDialogFocus]);
                    }
                }

                e.preventDefault();
            }

            if(!value)
            {
                $scope.searchedDialogs = [];
            }
        };

        $scope.save = function(saveFileName, saveHistory)
        {
            if(!DialogGraph.isDirty())
                return;

            var data = DialogGraph.getCompleteData();

            var fileName = saveFileName || $location.search().fileName || 'default.graph.js';
            DialogGraphsService.save({ data: data, botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : ''), fileName: fileName }, function()
            {
                //저장할때마다 history 업데이트
                if(saveHistory !== false)
                {
                    $scope.graphHistory.splice($scope.graphHistoryIndex + 1, $scope.graphHistory.length - $scope.graphHistoryIndex - 1);
                }

                GraphFileService.get({ botId: chatbot.id, templateId: chatbot.templateId ? chatbot.templateId.id : '', fileName: fileName }, function(result)
                {
                    if(result && result.dialogs && result.commonDialogs)
                    {
                        if(saveHistory !== false)
                        {
                            $scope.graphHistory.push(JSON.parse(JSON.stringify(result)));
                            $scope.graphHistoryIndex = $scope.graphHistory.length - 1;
                        }

                        DialogGraph.setDirty(false);

                        $rootScope.$broadcast('simulator-build');

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
                    }
                });

                // $rootScope.$broadcast('simulator-build-without-reset-focus');

                // angular.element('.graph-controller .alert-success').show();
                // $timeout(function()
                // {
                //     angular.element('.graph-controller .alert-success').css('opacity', 1);
                //     $timeout(function()
                //     {
                //         angular.element('.graph-controller .alert-success').css('opacity', 0);
                //         $timeout(function()
                //         {
                //             angular.element('.graph-controller .alert-success').hide();
                //         }, 600);
                //     }, 1500);
                // }, 5);
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

            var data = DialogGraph.getCompleteData();
            var fileName = $location.search().fileName || 'default.graph.js';
            DialogGraphsService.save({ data: data, botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : ''), fileName: fileName }, function()
            {
                $rootScope.$broadcast('simulator-build');
            }, function(error)
            {
                alert($scope.lan('저장 실패 : ') + error.message);
            });
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

            var data = DialogGraph.getCompleteData();
            var fileName = $location.search().fileName || 'default.graph.js';
            DialogGraphsService.save({ data: data, botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : ''), fileName: fileName }, function()
            {
                $rootScope.$broadcast('simulator-build');
            }, function(error)
            {
                alert($scope.lan('저장 실패 : ') + error.message);
            });
        };



        $scope.openVideo = function(e)
        {
            $cookies.put('openVideoGraph', 'true');

            var target = e.currentTarget;
            angular.element(target).hide().prev().show().prev().show();
        };

        $scope.closeVideo = function(e)
        {
            $cookies.put('openVideoGraph', 'false');

            var target = e.currentTarget;
            angular.element(target).parent().hide().next().hide().next().show();
        };

        var isOpen = $cookies.get('openVideoGraph');
        if(!isOpen || isOpen == 'true')
        {
            angular.element('.video-popup > div').show();
            angular.element('.video-popup > img').hide();
            angular.element('.video-wrapper').hide();
            setTimeout(function()
            {
                angular.element('.video-wrapper').show('slow');
            }, 1000);
        }
        else
        {
            angular.element('.video-popup > div').hide();
            angular.element('.video-popup > img').show();
        }

        $scope.isOpenVideoPopup = false;
        $scope.openVideoPopup = function()
        {
            $scope.isOpenVideoPopup = true;
        };

        $scope.closeVideoPopup = function()
        {
            $scope.isOpenVideoPopup = false;
        };
    })();

    $scope.initialize();
    $scope.getFileList();
    $scope.lan=LanguageService;
}]);
