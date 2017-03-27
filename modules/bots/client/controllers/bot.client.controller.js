'use strict';

// Bots controller
angular.module('bots').controller('BotController', ['$scope', '$state', '$stateParams', 'botResolve', 'TemplatesService',
  function ($scope, $state, $stateParams, bot, TemplatesService) {
    var vm = this;
    vm.bot = bot;

    vm.templates = TemplatesService.query({});

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

    vm.selectTemplate = function(template) {
      vm.selectedTemplate = template;
      vm.bot.template = template;
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
