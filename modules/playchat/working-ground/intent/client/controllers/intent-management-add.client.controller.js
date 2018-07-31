'use strict';

angular.module('playchat').controller('IntentManagementAddController', ['$scope', '$resource', '$cookies', '$location', 'LanguageService',function ($scope, $resource, $cookies, $location, LanguageService)
{
    var id = $location.search()._id;
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Intent') + ' > ' + (id ? LanguageService('Edit') : LanguageService('Add')), '/modules/playchat/gnb/client/imgs/intent.png');

    var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });
    var IntentContentsService = $resource('/api/:botId/intents/:intentId/contents', { botId: '@botId', intentId: '@intentId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.$parent.loaded('working-ground');

    $scope.intents = [];
    $scope.intent = {};

    (function()
    {
        var _id = $location.search()._id;
        if(_id)
        {
            IntentService.get({ botId: chatbot.id, intentId: _id }, function(intent)
            {
                $scope.name = intent.name;
                $scope.intent = intent;
            },
            function(err)
            {
                alert(err);
            });

            IntentContentsService.query({ botId: chatbot.id, intentId: _id }, function(intentContents)
            {
                if(intentContents.length > 0)
                {
                    $scope.intents = intentContents;
                }
            });
        }
    })();

    $scope.contentInputKeydown = function(e)
    {
        if(e.keyCode == 13)
        {
            if(e.currentTarget.value)
            {
                $scope.intents.push({ name: e.currentTarget.value });

                e.currentTarget.value = '';
            }

            e.preventDefault();
        }
    };

    $scope.addIntentContentClick = function(e)
    {
        var input = e.currentTarget.previousElementSibling;
        if(input.value)
        {
            $scope.intents.push({ name: input.value });
            input.value = '';
        }

        input.focus();
    };

    $scope.deleteContent = function(intents, index)
    {
        intents.splice(index, 1);
    };

    $scope.save = function()
    {
        var params = {};
        params.botId = chatbot.id;
        if(chatbot.templateId)
            params.templateId = chatbot.templateId._id;
        params.name = $scope.name;
        params.language = chatbot.language;
        params.intentContents = [];

        for(var i=0; i<$scope.intents.length; i++)
        {
            params.intentContents.push($scope.intents[i].name);
        }

        if($scope.intent._id)
        {
            params._id = $scope.intent._id;
            IntentService.update(params, function(result)
            {
                $location.url('/playchat/management/intent');
            },
            function(err)
            {
                alert(err);
                if(err.data.message == 'Duplicated intent name')
                {
                    alert(params.name + $scope.lan('is duplicated name.'));
                }
            });
        }
        else
        {
            IntentService.save(params, function(result)
            {
                $location.url('/playchat/management/intent');
            },
            function(err)
            {
                if(err.data.message == 'Duplicated name')
                {
                    alert(params.name + $scope.lan('is duplicated'));
                }
            });
        }
    };

    $scope.cancel = function()
    {
        $location.url('/playchat/management/intent');
    };

    $scope.lan=LanguageService;
}]);
