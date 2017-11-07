'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('OperationUserController', ['$window', '$scope', '$resource', '$cookies', '$location', 'PagingService', function ($window, $scope, $resource, $cookies, $location, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Operation > User');

    var BotUserService = $resource('/api/:botId/operation/users', { botId: '@botId' });
    var BotUserPageService = $resource('/api/:botId/operation/users/totalpage', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        $scope.searchKeyDown = function(e)
        {
            if(e.keyCode == 13)
            {
                $scope.search();
                e.preventDefault();
            }
            else if(e.keyCode == 8)
            {
                if(e.currentTarget.value.length == 1)
                {
                    $scope.getList(1, '');
                }
            }
        };

        $scope.search = function()
        {
            var value = angular.element('#operationSearchInput').val();
            $scope.getList(1, value);
        };

        $scope.getList = function(page, userKey)
        {
            page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            BotUserPageService.get({ botId: chatbot.id, countPerPage: countPerPage, userKey : userKey }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            BotUserService.query({ botId: chatbot.id, page: page, countPerPage: countPerPage, userKey : userKey }, function(list)
            {
                $scope.list = list;
                $scope.$parent.loaded('working-ground');
            });
        };
    })();

    $scope.getList();
}]);
