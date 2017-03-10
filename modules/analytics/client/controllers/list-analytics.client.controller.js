'use strict';

// Articles controller
angular.module('analytics').controller('AnalyticsListController', ['$scope', '$stateParams', '$location', 'Authentication', 'AnalyticsService', 'DialogUsageService',
  function ($scope, $stateParams, $location, Authentication, AnalyticsService, DialogUsageService) {
    $scope.authentication = Authentication;

    // Find a list of UserCount with filter
    $scope.search = function() {
      $scope.userCounts = AnalyticsService.get({
        kind: this.kind,
        ym: this.ym
      })
    };

    // Find a list of UserCount
    $scope.find = function () {
      $scope.userCounts = AnalyticsService.query({}, function() {
        console.log($scope.userCounts);
      }, function(err) {
        console.log(err);
      });
    };

    // Find a list of dialog usage
    $scope.find_dialog = function () {
      $scope.dialogUsages = DialogUsageService.query({}, function() {
        console.log($scope.dialogUsages);
      }, function(err) {
        console.log(err);
      });
    };
  }
]);
