angular.module('playchat').controller('HumanChatLogController', ['$window', '$scope', '$resource', '$cookies', '$location', 'DateService', 'PagingService','LanguageService', function ($window, $scope, $resource, $cookies, $location, DateService, PagingService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Operation') + ' > ' + LanguageService('Human Chat log'), '/modules/playchat/gnb/client/imgs/human.png');

    var HumanChatService = $resource('/api/:botId/operation/humanchatlog', { botId: '@botId' });
    var HumanChatBotUserService = $resource('/api/:botId/operation/humanchatlog/:userKey', { botId: '@botId', userKey: '@userKey' });

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
            query.page = page;
            query.search = searchValue;

            HumanChatService.get(query, function(list)
            {
                $scope.list = list.data;

                var totalPage = list.recordsTotal;
                $scope.pageOptions = PagingService(page, totalPage);

                for(var i=0; i<$scope.list.length; i++)
                {
                    (function(index)
                    {
                        HumanChatBotUserService.get({ botId: chatbot.id, userKey: $scope.list[index]._id.userKey }, function(result)
                        {
                            $scope.list[index]._id._id = result._id;
                        },
                        function(err)
                        {
                            alert(err.data.error || err.data.message);
                        });
                    })(i);
                }

                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.dateFormat = function(date)
        {
            return DateService.formatDate(date);
        };
    })();

    $scope.getList();

    $scope.$parent.loaded('working-ground');

    $scope.lan=LanguageService;
}]);
