'use strict';

angular.module('template').controller('restaurantDashboardController', ['$scope', '$resource', '$cookies', '$location', function ($scope, $resource, $cookies, $location)
{
    var ChatbotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    $scope.isFirst = $location.search().isFirst;

    (function()
    {
        $scope.chatbot = chatbot;
        ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
        {
            $scope.template = result;
        },
        function(err)
        {
            alert(err);
        });
    })();
}]);
