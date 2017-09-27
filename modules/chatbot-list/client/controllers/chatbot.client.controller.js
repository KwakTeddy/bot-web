(function()
{
    'use strict';

    angular.module('chatbot').controller('ChatbotController', ['$scope', '$resource', '$cookies', '$location', function ($scope, $resource, $cookies, $location)
    {
        var ChatBotService = $resource('/api/chatbots/:id', { id: '@_id' }, { update: { method: 'PUT' } });
        ChatBotService.query({}, function(list)
        {
            $scope.chatbotList = list;
            $scope.$parent.loading = false;
        });

        $scope.selectChatbot = function(chatbot)
        {
            $cookies.putObject('chatbot', chatbot);
            $location.url('/playchat');
        };
    }]);
})();
