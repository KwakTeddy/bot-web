'use strict';

angular.module('template').controller('flowerDashboardController', ['$scope', '$resource', '$cookies', '$location', '$rootScope','LanguageService', function ($scope, $resource, $cookies, $location,$rootScope,LanguageService)


{
    $scope.$parent.changeWorkingGroundName('Dashboard', '/modules/playchat/gnb/client/imgs/dashboard_grey_1.png');

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
            $rootScope.$broadcast('simulator-build');
        },
        function(err)
        {
            alert(err);
        });
    })();
    $scope.lan=LanguageService;
}]);
