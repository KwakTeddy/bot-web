'use strict';

// Messengers controller
angular.module('messengers').controller('MessengersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messengers',
  function ($scope, $stateParams, $location, Authentication, Messengers) {
    $scope.authentication = Authentication;

    // Create new Messenger
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messengerForm');

        return false;
      }

      // Create new Messenger object
      var messenger = new Messengers({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      messenger.$save(function (response) {
        $location.path('messengers/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Messenger
    $scope.remove = function (messenger) {
      if (messenger) {
        messenger.$remove();

        for (var i in $scope.messengers) {
          if ($scope.messengers[i] === messenger) {
            $scope.messengers.splice(i, 1);
          }
        }
      } else {
        $scope.messenger.$remove(function () {
          $location.path('messengers');
        });
      }
    };

    // Update existing Messenger
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messengerForm');

        return false;
      }

      var messenger = $scope.messenger;

      messenger.$update(function () {
        $location.path('messengers/' + messenger._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Messengers
    $scope.find = function () {
      $scope.messengers = Messengers.query();
    };

    // Find existing Messenger
    $scope.findOne = function () {
      $scope.messenger = Messengers.get({
        messengerId: $stateParams.messengerId
      });
    };
  }
]);
