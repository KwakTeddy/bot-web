'use strict';

angular.module('playchat').controller('BizSendlistBotAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService )
{
  $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');

  var BotOneSendService = $resource('/api/analysis/botOneSend', {
    botId: '@botId',
    startDateTime: '@startDateTime',
    endDateTime: '@endDateTime'
  });


  var user = $cookies.getObject('user');
  $scope.Users = [];
  $scope.Bots = [];
  $scope.Messages = [];
  $scope.date = {};

  (function () {

      $scope.toPage = function(page)
      {
          $scope.getBotSend(page);
      };

      $scope.getBotSend = function () {
       BotOneSendService.get({
           startDateTime: $scope.date.start,
           endDateTime: $scope.date.end}, function (result) {
        // console.log('result: ' + JSON(result));
        $scope.Bots = result.list;

        var totalPage = result.list.length < 10 ? 1 : Math.round(result.list.length / 10);
        page = page || 1;
        $scope.pageOptions = PagingService(page, totalPage);

       });
    };

    $scope.getList = function () {

      $scope.date.start = $scope.dateFormat($scope.date.start);
      $scope.date.end = $scope.dateFormat($scope.date.end);
      $scope.getBotSend();
    };



  })();

  DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
  $scope.getBotSend();

  $scope.$parent.loaded('working-ground');
  $scope.lan = LanguageService;

}]);
