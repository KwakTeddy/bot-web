(function()
{
    'use strict';
    angular.module('playchat').controller('ChatbotEditController', ['$window', '$scope', '$resource', '$cookies', 'LanguageService', function ($window, $scope, $resource, $cookies, LanguageService)
    {
        $scope.$parent.changeWorkingGroundName(LanguageService('Bot Profile'), '/modules/playchat/working-ground/chatbot-edit/client/imgs/botsetting.png');

        var ChatbotAuthService = $resource('/api/:botId/bot-auth/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
        var ChatbotEditService = $resource('/api/:botId/chatbot-edit', { botId: '@botId' }, { update: { method: 'PUT' } });
        var ChatBotShareService = $resource('/api/chatbots/:botId/share', { botId: '@botId' });

        var chatbot = $scope.chatbot = $cookies.getObject('chatbot');

        $scope.list = [];
        $scope.openShareModal = false;
        $scope.share = {};

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
                if(item.edit)
                {
                    item.read = true;
                }

                ChatbotAuthService.update({ botId: chatbot._id, _id: item._id, read: item.read, edit: item.edit }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
            };

            $scope.addNewMember = function()
            {
                $scope.openShareModal = true;
            };

            $scope.closeShareModal = function()
            {
                $scope.openShareModal = false;
            };

            $scope.shareChatbot = function()
            {
                if(!$scope.share.read && !$scope.share.write)
                {
                    alert($scope.lan('Please select at least one permission'));
                    return false;
                }

                if($scope.share.edit)
                {
                    $scope.share.read = true;
                }

                ChatBotShareService.save({ botId: chatbot._id, data: JSON.parse(angular.toJson($scope.share)) }, function(result)
                {
                    $scope.openShareModal = false;
                    alert('Shared ' + chatbot.name + ' to ' + $scope.share.email);
                },
                function(err)
                {
                    alert(err.data.message);
                });
            };

            $scope.deleteAuth = function(item, list)
            {
                if(confirm($scope.lan('Are you sure you want to delete this item?')))
                {
                    ChatbotAuthService.delete({ botId: chatbot._id, _id: item._id }, function(result)
                    {
                        console.log('결과 : ', result);

                        var index = list.indexOf(item);
                        list.splice(index, 1);
                    },
                    function(err)
                    {
                        alert(err.data.message);
                    });
                }
            };
        })();

        $scope.getList();

        $scope.lan = LanguageService;
    }]);
})();
