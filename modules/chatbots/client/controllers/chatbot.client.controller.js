(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotListController', ['$scope', '$resource', '$location', '$cookies', '$state', 'PagingService', 'CaretService', function ($scope, $resource, $location, $cookies, $state, PagingService, CaretService)
    {
        var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
        var ChatBotDuplicateService = $resource('/api/chatbots/:botId/duplicate', { botId: '@botId' });
        var ChatBotPageService = $resource('/api/chatbots/totalpage');

        if($cookies.get('login') === 'false')
        {
            $location.url('/signin');
            return;
        }

        var chatbot = $cookies.getObject('chatbot');

        $scope.selectedBot = undefined;
        $scope.openShareModal = false;
        $scope.share = {};

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
                var target = angular.element('li[data-id="' + $scope.selectedBot.id + '"]').attr('contenteditable', 'true').get(0);
                console.log(target);
                CaretService.placeCaretAtEnd(target);
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

        $scope.chatbotNameKeyDown = function(e)
        {
            if(e.keyCode == 13)
            {
                var value = e.currentTarget.innerText;
                $scope.selectedBot.id = value;

                var params = {};
                params.botId = chatbot._id;

                for(var key in chatbot)
                {
                    params[key] = chatbot[key];
                }

                params.id = value;

                ChatBotService.update(params, function()
                {
                    console.log('성공');
                },
                function(err)
                {
                    alert(err.data.message);
                });

                e.currentTarget.removeAttribute('contenteditable');
            }
            else if(e.keyCode == 27)
            {
                e.currentTarget.removeAttribute('contenteditable');
            }

            console.log(e.keyCode);
        };

        $scope.chatbotNameClick = function(e)
        {
            e.stopPropagation();
        };

        $scope.chatbotNameBlur = function(e)
        {
            e.currentTarget.removeAttribute('contenteditable');
        };

        $scope.closeShareModal = function()
        {
            $scope.openShareModal = false;
        };

        $scope.shareChatbot = function()
        {
            // if(!$scope.share.read || !$scope.share.write)
            // {
            //     alert('Please select at least one permission.');
            //     return false;
            // }
            //
            // $http.post("/api/bot-auths", { authData: authData, email: $scope.share.email }).then(function (doc)
            // {
            //     $state.go("bot-auths.list")
            // },
            // function (err)
            // {
            //     $scope.error = err.data.message;
            //     console.log(err);
            // })
        };

        $scope.selectBot = function(bot)
        {
            $cookies.putObject('chatbot', bot);
            $state.go('playchat');
        };

        $scope.getList();
    }]);
})();
