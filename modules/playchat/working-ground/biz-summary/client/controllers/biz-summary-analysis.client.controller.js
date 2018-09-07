'use strict';

angular.module('playchat').controller('BizSummaryAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$location','$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $location, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var user = $cookies.getObject('user');

    var TotalSendNumService = $resource('/api/:botId/:startDate/:endDate/analysis/sendMsgNum', { botId: '@botId' });
    var TotalSendLastDateService = $resource('/api/:botId/:startDate/:endDate/analysis/sendMsgLastDate', { botId: '@botId' });

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

        if(user.organization && user.organization !== ""){
            $scope.User.name = user.organization;
        }else{
            $scope.User.name = user.username;
        }

        $scope.User.lastSendDate = '';
        $scope.User.sendNum = 0;
        $scope.User.sendSuccNum = 0;
        $scope.User.sendFailedNum = 0;
        $scope.User.sendSuccRate = 0;

        ChatBotService.query({ type : true }, function(list)
        {

            var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
            page = page || 1;
            $scope.pageOptions = PagingService(page, totalPage);
            $scope.date.start = $scope.dateFormat($scope.date.start);
            $scope.date.end = $scope.dateFormat($scope.date.end);

            list.forEach((e,index) => {
                TotalSendNumService.get({ botId: e.id, startDate: $scope.date.start, endDate: $scope.date.end}, function(result)
                {
                    //User:
                    console.log("bot: " + e.id + ', sendNum: ' + result.data[0].total + ', lastSendDate: ' + result.data[0].lastDate);
                    $scope.User.sendNum = $scope.User.sendNum + result.data[0].total;

                    if($scope.User.lastSendDate === '' && result.data[0].lastDate !== null){
                        $scope.User.lastSendDate = $scope.dateFormat(result.data[0].lastDate);
                    }else if(result.data[0].lastDate !== null){
                        $scope.User.lastSendDate = $scope.compareDate($scope.User.lastSendDate, result.data[0].lastDate);
                    }

                    $scope.User.sendSuccNum = 0;

                    //Bot:
                    $scope.Bots[index] = {};
                    $scope.Bots[index].index = index + 1;
                    $scope.Bots[index].name = e.name;
                    $scope.Bots[index].lastSendDate =  $scope.dateFormat(result.data[0].lastDate);
                    $scope.Bots[index].sendNum = result.data[0].total;
                    $scope.Bots[index].sendSuccNum = 0;

                })
            })

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



        });

        angular.element('.main-logo-background').css('opacity', 0);
        angular.element('.main-logo-background').css('display', 'none');

    };

        $scope.compareDate = function(olddate, newdate)
        {
            var oldDate = new Date(olddate);
            var oldTimesheet = oldDate.getTime();
            var newDate = new Date(newdate);
            var newTimesheet = newDate.getTime();
            if(oldTimesheet < newTimesheet){
                olddate =  $scope.dateFormat(newdate);
                return olddate;
            }else{
                return olddate;
            }
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

            return year + '.' + month + '.' + dateOfMonth + ' ' + hour + ':' + min + ':' + sec;
        };



    })();
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
