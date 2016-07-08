'use strict';

// Bots controller
angular.module('bots').controller('BotsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bots',
  function ($scope, $stateParams, $location, Authentication, Bots) {
    $scope.authentication = Authentication;

    // Create new Bot
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');

        return false;
      }

      // Create new Bot object
      var bot = new Bots({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      bot.$save(function (response) {
        $location.path('bots/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Bot
    $scope.remove = function (bot) {
      if (bot) {
        bot.$remove();

        for (var i in $scope.bots) {
          if ($scope.bots[i] === bot) {
            $scope.bots.splice(i, 1);
          }
        }
      } else {
        $scope.bot.$remove(function () {
          $location.path('bots');
        });
      }
    };

    // Update existing Bot
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');

        return false;
      }

      var bot = $scope.bot;

      bot.$update(function () {
        $location.path('bots/' + bot._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Bots
    $scope.find = function () {
      $scope.bots = Bots.query();
    };

    // Find existing Bot
    $scope.findOne = function () {
      $scope.bot = Bots.get({
        botId: $stateParams.botId
      });
    };
  }
]);
