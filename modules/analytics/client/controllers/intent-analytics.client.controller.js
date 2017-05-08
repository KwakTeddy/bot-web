'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsIntentController', ['$scope', '$rootScope', '$stateParams', '$location', '$window', 'Authentication', '$resource',
  function ($scope, $rootScope, $stateParams, $location, $window, Authentication, $resource) {
    var vm = this;
    $scope.authentication = Authentication;
    $scope.entities = '';
    $scope.intent = '';
    $scope.test = '';

    $scope.tester = function (arg) {
      $resource('/api/user-bots-analytics/intent', {}).get({input: $scope.test, botId: $rootScope.botId}, function (res) {
        console.log(res);
        $scope.intent = res.intent;
        $scope.entities = JSON.stringify(res.entities);
      })
    }
  }
]);
