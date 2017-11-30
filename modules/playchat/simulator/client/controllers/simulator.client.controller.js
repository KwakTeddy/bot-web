'use strict';

angular.module('playchat').controller('SimulatorController', ['$window', '$scope', '$cookies', '$resource', '$rootScope', 'Socket',
function ($window, $scope, $cookies, $resource, $rootScope, Socket)
{
    $scope.$parent.loaded('simulator');

    (function()
    {
        var chatbot = $cookies.getObject('chatbot');
        var user = $cookies.getObject('user');

        var simulatorBody = undefined;

        var getCurrentTime = function()
        {
            var date = new Date();

            var hour = date.getHours();
            var min = date.getMinutes();

            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;

            return hour + ':' + min;
        };

        var addBotBubble = function(text)
        {
            try {
                text = JSON.parse(text);
            }
            catch(err)
            {

            }

            var template = undefined;

            if(typeof text != 'object')
            {
                template = angular.element('#botAnswerTemplate').html();
                template = template.replace('{botName}', chatbot.name).replace('{time}', getCurrentTime()).replace('{text}', (text + '').replace(/\n/gi, '<br>'));
            }
            else
            {
                template = angular.element('#botAnswerTemplate').html();
                template = template.replace('{botName}', chatbot.name).replace('{time}', getCurrentTime()).replace('{text}', text.text.replace(/\n/gi, '<br>'));

                template = angular.element(template);
                if(text.image)
                {
                    var t = '<div class="output-image">';
                    t += '<img src="' + text.image.url + '" alt="' + text.image.displayname + '">';
                    t += '</div>';

                    template.append(t);
                }

                if(text.buttons)
                {
                    var t = '<div class="output-buttons">';

                    for(var i=0; i<text.buttons.length; i++)
                    {
                        t += '<a href="' + (text.buttons[i].url || '#') + '" class="default-button">' + text.buttons[i].text + '</a>';
                    }

                    t += '</div>';

                    template.append(t);
                }
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

        var addUserBubble = function(text)
        {
            var template = angular.element('#userAnswerTemplate').html();
            template = template.replace('{time}', getCurrentTime()).replace('{text}', text);
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

        //event handling
        Socket.on('send_msg', function(data)
        {
            addBotBubble(data);

            $rootScope.$broadcast('onmsg', { message: data });
        });

        $scope.sendMessage = function(e)
        {
            if(e.keyCode == 13)
            {
                var value = e.currentTarget.value;
                emitMsg(value, true);
                e.currentTarget.value = '';
            }
            else if(e.keyCode == 116)
            {
                clearBubble();
                emitMsg(':build', false);
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
                emitMsg(':reset user', false);
            }, Beagle.error);
        };

        $scope.$on('simulator-build', function()
        {
            console.log('빌드');
            clearBubble();
            emitMsg(':build', false);
        });

        $scope.$on('set-simulator-content', function(context, data)
        {
            for(var i=data.dialog.length-1; i>=0; i--)
            {
                if(data.dialog[i].inOut)
                {
                    addUserBubble(data.dialog[i].dialog);
                }
                else
                {
                    addBotBubble(data.dialog[i].dialog);
                }
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

        $scope.init();
    })();

    // --------- Simulator 접기 펼치기 기능.
    (function()
    {
        $scope.isClosed = false;
        $scope.toggle = function(e)
        {
            $scope.isClosed = angular.element('.simulator-btn').is(':visible');

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
        };
    })();
}]);
