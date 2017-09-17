'use strict';

// Analytics controller
angular.module('analytics').controller('IntentFailMaintenanceController', ['$scope', '$rootScope', '$stateParams', '$location', '$window', 'Authentication', '$resource', '$document',
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

    DialogFailureMaintenanceService.query({intentId: $stateParams.intentId, botId: $cookies.get('default_bot')}, function (result) {
      $scope.failedIntentDialog = result;
    }, function (err) {
      console.log(err)
    });

    IntentsService.query({botName: $cookies.get('default_bot')}, function (result) {
      console.log(result);
      $scope.intents = result;
    }, function (err) {
      console.log(err)
    });

    IntentsService.get({
      botName: $cookies.get('default_bot'),
      intentId: $stateParams.intentId
    }, function (result) {
      console.log(result)
      $scope.failedIntent = result;
    }, function (err) {
      console.log(err)
    });

    $scope.intentChange = function (target) {
      IntentsService.get({
        botName: $cookies.get('default_bot'),
        intentId: target._id
      }, function (result) {
        $scope.failedIntent = result;
      }, function (err) {
        console.log(err)
      });
    };

    $scope.save = function () {

      var clearList = [];
      for(var i = 0; i < $scope.failedIntentDialog.length; i++){
        if ($scope.failedIntentDialog[i].clear){
          clearList.push($scope.failedIntentDialog[i])
        }
      }
      if(clearList.length){
        $resource('/api/intentsContent').save({content: clearList, intentId: $scope.failedIntent._id, botId: $rootScope.botId}, function () {
          $scope.failedIntentDialog[0].$update({intentId: $scope.failedIntent._id, clearList: clearList}, function (result) {
            DialogFailureMaintenanceService.query({intentId: $stateParams.intentId, botId: $cookies.get('default_bot')}, function (result2) {
              $scope.failedIntentDialog = result2;
              IntentsService.get({
                botName: $cookies.get('default_bot'),
                intentId: $scope.failedIntent._id
              }, function (data) {
                $scope.failedIntent = data;
              }, function (err) {
                console.log(err)
              });

            }, function (err2) {
              console.log(err2)
            });

          }, function (err1) {
            console.log(err1);
          })
        }, function (err) {
          console.log(err);
        })
      }
    };

    $scope.intentFailRemove = function (target) {
      target.$update({intentId: target.intent, clearList: target}, function (result) {
        DialogFailureMaintenanceService.query({intentId: $stateParams.intentId, botId: $cookies.get('default_bot')}, function (result2) {
          $scope.failedIntentDialog = result2;
        }, function (err2) {
          console.log(err2)
        });
      }, function (err) {
        console.log(err)
      })
    };

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
