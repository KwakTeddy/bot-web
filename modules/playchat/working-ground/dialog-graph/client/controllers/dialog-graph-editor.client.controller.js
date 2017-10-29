angular.module('playchat.working-ground').controller('DialogGraphEditorController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', 'FileUploader', 'DialogGraph', 'DialogGraphEditor', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, FileUploader, DialogGraph, DialogGraphEditor)
{
    var DialogGraphsService = $resource('/api/:botId/dialoggraphs/:fileName', { botId: '@botId', fileName: '@fileName' });
    var DialogGraphsNLPService = $resource('/api/:botId/dialoggraphs/nlp/:text', { botId: '@botId', text: '@text' });

    var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });
    var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    $scope.parentDialog = undefined;
    $scope.oldDialog = undefined;
    $scope.dialog = {};

    $scope.isAdvancedMode = false;
    $scope.nlpedText = undefined;
    $scope.showNlpTimeout = undefined;
    $scope.isUseOutput = true;

    //나중에 실제로 서버에서 타입을 가져와야 함.
    $scope.commonTypes = ["mobile","phone","date","timeType","account","count","faqType","address","number","amountType","mobileType","phoneType","dateType","accountType","countType"];

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

    $scope.setOutputButtons = function(index)
    {
        if(!$scope.dialog.output[index].buttons)
            $scope.dialog.output[index].buttons = [];
    };

    $scope.setOutputImageUploader = function(index)
    {
        $scope.dialog.output[index].uploader = new FileUploader({
            url: '/api/' + chatbot.id + '/dialoggraphs/uploadImage',
            alias: 'uploadFile',
            autoUpload: true
        });

        $scope.dialog.output[index].uploader.item = 'none';
        if($scope.dialog.output[index].kind == 'Content' && $scope.dialog.output[index].image)
            $scope.dialog.output[index].uploader.item = $scope.dialog.output[index].image.url;

        $scope.dialog.output[index].uploader.onErrorItem = function(item, response, status, headers)
        {
            alert(response.message);
        };

        $scope.dialog.output[index].uploader.onSuccessItem = function(item, response, status, headers)
        {
            // console.log('성공 : ', item, response, status, headers);
            $scope.dialog.output[index].image = {
                url: response.url,
                displayname: item.file.name
            };

            $scope.$apply(function()
            {
                $scope.dialog.output[index].uploader.item = response.url;
            });
        };

        $scope.dialog.output[index].uploader.onProgressItem = function(fileItem, progress)
        {
            console.log(progress);
        };
    };

    $scope.addInput = function()
    {
        $scope.dialog.input.push({ text: '' });
    };

    $scope.inputKeyDown = function(e, index)
    {
        var _this = e.currentTarget;
        var value = e.currentTarget.value;
        if(e.keyCode == 13 && (e.ctrlKey || e.metaKey))
        {
            if(value)
            {
                $scope.dialog.input.unshift({ kind: 'text', text: value });
                e.currentTarget.value = '';
            }

            e.preventDefault();
            e.stopPropagation();

            return;
        }
        else if(e.keyCode == 8)
        {
            if(value.length <= 1 && $scope.dialog.inputList.length > 1)
            {
                if(_this.checkDelete)
                {
                    var target = _this.parentElement.previousElementSibling.children[0];
                    var strLength = target.value.length * 2;

                    target.focus();
                    target.setSelectionRange(strLength, strLength);

                    $scope.dialog.inputList.splice(index, 1);

                    e.preventDefault();
                }
                else
                {
                    var placeholder = _this.getAttribute('placeholder');
                    _this.setAttribute('placeholder', '한번더 Backpace를 누르면 Input이 삭제됩니다.');
                    _this.setAttribute('data-placeholder', placeholder);
                    _this.checkDelete = true;
                }

                return;
            }
        }

        if(_this.checkDelete)
        {
            _this.checkDelete = false;
            _this.setAttribute('placeholder', _this.getAttribute('data-placeholder') || '');
        }
    };

    $scope.inputKeyUp = function(e)
    {
        var text = e.currentTarget.value;
        if(text)
        {
            DialogGraphsNLPService.get({ botId: chatbot.id, text: text }, function(result)
            {
                $scope.nlpedText = 'nlu: ' + result.text;

                if($scope.showNlpTimeout)
                    clearTimeout($scope.showNlpTimeout);

                $scope.showNlpTimeout = setTimeout(function()
                {
                    $scope.$apply(function()
                    {
                        $scope.nlpedText = undefined;
                    });
                }, 2000);
            });
        }
    }

    $scope.getInputValueLength = function(input, key)
    {
        return input[key].length;
    };

    function addOrPushData(input, key, text)
    {
        if(input[key])
        {
            if(typeof input[key] == 'string')
            {
                input[key] = [input[key], text];
            }
            else
            {
                input[key].push(text);
            }
        }
        else
        {
            input[key] = text;
        }
    };

    function getEntity(e, input, y, x, name)
    {
        DialogGraphEditor.openInputEditor('entity', y, x, function(page, bind)
        {
            EntityService.query({ botId: chatbot.id, page: page, countPerPage: 10, name : name }, function(list)
            {
                bind(name, list);
            },
            function(error)
            {
                alert(error.message);
            });
        }, function(selectedText)
        {
            $scope.$apply(function()
            {
                addOrPushData(input, 'entities', '@' + selectedText);

                angular.element('.dialog-editor-input-key:last').focus();
            });

            e.currentTarget.value = '';

            e.stopPropagation();
            e.preventDefault();
        });
    };

    function getIntent(e, input, y, x, name)
    {
        DialogGraphEditor.openInputEditor('intent', y, x, function(page, bind)
        {
            IntentService.query({ botId: chatbot.id, page: page, countPerPage: 10, name: name }, function(list)
            {
                bind(name, list);
            },
            function(error)
            {
                alert(error.message);
            });
        }, function(selectedText)
        {
            $scope.$apply(function()
            {
                input.intent = '#' + selectedText;

                angular.element('.dialog-editor-input-key:last').focus();
            });

            e.currentTarget.value = '';

            e.stopPropagation();
            e.preventDefault();
        });
    };

    function getType(e, input, y, x, name)
    {
        DialogGraphEditor.openInputEditor('type', y, x, function(page, bind)
        {
            if(page == 1)
            {
                var list = [];
                for(var i=0, l=$scope.commonTypes.length; i<l; i++)
                {
                    if(!name || new RegExp(name, 'gi').exec($scope.commonTypes[i]))
                    {
                        list.push({ name: $scope.commonTypes[i] });
                    }
                }

                bind(name, list);
            }

        }, function(selectedText)
        {
            $scope.$apply(function()
            {
                addOrPushData(input, 'types', '$' + selectedText);

                angular.element('.dialog-editor-input-key:last').focus();
            });

            e.currentTarget.value = '';

            e.stopPropagation();
            e.preventDefault();
        });
    }

    $scope.inputValueClick = function(e)
    {
        var value = e.currentTarget.value || e.currentTarget.innerText;

        if(!value.replace('#', '').replace('@', '').replace('$', ''))
            return;

        e.stopPropagation();
    };

    $scope.inputValueFocus = function(e, input)
    {
        if(e.which != 1)
            return;

        var value = e.currentTarget.value || e.currentTarget.innerText;

        var rect = e.currentTarget.getBoundingClientRect();

        var y = rect.bottom;
        var x = rect.left;

        if(!value.replace('#', '').replace('@', '').replace('$', ''))
            return;

        // @, #, $ 이것에 대해서만 열어주면 된다.
        if(value.indexOf('@') != -1)
        {
            getEntity(e, input, y, x, value.split('@')[1] || undefined);
        }
        else if(value[0] == '#')
        {
            getIntent(e, input, y, x, value.replace('#', '') || undefined);
        }
        else if(value[0] == '$')
        {
            getType(e, input, y, x, value.replace('$', '') || undefined);
        }

        e.stopPropagation();
    };

    $scope.inputValueKeyDown = function(e, input)
    {
        if(e.keyCode == 51) // #
        {
            var key = e.currentTarget.getAttribute('data-key');
            if(input.intent && key != 'intent')
            {
                //이미 추가된게 있으면 추가 할 수 없게 함.
                alert('이미 인텐트 형태의 Input이 추가되어 있습니다');
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        else if(e.keyCode == 13)
        {
            e.preventDefault();
        }


        // var targetKey = 'value';
        // var value = e.currentTarget.value;
        // if(!e.currentTarget.value && e.currentTarget.innerText)
        // {
        //     value = e.currentTarget.innerText;
        //     targetKey = 'innerText';
        //
        //     e.currentTarget.targetKey = targetKey;
        // }
        // else
        // {
        //     e.currentTarget.targetKey = 'value';
        // }
        //
        // var key = e.currentTarget.getAttribute('data-key');
        //
        // var rect = e.currentTarget.getBoundingClientRect();
        //
        // var y = rect.bottom;
        // var x = rect.left;
        //
        // if(e.keyCode == 50) // @
        // {
        //     //엔티티 목록 modal을 보여준다.
        //     getEntity(e, input, y, x, value.replace('@', '') || undefined);
        //     e.stopPropagation();
        // }
        // else if(e.keyCode == 51) // #
        // {
        //     if(input.intent && key != 'intent')
        //     {
        //         //이미 추가된게 있으면 추가 할 수 없게 함.
        //         alert('이미 인텐트 형태의 Input이 추가되어 있습니다');
        //         e.preventDefault();
        //         e.stopPropagation();
        //         return;
        //     }
        //
        //     //인텐트 목록 modal을 보여준다.
        //     getIntent(e, input, y, x, value.replace('#', '') || undefined);
        //
        //     console.log('호출');
        //
        //     e.stopPropagation();
        // }
        // else if(e.keyCode == 52) // $
        // {
        //     //타입 목록 modal을 보여준다.
        //     getType(e, input, y, x, value.replace('$', '') || undefined);
        //
        //     e.stopPropagation();
        // }
        // else if(e.keyCode == 13)
        // {
        //     //엔터키를 누르면 현재까지 입력된 value를 기반으로 저장.
        //     if(value)
        //     {
        //         if(value[0] == '@')
        //         {
        //             addOrPushData(input, 'entities', value);
        //             e.currentTarget.value = '';
        //         }
        //         else if(value[0] == '#')
        //         {
        //             if(input.intent && key != 'intent')
        //             {
        //                 //이미 추가된게 있으면 추가 할 수 없게 함.
        //                 alert('이미 인텐트 형태의 Input이 추가되어 있습니다');
        //             }
        //             else
        //             {
        //                 input.intent = value;
        //                 e.currentTarget.value = '';
        //
        //                 angular.element('.dialog-editor-input-key:last').focus();
        //             }
        //         }
        //         else if(value[0] == '$')
        //         {
        //             addOrPushData(input, 'types', value);
        //             e.currentTarget.value = '';
        //         }
        //         else if(value[0] == '/' && value[value.length-1] == '/')
        //         {
        //             if(input.regexp)
        //             {
        //                 alert('이미 정규식 형태의 Input이 추가되어 있습니다');
        //             }
        //             else
        //             {
        //                 input.regexp = value;
        //                 e.currentTarget.value = '';
        //
        //                 angular.element('.dialog-editor-input-key:last').focus();
        //             }
        //         }
        //         else if(value.startsWith('if('))
        //         {
        //             if (input.if)
        //             {
        //                 alert('이미 조건식 형태의 Input이 추가되어 있습니다');
        //             }
        //             else
        //             {
        //                 input.if = value;
        //
        //                 angular.element('.dialog-editor-input-key:last').focus();
        //             }
        //         }
        //         else
        //         {
        //             if(input.text)
        //             {
        //                 alert('이미 텍스트 형태의 Input이 추가되어 있습니다');
        //             }
        //             else
        //             {
        //                 input.text = value;
        //                 e.currentTarget.value = '';
        //
        //                 angular.element('.dialog-editor-input-key:last').focus();
        //             }
        //         }
        //
        //         DialogGraphEditor.closeInputEditor();
        //     }
        //
        //     e.preventDefault();
        //     e.stopPropagation();
        //
        //     return;
        // }
        // else if(e.keyCode == 8)
        // {
        //     if(value.length == 1)
        //     {
        //         DialogGraphEditor.closeInputEditor();
        //         return;
        //     }
        // }
        // else if(e.keyCode == 9)
        // {
        //     DialogGraphEditor.closeInputEditor();
        //     e.stopPropagation();
        //     return;
        // }
    };

    $scope.inputValueKeyUp = function(e, input)
    {
        var value = e.currentTarget.value || e.currentTarget.innerText;

        var key = e.currentTarget.getAttribute('data-key');

        var rect = e.currentTarget.getBoundingClientRect();

        var y = rect.bottom;
        var x = rect.left;

        // @, #, $ 이것에 대해서만 열어주면 된다.
        if(e.keyCode == 50 && value.indexOf('@') != -1)
        {
            getEntity(e, input, y, x, value.split('@')[1] || undefined);
        }
        else if(e.keyCode == 51 && value[0] == '#')
        {
            getIntent(e, input, y, x, value.replace('#', '') || undefined);
        }
        else if(e.keyCode == 52 && value[0] == '$')
        {
            getType(e, input, y, x, value.replace('$', '') || undefined);
        }
        else if(e.keyCode == 13)
        {
            e.preventDefault();

            if(value.indexOf('@') != -1)
            {
                addOrPushData(input, 'entities', value);
                e.currentTarget.value = ''; // span의 경우 value가 없으므로 문제 없음.
            }
            else if(value[0] == '#')
            {
                if(input.intent && key != 'intent')
                {
                    //이미 추가된게 있으면 추가 할 수 없게 함.
                    alert('이미 인텐트 형태의 Input이 추가되어 있습니다');
                }
                else
                {
                    input.intent = value;
                    e.currentTarget.value = '';

                    angular.element('.dialog-editor-input-key:last').focus();
                }
            }
            else if(value[0] == '$')
            {
                addOrPushData(input, 'types', value);
                e.currentTarget.value = '';
            }
            else if(value[0] == '/' && value[value.length-1] == '/')
            {
                if(input.regexp)
                {
                    alert('이미 정규식 형태의 Input이 추가되어 있습니다');
                }
                else
                {
                    input.regexp = value;
                    e.currentTarget.value = '';

                    angular.element('.dialog-editor-input-key:last').focus();
                }
            }
            else if(value.startsWith('if('))
            {
                if (input.if)
                {
                    alert('이미 조건식 형태의 Input이 추가되어 있습니다');
                }
                else
                {
                    input.if = value;
                    e.currentTarget.value = '';

                    angular.element('.dialog-editor-input-key:last').focus();
                }
            }
            else
            {
                if(input.text)
                {
                    alert('이미 텍스트 형태의 Input이 추가되어 있습니다');
                }
                else
                {
                    input.text = value;
                    e.currentTarget.value = '';

                    angular.element('.dialog-editor-input-key:last').focus();
                }
            }

            DialogGraphEditor.closeInputEditor();
        }
        else if(value.indexOf('@') == -1 && value.indexOf('#') == -1 && value.indexOf('$') == -1)
        {
            DialogGraphEditor.closeInputEditor();
        }
        else
        {
            if(e.keyCode == 8 && value.length == 0)
            {
                DialogGraphEditor.closeInputEditor();
                return;
            }
            else if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 16 || e.keyCode == 9)
            {
                return;
            }

            // 일반 텍스트 입력 및 탭이동시
            if(value.indexOf('@') != -1)
            {
                getEntity(e, input, y, x, value.replace('@', '') || undefined);
            }
            else if(value[0] == '#')
            {
                getIntent(e, input, y, x, value.replace('#', '') || undefined);
            }
            else if(value[0] == '$')
            {
                getType(e, input, y, x, value.replace('$', '') || undefined);
            }
            else if(value.indexOf('@') == -1 && value.indexOf('#') == -1 && value.indexOf('$') == -1)
            {
                DialogGraphEditor.closeInputEditor();
            }
        }











        // if(e.keyCode != 8 && value.length == 1 || e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
        //     return;
        //
        // var rect = e.currentTarget.getBoundingClientRect();
        //
        // var y = rect.bottom;
        // var x = rect.left;
        //
        // //만약 나타난 리스트에서 고르지 않고 타이핑을 계속한다면 해당 이름으로 검색결과를 리스트에 보여준다.
        // if(value[0] == '@')
        // {
        //     getEntity(e, input, y, x, value.replace('@', '') || undefined);
        // }
        // else if(value[0] == '#')
        // {
        //     console.log('여기 오냐');
        //     getIntent(e, input, y, x, value.replace('#', '') || undefined);
        // }
        // else if(value[0] == '$')
        // {
        //     getType(e, input, y, x, value.replace('$', '') || undefined);
        // }
        // else if(value.indexOf('@') == -1 && value.indexOf('#') == -1 && value.indexOf('$') == -1)
        // {
        //     DialogGraphEditor.closeInputEditor();
        // }
    };

    $scope.deleteInput = function(index)
    {
        if($scope.dialog.input.length == 1)
        {
            alert('마지막 Input은 삭제할 수 없습니다');
            return;
        }

        if(confirm('정말 삭제하시겠습니까?'))
        {
            $scope.dialog.input.splice(index, 1);
        }
    };

    $scope.deleteInputKey = function(input, key)
    {
        if(Object.keys(input).length > 1)
            delete input[key];
    };

    $scope.focusInputKey = function(e)
    {
        if(e.target && e.target.className.indexOf('dialog-editor-input-key') != -1)
        {
            return;
        }

        angular.element(e.currentTarget).find('.dialog-editor-input-key:last').focus();
    };

    $scope.addOutput = function(e)
    {
        if(!$scope.useOutput)
            return;

        var output = { kind: 'text', text: '' };
        $scope.dialog.output.unshift(output);
        $scope.setOutputImageUploader(0);
    };

    $scope.changeOutputType = function(e)
    {

    };

    $scope.addOutputImage = function(e, output)
    {
        if(!$scope.isUseOutput)
            return;

        $timeout(function()
        {
            console.log(e.currentTarget.children[1]);
            e.currentTarget.children[1].click();
        })
    };

    $scope.deleteOutputImage = function(e, index)
    {
        delete $scope.dialog.output[index].image;
        $scope.dialog.output[index].uploader.item = 'none';

        // $scope.setOutputImageUploader(index);

        e.stopPropagation();
    };

    $scope.clickToImageFile = function(e, direction)
    {
        var imageFile = e.currentTarget[direction];
        console.log(imageFile);
        $timeout(function()
        {
            imageFile.click();
        });
    };

    $scope.addOutputButton = function(e, output)
    {
        if(!$scope.isUseOutput)
            return;

        output.buttons.push({ url : '', text: ''});

        $timeout(function()
        {
            e.currentTarget.nextElementSibling.querySelector('input').focus();
        });
    };

    $scope.useOutput = function (e)
    {
        $scope.isUseOutput = true;
    };

    $scope.useAction = function(e)
    {
        $scope.isUseOutput = false;
    };

    $scope.selectedItem = function(e, dialog)
    {
        $scope.dialog.actionOutput.dialog = dialog.name;
    };

    $scope.save = function()
    {
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
            ($scope.parentDialog.children || ($scope.parentDialog.children = [])).push(result);
        }

        var data = DialogGraph.getCompleteData();

        console.log('데이터 : ', data);

        var fileName = $location.search().fileName || 'default.graph.js';
        var data = DialogGraph.getCompleteData();
        DialogGraphsService.save({ data: data, botId: chatbot.id, fileName: fileName }, function()
        {
            DialogGraph.refreshLine();
            $scope.close();
        }, function(error)
        {
            alert('저장 실패 : ' + error.message);
        });
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
