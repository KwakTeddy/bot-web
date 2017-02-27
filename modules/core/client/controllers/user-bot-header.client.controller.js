'use strict';

angular.module('core').controller('UserBotHeaderController', ['$scope', '$state', 'Authentication',
  function ($scope, $state, Authentication) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
  }
]);
