'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsIntentController', ['$scope', '$rootScope', '$stateParams', '$location', '$window', 'Authentication', '$resource', '$document',
  'DialogFailureMaintenanceService', '$cookies', 'IntentsService',
  function ($scope, $rootScope, $stateParams, $location, $window, Authentication, $resource, $document, DialogFailureMaintenanceService, $cookies, IntentsService) {
    var vm = this;
    $scope.authentication = Authentication;
    $scope.entities = '';
    $scope.intent = {};
    $scope.intents = [];
    $scope.task = {};
    $scope.taskEntities = [];
    $scope.msg = '';
    $scope.failedIntentDialog = '';
    $scope.failedIntent = $stateParams.intentId;

    DialogFailureMaintenanceService.query({intentId: $stateParams.intentId, botId: $cookies.get('default_bot')}, function (result) {
      $scope.failedIntentDialog = result;
    }, function (err) {
      console.log(err)
    });

    IntentsService.query({botName: $cookies.get('default_bot')}, function (result) {
      $scope.intents = result;
    }, function (err) {
      console.log(err)
    });

    IntentsService.get({
      botName: $cookies.get('default_bot'),
      intentId: $stateParams.intentId
    }, function (result) {
      $scope.failedIntent = result;
    }, function (err) {
      console.log(err)
    });

    $scope.intentChange = function (target) {
      $scope.failedIntent = target;
    };


    $scope.save = function () {
      var clearList = [];
      for(var i = 0; i < $scope.failedIntentDialog.length; i++){
        if ($scope.failedIntentDialog[i].clear){
          clearList.push($scope.failedIntentDialog[i])
        }
      }

      $resource('/api/intentsContent').save({content: clearList, intentId: $scope.failedIntent._id, botId: $rootScope.botId}, function () {
       $scope.failedIntentDialog[0].$update({intentId: $scope.failedIntent._id, clearList: clearList}, function (result) {
         DialogFailureMaintenanceService.query({intentId: $stateParams.intentId, botId: $cookies.get('default_bot')}, function (result2) {
           $scope.failedIntentDialog = result2;
         }, function (err2) {
           console.log(err2)
         });

       }, function (err1) {
         console.log(err1);
       })
      }, function (err) {
        console.log(err);
      })
    };

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
