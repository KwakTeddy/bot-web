'use strict';

// Analytics controller
angular.module('analytics').controller('ManageBatchController', ['$scope', '$rootScope', '$stateParams', '$resource', '$window', 'Authentication',
  function ($scope, $rootScope, $stateParams, $resource, $window, Authentication) {
    var vm = this;
    $scope.authentication = Authentication;

    vm.resetDB = function() {
      $resource('/api/resetDB').delete();
    };

    vm.batchCorrection = function() {
      $resource('/api/batchCorrection').get();
    };
  }
]);
