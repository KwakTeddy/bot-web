'use strict';

angular.module('playchat').controller('BizSendlistAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', '$http', '$location', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService, $http, $location)
{
  $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');

  var UserSendService = $resource('/api/analysis/userSend', {
    startDateTime: '@startDateTime',
    endDateTime: '@endDateTime'
  });

  var BotSendService = $resource('/api/analysis/botSend', {
    startDateTime: '@startDateTime',
    endDateTime: '@endDateTime'
  });

  var user = $cookies.getObject('user');
  $scope.Users = [];
  $scope.Bots = [];
  $scope.Messages = [];
  $scope.date = {};

  (function () {

    $scope.getUsers = function () {
      UserSendService.get({
        botId: '1'
        // startDate: '2018-08-28 10:39:00',
        // endDate: '2018-09-05 10:39:00'
      }, function (result) {
        // console.log('result: ' + JSON(result));
        $scope.Users = result.list;
      });
    };

    $scope.getBots = function () {
      BotSendService.get({
        // startDate: '2018-08-28 10:39:00',
        // endDate: '2018-09-05 10:39:00'
      }, function (result) {
        // console.log('result: ' + JSON(result));
        $scope.Bots = result.list;
      });
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

    $scope.goDetailPage = function(event, data)
    {
      sessionStorage.setItem('botMsg',JSON.stringify(data));
      $location.path('/playchat/analysis/biz-sendlist-bot')
    };


    angular.element('.main-logo-background').css('opacity', 0);
    angular.element('.main-logo-background').css('display', 'none');

  })();

  // DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
  $scope.getUsers();
  $scope.getBots();
  
  $scope.$parent.loaded('working-ground');
  $scope.lan = LanguageService;

}]);
