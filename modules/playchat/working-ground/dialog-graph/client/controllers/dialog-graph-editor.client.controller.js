angular.module('playchat').controller('DialogGraphEditorController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', 'DialogGraph', 'DialogGraphEditor', 'DialogGraphEditorInput', 'DialogGraphEditorOutput', 'DialogGraphEditorTask', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, DialogGraph, DialogGraphEditor, DialogGraphEditorInput, DialogGraphEditorOutput, DialogGraphEditorTask, LanguageService)
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
            if($scope.dialog.output.length > 1)
            {
                var check = false;
                for(var i=0; i<$scope.dialog.output.length; i++)
                {
                    if($scope.dialog.output[i].kind == 'Action')
                    {
                        check = true;
                        break;
                    }
                }

                if(check)
                {
                    //아웃풋이 여러개고 그 중에 Action도 있는경우는 basic모드에서 편집 불가
                    alert($scope.lan('복잡한 Output 구조 편집중에는 Basic 모드로 전환할 수 없습니다.'));
                    return;
                }
            }$

            $scope.isAdvancedMode = false;
        }
        else
        {
            $scope.isAdvancedMode = true;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    $scope.$watch('isAdvancedMode', function(after, before)
    {
        if(after)
        {
            for(var i=0; i<$scope.dialog.input.length; i++)
            {
                if(!$scope.dialog.input[i].text)
                    delete $scope.dialog.input[i].text;
            }
        }

        if(after && !before && !$scope.isUseOutput && $scope.dialog.actionOutput)
        {
            // basic에서 advanced로 바뀐경우 이미 actionObject가 있다면 변환해줘야 함.
            $scope.isUseOutput = true;
            var actionObject = JSON.parse(angular.toJson($scope.dialog.actionOutput));
            for(var key in actionObject)
            {
                $scope.dialog.output[0][key] = actionObject[key];
            }

            delete $scope.dialog.output[0].text;

            angular.element('input[type="radio"][name="output"]').get(0).checked = true;
        }
        else if(!after && before)
        {
            // Advanced에서 basic으로 바뀐경우 여기는 변경이 가능한 조건일때만 수행된다. 즉 output이 Action 하나이거나 Content가 여러개.

            if($scope.dialog.output.length == 1 && $scope.dialog.output[0].kind == 'Action')
            {
                // Action이 하나인경우 actionObject로 변환하고
                var actionObject = {};
                actionObject.kind = 'Action';
                actionObject.type = $scope.dialog.output[0].type;
                actionObject.dialog = $scope.dialog.output[0].dialog;

                // Basic모드에 맞게 데이터 구조 변경
                $scope.isUseOutput = false;
                $scope.dialog.actionOutput = actionObject;
                // $scope.dialog.output;

                console.log($scope.dialog.actionOutput);

                $scope.dialog.output[0].kind = 'Content';
                $scope.dialog.output[0].text = '';
                delete $scope.dialog.output[0].type;
                delete $scope.dialog.output[0].dialog;
            }
            else if($scope.dialog.output.length > 1)
            {
                // Content로 여러개인경우는 걍 놔둬도 될듯
                $scope.isUseOutput = true;
            }
        }

        if($scope.isAdvancedMode)
        {
            $scope.useOutput();
        }
    });

    $scope.initialize = function(parent, dialog)
    {
        $timeout(function()
        {
            $scope.parentDialog = parent;

            if(dialog)
            {
                $scope.oldDialog = dialog;

                $scope.dialog.id = dialog.id;
                $scope.dialog.name = dialog.name;
                $scope.dialog.input = JSON.parse(angular.toJson(dialog.input));
                $scope.dialog.output = [];
                $scope.dialog.task = dialog.task;

                if(dialog.task)
                {
                    $scope.isAdvancedMode = true;
                }

                if(!$scope.dialog.input.length)
                {
                    for(var key in $scope.dialog.input)
                    {
                        if(key != 'text')
                        {
                            $scope.isAdvancedMode = true;
                            break;
                        }
                    }

                    $scope.dialog.input = [$scope.dialog.input];
                }
                else
                {
                    for(var i=0, l=$scope.dialog.input.length; i<l; i++)
                    {
                        if(Object.keys($scope.dialog.input[i]).length > 1)
                        {
                            $scope.isAdvancedMode = true;
                            break;
                        }
                        else
                        {
                            var string = JSON.stringify($scope.dialog.input[i]);
                            if(string.indexOf('text') == -1)
                            {
                                $scope.isAdvancedMode = true;
                                break;
                            }
                        }
                    }
                }

                if(typeof dialog.output == 'string')
                {
                    $scope.dialog.output.push({ kind: 'Content', text: dialog.output });
                }
                else if(typeof dialog.output == 'object')
                {
                    if(dialog.output.length > 0)
                    {
                        var actionObjects = [];
                        for(var i=0; i<dialog.output.length; i++)
                        {
                            //advanced 모드일때는 action을 output쪽에 처리해서 넣어주면 됨.
                            if(dialog.output[i].kind == 'Action')
                            {
                                var actionObject = {};
                                actionObject.kind = 'Action';

                                for(var key in dialog.output[i])
                                {
                                    if(key == 'repeat' || key == 'call' || key == 'callChild' || key == 'returnCall' || key == 'up' || key == 'return')
                                     {
                                        actionObject.type = key;
                                        actionObject.dialog = dialog.output[i][key];
                                    }
                                }

                                if(dialog.output[i].if)
                                {
                                    actionObject.if = dialog.output[i].if;
                                }

                                if(dialog.output[i].options)
                                {
                                    actionObject.options = dialog.output[i].options;
                                }

                                actionObjects.push(actionObject);
                            }
                            else
                            {
                                if(dialog.output[i].if)
                                {
                                    $scope.isAdvancedMode = true;
                                    $scope.isUseOutput = true;
                                }

                                $scope.dialog.output.push(dialog.output[i]);
                            }
                        }

                        if(actionObjects.length > 1)
                        {
                            $scope.isAdvancedMode = true;
                            $scope.isUseOutput = true;

                            for(var i=0; i<actionObjects.length; i++)
                            {
                                $scope.dialog.output.push(actionObjects[i]);
                            }
                        }
                        else if(actionObjects.length == 1)
                        {
                            if(!$scope.isAdvancedMode)
                            {
                                $scope.isUseOutput = false;
                                $scope.dialog.actionOutput = actionObjects[0];
                                $scope.dialog.output.push( { kind: 'Content', text: '' } );
                            }
                            else
                            {
                                $scope.dialog.output.push(actionObjects[0]);
                            }
                        }
                    }
                    else
                    {
                        var check = false;
                        for(var key in dialog.output)
                        {
                            if(key == 'options' || key == 'repeat' || key == 'call' || key == 'callChild' || key == 'returnCall' || key == 'up' || key == 'return')
                            {
                                var actionObject = {};
                                actionObject.kind = 'Action';

                                for(var key in dialog.output)
                                {
                                    if(key == 'repeat' || key == 'call' || key == 'callChild' || key == 'returnCall' || key == 'up' || key == 'return')
                                    {
                                        actionObject.type = key;
                                        actionObject.dialog = dialog.output[key];
                                        break;
                                    }
                                }

                                if(!$scope.isAdvancedMode)
                                {
                                    $scope.isUseOutput = false;
                                    $scope.dialog.actionOutput = actionObject;
                                    $scope.dialog.output.push( { kind: 'Content', text: '' } );
                                }
                                else
                                {
                                    $scope.dialog.output.push(actionObject);
                                }

                                check = true;
                                break;
                            }
                        }

                        if(!check)
                        {
                            $scope.dialog.output.push(dialog.output);
                        }
                    }
                }
                else
                {
                    console.log('처리되지 않은 아웃풋 : ', dialog.output);
                }

                console.log('아웃풋 : ', $scope.dialog.output);
            }
            else
            {
                if(parent)
                {
                    $scope.dialog.name = DialogGraph.getRandomName();
                }

                $scope.dialog.input = [{ text: '' }];
                $scope.dialog.output = [{ kind: 'Content', text: '', buttons: [] }];
                $scope.dialog.actionOutput = { kind: 'Action', type: '', dialog: '' };
                $scope.dialog.task = undefined;

                $scope.oldDialog = undefined;

                $scope.isUseOutput = true;
            }

            // 만들어진 아웃풋은 언제든지 Content 타입으로 변경될수도 있으므로 모든 output에 이미지 업로드가 가능하도록 세팅.
            // 버튼도 마찬가지. 화면 viewing을 위해 필요한 데이터.
            for(var i=0; i<$scope.dialog.output.length; i++)
            {
                $scope.setOutputButtons(i);
                $scope.setOutputImageUploader(i);
            }
        });
    };

    DialogGraphEditorInput.make($scope);
    DialogGraphEditorOutput.make($scope);
    DialogGraphEditorTask.make($scope);

    $scope.save = function(e)
    {
        if(!DialogGraph.checkDuplicatedName($scope.dialog))
        {
            alert($scope.dialog.name + $scope.lan(' is duplicated'));
            return;
        }

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
        result.output = JSON.parse(JSON.stringify($scope.dialog.output));
        if($scope.dialog.task)
            result.task = $scope.dialog.task;

        if(!$scope.isUseOutput || $scope.isAdvancedMode)
        {
            if($scope.isAdvancedMode)
            {
                //Advanced모드인경우 데이터를 잘 만들어야함.
                for(var i=0; i<result.output.length; i++)
                {
                    if(result.output[i].kind == 'Action')
                    {
                        var actionObject = { kind: 'Action' };
                        actionObject[result.output[i].type] = result.output[i].type == 'return' ? 1 : result.output[i].dialog;
                        if(result.output[i].if)
                            actionObject.if = result.output[i].if;
                        if(result.output[i].options)
                            actionObject.options = result.output[i].options;
                        result.output[i] = actionObject;
                    }
                }
            }
            else
            {
                //액션 타입을 선택한 경우 저장시 액션데이터만 저장하도록.
                //이렇게 하면 저장하기 전에 다시 Content등의 아웃풋을 선택하면 기존 데이터를 그대로 활용할 수 있음.
                var output = { kind: 'Action' };
                output[$scope.dialog.actionOutput.type] = $scope.dialog.actionOutput.type == 'return' ? 1 : $scope.dialog.actionOutput.dialog;
                result.output = [output];
            }
        }
        else
        {
            delete $scope.dialog.actionOutput;
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

        // 새로 추가되는 경우 실 데이터에도 추가해줌.
        if($scope.parentDialog && !$scope.oldDialog)
        {
            DialogGraph.addChildDialog($scope.parentDialog, result);
        }

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

    $scope.initialize();

    $scope.$on('saveDialogGraphEditor', function()
    {
        angular.element('.dialog-editor form .blue-button').click();
    });

    DialogGraphEditor.setOpenCallback(function(parent, dialog)
    {
        $scope.commonDialogs = DialogGraph.getCommonDialogs();
        $scope.userDialogs = DialogGraph.getAllUserDialogs();

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
