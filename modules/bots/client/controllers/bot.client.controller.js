'use strict';

// Bots controller
angular.module('bots').controller('BotController', ['$scope', '$state', '$stateParams', 'botResolve', 'BotsService',
  function ($scope, $state, $stateParams, bot, BotsService) {
    var vm = this;
    vm.bot = bot;

    // Create new Bot
    vm.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      vm.bot.$save(function (response) {
        $state.go('bots.list');
        // $location.path('bots/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Bot
    vm.remove = function () {
      if (vm.bot && vm.bot._id) {
        vm.bot.$remove(function () {
          $state.go('bots.list');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Update existing Bot
    vm.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      if(vm.bot && vm.bot._id) {
        vm.bot.$update(function () {
          $state.go('bots.list');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // // Find a list of Bots
    // $scope.find = function () {
    //   vm.bots = BotsService.query();
    // };
    //
    // // Find existing Bot
    // $scope.findOne = function () {
    //   vm.bot = BotsService.get({
    //     botId: $stateParams.botId
    //   });
    // };
  }
]);
