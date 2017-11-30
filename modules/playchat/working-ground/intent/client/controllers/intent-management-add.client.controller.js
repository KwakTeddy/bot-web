'use strict';

angular.module('playchat').controller('IntentManagementAddController', ['$scope', '$resource', '$cookies', '$location', function ($scope, $resource, $cookies, $location)
{
    $scope.$parent.changeWorkingGroundName('Management > Intent > Add', '/modules/playchat/gnb/client/imgs/intent.png');

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

                console.log('인텐트 : ', intent);
            },
            function(err)
            {
                alert(err);
            });

            IntentContentsService.query({ botId: chatbot.id, intentId: _id }, function(intentContents)
            {
                if(intentContents.length > 0)
                {
                    console.log(intentContents);
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
                $scope.intents.push(e.currentTarget.value);
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
            $scope.intents.push(e.currentTarget.value);
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
        params.name = $scope.name;
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
                    alert(params.name + '은 중복된 이름 입니다.');
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
                if(err.data.message == 'Duplicated intent name')
                {
                    alert(params.name + '은 중복된 이름 입니다.');
                }
            });
        }
    };

    $scope.cancel = function()
    {
        $location.url('/playchat/management/intent');
    };
}]);
