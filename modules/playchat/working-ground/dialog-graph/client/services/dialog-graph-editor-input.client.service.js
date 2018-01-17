//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorInput', function ($resource, $cookies, $compile, LanguageService, CaretService)
    {
        var DialogGraphsNLPService = $resource('/api/:botId/dialog-graphs/nlp/:text', { botId: '@botId', text: '@text' });
        var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });
        var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' });

        var chatbot = $cookies.getObject('chatbot');

        var getCaretPosition = function(editableDiv) {
            var caretPos = 0,
                sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    if (range.commonAncestorContainer.parentNode == editableDiv) {
                        caretPos = range.endOffset;
                    }
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                if (range.parentElement() == editableDiv) {
                    var tempEl = document.createElement("span");
                    editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                    var tempRange = range.duplicate();
                    tempRange.moveToElementText(tempEl);
                    tempRange.setEndPoint("EndToEnd", range);
                    caretPos = tempRange.text.length;
                }
            }
            return caretPos;
        };

        var makeNewSpan = function(target, text, type, $scope, index)
        {
            var html = '<span contenteditable="true" ng-focus="onFocus($event);" ng-keydown="onKeyDown($event);" ng-keyup="onKeyUp($event)" ng-blur="onBlur($event)" data-index="' + index + '">' + text + '</span>';
            var span = angular.element($compile(html)($scope));
            span.insertAfter(target);

            return span;
        };

        var DialogGraphEditorInput = {};
        DialogGraphEditorInput.init = function($scope)
        {
            var input = JSON.parse(angular.toJson($scope.dialog.input));
            console.log(input);

            for(var i=0; i<input.length; i++)
            {
                var target = angular.element('.dialog-editor-input-wrapper > span[data-index="' + i + '"]');
                target.html('');

                for(var key in input[i])
                {
                    var text = input[i][key];
                    if(key == 'types')
                    {
                        if(typeof text == 'string')
                        {
                            var html = '<span contenteditable="true" ng-focus="onFocus($event);" ng-keydown="onKeyDown($event);" ng-keyup="onKeyUp($event)" ng-blur="onBlur($event)" data-index="' + i + '" class="' + key + '" data-type="' + key + '">$' + text + '</span>';
                            var span = angular.element($compile(html)($scope));

                            target.append(span);
                        }
                        else
                        {
                            for(var j=0; j<text.length; j++)
                            {
                                var html = '<span contenteditable="true" ng-focus="onFocus($event);" ng-keydown="onKeyDown($event);" ng-keyup="onKeyUp($event)" ng-blur="onBlur($event)" data-index="' + i + '" class="' + key + '" data-type="' + key + '">$' + text[j] + '</span>';
                                var span = angular.element($compile(html)($scope));

                                target.append(span);
                            }
                        }
                    }
                    else
                    {
                        if(key == 'intent')
                        {
                            text = '#' + text;
                        }
                        else if(key == 'entities')
                        {
                            text = '@' + text;
                        }
                        else if(key == 'regexp')
                        {
                            text = '/' + text + '/';
                        }
                        else if(key == 'if')
                        {
                            text = 'if(' + text + ')';
                        }

                        var html = '<span contenteditable="true" ng-focus="onFocus($event);" ng-keydown="onKeyDown($event);" ng-keyup="onKeyUp($event)" ng-blur="onBlur($event)" data-index="' + i + '" class="' + key + '" data-type="' + key + '">' + text + '</span>';
                        var span = angular.element($compile(html)($scope));

                        target.append(span);
                    }
                }
            }
        };

        DialogGraphEditorInput.make = function($scope)
        {
            var initInputListTimer = undefined;
            var currentListOwner = undefined;

            var initInputList = function()
            {
                $scope.showInputList = false;
                $scope.inputList = [];
                $scope.inputType = '';

                angular.element('.dialog-editor-body').css('overflow', 'auto');
            };

            var makeInputListOnKeyDown = function(e, pos, type, index)
            {
                var text = e.currentTarget.innerText;

                if(text.endsWith(' ') || text.endsWith(String.fromCharCode(160)))
                {
                    var newSpan = makeNewSpan(e.currentTarget, '', type, $scope, index);
                    CaretService.placeCaretAtEnd(newSpan.get(0));

                    e.currentTarget.innerText = text.substring(0, text.length-1);
                }
                else
                {
                    return;
                }
            };

            var showIntentInputList = function(name)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = true;
                IntentService.query({ botId: chatbot.id, page: 1, countPerPage: 10, name: name ? name.trim() : '' }, function(result)
                {
                    var list = [];
                    for(var i=0; i<result.length; i++)
                    {
                        list.push({ name: result[i].name });
                    }

                    $scope.inputType = 'intent';
                    $scope.inputListTarget = 0;
                    $scope.inputList = list;
                });
            };

            var showEntityInputList = function(name)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = true;
                EntityService.query({ botId: chatbot.id, page: 1, countPerPage: 10, name : name ? name.trim() : '' }, function(result)
                {
                    var list = [];
                    for(var i=0; i<result.length; i++)
                    {
                        list.push({ name: result[i].name });
                    }

                    $scope.inputType = 'entities';
                    $scope.inputListTarget = 0;
                    $scope.inputList = list;
                });
            };

            var showTypeInputList = function(name)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = true;

                // 나중에는 실제로 봇엔진이 들고있는 공통 타입들을 가지고 와야함.
                var commons = ["mobile","phone","date","timeType","account","count","faqType","address","number","amountType","mobileType","phoneType","dateType","accountType","countType"];
                TypeService.query({ botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id: '') }, function(result)
                {
                    var list = [];
                    for(var i=0; i<commons.length; i++)
                    {
                        if(commons[i].indexOf(name) != -1)
                        {
                            list.push({ name: commons[i] });
                        }
                    }

                    for(var i=0; i<result.length; i++)
                    {
                        if(result[i].name.indexOf(name) != -1)
                        {
                            list.push({ name: result[i].name, fileName: result[i].fileName });
                        }
                    }

                    $scope.inputType = 'types';
                    $scope.inputListTarget = 0;
                    $scope.inputList = list;

                    console.log('머냐 : ', $scope.inputList);
                });
            };

            var selectInput = function(target)
            {
                var typeText = '';
                if($scope.inputType == 'intent')
                {
                    typeText = '#';
                }
                else if($scope.inputType == 'entities')
                {
                    typeText = '@';
                }
                else if($scope.inputType == 'types')
                {
                    typeText = '$';
                }

                var name = $scope.inputList[$scope.inputListTarget].name;
                target.innerText = typeText + name + '';
                target.className = $scope.inputType;
                target.setAttribute('data-type', $scope.inputType);

                var next = target.nextElementSibling;
                if(next)
                {
                    next.focus();
                }
                else
                {
                    var span = makeNewSpan(target, '', 'text', $scope, currentListOwner.getAttribute('data-index'));
                    span.attr('data-type', 'text');
                    span.focus();
                }
            };

            $scope.selectInput = function(e)
            {
                clearTimeout(initInputListTimer);

                var children = Array.prototype.slice.call(e.currentTarget.parentElement.children);
                var index = children.indexOf(e.currentTarget);

                selectInput(currentListOwner);

                $scope.inputListTarget = index;
            };

            $scope.onMouseOver = function(e)
            {
                var children = Array.prototype.slice.call(e.currentTarget.parentElement.children);
                var index = children.indexOf(e.currentTarget);

                var typeText = '';
                if($scope.inputType == 'intent')
                {
                    typeText = '#';
                }
                else if($scope.inputType == 'entities')
                {
                    typeText = '@';
                }
                else if($scope.inputType == 'types')
                {
                    typeText = '$';
                }

                currentListOwner.className = $scope.inputType;
                currentListOwner.innerText = typeText + $scope.inputList[index].name;

                $scope.inputListTarget = index;
            };

            $scope.onMousedown = function(e)
            {
                if(e.toElement == e.currentTarget)
                {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            };
            
            $scope.focusToLastSpan = function(e)
            {
                if(e.toElement == e.currentTarget)
                {
                    var children = e.currentTarget.children;
                    children[children.length-1].focus();

                    e.stopImmediatePropagation();
                }
            };

            $scope.onBlur = function(e)
            {
                currentListOwner = e.currentTarget;

                if($scope.showInputList)
                {
                    $scope.showInputList = false;
                    initInputListTimer = setTimeout(function()
                    {
                        initInputList();
                    }, 1000);
                }

                var target = e.currentTarget.parentElement.parentElement;
                target.nextElementSibling.innerText = '';

                var index = e.currentTarget.getAttribute('data-index');

                var input = $scope.dialog.input[index];
                var children = e.currentTarget.parentElement.children;
                for(var i=0; i<children.length; i++)
                {
                    children[i].innerText = children[i].innerText.trim();

                    var type = children[i].getAttribute('data-type') || 'text';

                    var text = children[i].innerText;
                    if(type == 'intent')
                    {
                        text = text.replace('#', '');
                        input[type] = text;
                    }
                    else if(type == 'if')
                    {
                        text = text.trim();
                        text = text.substring(3, text.length-1);
                        input[type] = text;
                    }
                    else if(type == 'regexp')
                    {
                        text = text.trim();
                        var start = text.indexOf('/');
                        var end = text.lastIndexOf('/');
                        text = text.substring(start + 1, end);
                        input[type] = text;
                    }
                    else if(type == 'entities')
                    {
                        text = text.replace('@', '');
                        input[type] = text;
                    }
                    else if(type == 'types')
                    {
                        text = text.replace('$', '');
                        if(input[type])
                        {
                            console.log('인풋 타입 : ', input[type]);
                            var check = false;
                            for(var j=0; j<input[type].length; j++)
                            {
                                if(input[type][j] == text)
                                {
                                    check = true;
                                    break;
                                }
                            }

                            if(!check)
                            {
                                input[type].push(text);
                            }
                        }
                        else
                        {
                            input[type] = [text];
                        }
                    }
                    else
                    {
                        if(text)
                        {
                            input[type] = text.trim();
                        }
                    }
                }

                console.log('인풋 : ', $scope.dialog.input);
            };

            $scope.onFocus = function(e)
            {
                clearTimeout(initInputListTimer);

                var target = e.currentTarget.parentElement.parentElement;

                currentListOwner = e.currentTarget;

                var type = e.currentTarget.innerText[0];
                if(type == '#')
                {
                    target.nextElementSibling.innerText = '';
                    showIntentInputList(e.currentTarget.innerText.substring(1));
                }
                else if(type == '@')
                {
                    target.nextElementSibling.innerText = '';
                    showEntityInputList(e.currentTarget.innerText.substring(1));
                }
                else if(type == '$')
                {
                    target.nextElementSibling.innerText = '';
                    showTypeInputList(e.currentTarget.innerText.substring(1));
                }
                else
                {
                    initInputList();
                    if(type == '/' && e.currentTarget.innerText[e.currentTarget.innerText.length-1] == '/')
                    {
                        e.currentTarget.className = 'regexp';
                        e.currentTarget.setAttribute('data-type', 'regexp');

                        target.nextElementSibling.innerText = LanguageService('Please enter a regular expression.');
                    }
                    else
                    {
                        var value = e.currentTarget.innerText.trim();
                        if(value)
                        {
                            DialogGraphsNLPService.get({ botId: chatbot.id, text: value }, function(result)
                            {
                                target.nextElementSibling.innerText = '[nlu] ' + result.text;
                            });
                        }
                        else
                        {
                            target.nextElementSibling.innerText = '';
                        }
                    }
                }
            };

            $scope.onKeyDown = function(e, index)
            {
                currentListOwner = e.currentTarget;

                // 일단 키 다운이 발생하면 무조건 플레이스홀더를 지움
                var input = angular.element(e.currentTarget).parent().prev();
                input.attr('data-placeholder', input.attr('placeholder'));
                input.removeAttr('placeholder');

                console.log('키코드 : ', e.keyCode);

                index = e.currentTarget.getAttribute('data-index');
                var pos = window.getSelection().anchorOffset;
                if(e.shiftKey)
                {
                    if(e.keyCode == 51)
                    {
                        //#을 눌렀을때
                        if(e.currentTarget.innerText != '')
                        {
                            makeInputListOnKeyDown(e, pos, 'intent', index);
                        }
                        else
                        {
                            CaretService.placeCaretAtEnd(e.currentTarget);
                        }
                    }
                    else if(e.keyCode == 50) // @
                    {
                        if(e.currentTarget.innerText != '')
                        {
                            makeInputListOnKeyDown(e, pos, 'entities', index);
                        }
                        else
                        {
                            CaretService.placeCaretAtEnd(e.currentTarget);
                        }
                    }
                    else if(e.keyCode == 52) // $
                    {
                        if(e.currentTarget.innerText != '')
                        {
                            makeInputListOnKeyDown(e, pos, 'types', index);
                        }
                        else
                        {
                            CaretService.placeCaretAtEnd(e.currentTarget);
                        }
                    }
                }
                else if(e.keyCode == 191)
                {
                    if(e.currentTarget.innerText[pos] == '/')
                    {
                        e.preventDefault();
                    }
                }
                else if(e.keyCode == 37 || e.keyCode == 8)
                {
                    //left
                    if(pos == 0)
                    {
                        initInputList();
                        
                        //prev span으로 넘어간다.
                        var prev = e.currentTarget.previousElementSibling;
                        if(prev)
                        {
                            if(!e.currentTarget.innerText)
                            {
                                angular.element(e.currentTarget).remove();
                            }

                            CaretService.placeCaretAtEnd(prev);
                        }

                        if(e.keyCode == 8)
                        {
                            if(e.currentTarget.children.length > 1 && !e.currentTarget.innerText.trim())
                            {
                                angular.element(e.currentTarget).remove();
                            }
                        }
                    }
                }
                else if(e.keyCode == 39)
                {
                    //right
                    if(pos == e.currentTarget.innerText.length)
                    {
                        //next span으로 넘어간다.
                        var next = e.currentTarget.nextElementSibling;
                        if(next)
                        {
                            next.focus();

                            if(!e.currentTarget.innerText)
                            {
                                angular.element(e.currentTarget).remove();
                            }
                        }
                    }
                }
                else if(e.keyCode == 46)
                {
                    //delete
                    if(!e.currentTarget.innerText)
                    {
                        var next = e.currentTarget.nextElementSibling;
                        var prev = e.currentTarget.previousElementSibling;

                        if(!next && !prev)
                        {
                            e.currentTarget.innerText = '';
                            e.currentTarget.className = 'text';
                            e.currentTarget.setAttribute('data-type', 'text');
                        }
                        else
                        {
                            angular.element(e.currentTarget).remove();

                            if(next)
                            {
                                next.focus();
                            }
                            else if(prev)
                            {
                                CaretService.placeCaretAtEnd(prev);
                            }
                        }
                    }
                }
                else if(e.keyCode == 38)
                {
                    //up
                    if($scope.inputListTarget > 0)
                    {
                        $scope.inputListTarget--;
                    }

                    var typeText = '';
                    if($scope.inputType == 'intent')
                    {
                        typeText = '#';
                    }
                    else if($scope.inputType == 'entities')
                    {
                        typeText = '@';
                    }
                    else if($scope.inputType == 'types')
                    {
                        typeText = '$';
                    }

                    e.currentTarget.className = $scope.inputType;
                    e.currentTarget.innerText = typeText + $scope.inputList[$scope.inputListTarget].name;

                    CaretService.placeCaretAtEnd(e.currentTarget);

                    e.preventDefault();
                    e.stopPropagation();
                }
                else if(e.keyCode == 40)
                {
                    //down
                    if($scope.inputListTarget < $scope.inputList.length - 1)
                    {
                        $scope.inputListTarget++;
                    }

                    var typeText = '';
                    if($scope.inputType == 'intent')
                    {
                        typeText = '#';
                    }
                    else if($scope.inputType == 'entities')
                    {
                        typeText = '@';
                    }
                    else if($scope.inputType == 'types')
                    {
                        typeText = '$';
                    }

                    e.currentTarget.className = $scope.inputType;
                    e.currentTarget.innerText = typeText + $scope.inputList[$scope.inputListTarget].name;

                    CaretService.placeCaretAtEnd(e.currentTarget);

                    e.preventDefault();
                    e.stopPropagation();
                }
                else if(e.keyCode == 27 && $scope.showInputList)
                {
                    $scope.showInputList = false;
                    e.stopPropagation();
                    e.preventDefault();
                }
                else if(e.keyCode == 13 && $scope.showInputList)
                {
                    console.log($scope.inputType, $scope.inputListTarget);

                    selectInput(e.currentTarget, index);

                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            $scope.onKeyUp = function(e)
            {
                var target = e.currentTarget.parentElement.parentElement;

                currentListOwner = e.currentTarget;

                var input = angular.element(e.currentTarget).parent().prev();

                if(e.currentTarget.parentElement.children.length == 1 && !e.currentTarget.innerText.trim())
                {
                    input.attr('placeholder', input.attr('data-placeholder'));
                    input.removeAttr('data-placeholder');
                }

                if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 27)
                {

                }
                else
                {
                    var text = e.currentTarget.innerText.trim();
                    var type = text[0];
                    if(type == '#')
                    {
                        showIntentInputList(text.substring(1));
                    }
                    else if(type == '@')
                    {
                        showEntityInputList(text.substring(1));
                    }
                    else if(type == '$')
                    {
                        showTypeInputList(text.substring(1));
                    }
                    else if(text.endsWith('if('))
                    {
                        if(text.replace('if(', '').trim().length > 0)
                        {
                            //뭔가 입력했을때 텍스트나 정규식등을 입력한 뒤에 if(를 입력했다면 공백과 함께 해야함.
                            if(text.endsWith(' if('))
                            {
                                e.currentTarget.innerText = text.replace(' if(', '');

                                var span = makeNewSpan(e.currentTarget, 'if()', 'if', $scope, e.currentTarget.getAttribute('data-index')).get(0);

                                span.className = 'if';
                                span.setAttribute('data-type', 'if');

                                CaretService.placeCaretAtIndex(span.childNodes[0], 3);
                            }
                            else
                            {
                                // 공백 없이 입력한 경우는 발동하지 않음.
                                return;
                            }
                        }
                        else
                        {
                            //아무것도 입력하지 않고 if(를 입력했을때 조건문 입력으로 전환
                            text = text.trim();
                            var index = text.lastIndexOf(')');
                            if(index == -1)
                            {
                                e.currentTarget.innerText += ')';
                                CaretService.placeCaretAtIndex(e.currentTarget.childNodes[0], 3);
                            }

                            e.currentTarget.className = 'if';
                            e.currentTarget.setAttribute('data-type', 'if');
                        }

                        target.nextElementSibling.innerText = LanguageService('Entering conditional statements.');
                    }
                    else if(text.startsWith('if('))
                    {
                        target.nextElementSibling.innerText = LanguageService('Entering conditional statements.');
                    }
                    else
                    {
                        var start = text.indexOf('/');

                        if(start != -1 && e.keyCode != 8 && e.keyCode != 46)
                        {
                            // 만약 슬래쉬를 입력한 경우
                            if(text == '/')
                            {
                                //슬래쉬 외에 아무것도 입력한게 없을 때.
                                e.currentTarget.innerText += '/'; // 슬래쉬를 하나 더 붙여주고
                                CaretService.placeCaretAtIndex(e.currentTarget.childNodes[0], 1);
                                e.currentTarget.className = 'regexp';
                                e.currentTarget.setAttribute('data-type', 'regexp');

                                target.nextElementSibling.innerText = LanguageService('Please enter a regular expression.');
                                return;
                            }
                            else
                            {
                                // 이미 입력된 데이터가 있을 때 만약 마지막에 입력한 것이고 앞에 공백이 있다면
                                if(text[text.length-1] == '/' && text[text.length-2] == ' ')
                                {
                                    e.currentTarget.innerText = text.substring(0, text.length-2); // 공백과 슬래쉬를 없애고

                                    // span을 새로 만든다.
                                    var span = makeNewSpan(e.currentTarget, '//', 'regexp', $scope, e.currentTarget.getAttribute('data-index')).get(0);

                                    span.className = 'regexp';
                                    span.setAttribute('data-type', 'regexp');

                                    // CaretService.placeCaretAtIndex(span.childNodes[0], 2);
                                    var range = document.createRange();
                                    var sel = window.getSelection();
                                    range.setStart(span.childNodes[0], 1);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                    return;
                                }
                                else if(text[0] == '/' && text[text.length-1] == '/')
                                {
                                    //화살표 이동시에 일반 text인식으로 못가게 하려고
                                    return;
                                }
                            }
                        }

                        initInputList();

                        e.currentTarget.className = 'text';
                        e.currentTarget.setAttribute('data-type', 'text');

                        var value = e.currentTarget.innerText.trim();
                        if(value)
                        {
                            DialogGraphsNLPService.get({ botId: chatbot.id, text: value }, function(result)
                            {
                                target.nextElementSibling.innerText = '[nlu] ' + result.text;
                            });
                        }
                        else
                        {
                            target.nextElementSibling.innerText = '';
                        }
                    }
                }
            };

            $scope.addInput = function(e)
            {
                var target = angular.element(e.currentTarget).parent().parent();
                $scope.dialog.input.push({ text: '' });
                setTimeout(function()
                {
                    target.find('input:last').focus();
                }, 100);
            };
        };

        return DialogGraphEditorInput;
    });
})();
