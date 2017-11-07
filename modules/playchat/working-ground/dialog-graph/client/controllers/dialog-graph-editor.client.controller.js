angular.module('playchat').controller('DialogGraphEditorController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', 'DialogGraph', 'DialogGraphEditor', 'DialogGraphEditorInput', 'DialogGraphEditorOutput', 'DialogGraphEditorTask', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, DialogGraph, DialogGraphEditor, DialogGraphEditorInput, DialogGraphEditorOutput, DialogGraphEditorTask)
{
    var chatbot = $cookies.getObject('chatbot');

    $scope.chatbot = chatbot;

    $scope.parentDialog = undefined;
    $scope.oldDialog = undefined;
    $scope.dialog = {};

    $scope.isAdvancedMode = false;

    $scope.changeMode = function()
    {
        if($scope.isAdvancedMode)
        {
            $scope.isAdvancedMode = false;
        }
        else
        {
            $scope.isAdvancedMode = true;
        }
        console.log($scope.isAdvancedMode);
    };

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

                if(typeof dialog.output == 'string')
                {
                    $scope.dialog.output.push({ kind: 'Content', text: dialog.output });
                }
                else if(typeof dialog.output == 'object')
                {
                    if(dialog.output.length > 0)
                    {
                        for(var i=0; i<dialog.output.length; i++)
                        {
                            //advanced 모드일때는 action을 output쪽에 처리해서 넣어주면 됨.
                            if(dialog.output[i].kind == 'Action')
                            {
                                var actionObject = {};
                                actionObject.kind = 'Action';

                                for(var key in dialog.output[i])
                                {
                                    if(key != 'kind')
                                    {
                                        actionObject.type = key;
                                        actionObject.dialog = dialog.output[i][key];
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
                            }
                            else
                            {
                                $scope.dialog.output.push(dialog.output[i]);
                            }
                        }
                    }
                    else
                    {
                        $scope.dialog.output.push(dialog.output);
                    }
                }
                else
                {
                    console.log('처리되지 않은 아웃풋 : ', dialog.output);
                }

                // if(dialog.output.length == 1 && dialog.output[0].kind == 'Action')
                // {
                //     $scope.isUseOutput = false;
                //
                //     for(var key in $scope.dialog.output[0])
                //     {
                //         if(key != 'kind')
                //         {
                //             $scope.dialog.actionOutput = { type: key, dialog: $scope.dialog.output[0][key] };
                //             break;
                //         }
                //     }
                //
                //     $scope.dialog.output = [{ kind: 'Content', text: '', buttons: [] }];
                // }
                // else
                // {
                //     //output이 action이 아닌경우
                //     if(typeof dialog.output == 'string')
                //     {
                //         $scope.dialog.output.push({ kind: 'Content', text: dialog.output });
                //     }
                //     else if(typeof dialog.output == 'object')
                //     {
                //         if(dialog.output.length > 0)
                //         {
                //             for(var i=0; i<dialog.output.length; i++)
                //             {
                //                 $scope.dialog.output.push(dialog.output[i]);
                //             }
                //         }
                //         else
                //         {
                //             $scope.dialog.output.push(dialog.output);
                //         }
                //     }
                //     else
                //     {
                //         console.log('처리되지 않은 아웃풋 : ', dialog.output);
                //     }
                // }
            }
            else
            {
                $scope.dialog.name = '';
                $scope.dialog.input = [{ text: '' }];
                $scope.dialog.output = [{ kind: 'Content', text: '', buttons: [] }];
                $scope.dialog.actionOutput = { kind: 'Action', type: '', dialog: '' };
                $scope.dialog.task = undefined;

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

    $scope.$watch('isAdvancedMode', function()
    {
        if($scope.isAdvancedMode)
        {
            $scope.useOutput();
        }
    });

    DialogGraphEditorInput.make($scope);
    DialogGraphEditorOutput.make($scope);
    DialogGraphEditorTask.make($scope);

    $scope.save = function()
    {
        if(!DialogGraph.checkDuplicatedName($scope.dialog))
        {
            alert($scope.dialog.name + ' is duplicated');
            return;
        }

        var result = {};
        if($scope.oldDialog)
        {
            result = $scope.oldDialog;
        }

        result.name = $scope.dialog.name;
        result.input = $scope.dialog.input;
        result.output = $scope.dialog.output;
        if($scope.dialog.task)
            result.task = $scope.dialog.task;

        if(!$scope.isUseOutput)
        {
            //액션 타입을 선택한 경우 저장시 액션데이터만 저장하도록.
            //이렇게 하면 저장하기 전에 다시 Content등의 아웃풋을 선택하면 기존 데이터를 그대로 활용할 수 있음.
            var output = { kind: 'Action' };
            output[$scope.dialog.actionOutput.type] = $scope.dialog.actionOutput.dialog;
            result.output = [output];
        }
        else
        {
            delete $scope.dialog.actionOutput;
        }

        console.log(result.output);

        // 저장시 불필요한 데이터 삭제.
        for(var i=0; i<result.output.length; i++)
        {
            // 이미지 업로드를 위한 데이터
            delete result.output[i].uploader;

            if(result.output[i].buttons && result.output[i].buttons.length == 0)
            {
                // 화면 viewing을 위해 필요한 데이터 이므로 버튼이 없는경우 삭제.
                delete result.output[i].buttons;
            }
        }

        result.input = JSON.parse(angular.toJson(result.input).replace('#', '').replace('@', '').replace('$', ''));
        result.output = JSON.parse(angular.toJson(result.output));
        if(result.task)
            result.task = JSON.parse(angular.toJson(result.task));

        // 새로 추가되는 경우 실 데이터에도 추가해줌.
        if($scope.parentDialog && !$scope.oldDialog)
        {
            // var fileName = $location.search().fileName || 'default.graph.js';
            // var prefix = fileName.split('.')[0];
            // ($scope.parentDialog.children || ($scope.parentDialog.children = [])).push(result);

            DialogGraph.addChildDialog($scope.parentDialog, result);
        }

        DialogGraph.refresh();
        DialogGraph.setDirty(true);
        DialogGraph.focusById(result.id);
        $scope.close();
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

    DialogGraphEditor.setOpenCallback(function(parent, dialog)
    {
        $scope.commonDialogs = DialogGraph.getCommonDialogs();
        $scope.userDialogs = DialogGraph.getAllUserDialogs();


        $scope.initialize(parent, dialog);
    });
}]);
