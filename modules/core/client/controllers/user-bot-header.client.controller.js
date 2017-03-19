'use strict';

angular.module('core').controller('UserBotHeaderController', ['$scope', '$state', 'Authentication', '$location', '$rootScope',
  function ($scope, $state, Authentication, $location, $rootScope) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.currentUrl = $location.absUrl();


  }
]);
