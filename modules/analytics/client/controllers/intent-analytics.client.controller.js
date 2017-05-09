'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsIntentController', ['$scope', '$rootScope', '$stateParams', '$location', '$window', 'Authentication', '$resource', '$document',
  'DialogFailureMaintenanceService', '$cookies', 'IntentsService',
  function ($scope, $rootScope, $stateParams, $location, $window, Authentication, $resource, $document, DialogFailureMaintenanceService, $cookies, IntentsService) {
    var vm = this;
    $scope.authentication = Authentication;
    $scope.entities = {};
    $scope.intent = {};
    $scope.intents = [];
    $scope.task = {};
    $scope.taskEntities = [];
    $scope.msg = '';
    $scope.failedIntentDialog = '';
    $scope.failedIntent = $stateParams.intentId;

    // DialogFailureMaintenanceService.query({intentId: $stateParams.intentId, botId: $cookies.get('default_bot')}, function (result) {
    //   $scope.failedIntentDialog = result;
    // }, function (err) {
    //   console.log(err)
    // });
    //
    // IntentsService.query({botName: $cookies.get('default_bot')}, function (result) {
    //   $scope.intents = result;
    // }, function (err) {
    //   console.log(err)
    // });
    //
    // IntentsService.get({
    //   botName: $cookies.get('default_bot'),
    //   intentId: $stateParams.intentId
    // }, function (result) {
    //   $scope.failedIntent = result;
    // }, function (err) {
    //   console.log(err)
    // });
    //
    // $scope.intentChange = function (target) {
    //   $scope.failedIntent = target;
    // };

    $scope.$on('sendmsg', function(event, arg0) {
      $scope.msg = arg0.message;
      $scope.sendIntent();
    });

    $scope.sendIntent = function() {
      $resource('/api/user-bots-analytics/intent', {}).get({input: $scope.msg, botId: $rootScope.botId}, function (res) {
        // console.log(res);
        if (res.intent){
          $scope.intent = res.intent;
        }else {
          // $scope.intent['name'] = '해당하는 Intent가 없습니다'
          $scope.intent = undefined;
        }

        if (!Object.keys(res.entities).length){
          $scope.entities = undefined;
        }else {
          $scope.entities = res.entities;
        }

        if(res.dialog && res.dialog.task){
          $scope.task = res.dialog.task
        }else {
          $scope.task = undefined;
          // $scope.task['name'] = '해당하는 Task가 없습니다'
        }

        if(res.dialog && res.dialog.task && res.dialog.task.entities){
          $scope.taskEntities = res.dialog.task.entities;
        }else {
          $scope.taskEntities = undefined;
        }

        $scope.msg = '';
      })
    }
  }
]);

function showIntentPanel() {
  document.getElementById('intent-button').className='intent-button-hide';
  document.getElementById('intent-include').className='show-intent';
  document.getElementById('main').classList.add('content-body-show-log');
  if(document.getElementById('content')) document.getElementById('content').classList.add('tree-content-show-log');

}

function hideIntentPanel() {
  document.getElementById('intent-button').className = 'intent-button';
  document.getElementById('intent-include').className = 'hide-intent';
  document.getElementById('main').classList.remove('content-body-show-log');
  if(document.getElementById('content')) document.getElementById('content').classList.remove('tree-content-show-log');
}