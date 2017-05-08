'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsIntentController', ['$scope', '$rootScope', '$stateParams', '$location', '$window', 'Authentication', '$resource', '$document',
  function ($scope, $rootScope, $stateParams, $location, $window, Authentication, $resource, $document) {
    var vm = this;
    $scope.authentication = Authentication;
    $scope.entities = '';
    $scope.intent = {};
    $scope.task = {};
    $scope.taskEntities = [];
    $scope.msg = '';


    $scope.$on('keyinput', function(event, arg0) {
      $scope.msg = arg0;
    });
    $document.bind("keydown", function (event) {
      if (event.keyCode == 13){
        $resource('/api/user-bots-analytics/intent', {}).get({input: $scope.msg, botId: $rootScope.botId}, function (res) {
          console.log(res);
          if (res.intent){
            $scope.intent = res.intent;
          }else {
            $scope.intent['name'] = '해당하는 인텐트가 없습니다'
          }

          if (!Object.keys(res.entities).length){
            $scope.entities = '해당하는 엔터티가 없습니다'
          }else {
            $scope.entities = JSON.stringify(res.entities);
          }

          if(res.intentDialog && res.intentDialog.task){
            $scope.task = res.intentDialog.task
          }else {
            $scope.task['name'] = '없음'
          }

          if(res.intentDialog && res.intentDialog.task && res.intentDialog.task.entities){
            $scope.taskEntities = res.intentDialog.task.entities;
          }else {
            $scope.taskEntities = [];
          }

        })
      }
    });
  }
]);
