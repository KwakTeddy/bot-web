'use strict';

angular.module('playchat').controller('BizSummaryAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$location','$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $location, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var user = $cookies.getObject('user');

    // var TotalDialogContentService = $resource('/api/:botId/analysis/total-dialog-content', { botId: '@botId' });
    var TotalDialogContentService = $resource('/api/:botId/:startDate/:endDate/:startTime/analysis/sendMsg', { botId: '@botId' });
    var TotalSuccDialogCountService = $resource('/api/:botId/analysis/total-succ-dialog-count', { botId: '@botId' });
    var LastSendDateService = $resource('/api/:botId/analysis/last-send-date', { botId: '@botId' });
    var TotalDialogCountService = $resource('/api/:botId/analysis/total-dialog-counts', { botId: '@botId' });

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
        $scope.User.lastSendDate = '';
        $scope.User.sendNum = 0;
        $scope.User.sendSuccNum = 0;
        $scope.User.sendSuccRate = 0;

        ChatBotService.query({ type : true }, function(list)
        {

            var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
            page = page || 1;
            $scope.pageOptions = PagingService(page, totalPage);

            // list.forEach((e,index) => {
            //     $scope.Bots[index] = {};
            //     console.log("e.id: " + e.id );
            //     console.log("e.name: " + e.name );
            //     LastSendDateService.get({ botId: e.id,startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result1)
            //     {
            //         //Bot
            //         $scope.Bots[index].lastSendDate = $scope.dateFormat(result1.lastDate);
            //         //User
            //         if (result1.lastDate) {
            //             if ($scope.User.lastSendDate === '') {
            //                 $scope.User.lastSendDate = result1.lastDate;
            //             }
            //             else {
            //                 var OldTime = new Date($scope.User.lastSendDate).getTime();
            //                 var newTime = new Date(result1.lastDate).getTime();
            //                 if (OldTime < newTime) {
            //                     $scope.User.lastSendDate = result1.lastDate;
            //                 }
            //             }
            //         }
            //
            //         TotalDialogCountService.get({ botId: e.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result2)
            //         {
            //             //User
            //             $scope.User.sendNum =  $scope.User.sendNum + result2.count;
            //             //Bot
            //             $scope.Bots[index].sendNum = result2.count;
            //
            //             TotalSuccDialogCountService.get({ botId: e.id,startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()}, function(result3)
            //             {
            //                 //User
            //                 $scope.User.sendSuccNum =  $scope.User.sendSuccNum + result3.count;
            //                 if(index === list.length - 1){
            //                     if($scope.User.sendNum === 0){
            //                         $scope.User.sendSuccRate = 0;
            //                     }
            //                     else{
            //                         $scope.User.sendSuccRate = ( $scope.User.sendSuccNum / $scope.User.sendNum ) * 100;
            //                     }
            //                     $scope.User.lastSendDate = $scope.dateFormat($scope.User.lastSendDate);
            //                 }
            //                 //Bot
            //                 $scope.Bots[index].index = index + 1;
            //                 $scope.Bots[index].name = e.name;
            //                 $scope.Bots[index].sendSuccNum = result3.count;
            //                 if($scope.Bots[index].sendNum === 0){
            //                     $scope.Bots[index].sendSuccRate = 0;
            //                 }
            //                 else{
            //                     $scope.Bots[index].sendSuccRate = ( $scope.Bots[index].sendSuccNum / $scope.Bots[index].sendNum ) * 100;
            //                 }
            //                 index++;
            //             });
            //         });
            //     });
            // });
            var startTime = '2018';
            TotalDialogContentService.get({ botId: 'ddd',startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString(), startTime }, function(result1)
                                {
                                    console.log("result1: " + JSON.stringify(result1));
                                })

        });

        angular.element('.main-logo-background').css('opacity', 0);
        angular.element('.main-logo-background').css('display', 'none');

    };

        $scope.goDetailPage = function(event, data)
        {
            sessionStorage.setItem('botMsg',JSON.stringify(data));
            $location.path('/playchat/analysis/biz-summary-chatbot')
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

            return year + '.' + month + '.' + dateOfMonth + ' ' + hour + ':' + min;
        };



    })();
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
