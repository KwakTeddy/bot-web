'use strict';

angular.module('playchat').controller('BizSendlistAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$location','$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $location, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService )
{

    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');

    // var TotalSendNumService = $resource('/api/:botId/:startDate/:endDate/analysis/sendMsgNum', { botId: '@botId' });
    // var ResponseHumNumService = $resource('/api/:botId/:startDate/:endDate/analysis/resHumNum', { botId: '@botId' });
    // var TotalHumNumService = $resource('/api/:botId/:startDate/:endDate/analysis/TotalHumNum', { botId: '@botId' });



    var user = $cookies.getObject('user');
    $scope.Users = [];
    $scope.Bots = [];
    $scope.Messages = [];
    $scope.date = {};



    var UserSendService = $resource('/api/analysis/userSend', {
        startDateTime: '@startDateTime',
        endDateTime: '@endDateTime'
    });

    var BotSendService = $resource('/api/analysis/botSend', {
        startDateTime: '@startDateTime',
        endDateTime: '@endDateTime'
    });


    (function () {
        $scope.toPage = function(page)
        {
            $scope.getBots(page);
        };


        $scope.User.name = user.email;

        $scope.User.lastSendDate = '';
        $scope.User.sendNum = 0;
        $scope.User.sendSuccNum = 0;
        $scope.User.sendTotalNum = 0;
        $scope.User.sendSuccRate = 0;

        $scope.getUsers = function () {

            UserSendService.get({
                botId: '1',
                startDateTime: $scope.date.start,
                endDateTime: $scope.date.end
            }, function (result) {
                $scope.Users = result.list;
            });
        };

        $scope.getBots = function (page) {
            BotSendService.get({
                startDateTime: $scope.date.start,
                endDateTime: $scope.date.end}, function (result) {
                $scope.Bots = result.list;

                var totalPage = result.list.length < 10 ? 1 : Math.round(result.list.length / 10);
                page = page || 1;
                $scope.pageOptions = PagingService(page, totalPage);

            });
        };

        $scope.getList = function () {
            $scope.date.start = $scope.dateFormat($scope.date.start);
            $scope.date.end = $scope.dateFormat($scope.date.end);

            $scope.getUsers();
            $scope.getBots();
        };






        $scope.dateFormat = function (date) {
            if (!date)
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


        $scope.goDetailPage = function (event, data) {
            sessionStorage.setItem('botMsg', JSON.stringify(data));
            $location.path('/playchat/analysis/biz-sendlist-bot')
        };


        angular.element('.main-logo-background').css('opacity', 0);
        angular.element('.main-logo-background').css('display', 'none');



    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getUsers();
    $scope.getBots();

    $scope.$parent.loaded('working-ground');
    $scope.lan = LanguageService;

}]);





//
//
//
// angular.module('playchat').controller('BizSendlistAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$location','$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $location, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
// {
//
//     $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');
//     var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
//     var user = $cookies.getObject('user');
//
//     var TotalSendNumService = $resource('/api/:botId/:startDate/:endDate/analysis/sendMsgNum', { botId: '@botId' });
//     // var ResponseHumNumService = $resource('/api/:botId/:startDate/:endDate/analysis/resHumNum', { botId: '@botId' });
//     // var TotalHumNumService = $resource('/api/:botId/:startDate/:endDate/analysis/TotalHumNum', { botId: '@botId' });
//
//     $scope.User = [];
//     $scope.Bots = [];
//     $scope.Messages = [];
//     $scope.date = {};
//     (function()
//     {
//         $scope.toPage = function(page)
//         {
//             $scope.getList(page);
//         };
//
//         $scope.getList = function(page)
//         {
//             $scope.User.name = user.email;
//
//             $scope.User.lastSendDate = '';
//             $scope.User.sendNum = 0;
//             $scope.User.sendSuccNum = 0;
//             $scope.User.sendTotalNum = 0;
//             $scope.User.sendSuccRate = 0;
//
//             ChatBotService.query({ type : true }, function(list)
//             {
//
//                 var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
//                 page = page || 1;
//                 $scope.pageOptions = PagingService(page, totalPage);
//                 $scope.date.start = $scope.dateFormat($scope.date.start);
//                 $scope.date.end = $scope.dateFormat($scope.date.end);
//
//                 list.forEach((e,index) => {
//                     //get total send number of User and Bot
//                     TotalSendNumService.get({ botId: e.id, startDate: $scope.date.start, endDate: $scope.date.end}, function(result)
//                     {
//                         //User:
//                         $scope.User.sendNum = $scope.User.sendNum + result.data[0].total;
//
//                         if($scope.User.lastSendDate === '' && result.data[0].lastDate !== null){
//                             $scope.User.lastSendDate = $scope.dateFormat(result.data[0].lastDate);
//                         }else if(result.data[0].lastDate !== null){
//                             $scope.User.lastSendDate = $scope.compareDate($scope.User.lastSendDate, result.data[0].lastDate);
//                         }
//
//                         // //Bot:
//                         // $scope.Bots[index] = {};
//                         // $scope.Bots[index].index = index + 1;
//                         // $scope.Bots[index].sendTotalNum = 0;
//                         // $scope.Bots[index].sendSuccRate = 0;
//                         // $scope.Bots[index].sendNum = 0;
//                         // $scope.Bots[index].id = e.id;
//                         // $scope.Bots[index].name = e.name;
//                         // $scope.Bots[index].lastSendDate =  $scope.dateFormat(result.data[0].lastDate);
//                         // $scope.Bots[index].sendNum = result.data[0].total;
//
//
//                         // get response people number of User and Bot
//                         ResponseHumNumService.get({ botId: e.id, startDate: $scope.date.start, endDate: $scope.date.end},function (count) {
//                             //User
//                             $scope.User.sendSuccNum = $scope.User.sendSuccNum + count.result;
//
//                             //bots
//                             $scope.Bots[index].sendSuccNum = count.result;
//
//                             TotalHumNumService.get({ botId: e.id, startDate: $scope.date.start, endDate: $scope.date.end},function (totalCount) {
//                                 if(totalCount[0] && totalCount[0].count){
//                                     $scope.User.sendTotalNum = $scope.User.sendTotalNum + totalCount[0].count;
//                                     $scope.Bots[index].sendTotalNum = totalCount[0].count;
//                                 }
//
//                                 if (index === list.length - 1) {
//                                     if($scope.User.sendTotalNum !== 0){
//                                         $scope.User.sendSuccRate =($scope.User.sendSuccNum / $scope.User.sendTotalNum )* 100;
//                                     }
//                                 }
//
//                                 if($scope.Bots[index].sendTotalNum !== 0){
//                                     $scope.Bots[index].sendSuccRate = ($scope.Bots[index].sendSuccNum / $scope.Bots[index].sendTotalNum) * 100;
//                                 }
//                             });
//                         });
//                     });
//                 });
//             });
//
//             angular.element('.main-logo-background').css('opacity', 0);
//             angular.element('.main-logo-background').css('display', 'none');
//
//         };
//
//         $scope.compareDate = function(olddate, newdate)
//         {
//             var oldDate = new Date(olddate);
//             var oldTimesheet = oldDate.getTime();
//             var newDate = new Date(newdate);
//             var newTimesheet = newDate.getTime();
//             if(oldTimesheet < newTimesheet){
//                 olddate =  $scope.dateFormat(newdate);
//                 return olddate;
//             }else{
//                 return olddate;
//             }
//         };
//
//         $scope.goDetailPage = function(event, data)
//         {
//             sessionStorage.setItem('botMsg',JSON.stringify(data));
//             $location.path('/playchat/analysis/biz-sendlist-chatbot')
//         };
//
//         $scope.dateFormat = function(date)
//         {
//             if(!date)
//                 return;
//
//             date = new Date(date);
//
//             var year = date.getFullYear();
//             var month = date.getMonth() + 1;
//             var dateOfMonth = date.getDate();
//
//             var hour = date.getHours();
//             var min = date.getMinutes();
//             var sec = date.getSeconds();
//
//             month = month < 10 ? '0' + month : month;
//             dateOfMonth = dateOfMonth < 10 ? '0' + dateOfMonth : dateOfMonth;
//
//             hour = hour < 10 ? '0' + hour : hour;
//             min = min < 10 ? '0' + min : min;
//             sec = sec < 10 ? '0' + sec : sec;
//
//             return year + '.' + month + '.' + dateOfMonth + ' ' + hour + ':' + min + ':' + sec;
//         };
//
//     })();
//     DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
//     $scope.getList();
//     $scope.$parent.loaded('working-ground');
//     $scope.lan=LanguageService;
// }]);
//
