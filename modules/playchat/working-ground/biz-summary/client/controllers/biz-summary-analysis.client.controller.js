'use strict';

angular.module('playchat').controller('BizSummaryAnalysisController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var BizMsgsService = $resource('/api/:botId/biz-msg/:id', { botId: '@botId', id:'@id', data:'@data' });
    var user = $cookies.getObject('user');

    $scope.User = [];
    $scope.Bots = [];
    $scope.Messages = [];
    $scope.date = {};

    (function()
    {
        $scope.getList = function()
    {
        $scope.User.name = user.displayName;
        ChatBotService.query({ type : true }, function(list)
        {
            list.forEach((e,index) => {
                e.created = moment(e.created).format('YYYY.MM.DD');
                $scope.Bots[index] = {};
                $scope.Bots[index].index = index + 1;
                $scope.Bots[index].name = e.name;
                // message list load
                $scope.Bots[index].lastSendDate = 0;
                $scope.Bots[index].sendNum = 0;
                $scope.Bots[index].sendSuccNum = 0;
                $scope.Bots[index].sendSuccRate = 0;
                //
                index++;
            });

        });
        angular.element('.main-logo-background').css('opacity', 0);
        angular.element('.main-logo-background').css('display', 'none');

    };

        $scope.goDetailPage = function(event, data)
        {
            var target = angular.element(event.currentTarget);
            console.log("target: " + target);

            var href = target.attr('data-href');
            //
            location.href = href + '#' + encodeURIComponent(JSON.stringify(data));
            // location.href = href;
        };

    })();
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
