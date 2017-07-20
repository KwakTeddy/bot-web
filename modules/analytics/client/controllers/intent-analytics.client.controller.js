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

    $scope.$on('updateLog', function(event, arg0) {
      var index = $rootScope.logUpdated.indexOf('[DIALOG_SEL]');

      if(index != -1) {
        var json = $rootScope.logUpdated.substring('[DIALOG_SEL]'.length);

        try {
          var res = JSON.parse(json);

          if (res.contexts){
            $scope.contexts = res.contexts;
          }else {
            $scope.contexts = undefined;
          }

          if (res.intent){
            $scope.intent = res.intent;
          }else {
            $scope.intent = undefined;
          }

          if (!res.entities || !Object.keys(res.entities).length){
            $scope.entities = undefined;
          }else {
            $scope.entities = res.entities;
          }
        } catch(e) {
          console.log(e);
        }
      }
    })

    $scope.sendIntent = function() {
      $resource('/api/user-bots-analytics/intent', {}).get({input: $scope.msg, botId: $rootScope.botId}, function (res) {
        // console.log(res);
        if (res.contexts){
          $scope.contexts = res.contexts;
        }else {
          $scope.contexts = undefined;
        }

        if (res.intent){
          $scope.intent = res.intent;
        }else {
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
  document.getElementById('log-button').classList.add('log-button-hide');
  document.getElementById('intent-button').classList.add('intent-button-hide');
  document.getElementById('intent-include').className='show-intent';
  document.getElementById('log-include').className = 'hide-log';
  document.getElementById('main').classList.add('content-body-show-log');
  if(document.getElementById('content')) document.getElementById('content').classList.add('tree-content-show-log');

}

function hideIntentPanel() {
  document.getElementById('log-button').classList.remove('log-button-hide');
  document.getElementById('intent-button').classList.remove('intent-button-hide');
  document.getElementById('intent-include').className = 'hide-intent';
  document.getElementById('main').classList.remove('content-body-show-log');
  if(document.getElementById('content')) document.getElementById('content').classList.remove('tree-content-show-log');
}
