'use strict';

angular.module('template').controller('dashboardController', ['$scope', '$resource', '$cookies', function ($scope, $resource, $cookies)
{
    var ChatbotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        $scope.chatbot = chatbot;
        ChatbotTemplateService.get({ templateId: chatbot.templateId }, function(result)
        {
            $scope.template = result;
        },
        function(err)
        {
            alert(err);
        });
    })();
}]);
