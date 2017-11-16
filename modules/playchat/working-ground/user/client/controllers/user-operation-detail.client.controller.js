'use strict';

angular.module('playchat').controller('OperationUserDetailController', ['$window', '$scope', '$rootScope', '$resource', '$cookies', '$location', 'DateService', function ($window, $scope, $rootScope, $resource, $cookies, $location, DateService)
{
    $scope.$parent.changeWorkingGroundName('Operation > User Detail');

    var BotUserService = $resource('/api/:botId/operation/users/:id', { botId: '@botId', id: '@id' });


    (function()
    {
        $scope.memo = '';
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
                if(item.userDialog && item.userDialog.length > 0)
                {
                    $scope.data.lastUpdate = item.userDialog[0].created;
                    $scope.data.newMsg = item.userDialog[0].dialog;

                    console.log('머야', $scope.data.userDialog);

                    $rootScope.$broadcast('set-simulator-content', { dialog: $scope.data.userDialog, readonly: true });

                    $scope.data.lastUpdate = DateService.formatDate($scope.data.lastUpdate);
                }
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.saveUserMemo = function()
        {
            BotUserService.save({ botId: chatbot.id, id: $scope.data._id, memo: $scope.data.memo }, function(result)
            {
                console.log(result);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.formatDate = function(date)
        {
            return DateService.formatDate(date);
        };
    })();

    $scope.getDetail();

    $scope.$parent.loaded('working-ground');
}]);
