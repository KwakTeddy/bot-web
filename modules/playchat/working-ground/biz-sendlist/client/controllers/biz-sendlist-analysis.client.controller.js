'use strict';

angular.module('playchat').controller('BizSendlistAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var user = $cookies.getObject('user');

    $scope.User = [];
    $scope.Bots = [];
    $scope.Messages = [];
    $scope.date = {};

    (function()
    {

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.getList = function(page)
        {
            $scope.User.name = user.displayName;
            $scope.User.lastSendDate = '2018.08.24.0600';
            $scope.User.sendNum = 0;
            $scope.User.sendSuccNum = 0;
            $scope.User.sendSuccRate = 0;

            ChatBotService.query({ type : true }, function(list)
            {
                var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
                page = page || 1;
                $scope.pageOptions = PagingService(page, totalPage);

                list.forEach((e,index) => {
                    e.created = moment(e.created).format('YYYY.MM.DD');
                    $scope.Bots[index] = {};
                    $scope.Bots[index].index = index + 1;
                    $scope.Bots[index].name = e.name;
                    // message list load
                    $scope.Bots[index].lastSendDate = '2018.08.24.0600';
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
        };

        $scope.dateFormat = function(date)
        {
            if(!date)
                return;

            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var dateOfMonth = date.getDate();

            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();

            month = month < 10 ? '0' + month : month;
            dateOfMonth = dateOfMonth < 10 ? '0' + dateOfMonth : dateOfMonth;

            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;

            return year + '-' + month + '-' + dateOfMonth + ' ' + hour + ':' + min + ':' + sec;
        };



    })();
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);