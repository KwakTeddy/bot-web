//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    var ListModal = (function()
    {
        var Instance = function()
        {
            this.inputModal = undefined;
        };

        Instance.prototype.open = function(type, y, x, dataCallback, selectCallback)
        {
            var that = this;

            if(this.inputModal)
            {
                this.inputModal.find('li').each(function(index)
                {
                    if(index > 0)
                    {
                        angular.element(this).remove();
                    }
                });
            }
            else
            {
                var page = 1;
                var template = '<ul class="dialog-editor-input-list-modal">' +
                               '<li data-new="true">새로만들기</li>' +
                               '</ul>';

                var t = angular.element(template);

                t.find('li').on('mousedown', function(e)
                {
                    if(this.getAttribute('data-new') == 'true')
                    {
                        //열어야 함.
                        var target = angular.element('.dialog-editor-creation-panel[data-type="' + type + '"]');
                        target.css('right', '0');

                        var value = this.getAttribute('data-name');
                        setTimeout(function()
                        {
                            target.find('form').get(0).openCallback(value);
                        }, 501);

                        target.find('form').get(0).saveCallback = function(name)
                        {
                            selectCallback(name);
                            target.css('right', '-368px');
                        };

                        target.find('form').get(0).closeCallback = function()
                        {
                            target.css('right', '-368px');
                        };
                    }

                    e.stopPropagation();
                });

                t.on('scroll', function(e)
                {
                    if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight >= e.currentTarget.scrollHeight)
                    {
                        dataCallback(++page, function(name, list)
                        {
                            that.inputModal.find('li:first').attr('data-name', name);
                            for(var i=0; i<list.length; i++)
                            {
                                var li = document.createElement('li');
                                li.innerText = list[i].name;
                                li.data = list[i];
                                li.addEventListener('click', function()
                                {
                                    selectCallback(this.innerText);
                                    that.close();
                                });

                                that.inputModal.append(li);
                            }
                        });
                    }
                });

                t.css('top', y + 'px').css('left', x + 'px');

                angular.element('body').append(t);

                this.inputModal = t;
            }

            dataCallback(1, function(name, list)
            {
                if(!that.inputModal)
                {
                    return;
                }

                that.inputModal.find('li:first').attr('data-name', name);
                for(var i=0; i<list.length; i++)
                {
                    var li = document.createElement('li');
                    li.innerText = list[i].name;
                    li.data = list[i];
                    li.addEventListener('mousedown', function(e)
                    {
                        selectCallback(this.innerText);
                        that.close();

                        e.stopPropagation();
                    });

                    that.inputModal.append(li);
                }
            });
        };

        Instance.prototype.close = function()
        {
            angular.element('.dialog-editor-input-list-modal').remove();
            this.inputModal = undefined;
        };


        return new Instance();
    })();


    angular.module('playchat').factory('DialogGraphEditorInput', function ($resource)
    {
        var DialogGraphsNLPService = $resource('/api/:botId/dialoggraphs/nlp/:text', { botId: '@botId', text: '@text' });
        var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });
        var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });

        var make = function($scope)
        {
            $scope.isAdvancedMode = false;

            $scope.nlpedText = undefined;
            $scope.showNlpTimeout = undefined;

            //나중에 실제로 서버에서 타입을 가져와야 함.
            $scope.commonTypes = ["mobile","phone","date","timeType","account","count","faqType","address","number","amountType","mobileType","phoneType","dateType","accountType","countType"];

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

            function openEntityListModal(e, input, y, x, name)
            {
                ListModal.open('entity', y, x, function(page, bind)
                {
                    EntityService.query({ botId: $scope.chatbot.id, page: page, countPerPage: 10, name : name }, function(list)
                    {
                        bind(name, list);
                    },
                    function(error)
                    {
                        alert(error.message);
                    });
                }, function(selectedText)
                {
                    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' )
                    {
                        addOrPushData(input, 'entities', '@' + selectedText);
                        if(e.currentTarget.innerText) // 자동으로 화면쪽으로 바인딩이 안되서 임시적으로.
                            e.currentTarget.innerText = '@' + selectedText;
                        angular.element('.dialog-editor-input-key:last').focus();
                    }
                    else
                    {
                        $scope.$apply(function()
                        {
                            addOrPushData(input, 'entities', '@' + selectedText);
                            if(e.currentTarget.innerText) // 자동으로 화면쪽으로 바인딩이 안되서 임시적으로.
                                e.currentTarget.innerText = '@' + selectedText;
                            angular.element('.dialog-editor-input-key:last').focus();
                        });
                    }

                    e.currentTarget.value = '';

                    e.stopPropagation();
                    e.preventDefault();
                });
            };

            function openIntentListModal(e, input, y, x, name)
            {
                ListModal.open('intent', y, x, function(page, bind)
                {
                    IntentService.query({ botId: $scope.chatbot.id, page: page, countPerPage: 10, name: name }, function(list)
                    {
                        bind(name, list);
                    },
                    function(error)
                    {
                        alert(error.message);
                    });
                }, function(selectedText)
                {
                    // 새로 만들기에서 넘어오는 스코프가 있다.
                    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' )
                    {
                        input.intent = '#' + selectedText;
                        if(e.currentTarget.innerText) // 자동으로 화면쪽으로 바인딩이 안되서 임시적으로.
                            e.currentTarget.innerText = input.intent;
                        angular.element('.dialog-editor-input-key:last').focus();
                    }
                    else
                    {
                        $scope.$apply(function()
                        {
                            input.intent = '#' + selectedText;
                            if(e.currentTarget.innerText) // 자동으로 화면쪽으로 바인딩이 안되서 임시적으로.
                                e.currentTarget.innerText = input.intent;
                            angular.element('.dialog-editor-input-key:last').focus();
                        });
                    }

                    e.currentTarget.value = '';

                    e.stopPropagation();
                    e.preventDefault();
                });
            };

            function openTypeListModal(e, input, y, x, name)
            {
                ListModal.open('type', y, x, function(page, bind)
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
                    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' )
                    {
                        addOrPushData(input, 'types', '$' + selectedText);
                        if(e.currentTarget.innerText) // 자동으로 화면쪽으로 바인딩이 안되서 임시적으로.
                            e.currentTarget.innerText = '$' + selectedText;
                        angular.element('.dialog-editor-input-key:last').focus();
                    }
                    else
                    {
                        $scope.$apply(function()
                        {
                            addOrPushData(input, 'types', '$' + selectedText);
                            if(e.currentTarget.innerText) // 자동으로 화면쪽으로 바인딩이 안되서 임시적으로.
                                e.currentTarget.innerText = '$' + selectedText;
                            angular.element('.dialog-editor-input-key:last').focus();
                        });
                    }

                    e.currentTarget.value = '';

                    e.stopPropagation();
                    e.preventDefault();
                });
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

            $scope.addInput = function()
            {
                $scope.dialog.input.push({ text: '' });
            };

            $scope.inputOnKeyDown = function(e, index)
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
                    if(value.length <= 1 && $scope.dialog.input.length > 1)
                    {
                        if(_this.checkDelete)
                        {
                            var target = _this.parentElement.previousElementSibling.children[0];
                            var strLength = target.value.length * 2;

                            target.focus();
                            target.setSelectionRange(strLength, strLength);

                            $scope.dialog.input.splice(index, 1);

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

            $scope.inputKeyOnKeyUp = function(e)
            {
                var text = e.currentTarget.value;
                if(text)
                {
                    DialogGraphsNLPService.get({ botId: $scope.chatbot.id, text: text }, function(result)
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
            };




            // -------- Advanced

            $scope.focusToInputArea = function(e)
            {
                // if(e.target && e.target.className.indexOf('dialog-editor-input-key') != -1)
                // {
                //     return;
                // }

                angular.element(e.currentTarget).find('.dialog-editor-input-key:last').focus();
            };

            $scope.getInputKeyLength = function(input, key)
            {
                return input[key].length;
            };

            $scope.inputKeyOnClick = function(e)
            {
                e.stopPropagation();
            };

            // focus
            // - @, #, $가 있으면 리스트 에디터를 띄움.
            $scope.inputKeyOnFocus = function(e, input)
            {
                e.stopPropagation();

                var value = e.currentTarget.value;
                if(e.currentTarget.nodeName == 'SPAN')
                    value = e.currentTarget.innerText;

                var rect = e.currentTarget.getBoundingClientRect();

                var y = rect.bottom;
                var x = rect.left;

                if(!value.replace('#', '').replace('@', '').replace('$', ''))
                    return;

                // @, #, $ 이것에 대해서만 열어주면 된다.
                if(value.indexOf('@') != -1)
                {
                    openEntityListModal(e, input, y, x, value.split('@')[1] || undefined);
                }
                else if(value[0] == '#')
                {
                    openIntentListModal(e, input, y, x, value.replace('#', '') || undefined);
                }
                else if(value[0] == '$')
                {
                    openTypeListModal(e, input, y, x, value.replace('$', '') || undefined);
                }
            };

            // blur
            // - 에디터 닫음.
            $scope.inputKeyOnBlur = function(e, input)
            {
                ListModal.close();
            };

            // keydown
            // - 중복 안되는 타입 체크
            $scope.inputKeyOnKeyDown = function(e, input)
            {
                var value = e.currentTarget.value;
                if(e.currentTarget.nodeName == 'SPAN')
                    value = e.currentTarget.innerText;

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
            };

            // keyup
            // -
            $scope.inputKeyOnKeyUp = function(e, input)
            {
                var value = e.currentTarget.value;
                if(e.currentTarget.nodeName == 'SPAN')
                    value = e.currentTarget.innerText;

                var key = e.currentTarget.getAttribute('data-key');

                var rect = e.currentTarget.getBoundingClientRect();

                var y = rect.bottom;
                var x = rect.left;

                // @, #, $ 이것에 대해서만 열어주면 된다.
                if(e.keyCode == 50 && value.indexOf('@') != -1)
                {
                    openEntityListModal(e, input, y, x, value.split('@')[1] || undefined);
                }
                else if(e.keyCode == 51 && value[0] == '#')
                {
                    openIntentListModal(e, input, y, x, value.replace('#', '') || undefined);
                }
                else if(e.keyCode == 52 && value[0] == '$')
                {
                    openTypeListModal(e, input, y, x, value.replace('$', '') || undefined);
                }
                else if(e.keyCode == 13)
                {
                    e.preventDefault();

                    if(value === undefined || value === null || value === '')
                    {
                        return
                    }

                    if(value.indexOf('@') != -1)
                    {
                        //다른 타입의 span에서 수정한다음 엔터를 누른 경우.
                        if(key && key != 'entities')
                        {
                            return alert('다른 형태의 Input으로 변경할 수 없습니다.');
                        }

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
                            //다른 타입의 span에서 수정한다음 엔터를 누른 경우.
                            if(key && key != 'intent')
                            {
                                return alert('다른 형태의 Input으로 변경할 수 없습니다.');
                            }

                            input.intent = value;
                            e.currentTarget.value = '';

                            angular.element('.dialog-editor-input-key:last').focus();
                        }
                    }
                    else if(value[0] == '$')
                    {
                        //다른 타입의 span에서 수정한다음 엔터를 누른 경우.
                        if(key && key != 'types')
                        {
                            return alert('다른 형태의 Input으로 변경할 수 없습니다.');
                        }

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
                            //다른 타입의 span에서 수정한다음 엔터를 누른 경우.
                            if(key && key != 'regexp')
                            {
                                return alert('다른 형태의 Input으로 변경할 수 없습니다.');
                            }

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
                            //다른 타입의 span에서 수정한다음 엔터를 누른 경우.
                            if(key && key != 'if')
                            {
                                return alert('다른 형태의 Input으로 변경할 수 없습니다.');
                            }

                            input.if = value;
                            e.currentTarget.value = '';

                            angular.element('.dialog-editor-input-key:last').focus();
                        }
                    }
                    else
                    {
                        if(input.text && key != 'text')
                        {
                            alert('이미 텍스트 형태의 Input이 추가되어 있습니다');
                        }
                        else
                        {
                            //다른 타입의 span에서 수정한다음 엔터를 누른 경우.
                            if(key && key != 'text')
                            {
                                return alert('다른 형태의 Input으로 변경할 수 없습니다.');
                            }

                            input.text = value;
                            e.currentTarget.value = '';

                            angular.element('.dialog-editor-input-key:last').focus();
                        }
                    }

                    ListModal.close();
                }
                else
                {
                    if(e.keyCode == 8 && value.length == 0)
                    {
                        ListModal.close();
                        return;
                    }
                    else if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 16 || e.keyCode == 9)
                    {
                        return;
                    }
                    else if(value.indexOf('@') == -1 && value.indexOf('#') == -1 && value.indexOf('$') == -1)
                    {
                        ListModal.close();
                    }

                    // 일반 텍스트 입력 및 탭이동시
                    if(value.indexOf('@') != -1)
                    {
                        openEntityListModal(e, input, y, x, value.replace('@', '') || undefined);
                    }
                    else if(value[0] == '#')
                    {
                        openIntentListModal(e, input, y, x, value.replace('#', '') || undefined);
                    }
                    else if(value[0] == '$')
                    {
                        openTypeListModal(e, input, y, x, value.replace('$', '') || undefined);
                    }
                    else if(value.indexOf('@') == -1 && value.indexOf('#') == -1 && value.indexOf('$') == -1)
                    {
                        ListModal.close();
                    }

                    if(value !== undefined && value !== null && value !== '')
                    {
                        DialogGraphsNLPService.get({ botId: $scope.chatbot.id, text: value }, function(result)
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
            };

            $scope.deleteInputKey = function(input, key)
            {
                if(Object.keys(input).length > 1)
                    delete input[key];

                ListModal.close();
            };
        };

        return { make: make };
    });
})();