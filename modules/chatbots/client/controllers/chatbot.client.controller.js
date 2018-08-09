(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotListController', ['$scope', '$resource', '$location', '$cookies', '$state', 'PagingService', 'CaretService', 'LanguageService', 'LogService', function ($scope, $resource, $location, $cookies, $state, PagingService, CaretService, LanguageService, LogService)
    {
        var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
        var ChatBotRenameService = $resource('/api/chatbots/:botId/rename', { botId: '@botId' }, { update: { method: 'PUT' } });
        var ChatBotDuplicateService = $resource('/api/chatbots/:botId/duplicate', { botId: '@botId' });
        var ChatBotShareService = $resource('/api/chatbots/:botId/share', { botId: '@botId' });
        var ChatbotAuthService = $resource('/api/:botId/bot-auth/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
        var SharedChatBotService = $resource('/api/chatbots/shared');

        if($cookies.get('login') !== 'true')
        {
            $location.url('/signin');
            return;
        }

        var page = 1;
        var countPerPage = $location.search().countPerPage || 50;

        var user = $cookies.getObject('user');

        $scope.selectedBot = undefined;
        $scope.openShareModal = false;
        $scope.share = {};

        $scope.sharedList = [];

        window.addEventListener('click', function()
        {
            $scope.closeMenu();
        });

        $scope.getList = function(name)
        {
            ChatBotService.query({ page: page, countPerPage: countPerPage, name : name }, function(list)
            {
                $scope.list = list;
                
                for(var i=0; i<list.length; i++)
                {
                    if(list[i].language == 'ko')
                    {
                        list[i].languageCode = ''
                    }
                }
                
                $scope.$parent.loading = false;
            });

            SharedChatBotService.query({}, function(list)
            {
                $scope.sharedList = list;
            });
        };

        angular.element('#main > section').on('scroll', function(e)
        {
            if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight >= e.currentTarget.scrollHeight)
            {
                page++;
                ChatBotService.query({ page: page, countPerPage: countPerPage, name : name }, function(list)
                {
                    for(var i=0; i<list.length; i++)
                    {
                        $scope.list.push(list[i]);
                    }
                });
            }
        });

        $scope.selectChatbot = function(chatbot, callback)
        {
            LogService.botId = chatbot._id;
            // alert(JSON.stringify(chatbot))
            // delete chatbot.user;
            ChatbotAuthService.get({ botId: chatbot._id }, function(result)
            {
                var version = result.version;
                var list = result.list;
                if(list.length > 0)
                {
                    chatbot.myBotAuth = { read : list[0].read, edit: list[0].edit };
                    $cookies.putObject('chatbot', chatbot);

                    if(!version)
                    {
                        alert(LanguageService('It is a chatbot made in old version PlayChat. Go to old version PlayChat.'));
                        window.open(
                            'https://old.playchat.ai/playchat/',
                            '_blank' // <- This is what makes it open in a new window.
                        );
                    }
                    else
                    {
                        if(!callback)
                        {
                            $location.url('/playchat');
                        }
                        else
                        {
                            callback();
                        }
                    }
                }
                else
                {
                    alert(LanguageService('You do not have permission to access this bot'));
                    location.href = '/playchat/chatbots';
                }

            }, function(err)
            {
                if(err.status == 401)
                {
                    alert(LanguageService('You do not have permission to access this bot'));
                    location.href = '/playchat/chatbots';
                }
            });
        };

        $scope.moveTab = function(e, name)
        {
            angular.element('.select_tab').removeClass('select_tab');
            angular.element('#botContent').hide();
            angular.element('#sharedBotContent').hide();
            angular.element('#' + name).show();
            angular.element(e.currentTarget).addClass('select_tab');
        };

        $scope.toPage = function(page)
        {
            console.log(page)
            $scope.getList(page);
        };

        $scope.openMenu = function(e, bot)
        {
            if(e.which != 1)
                return;

            $scope.selectedBot = bot;
            $scope.share = {
                email: '',
                read: false,
                write: false
            };

            var x = e.currentTarget.offsetLeft;
            var y = e.currentTarget.offsetTop;

            var rect = e.currentTarget.getBoundingClientRect();

            console.log(rect);

            angular.element('.chatbot-menu').css('left', rect.left).css('top', rect.top).show();

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
                $scope.selectChatbot($scope.selectedBot, function()
                {
                    $location.url('/playchat/chatbot-edit');
                });
                // var target = angular.element('div[data-id="' + $scope.selectedBot.id + '"]').attr('contenteditable', 'true').get(0);
                // CaretService.placeCaretAtEnd(target);
                //
                // target.style.cursor = 'text';
            }
            else if(name == 'Share')
            {
                $scope.openShareModal = true;
            }
            else if(name == 'Duplicate')
            {
                ChatBotDuplicateService.save({ botId: $scope.selectedBot._id }, function(item)
                {
                    $scope.list.unshift(item);
                },
                function(err)
                {
                    alert(err.data.message);
                });
            }
            else if(name == 'Delete')
            {
                if(confirm($scope.lan('Are you sure you want to delete this item?')))
                {
                    ChatBotService.delete({ botId : $scope.selectedBot._id, botDisplayId: $scope.selectedBot.id }, function()
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
                $scope.selectedBot.name = value;

                ChatBotRenameService.update({ botId: $scope.selectedBot._id, name: value }, function()
                {
                    e.currentTarget.style.color = 'green';

                    setTimeout(function()
                    {
                        e.currentTarget.style.color = '';
                    }, 1000);
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
        };

        $scope.chatbotNameClick = function(e)
        {
            var isEditing = e.currentTarget.getAttribute('contenteditable');

            if(isEditing)
            {
                e.preventDefault();
                e.stopPropagation();
            }

            // e.stopPropagation();
        };

        $scope.chatbotNameBlur = function(e)
        {
            e.currentTarget.style.cursor = 'pointer';

            e.currentTarget.removeAttribute('contenteditable');
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

            ChatBotShareService.save({ botId: $scope.selectedBot._id, data: JSON.parse(angular.toJson($scope.share)), language: user.language }, function(result)
            {
                $scope.openShareModal = false;
                alert('Shared ' + $scope.selectedBot.name + ' to ' + $scope.share.email);
            },
            function(err)
            {
                alert(err.data.message);
            });
        };

        $scope.moveToCreate = function()
        {
            $location.url('/playchat/chatbots/create');
        };

        $scope.getList();

        $scope.lan = LanguageService;
    }]);
})();
