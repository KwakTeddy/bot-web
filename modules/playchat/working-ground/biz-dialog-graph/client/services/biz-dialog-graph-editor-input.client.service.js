//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('BizDialogGraphEditorInput', function ($resource, $cookies, $compile, LanguageService, CaretService)
    {
        var chatbot = $cookies.getObject('chatbot');

        var DialogGraphsNLPService = $resource('/api/:botId/dialog-graphs/nlp/:text', { botId: '@botId', text: '@text', language: chatbot.language });
        var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });
        var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' });

        var DialogGraphEditorInput = {};
        DialogGraphEditorInput.init = function($scope)
        {
            $scope.showInputList = false;

            angular.element('.dialog-editor-input-description').text('');
            angular.element('.dialog-editor-body').css('overflow', 'auto');

            var input = JSON.parse(angular.toJson($scope.dialog.input));
            $scope.tempInputList = input;
            for(var i=0; i<input.length; i++)
            {
                var target = angular.element('.dialog-editor-input-wrapper > div[data-index="' + i + '"]');
                target.html('');

                var isBinded = false;
                for(var key in input[i])
                {
                    var text = input[i][key];
                    if(key == 'types')
                    {
                        isBinded = true;
                        if(typeof text == 'string')
                        {
                            var html = '<span class="' + key + '" data-type="' + key + '">$' + text + '</span>';
                            target.append(html);
                        }
                        else
                        {
                            for(var j=0; j<text.length; j++)
                            {
                                var html = '<span class="' + key + '" data-type="' + key + '">$' + text[j] + '</span>';
                                target.append(html);
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
                        }
                        else if(key == 'if')
                        {
                            text = 'if(' + text + ')';
                        }

                        if(key == 'text')
                        {
                            if(text.raw.trim())
                            {
                                isBinded = true;
                                target.append('<span class="text">' + text.raw + '</span>');
                            }
                        }
                        else
                        {
                            if(text.trim())
                            {
                                isBinded = true;

                                var html = '<span class="' + key + '">' + text + '</span>';
                                target.append(html);
                            }
                        }
                    }
                }

                if(isBinded)
                {
                    target.prev().attr('data-placeholder', target.prev().attr('placeholder')).removeAttr('placeholder');
                    target.prev().removeAttr('required');
                }
            }

            var template = '<div class="dialog-editor-input-guide-box">\n' +
            '                            <div class="dialog-editor-input-description"></div>\n' +
            '                            <div class="dialog-editor-input-list-box ng-hide" ng-show="showInputList">\n' +
            '                                <div class="dialog-editor-input-list-box-title">↓ ↑ to navigate&nbsp;&nbsp;&nbsp; enter to select &nbsp;&nbsp;&nbsp;esc to dismiss</div>\n' +
            '                                <ul></ul>\n' +
            '                            </div>\n' +
            '                        </div>';
            if(!angular.element('.dialog-editor-input-guide-box').get(0))
            {
                angular.element($compile(template)($scope)).insertAfter(angular.element('.dialog-editor-input-wrapper:last'));
            }
        };

        DialogGraphEditorInput.make = function($scope, $rootScope, DialogGraphEditor)
        {
            $scope.getInputPlaceHolder = function(index)
            {
                if(index >= 0)
                {
                    var div = angular.element('.dialog-editor-input-box .dialog-editor-input-wrapper').get(index);
                    div = div.querySelector('.editable');
                    if(div.innerText.length > 0)
                    {
                        return;
                    }
                }

                if($scope.isAdvancedMode)
                {
                    return LanguageService('Keyword, #Intent, @Entity, $Type, /RegExp/, if(Condition)');
                }
                else
                {
                    return LanguageService('Keyword');
                }
            };

            var initInputList = function(descriptionHide)
            {
                $scope.showInputList = false;

                if(descriptionHide)
                {
                    angular.element('.dialog-editor-input-description').text('');
                }

                angular.element('.dialog-editor-body').css('overflow', 'auto');
            };

            var moveInputListSelection = function(direction)
            {
                var target = angular.element('.dialog-editor-input-list-box > ul > li.selected');

                if(direction == 'up')
                {
                    if(target.prev().get(0))
                    {
                        target.removeClass('selected');
                        target.prev().addClass('selected');

                        var top = target.prev().get(0).offsetTop;
                        var scrollTop = target.prev().parent().get(0).scrollTop;

                        if(scrollTop > top)
                        {
                            var diff = top - scrollTop;
                            target.prev().parent().get(0).scrollTop += diff;
                        }
                    }
                }
                else if(direction == 'down')
                {
                    if(target.next().get(0))
                    {
                        target.removeClass('selected');
                        target.next().addClass('selected');

                        var bottom = target.next().get(0).offsetTop + target.next().get(0).offsetHeight;
                        var scrollTop = target.next().parent().get(0).scrollTop;
                        var scrollHeight = target.next().parent().get(0).offsetHeight;
                        
                        if(scrollTop + scrollHeight < bottom)
                        {
                            var diff = bottom - (scrollTop + scrollHeight);
                            target.next().parent().get(0).scrollTop += diff;
                        }
                    }
                }
            };

            var makeMoveInputListSelectionByMouseOver = function()
            {
                angular.element('.dialog-editor-input-list-box > ul > li').on('mouseover', function()
                {
                    angular.element('.dialog-editor-input-list-box > ul > li.selected').removeClass('selected');
                    $(this).addClass('selected');
                });
            };

            var onMousedownOnTypeList = function(callback)
            {
                angular.element('.dialog-editor-input-list-box > ul > li').on('mousedown', function()
                {
                    if(angular.element(this).attr('data-type') == 'addNew')
                    {
                        createGuidedInput();
                    }
                    else
                    {
                        callback(angular.element(this).text());
                    }
                });
            };

            var showIntentInputList = function(name, callback)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = '#';
                IntentService.query({ botId: chatbot.id, page: 1, countPerPage: 10, name: name ? name.trim() : '' }, function(result)
                {
                    var html = '';
                    for(var i=0; i<result.length; i++)
                    {
                        html += '<li>#' + result[i].name + '</li>';
                    }

                    html += '<li data-type="addNew">' + LanguageService('Add New') + '</li>';

                    angular.element('.dialog-editor-input-list-box > ul').html(html).find('li:first').attr('class', 'selected');
                    makeMoveInputListSelectionByMouseOver();
                    onMousedownOnTypeList(callback);

                    var page = 1;
                    var ul = angular.element('.dialog-editor-input-list-box > ul');
                    ul.on('scroll', function()
                    {
                        if(this.scrollTop + this.offsetHeight + 10 >= this.scrollHeight)
                        {
                            IntentService.query({ botId: chatbot.id, page: ++page, countPerPage: 10, name : name ? name.trim() : '' }, function(result)
                            {
                                if(result.length > 0)
                                {
                                    var html = '';
                                    for (var i = 0; i < result.length; i++)
                                    {
                                        html += '<li>#' + result[i].name + '</li>';
                                    }

                                    angular.element(html).insertBefore(angular.element('.dialog-editor-input-list-box > ul > li:last'));
                                }
                            });
                        }
                    });
                });
            };

            var showEntityInputList = function(name, callback)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = '@';
                EntityService.query({ botId: chatbot.id, page: 1, countPerPage: 10, name : name ? name.trim() : '' }, function(result)
                {
                    var html = '';
                    for(var i=0; i<result.length; i++)
                    {
                        html += '<li>@' + result[i].name + '</li>';
                    }

                    html += '<li data-type="addNew">' + LanguageService('Add New') + '</li>';

                    angular.element('.dialog-editor-input-list-box > ul').html(html).find('li:first').attr('class', 'selected');
                    makeMoveInputListSelectionByMouseOver();
                    onMousedownOnTypeList(callback);

                    var page = 1;
                    var ul = angular.element('.dialog-editor-input-list-box > ul');
                    ul.on('scroll', function()
                    {
                        if(this.scrollTop + this.offsetHeight + 10 >= this.scrollHeight)
                        {
                            EntityService.query({ botId: chatbot.id, page: ++page, countPerPage: 10, name : name ? name.trim() : '' }, function(result)
                            {
                                if(result.length > 0)
                                {
                                    var html = '';
                                    for (var i = 0; i < result.length; i++)
                                    {
                                        html += '<li>@' + result[i].name + '</li>';
                                    }

                                    angular.element(html).insertBefore(angular.element('.dialog-editor-input-list-box > ul > li:last'));
                                }
                            });
                        }
                    });
                });
            };

            var showTypeInputList = function(name, callback)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = '$';

                TypeService.query({ botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id: '') }, function(result)
                {
                    var html = '';
                    for(var i=0; i<result.length; i++)
                    {
                        if(!name || result[i].name.indexOf(name) != -1)
                        {
                            html += '<li>$' + result[i].name + '</li>';
                        }
                    }

                    html += '<li data-type="addNew">' + LanguageService('Add New') + '</li>';

                    angular.element('.dialog-editor-input-list-box > ul').html(html).find('li:first').attr('class', 'selected');
                    makeMoveInputListSelectionByMouseOver();
                    onMousedownOnTypeList(callback);
                });
            };

            var openAddPanel = function(focusedText, focusedElement, type, typeText, callback)
            {
                var target = angular.element('.dialog-editor-creation-panel[data-type="' + type + '"]').show();
                target.css('right', '0');

                setTimeout(function()
                {
                    if(target.find('form').get(0).open)
                        target.find('form').get(0).open();
                }, 501);

                if(target.find('form').get(0).openCallback)
                    target.find('form').get(0).openCallback(focusedText.replace(typeText, ''));

                target.find('form').get(0).saveCallback = function(name)
                {
                    callback(typeText + name);
                    target.css('right', '-368px');
                };

                target.find('form').get(0).closeCallback = function()
                {
                    CaretService.placeCaretAtEnd(focusedElement);
                    target.css('right', '-368px');
                };
            };

            var createGuidedInput = function ()
            {
                var selection = window.getSelection();

                var focusedElement = selection.focusNode.parentElement;

                if(focusedElement.className == 'editable')
                {
                    focusedElement = selection.focusNode;
                }

                var focusedText = focusedElement.innerText;

                var callback = function(name)
                {
                    focusedElement.innerText = name;

                    var lastSpanElement = document.createElement('span');
                    lastSpanElement.innerText = String.fromCharCode(160);
                    focusedElement.after(lastSpanElement);

                    CaretService.placeCaretAtEnd(lastSpanElement);

                    initInputList(true);
                };

                if(focusedText.startsWith('#'))
                {
                    openAddPanel(focusedText, focusedElement, 'intent', '#', callback);
                }
                else if(focusedText.startsWith('@'))
                {
                    openAddPanel(focusedText, focusedElement, 'entity', '@', callback);
                }
                else if(focusedText.startsWith('$'))
                {
                    $rootScope.$broadcast('makeNewType', focusedText.replace('$', ''), angular.element('.graph-background .select_tab').attr('id'));
                }
            };

            $scope.onBlur = function(e, index)
            {
                if($scope.lastFocusTarget)
                {
                    //인텐트 리스트 등에서 클릭했을때 포커스를 위해서
                    CaretService.placeCaretAtEnd($scope.lastFocusTarget);
                    $scope.lastFocusTarget = undefined;

                    return;
                }

                var textNodes = [];
                var children = e.currentTarget.childNodes;
                for(var i=0; i<children.length; i++)
                {
                    if(children[i].nodeName == '#text' || !children[i].className)
                    {
                        var text = (children[i].textContent || children[i].innerText);
                        if(text && text.trim())
                        {
                            textNodes.push(children[i]);
                        }
                    }
                }

                for(var i=0; i<textNodes.length; i++)
                {
                    var span = document.createElement('span');
                    span.innerText = (textNodes[i].textContent || textNodes[i].innerText).trim();
                    span.className = 'text';

                    e.currentTarget.insertBefore(span, textNodes[i]);
                    e.currentTarget.removeChild(textNodes[i]);
                }

                if(!$scope.tempInputList)
                {
                    $scope.tempInputList = [];
                }

                var input = $scope.tempInputList[index] = {};

                var children = e.currentTarget.childNodes;
                for(var i=0; i<children.length; i++)
                {
                    if(children[i].nodeName == 'SPAN')
                    {
                        var type = children[i].className;
                        if(type)
                        {
                            if(type == 'types')
                            {
                                var text = children[i].innerText.replace('$', '');
                                if(input[type] && input[type].indexOf(text) == -1)
                                {
                                    input[type].push(text);
                                }
                                else if(!input[type])
                                {
                                    input[type] = [text];
                                }
                            }
                            else if(type == 'text')
                            {
                                input.text = { raw: children[i].innerText, nlp: '' };
                            }
                            else
                            {
                                input[type] = children[i].innerText.replace('#', '').replace('@', '').replace('if(', '').replace(')', '');
                            }
                        }
                    }
                }

                for(var i=0; i<$scope.tempInputList.length; i++)
                {
                    if(!$scope.tempInputList[i] || Object.keys($scope.tempInputList[i]).length == 0)
                    {
                        angular.element('.dialog-editor-input-wrapper > div[data-index="' + i + '"]').prev().attr('required', 'true');
                    }
                    else
                    {
                        angular.element('.dialog-editor-input-wrapper > div[data-index="' + i + '"]').prev().removeAttr('required');
                    }
                }

                angular.element('.dialog-editor-input-description').text('');
                angular.element('.dialog-editor-body').css('overflow', 'auto');

                initInputList(true);
            };

            $scope.focusGuideBox = function(e)
            {
                angular.element('.dialog-editor-input-box > .dialog-editor-input-guide-box').insertAfter(e.currentTarget.parentElement);
            };

            $scope.onFocus = function()
            {
                var selection = window.getSelection();
                var target = selection.focusNode.parentElement;
                if(selection.focusNode.className == 'editable')
                {
                    target = selection.focusNode;
                }

                var text = target.innerText;
                var type = target.getAttribute('data-type');

                if(type == 'intent')
                {
                    showIntentInputList(text.replace('#', ''), target, function(selected)
                    {
                        selectionListThenCreateBlankSpan(e, selected, selection.focusNode);
                    });
                }
                else if(type == 'entities')
                {
                    showEntityInputList(text.replace('@', ''), target, function(selected)
                    {
                        selectionListThenCreateBlankSpan(e, selected, selection.focusNode);
                    });
                }
                else if(type == 'types')
                {
                    showTypeInputList(text.replace('$', ''), target, function(selected)
                    {
                        selectionListThenCreateBlankSpan(e, selected, selection.focusNode);
                    });
                }
                else if(type == 'regexp')
                {
                    initInputList(false);
                    angular.element('.dialog-editor-input-description').text(LanguageService('Please enter a regular expression.'));
                }
                else if(type == 'if')
                {
                    initInputList(false);
                    angular.element('.dialog-editor-input-description').text(LanguageService('Entering conditional statements.'));
                }
                else
                {
                    initInputList(false);
                    if(text.trim())
                    {
                        DialogGraphsNLPService.get({ botId: chatbot.id, text: text }, function(result)
                        {
                            if(result.text.trim())
                            {
                                angular.element('.dialog-editor-input-description').text('[nlu] ' + result.text);
                            }
                            else
                            {
                                angular.element('.dialog-editor-input-description').text('');
                            }
                        });
                    }
                    else
                    {
                        initInputList(true);
                    }
                }
            };

            $scope.moveFocusToEditable = function(e)
            {
                e.currentTarget.nextElementSibling.focus();
            };

            var createTextSpan = function(e, focusNode, newText, className)
            {
                var text = focusNode.textContent;

                var newSpan = document.createElement('span');
                newSpan.innerText = newText;

                if(focusNode.parentElement.nodeName != 'SPAN')
                {
                    var span = document.createElement('span');
                    span.className = className;
                    span.innerText = text.trim();
                    e.currentTarget.appendChild(span);

                    focusNode.textContent = '';
                }
                else if(!focusNode.parentElement.className)
                {
                    if(focusNode.parentElement.parentElement.nodeName == 'FONT')
                    {
                        var font = focusNode.parentElement.parentElement;
                        focusNode.parentElement.parentElement.parentElement.insertBefore(focusNode.parentElement, font);
                        font.parentElement.removeChild(font);
                    }

                    focusNode.parentElement.className = 'text';
                }

                e.currentTarget.appendChild(newSpan);

                CaretService.placeCaretAtEnd(newSpan);

                e.preventDefault();
            };

            var createNewTypeSpan = function(e, focusNode, newText, className)
            {
                if(focusNode.nodeName != 'DIV' && !focusNode.textContent.trim())
                {
                    focusNode.parentElement.removeChild(focusNode);
                }

                var newSpan = document.createElement('span');
                newSpan.innerText = newText;
                newSpan.className = className;
                e.currentTarget.appendChild(newSpan);
                CaretService.placeCaretAtEnd(newSpan);
                e.preventDefault();

                return newSpan;
            };

            var selectionListThenCreateBlankSpan = function(e, selectedText, focusNode)
            {
                if(selectedText == LanguageService('Add New'))
                {
                    createGuidedInput();
                }
                else
                {
                    focusNode.textContent = selectedText;

                    var span = document.createElement('span');
                    span.innerText = String.fromCharCode(160);
                    e.currentTarget.appendChild(span);

                    $scope.lastFocusTarget = span;
                    CaretService.placeCaretAtEnd(span);

                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                initInputList(true);
            };

            $scope.onKeyDown = function(e)
            {
                DialogGraphEditor.isDirty = true;

                var selection = window.getSelection();
                var focusNode = selection.focusNode;

                if(focusNode.parentElement.nodeName == 'SPAN')
                {
                    focusNode.parentElement.style.backgroundColor = '';
                }

                //플레이스홀더 처리
                if((e.keyCode == 8 || e.keyCode == 46))
                {
                    if(e.currentTarget.innerText.length == 1)
                    {
                        angular.element(e.currentTarget.previousElementSibling).attr('placeholder', $scope.getInputPlaceHolder());
                        // angular.element(e.currentTarget.previousElementSibling).attr('placeholder', angular.element(e.currentTarget.previousElementSibling).attr('data-placeholder')).removeAttr('data-placeholder');
                    }
                }
                else if(e.keyCode != 8 && e.keyCode != 20 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 91 && e.keyCode != 18)
                {
                    angular.element(e.currentTarget.previousElementSibling).removeAttr('placeholder');
                }

                if($scope.showInputList)
                {
                    if(e.keyCode == 38)
                    {
                        moveInputListSelection('up');
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    else if(e.keyCode == 40)
                    {
                        moveInputListSelection('down');
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    else if(e.keyCode == 27)
                    {

                    }
                    else if(e.keyCode == 13)
                    {
                        var selectedText = angular.element('.dialog-editor-input-list-box > ul > li.selected').text();
                        selectionListThenCreateBlankSpan(e, selectedText, focusNode);
                        initInputList(true);
                    }
                }
                else
                {
                    // 엔터 입력시 입력 마무으리
                    if(e.keyCode == 13)
                    {
                        if(focusNode.nodeName == '#text' || !focusNode.parentElement.className)
                        {
                            createTextSpan(e, focusNode, String.fromCharCode(160), 'text');
                        }
                    }
                    else if(focusNode.parentElement.nodeName != 'SPAN' || !focusNode.parentElement.className)
                    {
                        if(focusNode.textContent.trim().length == 0)
                        {
                            if(e.key == '#')
                            {
                                $scope.isAdvancedMode = true;
                                var target = createNewTypeSpan(e, focusNode, '#', 'intent');
                                showIntentInputList('#', function(selected)
                                {
                                    selectionListThenCreateBlankSpan(e, selected , target);
                                });
                            }
                            else if(e.key == '@')
                            {
                                $scope.isAdvancedMode = true;
                                createNewTypeSpan(e, focusNode, '@', 'entities');
                                showEntityInputList('@', function(selected)
                                {
                                    selectionListThenCreateBlankSpan(e, selected , target);
                                });
                            }
                            else if(e.key == '$')
                            {
                                $scope.isAdvancedMode = true;
                                createNewTypeSpan(e, focusNode, '$', 'types');
                                showTypeInputList('$', function(selected)
                                {
                                    selectionListThenCreateBlankSpan(e, selected , target);
                                });
                            }
                        }
                        else if(e.key == '(' && focusNode.textContent.trim().startsWith('if') && (focusNode.parentElement.nodeName == 'DIV' || !focusNode.parentElement.className))
                        {
                            $scope.isAdvancedMode = true;

                            $scope.showInputList = 'if';

                            var span = document.createElement('span');
                            span.className = 'if';
                            span.innerText = 'if()';

                            e.currentTarget.appendChild(span);

                            focusNode.textContent = '';

                            CaretService.placeCaretAtIndex(span.childNodes[0], 3);

                            e.preventDefault();
                        }
                        else if(e.key == '/' && focusNode.textContent.trim().startsWith('/') && (focusNode.parentElement.nodeName == 'DIV' || !focusNode.parentElement.className))
                        {
                            var text = focusNode.textContent.trim();

                            var span = document.createElement('span');
                            span.className = 'regexp';
                            span.innerText = text + '/';

                            e.currentTarget.appendChild(span);

                            focusNode.textContent = '';

                            CaretService.placeCaretAtIndex(span.childNodes[0], text.length+1);

                            e.preventDefault();
                        }
                    }
                }
            };

            var showNLPText = function(focusNode)
            {
                var text = focusNode.textContent;
                if(text.trim())
                {
                    DialogGraphsNLPService.get({ botId: chatbot.id, text: text }, function(result)
                    {
                        if(result.text.trim())
                        {
                            angular.element('.dialog-editor-input-description').text('[nlu] ' + result.text);
                        }
                        else
                        {
                            angular.element('.dialog-editor-input-description').text('');
                        }
                    });
                }
                else
                {
                    initInputList(true);
                }
            };

            $scope.onKeyUp = function(e)
            {
                var selection = window.getSelection();
                var focusNode = selection.focusNode;

                // if(focusNode.parentElement.nodeName == 'SPAN' && focusNode.parentElement.parentElement.nodeName == 'FONT')
                // {
                //     focusNode.parentElement.removeAttribute('style');
                //     var font = focusNode.parentElement.parentElement.parentElement;
                //     focusNode.parentElement.parentElement.parentElement.insertBefore(focusNode.parentElement, focusNode.parentElement.parentElement);
                //     font.parentElement.removeChild(font);
                // }

                if(e.keyCode == 8 || e.keyCode == 46)
                {
                    if($scope.showInputList)
                    {
                        if($scope.showInputList == 'if' && (!focusNode.textContent.trim().startsWith('if(') || !focusNode.textContent.trim().endsWith(')')))
                        {
                            initInputList(true);
                        }
                        else if($scope.showInputList == 'regexp' && (!focusNode.textContent.trim().startsWith('/') || !focusNode.textContent.trim().endsWith('/')))
                        {
                            initInputList(true);
                        }
                        else if(!focusNode.textContent.startsWith($scope.showInputList))
                        {
                            initInputList(true);
                        }

                        angular.element('.dialog-editor-input-description').text('');
                    }
                    else if(focusNode.textContent.trim().length == 0)
                    {
                        showNLPText(focusNode);

                        var parent = focusNode.parentElement;
                        while(parent.nodeName != 'DIV')
                        {
                            parent = parent.parentElement;
                        }

                        if(parent.innerText.length == 0)
                        {
                            angular.element(e.currentTarget.previousElementSibling).attr('placeholder', $scope.getInputPlaceHolder());
                        }
                    }
                }
                else if(e.keyCode == 37 || e.keyCode == 39 || ($scope.showInputList && e.keyCode != 38 && e.keyCode != 40))
                {
                    if(focusNode.textContent.trim().startsWith('#'))
                    {
                        showIntentInputList(focusNode.textContent.trim().substring(1), function(selected)
                        {
                            selectionListThenCreateBlankSpan(e, selected, focusNode);
                        });
                    }
                    else if(focusNode.textContent.trim().startsWith('@'))
                    {
                        showEntityInputList(focusNode.textContent.trim().substring(1), function(selected)
                        {
                            selectionListThenCreateBlankSpan(e, selected, focusNode);
                        });
                    }
                    else if(focusNode.textContent.trim().startsWith('$'))
                    {
                        showTypeInputList(focusNode.textContent.trim().substring(1), function(selected)
                        {
                            selectionListThenCreateBlankSpan(e, selected, focusNode);
                        });
                    }
                    else if(focusNode.textContent.trim().startsWith('if('))
                    {
                        angular.element('.dialog-editor-input-description').text(LanguageService('Entering conditional statements.'));
                        initInputList(true);
                    }
                    else if(focusNode.textContent.trim().startsWith('/') && focusNode.textContent.trim().endsWith('/'))
                    {
                        angular.element('.dialog-editor-input-description').text(LanguageService('Please enter a regular expression.'));
                        initInputList(true);
                    }
                    else if(!$scope.showInputList)
                    {
                        showNLPText(focusNode);
                    }
                }
                else if(!$scope.showInputList)
                {
                    showNLPText(focusNode);
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

            $scope.deleteInput = function(e, index)
            {
                angular.element(e.currentTarget).parent().remove();
                $scope.dialog.input.splice(index, 1);
                $scope.tempInputList.splice(index, 1);
            };

            $scope.addNewType = function()
            {
                console.log($scope.inputType);
            };
        };

        return DialogGraphEditorInput;
    });
})();
