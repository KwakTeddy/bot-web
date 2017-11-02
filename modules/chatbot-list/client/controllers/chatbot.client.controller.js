(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotListController', ['$scope', '$resource', '$location', '$cookies', '$state', 'PagingService', function ($scope, $resource, $location, $cookies, $state, PagingService)
    {
        var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
        var ChatBotDuplicateService = $resource('/api/chatbots/:botId/duplicate', { botId: '@botId' });
        var ChatBotPageService = $resource('/api/chatbots/totalpage');

        $scope.selectedBot = undefined;
        $scope.openShareModal = false;

        window.addEventListener('click', function()
        {
            $scope.closeMenu();
        });

        $scope.getList = function(page, name)
        {
            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 12;

            ChatBotPageService.get({ countPerPage: countPerPage, name : name }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            ChatBotService.query({ page: page, countPerPage: countPerPage, name : name }, function(list)
            {
                $scope.list = list;
                $scope.$parent.loading = false;
            });
        };

        $scope.selectChatbot = function(chatbot)
        {
            $cookies.putObject('chatbot', chatbot);
            $location.url('/playchat');
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.openMenu = function(e, bot)
        {
            if(e.which != 1)
                return;

            $scope.selectedBot = bot;

            var x = e.currentTarget.offsetLeft;
            var y = e.currentTarget.offsetTop;

            angular.element('.chatbot-menu').css('left', x).css('top', y).show();

            e.stopPropagation();
            e.preventDefault();
        };

        $scope.closeMenu = function()
        {
            angular.element('.chatbot-menu').hide();
        };

        $scope.executeMenu = function(name)
        {
            if(name == 'Rename')
            {

            }
            else if(name == 'Share')
            {
                $scope.openShareModal = true;
            }
            else if(name == 'Duplicate')
            {
                ChatBotDuplicateService.save({ botId: $scope.selectedBot._id }, function(item)
                {
                    console.log(item);
                },
                function(err)
                {
                    alert(err.data.message);
                });
            }
            else if(name == 'Delete')
            {
                if(confirm('정말 삭제하시겠습니까?'))
                {
                    ChatBotService.delete({ botId : $scope.selectedBot._id }, function()
                    {
                        var index = $scope.list.indexOf($scope.selectedBot);
                        $scope.list.splice(index, 1);
                    }, function(err)
                    {
                        alert(err.data.message);
                    });
                }
            }

            $scope.closeMenu();
        };

        $scope.closeShareModal = function()
        {
            $scope.openShareModal = false;
        };

        $scope.shareChatbot = function()
        {

        };

        $scope.selectBot = function(bot)
        {
            $cookies.putObject('chatbot', bot);
            $state.go('playchat');
        };

        $scope.getList();
    }]);
})();
