'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('PlayChatController', ['$cookies', function ($cookies)
{
    var chatbot = $cookies.getObject('chatbot');
}]);
