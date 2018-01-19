angular.module('playchat').controller('DialogGraphEditorController', ['$window', '$scope', '$rootScope', '$resource', '$cookies', '$location', '$compile', '$timeout', 'DialogGraph', 'DialogGraphEditor', 'DialogGraphEditorInput', 'DialogGraphEditorOutput', 'DialogGraphEditorTask', 'LanguageService',function ($window, $scope, $rootScope, $resource, $cookies, $location, $compile, $timeout, DialogGraph, DialogGraphEditor, DialogGraphEditorInput, DialogGraphEditorOutput, DialogGraphEditorTask, LanguageService)
{
    var DialogGraphsNLPService = $resource('/api/:botId/dialog-graphs/nlp/:text', { botId: '@botId', text: '@text' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.chatbot = chatbot;

    $scope.parentDialog = undefined;
    $scope.oldDialog = undefined;
    $scope.dialog = {};

    $scope.isAdvancedMode = false;

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

            // 옛날방식의 그래프를 읽기 위한 코드인데 일단 필요 없는듯 하니 뺀다. 만약 신한카드가 온다면 어떨까?
            // if(!$scope.dialog.input.length)
            // {
            //     $scope.dialog.input = [$scope.dialog.input];
            // }

            // if(typeof dialog.output == 'string')
            // {
            //     $scope.dialog.output.push({ kind: 'Content', text: dialog.output });
            // }
            // else if(typeof dialog.output == 'object')
            // {
            //     if(dialog.output.length > 0)
            //     {
            //         for(var i=0; i<dialog.output.length; i++)
            //         {
            //             //advanced 모드일때는 action을 output쪽에 처리해서 넣어주면 됨.
            //             if(dialog.output[i].if)
            //             {
            //                 $scope.isAdvancedMode = true;
            //             }
            //
            //             $scope.dialog.output.push(dialog.output[i]);
            //         }
            //     }
                // else
                // {
                //     var check = false;
                //     for(var key in dialog.output)
                //     {
                //         if(key == 'options' || key == 'repeat' || key == 'call' || key == 'callChild' || key == 'returnCall' || key == 'up' || key == 'return')
                //         {
                //             var actionObject = {};
                //             actionObject.kind = 'Action';
                //
                //             for(var key in dialog.output)
                //             {
                //                 if(key == 'repeat' || key == 'call' || key == 'callChild' || key == 'returnCall' || key == 'up' || key == 'return')
                //                 {
                //                     actionObject.type = key;
                //                     actionObject.dialog = dialog.output[key];
                //                     break;
                //                 }
                //             }
                //
                //             $scope.dialog.output.push(actionObject);
                //
                //             check = true;
                //             break;
                //         }
                //     }
                //
                //     if(!check)
                //     {
                //         $scope.dialog.output.push(dialog.output);
                //     }
                // }
            // }
            // else
            // {
            //     console.log('처리되지 않은 아웃풋 : ', dialog.output);
            // }

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

    DialogGraphEditorInput.make($scope, $rootScope);
    DialogGraphEditorOutput.make($scope);
    DialogGraphEditorTask.make($scope);

    $scope.parseResult = function()
    {
        var result = {};
        if($scope.oldDialog)
        {
            result = $scope.oldDialog;
        }

        for(var i=0; i<$scope.dialog.input.length; i++)
        {
            var input = $scope.dialog.input[i];
            for(var key in input)
            {
                if(!input[key])
                    delete input[key];
            }
        }

        // 저장시 불필요한 데이터 삭제.
        for(var i=0; i<$scope.dialog.output.length; i++)
        {
            // 이미지 업로드를 위한 데이터
            delete $scope.dialog.output[i].uploader;

            if($scope.dialog.output[i].buttons && $scope.dialog.output[i].buttons.length == 0)
            {
                // 화면 viewing을 위해 필요한 데이터 이므로 버튼이 없는경우 삭제.
                delete $scope.dialog.output[i].buttons;
            }
        }

        result.name = $scope.dialog.name;
        result.input = $scope.dialog.input;
        result.output = JSON.parse(angular.toJson($scope.dialog.output));
        if($scope.dialog.task)
        {
            result.task = $scope.dialog.task;
        }

        for(var i=0; i<result.output.length; i++)
        {
            if(result.output[i].kind == 'Action')
            {
                var actionObject = { kind: 'Action' };
                actionObject[result.output[i].type] = result.output[i].type == 'return' ? 1 : result.output[i].dialog;
                if(result.output[i].if)
                    actionObject.if = result.output[i].if;
                if(result.output[i].text)
                    actionObject.options = result.output[i].text;

                result.output[i] = actionObject;
            }
        }

        console.log(result.output);

        result.input = JSON.parse(angular.toJson(result.input).replace('#', '').replace('$', ''));
        result.output = JSON.parse(angular.toJson(result.output));
        if(result.task)
            result.task = JSON.parse(angular.toJson(result.task));

        for(var i=0; i<result.output.length; i++)
        {
            delete result.output[i].uploader;
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
        if(text)
        {
            DialogGraphsNLPService.get({ botId: chatbot.id, text: text }, function(result)
            {
                $scope.dialog.input[index].text = result.text;
                $scope.inputNLU(index+1, done);
            });
        }
        else
        {
            $scope.inputNLU(index+1, done);
        }
    };

    $scope.save = function(e)
    {
        $scope.dialog.input = $scope.tempInputList;

        $scope.inputNLU(0, function()
        {
            delete $scope.tempInputList;
            if($scope.oldDialog && !DialogGraph.checkDuplicatedName($scope.dialog))
            {
                alert($scope.dialog.name + $scope.lan(' is duplicated'));
                return;
            }

            var result = $scope.parseResult();

            // 새로 추가되는 경우 실 데이터에도 추가해줌.
            // if($scope.parentDialog && !$scope.oldDialog)
            // {
            //     DialogGraph.addChildDialog($scope.parentDialog, result);
            // }

            DialogGraph.refresh();
            DialogGraph.setDirty(true);
            DialogGraph.focusById(result.id);

            if(DialogGraphEditor.saveCallback)
            {
                DialogGraphEditor.saveCallback(result);
                DialogGraphEditor.saveCallback = undefined;
            }

            $scope.close();

            e.preventDefault();
        });
    };

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
        angular.element('.dialog-editor form .blue-button').click();
    });

    DialogGraphEditor.setOpenCallback(function(parent, dialog)
    {
        $scope.controlDialogFlow = false;

        $scope.commonDialogs = DialogGraph.getCommonDialogs();
        $scope.userDialogs = DialogGraph.getAllUserDialogs();

        if(parent && !dialog)
        {
            //새로 추가하는 경우 바로 추가해줌.
            var result = {};
            result.name = DialogGraph.getRandomName();
            result.input = [{ text: '' }];
            result.output = [{ kind: 'Content', text: '', buttons: [] }];
            result.task = undefined;

            dialog = result;

            DialogGraph.addChildDialog(parent, result);

            DialogGraph.refresh();
            DialogGraph.setDirty(true);
            DialogGraph.focusById(result.id);

            if(DialogGraphEditor.saveCallback)
            {
                DialogGraphEditor.saveCallback(result);
                DialogGraphEditor.saveCallback = undefined;
            }
        }

        $scope.initialize(parent, dialog);
    },
    function(data)
    {
        $scope.$apply(function()
        {
            $scope.dialog.input = data.input;

            for(var i=0; i<data.input.length; i++)
            {
                for(var key in data.input[i])
                {
                    if(key == 'text')
                    {
                        (function(index)
                        {
                            DialogGraphsNLPService.get({ botId: $scope.chatbot.id, text: data.input[index][key] }, function(result)
                            {
                                data.input[index][key] = result.text;
                            });
                        })(i);
                    }
                }
            }
        })
    });

    $scope.lan=LanguageService;
}]);
