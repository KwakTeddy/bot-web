angular.module('playchat').controller('AIChatLogController', ['$window', '$scope', '$resource', '$cookies', '$location', 'PagingService', 'DateService','LanguageService', function ($window, $scope, $resource, $cookies, $location, PagingService, DateService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Operation') + ' > ' + LanguageService('AI Chat log'), '/modules/playchat/gnb/client/imgs/ai.png');

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

        $scope.getList = function(page, searchValue)
        {
            page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 50;

            var query = {};
            query.botId = chatbot.id;
            query.countPerPage = countPerPage;
            query.neSocket = 'true';
            query.search = searchValue;

            BotUserPageService.get(query, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            query.page = page;

            BotUserService.query(query, function(list)
            {
                $scope.list = list;
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.dateFormat = function(date)
        {
            return DateService.formatDate(date);
        }
    })();

    $scope.getList();

    $scope.lan=LanguageService;
}]);
