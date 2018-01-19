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

        var DialogGraphEditorInput = {};
        DialogGraphEditorInput.init = function($scope)
        {
            $scope.showInputList = false;

            angular.element('.dialog-editor-input-description').text('');
            angular.element('.dialog-editor-body').css('overflow', 'auto');

            var input = JSON.parse(angular.toJson($scope.dialog.input));
            console.log(input);

            for(var i=0; i<input.length; i++)
            {
                var target = angular.element('.dialog-editor-input-wrapper > div[data-index="' + i + '"]');
                target.prev().removeAttr('required');
                target.html('');

                if(Object.keys(input[i]).length > 1 && !input[i].key)
                {
                    target.prev().attr('data-placeholder', target.prev().attr('placeholder')).removeAttr('placeholder');
                }

                for(var key in input[i])
                {
                    var text = input[i][key];
                    if(key == 'types')
                    {
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
                            text = '/' + text + '/';
                        }
                        else if(key == 'if')
                        {
                            text = 'if(' + text + ')';
                        }

                        if(text.trim())
                        {
                            if(key == 'text')
                            {
                                var node = document.createTextNode(text);
                                target.append(node);
                            }
                            else
                            {
                                var html = '<span class="' + key + '" data-type="' + key + '">' + text + '</span>';
                                target.append(html);
                            }
                        }
                    }
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

        DialogGraphEditorInput.make = function($scope)
        {
            var initInputList = function()
            {
                $scope.showInputList = false;
                angular.element('.dialog-editor-input-description').text('');
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
                    }
                }
                else if(direction == 'down')
                {
                    if(target.next().get(0))
                    {
                        target.removeClass('selected');
                        target.next().addClass('selected');
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

            var selectInput = function(callback)
            {
                angular.element('.dialog-editor-input-list-box > ul > li').on('mousedown', function()
                {
                    if(angular.element(this).attr('addNew'))
                    {
                        var text = angular.element(this).text();
                        if(text.startsWith('#'))
                        {

                        }
                        else if(text.startsWith('@'))
                        {

                        }
                        else if(text.startsWith('$'))
                        {

                        }
                    }
                    else
                    {
                        var text = angular.element(this).text();
                        callback(text);
                    }
                });
            };

            var showIntentInputList = function(name, callback)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = true;
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
                    selectInput(callback);
                });
            };

            var showEntityInputList = function(name, callback)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = true;
                EntityService.query({ botId: chatbot.id, page: 1, countPerPage: 10, name : name ? name.trim() : '' }, function(result)
                {
                    var html = '';
                    for(var i=0; i<result.length; i++)
                    {
                        html += '<li>@' + result[i].name + '</li>';
                    }

                    html += '<li>' + LanguageService('Add New') + '</li>';

                    angular.element('.dialog-editor-input-list-box > ul').html(html).find('li:first').attr('class', 'selected');
                    makeMoveInputListSelectionByMouseOver();
                    selectInput(callback);
                });
            };

            var showTypeInputList = function(name, callback)
            {
                angular.element('.dialog-editor-body').css('overflow', 'hidden');

                $scope.showInputList = true;

                // 나중에는 실제로 봇엔진이 들고있는 공통 타입들을 가지고 와야함.
                var commons = ["mobile","phone","date","timeType","account","count","faqType","address","number","amountType","mobileType","phoneType","dateType","accountType","countType"];
                TypeService.query({ botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id: '') }, function(result)
                {
                    var html = '';
                    for(var i=0; i<commons.length; i++)
                    {
                        if(!name || commons[i].indexOf(name) != -1)
                        {
                            html += '<li>$' + commons[i] + '</li>';
                        }
                    }

                    for(var i=0; i<result.length; i++)
                    {
                        if(!name || result[i].indexOf(name))
                        {
                            html += '<li>$' + result[i].name + '</li>';
                        }
                    }

                    html += '<li>' + LanguageService('Add New') + '</li>';

                    angular.element('.dialog-editor-input-list-box > ul').html(html).find('li:first').attr('class', 'selected');
                    makeMoveInputListSelectionByMouseOver();
                    selectInput(callback);
                });
            };

            $scope.focusToSpan = function(e)
            {
                e.currentTarget.nextElementSibling.focus();
            };

            $scope.onBlur = function(e, index)
            {
                if(!$scope.tempInputList)
                {
                    $scope.tempInputList = [];
                }

                var input = $scope.tempInputList[index] = {};

                var children = e.currentTarget.childNodes;
                for(var i=0; i<children.length; i++)
                {
                    if(children[i].nodeName == '#text')
                    {
                        input.text = children[i].textContent;
                    }
                    else if(children[i].nodeName == 'SPAN')
                    {
                        var type = children[i].getAttribute('data-type');
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
                            else
                            {
                                input[type] = children[i].innerText.replace('#', '').replace('@', '').replace(/\//gi, '').replace('if(', '').replace(')', '');
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

                initInputList();
            };

            $scope.focusGuideBox = function(e)
            {
                angular.element('.dialog-editor-input-box > .dialog-editor-input-guide-box').insertAfter(e.currentTarget.parentElement);
            };

            $scope.onFocus = function(e)
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
                    showIntentInputList(text.replace('#', ''), function(text)
                    {
                        target.innerText = text;
                        CaretService.placeCaretAtEnd(target);
                        initInputList();
                    });
                }
                else if(type == 'entities')
                {
                    showEntityInputList(text.replace('@', ''), function()
                    {
                        target.innerText = text;
                        CaretService.placeCaretAtEnd(target);
                        initInputList();
                    });
                }
                else if(type == 'types')
                {
                    showTypeInputList(text.replace('$', ''), function()
                    {
                        target.innerText = text;
                        CaretService.placeCaretAtEnd(target);
                        initInputList();
                    });
                }
                else if(type == 'regexp')
                {
                    initInputList();
                    angular.element('.dialog-editor-input-description').text(LanguageService('Please enter a regular expression.'));
                }
                else if(type == 'if')
                {
                    initInputList();
                    angular.element('.dialog-editor-input-description').text(LanguageService('Entering conditional statements.'));
                }
                else
                {
                    initInputList();
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
                        initInputList();
                    }
                }
            };

            $scope.onKeyDown = function(e)
            {
                if($scope.showInputList)
                {
                    if(e.keyCode == 38) // up
                    {
                        moveInputListSelection('up');
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    else if(e.keyCode == 40) // down
                    {
                        moveInputListSelection('down');
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    else if(e.keyCode == 27) // esc
                    {
                        initInputList();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    else if(e.keyCode == 13) // enter
                    {
                        var selectedText = angular.element('.dialog-editor-input-list-box > ul > li.selected').text();

                        var selection = window.getSelection();
                        selection.focusNode.textContent = selectedText;

                        var span = document.createElement('span');
                        span.innerText = String.fromCharCode(160);
                        e.currentTarget.appendChild(span);

                        CaretService.placeCaretAtEnd(span);

                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            };

            $scope.onKeyUp = function(e)
            {
                var selection = window.getSelection();
                var text = selection.focusNode.textContent;
                if(e.currentTarget.innerText)
                {
                    angular.element(e.currentTarget.previousElementSibling).attr('data-placeholder', angular.element(e.currentTarget.previousElementSibling).attr('placeholder')).removeAttr('placeholder');
                }
                else
                {
                    angular.element(e.currentTarget.previousElementSibling).attr('placeholder', angular.element(e.currentTarget.previousElementSibling).attr('data-placeholder')).removeAttr('data-placeholder');
                }

                if(selection.focusNode.parentElement.nodeName == 'SPAN')
                {
                    //span이 한 번 생성된 후에 다 지우고 다시 입력하면 span이 생김.
                    selection.focusNode.parentElement.style.backgroundColor = '';
                    selection.focusNode.parentElement.style.color = '';
                }

                // 유형 span 생성
                if(e.key == '#' || e.key == '@' || e.key == '$' || e.key == '/' || (e.key == '(' && text.indexOf('if(') != -1))
                {
                    var type = 'intent';
                    var replacedText = e.key;
                    var typeText = e.key;
                    var focusIndex = -1;

                    if(e.key == '@')
                    {
                        type = 'entities';
                    }
                    else if(e.key == '$')
                    {
                        type = 'types';
                    }
                    else if(e.key == '/')
                    {
                        type = 'regexp';
                        typeText = '//';
                        replacedText = '/';
                        focusIndex = 1;
                    }
                    else if(text.indexOf('if(') != -1)
                    {
                        type = 'if';
                        typeText = 'if()';
                        replacedText = 'if(';
                        focusIndex = 3;
                    }

                    selection.focusNode.textContent = text.replace(replacedText, '');

                    var span = document.createElement('span');
                    span.className = type;
                    span.setAttribute('data-type', type);
                    span.innerText = typeText;
                    e.currentTarget.appendChild(span);

                    if(focusIndex > 0)
                    {
                        CaretService.placeCaretAtIndex(span.childNodes[0], focusIndex);
                    }
                    else
                    {
                        CaretService.placeCaretAtEnd(span);
                    }

                    if(selection.focusNode.textContent.length == 0 && selection.focusNode.parentElement.nodeName == 'SPAN')
                    {
                        selection.focusNode.parentElement.parentElement.removeChild(selection.focusNode.parentElement);
                    }
                }

                // 유형 span에 focus가 왔다면
                selection = window.getSelection();
                text = selection.focusNode.textContent;

                var target = undefined;
                if(e.keyCode != 38 && e.keyCode != 40)
                {
                    //up, down은 목록에서 고르는것이기 때문에 reload 하지 않는다.
                    if((target = selection.focusNode).nodeName == 'SPAN' || (selection.focusNode.nodeName == '#text' && (target = selection.focusNode.parentElement).nodeName == 'SPAN'))
                    {
                        var type = target.getAttribute('data-type');
                        if(type == 'intent')
                        {
                            showIntentInputList(text.replace('#', ''), function(text)
                            {
                                console.log('타겟 : ', target);
                                target.innerText = text;

                                var span = document.createElement('span');
                                span.innerText = String.fromCharCode(160);
                                e.currentTarget.appendChild(span);

                                CaretService.placeCaretAtEnd(span);

                                initInputList();
                            });
                        }
                        else if(type == 'entities')
                        {
                            showEntityInputList(text.replace('@', ''), function()
                            {
                                target.innerText = text;

                                var span = document.createElement('span');
                                span.innerText = String.fromCharCode(160);
                                e.currentTarget.appendChild(span);

                                CaretService.placeCaretAtEnd(span);

                                initInputList();
                            });
                        }
                        else if(type == 'types')
                        {
                            showTypeInputList(text.replace('$', ''), function()
                            {
                                target.innerText = text;

                                var span = document.createElement('span');
                                span.innerText = String.fromCharCode(160);
                                e.currentTarget.appendChild(span);

                                CaretService.placeCaretAtEnd(span);

                                initInputList();
                            });
                        }
                    }
                }

                if(target && target.nodeName == 'SPAN')
                {
                    var type = target.getAttribute('data-type');
                    if((type == 'regexp' && (target.innerText.length <= 1 || !target.innerText.startsWith('/') || !target.innerText.endsWith('/')))
                       || (type == 'if' && (!target.innerText.startsWith('if(') || !target.innerText.endsWith(')')))
                       || (type == 'intent' && !target.innerText.startsWith('#'))
                       || (type == 'entities' && (!target.innerText.startsWith('@')))
                       || (type == 'types' && (!target.innerText.startsWith('$'))))
                    {
                        text = target.innerText;

                        selection = window.getSelection();
                        var offset = selection.anchorOffset;

                        var node = document.createTextNode(text);
                        e.currentTarget.insertBefore(node, target);
                        e.currentTarget.removeChild(target);

                        CaretService.placeCaretAtIndex(node, offset);
                    }
                }

                if(!text.startsWith('#') && !text.startsWith('@') && !text.startsWith('$'))
                {
                    initInputList();

                    if(text.length > 1 && text.startsWith('/') && text.endsWith('/'))
                    {
                        angular.element('.dialog-editor-input-description').text(LanguageService('Please enter a regular expression.'));
                    }
                    else if(text.startsWith('if(') && text.endsWith(')'))
                    {
                        angular.element('.dialog-editor-input-description').text(LanguageService('Entering conditional statements.'));
                    }
                    else
                    {
                        if(text.trim())
                        {
                            DialogGraphsNLPService.get({ botId: chatbot.id, text: text }, function(result)
                            {
                                angular.element('.dialog-editor-input-description').text('[nlu] ' + result.text);
                            });
                        }
                        else
                        {
                            angular.element('.dialog-editor-input-description').text('');
                        }
                    }
                }
                else
                {
                    angular.element('.dialog-editor-input-description').text('');
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

            $scope.deleteInput = function(e)
            {
                angular.element(e.currentTarget).parent().remove();
            };

            $scope.addNewType = function()
            {
                console.log($scope.inputType);
            };
        };

        return DialogGraphEditorInput;
    });
})();
