angular.module('playchat').controller('DialogGraphEditorController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', 'DialogGraph', 'DialogGraphEditor', 'DialogGraphEditorInput', 'DialogGraphEditorOutput', 'DialogGraphEditorTask', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, DialogGraph, DialogGraphEditor, DialogGraphEditorInput, DialogGraphEditorOutput, DialogGraphEditorTask)
{
    var chatbot = $cookies.getObject('chatbot');

    $scope.chatbot = chatbot;

    $scope.parentDialog = undefined;
    $scope.oldDialog = undefined;
    $scope.dialog = {};

    $scope.initialize = function(parent, dialog)
    {
        $timeout(function()
        {
            $scope.parentDialog = parent;

            if(dialog)
            {
                $scope.oldDialog = dialog;

                $scope.dialog.name = dialog.name;
                $scope.dialog.input = dialog.input;
                $scope.dialog.output = [];

                for(var i=0, l=dialog.input.length; i<l; i++)
                {
                    if(Object.keys(dialog.input[i]).length > 1)
                    {
                        $scope.isAdvancedMode = true;
                        break;
                    }
                }

                //output이 action인경우 다른 아웃풋은 존재할 수 없다.
                if(dialog.output.length == 0 && dialog.output[0].kind == 'Action')
                {
                    var actionObject = {};
                    for(var key in dialog.children[0])
                    {
                        if(key == 'kind')
                        {
                            actionObject[key] = 'Action';
                        }
                        else
                        {
                            actionObject.type = key;
                            actionObject.dialog = dialog.children[0][key];
                        }
                    }

                    $scope.dialog.output = [{ kind: 'Content', text: '', buttons: [] }];
                    $scope.dialog.actionOutput = actionObject;

                    $scope.isUseOutput = false;
                }
                else
                {
                    //ouput이 action이 아닌경우
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
                                $scope.dialog.output.push(dialog.output[i]);
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
                }
            }
            else
            {
                $scope.dialog.name = '';
                $scope.dialog.input = [{ text: '' }];
                $scope.dialog.output = [{ kind: 'Content', text: '', buttons: [] }];
                $scope.dialog.actionOutput = { kind: 'Action', type: '', dialog: '' };

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
    });

    DialogGraphEditorInput.make($scope);
    DialogGraphEditorOutput.make($scope);
    DialogGraphEditorTask.make($scope);
    
    $scope.save = function()
    {
        if(!DialogGraph.checkDuplicatedName($scope.dialog.name))
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

        if(!$scope.isUseOutput)
        {
            //액션 타입을 선택한 경우 저장시 액션데이터만 저장하도록.
            //이렇게 하면 저장하기 전에 다시 Content등의 아웃풋을 선택하면 기존 데이터를 그대로 활용할 수 있음.
            var output = { kind: 'Action' };
            output[$scope.dialog.actionOutput.type] = $scope.dialog.actionOutput.dialog;
            result.output = [output];
        }

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

    $scope.initialize();

    DialogGraphEditor.setOpenCallback(function(parent, dialog)
    {
        $scope.commonDialogs = DialogGraph.getCommonDialogs();
        $scope.userDialogs = DialogGraph.getUserDialogs();

        $scope.initialize(parent, dialog);
    });
}]);
