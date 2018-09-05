'use strict';

angular.module('playchat').controller('BizSendlistBotAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', '$http', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService, $http)
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

    $scope.getBotSend = function () {
      BotOneSendService.get({
        botId: 'bot',
        // startDate: '2018-08-28 10:39:00',
        // endDate: '2018-09-05 10:39:00'
      }, function (result) {
        // console.log('result: ' + JSON(result));
        $scope.Bots = result.list;
      });
    };
  })();

  // DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
  $scope.getBotSend();
  
  $scope.$parent.loaded('working-ground');
  $scope.lan = LanguageService;

}]);
