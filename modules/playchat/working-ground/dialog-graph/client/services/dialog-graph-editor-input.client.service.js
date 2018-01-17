//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorInput', function ($resource, $cookies, $compile, LanguageService, CaretService)
    {
        var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });

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
        }

        var makeNewSpan = function(target, text, type, $scope)
        {
            var html = '<span contenteditable="true" class="' + type + '" ng-keydown="onKeyDown($event);" ng-keyup="onKeyUp($event, $index)">' + text + '</span>';
            var span = angular.element($compile(html)($scope));
            span.insertAfter(target);

            return span;
        };

        var DialogGraphEditorInput = {};
        DialogGraphEditorInput.make = function($scope)
        {
            var initInputList = function()
            {
                $scope.showInputList = false;
                $scope.inputList = [];
                $scope.inputType = '';
            };

            var showIntentInputList = function(name)
            {
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
            
            $scope.focusToLastSpan = function(e)
            {
                var children = e.currentTarget.children;
                children[children.length-1].focus();
            };

            $scope.onKeyDown = function(e)
            {
                var pos = window.getSelection().anchorOffset;
                console.log(pos, e.keyCode);

                if(e.shiftKey)
                {
                    if(e.keyCode == 51)
                    {
                        //#을 눌렀을때
                        if(e.currentTarget.innerText != '')
                        {
                            //만약 최초 입력이 아닌경우
                            var start = e.currentTarget.innerText.substring(0, pos);
                            var end = e.currentTarget.innerText.substring(pos);

                            if(start[pos-1] != ' ' && start[pos-1].charCodeAt(0) != 160)
                            {
                                //#이 입력되었을때 바로 앞에 공백이 있어야만 동작한다.
                                return;
                            }

                            var newSpan = makeNewSpan(e.currentTarget, e.key, 'intent', $scope);

                            e.currentTarget.innerText = start;

                            if(end.trim())
                            {
                                makeNewSpan(newSpan, end, '', $scope);
                            }

                            CaretService.placeCaretAtEnd(newSpan.get(0));

                            e.preventDefault();
                        }

                        //만약 최초 입력인경우는 그냥 실행.
                        showIntentInputList();
                    }
                    else if(e.keyCode == 50) // @
                    {
                        console.log('골뱅이');
                    }
                    else if(e.keyCode == 52) // $
                    {
                        console.log('달러');
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
                            CaretService.placeCaretAtEnd(prev);
                        }

                        if(e.keyCode == 8)
                        {
                            if(!e.currentTarget.innerText.trim())
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

                    var name = $scope.inputList[$scope.inputListTarget].name;
                    e.currentTarget.innerText = '#' + name + '';

                    var next = e.currentTarget.nextElementSibling;
                    if(next)
                    {
                        next.focus();
                    }
                    else
                    {
                        var span = makeNewSpan(e.currentTarget, '', 'text', $scope);
                        span.focus();
                    }

                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            $scope.onKeyUp = function(e)
            {
                var input = angular.element(e.currentTarget).parent().prev();

                var value = e.currentTarget.parentElement.innerText;
                if(!value)
                {
                    input.attr('placeholder', input.attr('data-placeholder'));
                    input.removeAttr('data-placeholder');
                }
                else
                {
                    input.attr('data-placeholder', input.attr('placeholder'));
                    input.removeAttr('placeholder');
                }

                if(e.keyCode == 38 || e.keyCode == 40)
                {

                }
                else
                {
                    var type = e.currentTarget.innerText[0];
                    if(type == '#')
                    {
                        showIntentInputList(e.currentTarget.innerText.substring(1));
                    }
                    else
                    {
                        initInputList();
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
