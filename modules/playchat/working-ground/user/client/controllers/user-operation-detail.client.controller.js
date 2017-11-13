'use strict';

angular.module('playchat').controller('OperationUserDetailController', ['$window', '$scope', '$resource', '$cookies', '$location', 'DateService', function ($window, $scope, $resource, $cookies, $location, DateService)
{
    $scope.$parent.changeWorkingGroundName('Operation > User Detail');

    var BotUserService = $resource('/api/:botId/operation/users/:id', { botId: '@botId', id: '@id' });


    (function()
    {
        $scope.data = {};

        var chatbot = $cookies.getObject('chatbot');

        var split = $location.url().split('/');
        $scope.data._id = split[split.length-1];

        $scope.getDetail = function()
        {
            BotUserService.get({ botId: chatbot.id, id: $scope.data._id }, function(result)
            {
                var item = JSON.parse(JSON.stringify(result));

                $scope.data = item;

                $scope.data.lastUpdate = DateService.formatDate($scope.data.lastUpdate);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    })();

    $scope.getDetail();

    $scope.$parent.loaded('working-ground');
}]);
