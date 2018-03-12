angular.module('playchat').controller('DialogGraphEditorController', ['$window', '$scope', '$rootScope', '$resource', '$cookies', '$location', '$compile', '$timeout', 'DialogGraph', 'DialogGraphEditor', 'DialogGraphEditorInput', 'DialogGraphEditorOutput', 'DialogGraphEditorTask', 'LanguageService',function ($window, $scope, $rootScope, $resource, $cookies, $location, $compile, $timeout, DialogGraph, DialogGraphEditor, DialogGraphEditorInput, DialogGraphEditorOutput, DialogGraphEditorTask, LanguageService)
{
    var chatbot = $cookies.getObject('chatbot');

    var DialogGraphsNLPService = $resource('/api/:botId/dialog-graphs/nlp/:text', { botId: '@botId', text: '@text', language: chatbot.language });

    $scope.chatbot = chatbot;

    $scope.parentDialog = undefined;
    $scope.oldDialog = undefined;
    $scope.dialog = {};

    $scope.isNew = undefined;

    $scope.isAdvancedMode = false;

    $scope.actionList =
    [
        { key: 'call', name: LanguageService('Move Dialog') },
        { key: 'callChild', name: LanguageService('Search after dialog moved') },
        { key: 'returnCall', name: LanguageService('Return call') },
        { key: 'up', name: LanguageService('Move to parent dialog') },
        { key: 'back', name: LanguageService('Move to previous dialog') },
        { key: 'repeat', name: LanguageService('Ask the question again') },
        { key: 'return', name: LanguageService('Return') }
    ];

    $scope.changeMode = function(e)
    {
        if($scope.isAdvancedMode)
        {
            $scope.isAdvancedMode = false;
        }
        else
        {
            $scope.isAdvancedMode = true;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    $scope.initialize = function(parent, dialog)
    {
        $timeout(function()
        {
            $scope.parentDialog = parent;

            $scope.oldDialog = dialog;

            $scope.dialog = {};
            $scope.dialog.id = dialog.id;
            $scope.dialog.name = dialog.name;
            $scope.dialog.input = JSON.parse(angular.toJson(dialog.input));
            $scope.dialog.output = JSON.parse(angular.toJson(dialog.output));
            $scope.dialog.task = dialog.task;
            if(dialog.children)
            {
                $scope.dialog.children = dialog.children;
            }

            for(var i=0; i<$scope.dialog.input.length; i++)
            {
                if($scope.dialog.input[i].intent || $scope.dialog.input[i].entities || $scope.dialog.input[i].types || $scope.dialog.input[i].regexp || $scope.dialog.input[i].if)
                {
                    $scope.isAdvancedMode = true;
                    break;
                }
            }

            if($scope.dialog.task)
            {
                $scope.isAdvancedMode = true;
            }

            for(var i=0; i<dialog.output.length; i++)
            {
                //advanced 모드일때는 action을 output쪽에 처리해서 넣어주면 됨.
                if(dialog.output[i].if)
                {
                    $scope.isAdvancedMode = true;
                }
            }

            setTimeout(function()
            {
                DialogGraphEditorInput.init($scope); // 편집시에 초기화
            }, 200);

            // 만들어진 아웃풋은 언제든지 Content 타입으로 변경될수도 있으므로 모든 output에 이미지 업로드가 가능하도록 세팅.
            // 버튼도 마찬가지. 화면 viewing을 위해 필요한 데이터.
            for(var i=0; i<$scope.dialog.output.length; i++)
            {
                $scope.setOutputButtons(i);
                $scope.setOutputImageUploader(i);
            }
        });
    };

    DialogGraphEditorInput.make($scope, $rootScope, DialogGraphEditor);
    DialogGraphEditorOutput.make($scope, DialogGraphEditor);
    DialogGraphEditorTask.make($scope, DialogGraphEditor);

    // $scope.parseResult = function()
    // {
    //     var result = {};
    //     if($scope.oldDialog)
    //     {
    //         result = $scope.oldDialog;
    //     }
    //
    //     for(var i=0; i<$scope.dialog.input.length; i++)
    //     {
    //         var input = $scope.dialog.input[i];
    //         for(var key in input)
    //         {
    //             if(!input[key])
    //                 delete input[key];
    //         }
    //     }
    //
    //     // 저장시 불필요한 데이터 삭제.
    //     for(var i=0; i<$scope.dialog.output.length; i++)
    //     {
    //         // 이미지 업로드를 위한 데이터
    //         delete $scope.dialog.output[i].uploader;
    //
    //         if($scope.dialog.output[i].buttons && $scope.dialog.output[i].buttons.length == 0)
    //         {
    //             // 화면 viewing을 위해 필요한 데이터 이므로 버튼이 없는경우 삭제.
    //             delete $scope.dialog.output[i].buttons;
    //         }
    //     }
    //
    //     result.name = $scope.dialog.name;
    //     result.input = $scope.dialog.input;
    //     result.output = JSON.parse(angular.toJson($scope.dialog.output));
    //     if($scope.dialog.task)
    //     {
    //         result.task = $scope.dialog.task;
    //     }
    //
    //     console.log(result.output);
    //
    //     result.input = JSON.parse(angular.toJson(result.input).replace('#', '').replace('$', ''));
    //     result.output = JSON.parse(angular.toJson(result.output));
    //     if(result.task)
    //         result.task = JSON.parse(angular.toJson(result.task));
    //
    //     for(var i=0; i<result.output.length; i++)
    //     {
    //         delete result.output[i].uploader;
    //
    //         if(result.output[i].buttons)
    //         {
    //             for(var j=0; j<result.output[i].buttons.length; j++)
    //             {
    //                 if(!result.output[i].buttons[j].url)
    //                 {
    //                     delete result.output[i].buttons[j].url;
    //                 }
    //             }
    //         }
    //     }
    //
    //     return result;
    // };

    $scope.parseDialog = function(dialog)
    {
        var result = {};
        for(var i=0; i<dialog.input.length; i++)
        {
            var input = dialog.input[i];
            for(var key in input)
            {
                if(!input[key])
                    delete input[key];
            }
        }

        // 저장시 불필요한 데이터 삭제.
        for(var i=0; i<dialog.output.length; i++)
        {
            // 이미지 업로드를 위한 데이터
            delete dialog.output[i].uploader;

            if(dialog.output[i].buttons && dialog.output[i].buttons.length == 0)
            {
                // 화면 viewing을 위해 필요한 데이터 이므로 버튼이 없는경우 삭제.
                delete dialog.output[i].buttons;
            }
        }

        result.id = dialog.id;
        result.name = dialog.name;
        result.input = dialog.input;
        result.output = JSON.parse(angular.toJson(dialog.output));
        if(dialog.task)
        {
            result.task = dialog.task;
        }

        console.log(result.output);

        var input = angular.toJson(result.input);
        if(input.startsWith('#') || input.startsWith('$'))
        {
            input = input.substring(1);
        }

        result.input = JSON.parse(input);
        result.output = JSON.parse(angular.toJson(result.output));
        if(result.task)
            result.task = JSON.parse(angular.toJson(result.task));

        for(var i=0; i<result.output.length; i++)
        {
            delete result.output[i].uploader;

            if(result.output[i].buttons)
            {
                for(var j=0; j<result.output[i].buttons.length; j++)
                {
                    if(!result.output[i].buttons[j].url)
                    {
                        delete result.output[i].buttons[j].url;
                    }
                }
            }
        }

        if(dialog.children)
        {
            result.children = dialog.children;
        }

        return result;
    };

    $scope.inputNLU = function(index, done)
    {
        if($scope.dialog.input.length == index)
        {
            return done();
        }

        var text = $scope.dialog.input[index].text;
        if(text && text.raw.trim())
        {
            DialogGraphsNLPService.get({ botId: chatbot.id, text: text.raw }, function(result)
            {
                $scope.dialog.input[index].text = { raw: text.raw, nlp: result.text };
                $scope.inputNLU(index+1, done);
            });
        }
        else
        {
            delete $scope.dialog.input[index].text;
            $scope.inputNLU(index+1, done);
        }
    };

    $scope.save = function(e)
    {
        if($scope.oldDialog && !DialogGraph.checkDuplicatedName($scope.dialog))
        {
            alert($scope.dialog.name + $scope.lan(' is duplicated'));
            return;
        }

        $scope.dialog.input = $scope.tempInputList;

        $scope.inputNLU(0, function()
        {
            delete $scope.tempInputList;

            var result = $scope.parseDialog($scope.dialog);

            if($scope.isNew)
            {
                for(var key in result)
                {
                    $scope.isNew[key] = result[key];
                }
            }

            $scope.originalDialog = undefined;

            // DialogGraph.refresh();
            if($scope.isNew)
            {
                DialogGraph.addChildDialog($scope.parent, $scope.isNew);
            }

            DialogGraph.reloadDialog(result);
            DialogGraph.setDirty(true, $scope.currentFileName);
            DialogGraph.refreshLine();
            // DialogGraph.focusById(result.id);

            if(DialogGraphEditor.saveCallback)
            {
                DialogGraphEditor.saveCallback(result);
                DialogGraphEditor.saveCallback = undefined;
            }

            $scope.isNew = undefined;
            $scope.close();

            $rootScope.$broadcast('simulator-build');

            e.preventDefault();
        });
    };

    DialogGraphEditor.setCloseCallback(function()
    {
        if($scope.originalDialog)
        {
            var origin = JSON.stringify($scope.parseDialog($scope.originalDialog));
            var result = JSON.stringify($scope.parseDialog($scope.dialog));

            if(origin != result)
            {
                if(!confirm(LanguageService('Update is not saved. Do you want to close without saving?')))
                {
                    for(var i=0; i<$scope.dialog.output.length; i++)
                    {
                        $scope.setOutputButtons(i);
                        $scope.setOutputImageUploader(i);
                    }

                    return false;
                }
            }
        }

        if($scope.isNew)
        {
            DialogGraph.deleteDialogById($scope.isNew.id, false);
        }
        else if($scope.originalDialog && $scope.originalDialog.input.length == 1 && $scope.originalDialog.input[0].text && !$scope.originalDialog.input[0].text.raw.trim())
        {
            DialogGraph.deleteDialogById($scope.originalDialog.id, false);
        }

        $scope.isNew = undefined;

        return true;
    });

    $scope.close = function()
    {
        DialogGraphEditor.close();
    };

    $scope.isRequired = function(input)
    {
        input = JSON.parse(angular.toJson(input));
        if(Object.keys(input).length <= 1)
        {
            var check = false;
            for(var key in input)
            {
                if(!input[key])
                {
                    check = true;
                }
            }

            if(check)
            {
                angular.element('.target-input').attr('required', 'true');
            }
            else
            {
                angular.element('.target-input').removeAttr('required');
            }
        }
        else
        {
            angular.element('.target-input').removeAttr('required');
        }
    };

    $scope.$watch('dialog.input', function(after, before)
    {
        if(after)
        {
            var input = JSON.parse(angular.toJson(after));
            if(Object.keys(input).length <= 1)
            {
                var check = false;
                for(var key in input)
                {
                    if(!input[key])
                    {
                        check = true;
                    }
                }

                if(check)
                {
                    angular.element('.target-input').attr('required', 'true');
                }
                else
                {
                    angular.element('.target-input').removeAttr('required');
                }
            }
            else
            {
                angular.element('.target-input').removeAttr('required');
            }
        }
        else
        {
            angular.element('.target-input').attr('required', 'true');
        }

    }, true);

    // $scope.initialize();

    $scope.$on('saveDialogGraphEditor', function()
    {
        // angular.element('.dialog-editor form .blue-button').click();
        $scope.save();
    });

    DialogGraphEditor.setOpenCallback(function(parent, dialog, text)
    {
        if($scope.isNew)
        {
            if(!dialog || dialog.id != $scope.isNew.id)
            {
                return alert(LanguageService('The newly added card is still being edited.'));
            }
            else
            {
                return;
            }
            //기존에 추가했던애가 삭제된다는 알람 필요.
            // DialogGraph.deleteDialogById($scope.isNew.id, false, false);
        }

        $scope.currentFileName = $location.search().fileName || 'default.graph.js';
        $scope.controlDialogFlow = false;

        $scope.commonDialogs = DialogGraph.getCommonDialogs();
        $scope.userDialogs = DialogGraph.getAllUserDialogs();

        if(parent && !dialog)
        {
            //새로 추가하는 경우 바로 추가해줌.
            var result = {};
            result.name = DialogGraph.getRandomName();
            result.input = [{ text: { raw: text || '', nlp: '' } }];
            result.output = [{ kind: 'Content', text: '', buttons: [] }];
            result.task = undefined;

            dialog = result;

            // DialogGraph.addChildDialog(parent, dialog);

            DialogGraph.drawDialog(angular.element('#' + parent.id + ' .graph-dialog-children:first'), dialog);
            DialogGraph.refreshLine();
            // DialogGraph.refresh();
            // DialogGraph.setDirty(true);
            // DialogGraph.focusById(result.id);

            // $rootScope.$broadcast('saveDialogGraph', { saveFileName: DialogGraph.fileName, saveHistory: false });

            DialogGraphEditor.focusId = dialog.id;
            $scope.isNew = dialog;

            DialogGraph.focusById(dialog.id);

            if(DialogGraphEditor.saveCallback)
            {
                DialogGraphEditor.saveCallback(result);
                DialogGraphEditor.saveCallback = undefined;
            }

            $scope.originalDialog = undefined;
        }
        else if(dialog)
        {
            DialogGraphEditor.focusId = dialog.id;
            $scope.isNew = undefined;
            $scope.originalDialog = JSON.parse(angular.toJson(dialog));
        }

        $scope.parent = parent;

        $scope.initialize(parent, dialog);
    });

    $scope.saveKeydown = function(e)
    {
        console.log(e.keyCode);
        if(e.keyCode == 9)
        {
            e.preventDefault();
        }
    };

    $scope.lan=LanguageService;
}]);
