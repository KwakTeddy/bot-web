'use strict';

// Learnings controller
angular.module('learnings').controller('LearningsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Learnings',
  function ($scope, $stateParams, $location, Authentication, Learnings) {
    $scope.authentication = Authentication;

    // Create new Learning
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'learningForm');

        return false;
      }

      // Create new Learning object
      var learning = new Learnings({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      learning.$save(function (response) {
        $location.path('learnings/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Learning
    $scope.remove = function (learning) {
      if (learning) {
        learning.$remove();

        for (var i in $scope.learnings) {
          if ($scope.learnings[i] === learning) {
            $scope.learnings.splice(i, 1);
          }
        }
      } else {
        $scope.learning.$remove(function () {
          $location.path('learnings');
        });
      }
    };

    // Update existing Learning
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'learningForm');

        return false;
      }

      var learning = $scope.learning;

      learning.$update(function () {
        $location.path('learnings/' + learning._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Learnings
    $scope.find = function () {
      $scope.learnings = Learnings.query();
    };

    // Find existing Learning
    $scope.findOne = function () {
      $scope.learning = Learnings.get({
        learningId: $stateParams.learningId
      });
    };
  }
]);
