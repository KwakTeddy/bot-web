'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsListController', ['$scope', '$stateParams', '$location', 'Authentication', 'AnalyticsService', 'DialogUsageService', 'DialogSuccessService', 'SessionSuccessService', 'DialogFailureService',
  function ($scope, $stateParams, $location, Authentication, AnalyticsService, DialogUsageService, DialogSuccessService, SessionSuccessService, DialogFailureService) {
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

    // Find a list of dialog success rate
    $scope.find_dialog_success = function () {
      $scope.dialogSuccess = DialogSuccessService.query({}, function() {
        console.log($scope.dialogSuccess);
      }, function(err) {
        console.log(err);
      });
    };

    // Find a list of session success rate
    $scope.find_session_success = function () {
      $scope.sessionSuccess = SessionSuccessService.query({}, function() {
        console.log($scope.sessionSuccess);
      }, function(err) {
        console.log(err);
      });
    };

    // Find a list of dialog fail
    $scope.find_dialog_failure = function () {
      $scope.dialogFailure = DialogFailureService.query({}, function() {
        console.log($scope.dialogFailure);
      }, function(err) {
        console.log(err);
      });
    };
  }
]);
