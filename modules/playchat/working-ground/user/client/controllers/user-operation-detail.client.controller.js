'use strict';

angular.module('playchat').controller('OperationUserDetailController', ['$window', '$scope', '$rootScope', '$resource', '$cookies', '$location', 'DateService', 'LanguageService',function ($window, $scope, $rootScope, $resource, $cookies, $location, DateService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Operation') + ' > ' + LanguageService('User Detail'), '/modules/playchat/gnb/client/imgs/user.png');

    var BotUserService = $resource('/api/:botId/operation/users/:id', { botId: '@botId', id: '@id' });
    var MemoService = $resource('/api/:botId/operation/users/:userKey/memo', { botId: '@botId', userKey: '@userKey' });

    (function()
    {
        $scope.memo = '';
        $scope.data = {};

        var chatbot = $cookies.getObject('chatbot');

        $scope.data._id = $location.search()._id;

        $scope.getDetail = function()
        {
            var query = { botId: chatbot.id };
            if($scope.data._id)
            {
                query.id = $scope.data._id;
            }
            else if($location.search().userKey)
            {
                query.userKey = $location.search().userKey;
                query.liveChat = $location.search().liveChat;
            }

            BotUserService.get(query, function(result)
            {
                var item = JSON.parse(JSON.stringify(result));

                item.userDialog.sort(function (a, b) {
                    if(a.created != b.created)
                    {
                        return -1*(Date.parse(a.created) - Date.parse(b.created));
                    }
                    else
                    {
                        return a.inOut - b.inOut ;
                    }
                });

                $scope.data = item;
                if(item.userDialog && item.userDialog.length > 0)
                {
                    $scope.data.lastUpdate = item.userDialog[0].created;
                    $scope.data.newMsg = item.userDialog[0].dialog;

                    $rootScope.$broadcast('set-simulator-content', { dialog: $scope.data.userDialog, readonly: false });

                    $scope.data.lastUpdate = DateService.formatDate($scope.data.lastUpdate);
                }

                $rootScope.$broadcast('setAdvisorMode', { userKey: $scope.data.userKey });

                MemoService.query({ botId: chatbot.id, userKey: $scope.data.userKey }, function(memoList)
                {
                    $scope.data.memos = JSON.parse(JSON.stringify(memoList));
                },
                function(err)
                {
                    alert(err.data.error || err.data.message);
                });
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.saveUserMemo = function(e)
        {
            MemoService.save({ botId: chatbot.id, userKey: $scope.data.userKey, memo: $scope.memo }, function(result)
            {
                $scope.memo = '';
                $scope.data.memos.unshift(JSON.parse(JSON.stringify(result)));
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.formatDate = function(date)
        {
            return DateService.formatDate(date);
        };

        $scope.advisorModeText = '수동상담으로 전환하기';
        $scope.mode = 'ai';
        $scope.changeAdvisorMode = function()
        {
            if($scope.mode == 'ai')
            {
                if(confirm('자동상담중입니다. 수동상담으로 전환하시겠습니까?'))
                {
                    $scope.advisorModeText = '자동상담으로 전환하기';
                    alert('수동상담으로 전환되었습니다');
                    $scope.mode = 'human';
                    $rootScope.$broadcast('setAdvisorMode', {userKey: $scope.data.userKey, mode: 'human'});
                    angular.element('#simulatorInput').removeAttr('readonly').removeAttr('placeholder').off('click').focus();
                }
            }
            else
            {
                alert('자동상담으로 전환되었습니다');
                $scope.advisorModeText = '수동상담으로 전환하기';
                $scope.mode = 'ai';
                $rootScope.$broadcast('setAdvisorMode', { userKey: $scope.data.userKey, mode: 'ai' });
                angular.element('#simulatorInput').attr('readonly', true).attr('placeholder', '자동상담중입니다.').blur().on('click', function()
                {
                    if(confirm('자동상담중입니다. 수동상담으로 전환하시겠습니까?'))
                    {
                        angular.element('#simulatorInput').removeAttr('readonly').removeAttr('placeholder').off('click').focus();
                        $scope.changeAdvisorMode();
                    }
                });
            }
        };

        $scope.$on('setMode', function(context, data)
        {
            $scope.mode = data.mode;
            if(data.mode == 'human')
            {
                $scope.advisorModeText = '자동상담으로 전환하기';
                angular.element('#simulatorInput').removeAttr('readonly').removeAttr('placeholder').off('click').focus();
            }
            else
            {
                $scope.advisorModeText = '수동상담으로 전환하기';
                angular.element('#simulatorInput').attr('readonly', true).attr('placeholder', '자동상담중입니다.').on('click', function()
                {
                    if(confirm('자동상담중입니다. 수동상담으로 전환하시겠습니까?'))
                    {
                        angular.element('#simulatorInput').removeAttr('readonly').removeAttr('placeholder').off('click').focus();
                        $scope.changeAdvisorMode();
                    }
                });
            }
        });
    })();

    $scope.$on('simulator_command_end', function()
    {
        angular.element('#simulatorInput').attr('readonly', true).attr('placeholder', '자동상담중입니다.').on('click', function()
        {
            $scope.changeAdvisorMode();
        });
        $scope.getDetail();
    });

    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
