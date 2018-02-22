'use strict';

angular.module('playchat').controller('SimulatorController', ['$window', '$scope', '$cookies', '$resource', '$rootScope', 'Socket','LanguageService',
function ($window, $scope, $cookies, $resource, $rootScope, Socket, LanguageService)
{
    $scope.$parent.loaded('simulator');

    var tempUserKey = 'socket-user-' + new Date().getTime();

    (function()
    {
        var chatbot = $cookies.getObject('chatbot');
        var user = $cookies.getObject('user');

        var simulatorBody = undefined;

        $scope.shortCutHelp = false;
        $scope.isClosed = false;

        $scope.$on('editChatbotInfo', function () {
            chatbot = $cookies.getObject('chatbot');
            $scope.refresh();
        });

        window.addEventListener('keydown', function(e)
        {
            if(e.keyCode == 121) //F10
            {
                if($scope.isClosed)
                {
                    $scope.toggle(true);
                }

                angular.element('.simulator-background input').focus();
                e.preventDefault();
            }
            else if(e.keyCode == 191 && e.shiftKey) // ?
            {
                if(e.path[0].value || e.path[0].nodeName == 'TEXTAREA' || e.path[0].nodeName == 'INPUT' || e.path[0].getAttribute('contenteditable'))
                {
                    return;
                }

                $scope.$apply(function()
                {
                    $scope.shortCutHelp = true;
                });
            }
            else if(e.keyCode == 27) //ESC
            {
                $scope.$apply(function()
                {
                    $scope.shortCutHelp = false;
                });
            }
        });

        var getCurrentTime = function(time)
        {
            var date = undefined;
            if(time)
                date = new Date(time);
            else
                date = new Date();

            var hour = date.getHours();
            var min = date.getMinutes();
            var day = date.getDay();
            var month = date.getMonth() + 1;

            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            return month + "월 " + day + "일 " + hour + ':' + min;
        };

        var addBotBubble = function(text, time)
        {
            try {
                text = JSON.parse(text);
            }
            catch(err)
            {

            }

            var template = undefined;
            var chabotName = undefined;

            if(chatbot.name.length > 5)
                chabotName = chatbot.name.slice(0, 5) + '...';
            else
                chabotName = chatbot.name;

            template = angular.element('#botAnswerTemplate').html();
            template = template.replace('{botName}', chabotName).replace('{time}', getCurrentTime(time)).replace('{text}', (text.text || '' ).replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/\n/gi, '<br>'));

            template = angular.element(template);

            if(text.image && text.image.url)
            {
                var t = '<div class="output-image">';
                t += '<img src="' + text.image.url + '" alt="' + text.image.displayname + '">';
                t += '</div>';

                template.find('.speech').append(t);
            }

            if(text.buttons)
            {
                var t = '';

                for(var i=0; i<text.buttons.length; i++)
                {
                    if(text.buttons[i].url)
                    {
                        t = '<a href="' + text.buttons[i].url + '" class="default-button" style="color: #038eda;" target="_blank">#' + text.buttons[i].text + '</a>' + t;
                    }
                    else
                    {
                        t += '<a style="cursor: pointer;" href="#" class="default-button" target="_blank">' + text.buttons[i].text + '</a>';
                    }
                }

                t += '</div>';

                template.find('.speech').append('<div class="output-buttons">' + t);
            }

            simulatorBody.append(template);

            simulatorBody.find('.output-buttons a').off('click').on('click', function(e)
            {
                var href = angular.element(this).attr('href');
                if(href === undefined || href == 'undefined' || href == '#')
                {
                    var text = angular.element(this).text();

                    emitMsg(text, true);

                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            var body = angular.element('#simulatorBody').get(0);
            body.scrollTop = body.scrollHeight;
        };

        var addUserBubble = function(text, time)
        {
            var template = angular.element('#userAnswerTemplate').html();
            template = template.replace('{time}', getCurrentTime(time)).replace('{text}', text);
            simulatorBody.append(template);

            var body = angular.element('#simulatorBody').get(0);
            body.scrollTop = body.scrollHeight;
        };

        var clearBubble = function()
        {
            simulatorBody.html('');
        };

        var emitMsg = function(msg, isUser)
        {
            var options = { dev: true, language: 'en' };

            var params = {};
            params.bot = chatbot.id;
            params.user = user._id;
            params.msg = msg;
            params.options = options;

            Socket.emit('send_msg', params);

            if(isUser)
            {
                addUserBubble(msg);
            }
        };

        Socket.on('send_error_msg', function(data)
        {
            if(data == 'old-version')
            {
                addBotBubble({ text: '구 버전입니다. 구 버전 플레이챗으로 이동해서 테스트 해주세요.' });
            }
        });

        //event handling
        Socket.on('send_msg', function(data)
        {
            try
            {
                if(data.type == 'dialog')
                {
                    if(data.dialogId)
                    {
                        $rootScope.$broadcast('dialogGraphTestFocus', data.dialogId);
                    }

                    addBotBubble(data.output);
                    $rootScope.$broadcast('onmsg', { message: data.output });
                }
                else if(data.type == 'qa')
                {
                    addBotBubble(data.output);
                    $rootScope.$broadcast('onmsg', { message: data.output });
                }
                else if(data.type == 'log')
                {
                    $rootScope.$broadcast('onlog', { message: data });
                }
                else
                {
                    addBotBubble(data);
                    $rootScope.$broadcast('onmsg', { message: data });
                }
            }
            catch(err)
            {
                console.error(err);
            }
        });

        $scope.sendMessage = function(e)
        {
            if(e.keyCode == 13) //Enter
            {
                var value = e.currentTarget.value;
                if(value)
                {
                    emitMsg(value, true);
                    e.currentTarget.value = '';
                }
            }
            else if(e.keyCode == 116) //F5
            {
                clearBubble();
                $rootScope.$broadcast('dialogGraphTestFocus', 'defaultcommon0');
                emitMsg(':build', false);
            }
            else if(e.keyCode == 117) //F6
            {
                clearBubble();
                $rootScope.$broadcast('dialogGraphTestFocus', 'defaultcommon0');
                emitMsg(':reset memory', false);
            }
            else if(e.keyCode == 27) // Esc
            {
                var dialogsetElement = angular.element('.dialog-learning-development-content-row').get(0);
                var codeEditor = angular.element('.dialog-graph-code-editor').is(':visible');
                var dialoggraphElement = angular.element('.graph-body').get(0);

                e.currentTarget.blur();
                if(codeEditor)
                    $rootScope.$broadcast('focusToCodeEditor');
                else if(dialoggraphElement)
                    $rootScope.$broadcast('focusToDialogGraph');
                else if(dialogsetElement)
                    $rootScope.$broadcast('focusToDialogSet');
            }
            else if(e.keyCode == 118) //F7
            {
                var dialoggraphElement = angular.element('.graph-body').get(0);
                var codeEditor = angular.element('.dialog-graph-code-editor').is(':visible');
                if(codeEditor)
                {
                    $rootScope.$broadcast('saveCodeEditor');
                }
                else if(dialoggraphElement)
                {
                    $rootScope.$broadcast('saveDialogGraph');
                }
            }
        };

        $scope.init = function()
        {
            simulatorBody = angular.element('#simulatorBody');
            // init
            simulatorBody.html('');
            $resource('/api/chatbots/:id', { id: '@id' }).get({ id: chatbot._id }, function(data)
            {
                if(angular.element('.simulator-background input').parent().is(':hidden'))
                {
                    return;
                }

                $scope.chatbotName = data.name;

                if(!simulatorBody.html())
                {
                    $rootScope.$broadcast('dialogGraphTestFocus', 'defaultcommon0');
                    emitMsg(':reset user', false);
                }

            }, Beagle.error);
        };

        $scope.$on('simulator-build', function()
        {
            console.log('빌드');
            clearBubble();
            emitMsg(':build', false);
        });

        $scope.$on('simulator-build-without-reset-focus', function()
        {
            console.log('빌드');
            clearBubble();
            emitMsg(':reload-bot-files', false);
        });

        $scope.$on('set-simulator-content', function(context, data)
        {
            for(var i=data.dialog.length-1; i>=0; i--)
            {
                if(data.dialog[i].inOut)
                    addUserBubble(data.dialog[i].dialog, data.dialog[i].created);
                else
                    addBotBubble({text : data.dialog[i].dialog}, data.dialog[i].created);
            }

            if(data.readonly)
            {
                angular.element('.simulator-background input').parent().hide();
            }
            else
            {
                angular.element('.simulator-background input').parent().show();
            }
        });

        $scope.refresh = function()
        {
            clearBubble();
            emitMsg(':build', false);
        };

        $scope.closeShortCutHelp = function()
        {
            $scope.shortCutHelp = false;
        };

        $('#simulatorBody').on('click', function(e)
        {
            if(e.target.className.indexOf('speech-text') != -1)
                return;

            angular.element('#simulatorInput').focus();
        });

        $scope.init();
    })();

    // --------- Simulator 접기 펼치기 기능.
    (function()
    {
        $scope.isClosed = false;
        $scope.toggle = function()
        {
            var link = angular.element('#simulator-responsive-css');
            if(!$scope.isClosed)
            {
                //접기
                link.attr('data-media', link.attr('media')).removeAttr('media').removeAttr('disabled');
            }
            else
            {
                //시뮬레이터가 보이게 하는 부분
                link.attr('media', link.attr('data-media')).attr('disabled', '');
            }

            $scope.isClosed = !$scope.isClosed;
        };
    })();

    $scope.lan=LanguageService;
}]);
