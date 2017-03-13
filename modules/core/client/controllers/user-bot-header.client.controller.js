'use strict';

angular.module('core').controller('UserBotHeaderController', ['$scope', '$state', 'Authentication', '$location',
  function ($scope, $state, Authentication, $location) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.currentUrl = $location.absUrl();

  }
]);
