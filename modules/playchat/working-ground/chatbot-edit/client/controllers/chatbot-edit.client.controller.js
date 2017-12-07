(function()
{
    'use strict';
    angular.module('playchat').controller('ChatbotEditController', ['$window', '$scope', '$resource', '$cookies', 'LanguageService', function ($window, $scope, $resource, $cookies, LanguageService)
    {
        $scope.$parent.changeWorkingGroundName('Bot Profile');

        var ChatbotAuthService = $resource('/api/:botId/bot-auth/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
        var ChatbotEditService = $resource('/api/:botId/chatbot-edit', { botId: '@botId' }, { update: { method: 'PUT' } });

        var chatbot = $scope.chatbot = $cookies.getObject('chatbot');

        $scope.list = [];

        (function()
        {
            ChatbotEditService.get({ botId: chatbot._id }, function(bot)
            {
                chatbot = $scope.chatbot = bot;

                $cookies.putObject(bot);
            },
            function(err)
            {
                alert(err.data.message);
            });

            $scope.saveChatbot = function()
            {
                ChatbotEditService.update({ botId: chatbot._id, name: $scope.chatbot.name, description: $scope.chatbot.description, language: $scope.chatbot.language }, function()
                {
                    alert($scope.lan('Saved.'));
                },
                function(err)
                {
                    alert(err.data.message);
                });
            };

            $scope.getList = function()
            {
                ChatbotAuthService.query({ botId: chatbot._id }, function(list)
                {
                    $scope.list = list;

                    $scope.$parent.loaded('working-ground');
                },
                function(err)
                {
                    alert(err);
                });
            };

            $scope.saveAuth = function(item)
            {
                ChatbotAuthService.update({ botId: chatbot._id, _id: item._id, read: item.read, edit: item.edit }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
            }
        })();

        $scope.getList();

        $scope.lan = LanguageService;
    }]);
})();
