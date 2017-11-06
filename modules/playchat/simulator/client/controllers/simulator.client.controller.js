'use strict';

angular.module('playchat').controller('SimulatorController', ['$window', '$scope', '$cookies', '$resource', 'Socket',
function ($window, $scope, $cookies, $resource, Socket)
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
            var template = angular.element('#botAnswerTemplate').html();
            template = template.replace('{botName}', chatbot.name).replace('{time}', getCurrentTime()).replace('{text}', text);
            simulatorBody.append(template);

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

        var emitMsg = function(msg, isUser)
        {
            var options = { dev: true };

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
                $scope.chatbotName = data.name;
                emitMsg(':reset user', false);
            }, Beagle.error);
        };

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
