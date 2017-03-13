'use strict';

function callback(json)
{
  console.log(json);
};

// Analytics controller
angular.module('analytics').controller('AnalyticsListController', ['$scope', '$stateParams', '$location', 'DTColumnDefBuilder','Authentication', 'AnalyticsService', 'DialogUsageService', 'DialogSuccessService', 'SessionSuccessService', 'DialogFailureService',
  function ($scope, $stateParams, $location, DTColumnDefBuilder, Authentication, AnalyticsService, DialogUsageService, DialogSuccessService, SessionSuccessService, DialogFailureService) {
    $scope.authentication = Authentication;
    $scope.kind = "all";
    $scope.year = new Date().getFullYear();
    $scope.ym = new Date();

    $scope.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(1).notSortable(),
      DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];

    // Find a list of UserCount
    $scope.find = function () {
      var arg = 'empty';
      if ($scope.kind == 'year')
        arg = $scope.year;
      else if ($scope.kind == 'month')
        arg = $scope.ym;
      var userCounts = AnalyticsService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
          console.log(userCounts);
          $scope.userCounts = userCounts;
        }, function(err) {
          console.log(err);
        });
    };

    // Find a list of dialog usage
    $scope.find_dialog = function () {
      var arg = 'empty';
      if ($scope.kind == 'year')
        arg = $scope.year;
      else if ($scope.kind == 'month')
        arg = $scope.ym;
      var dialogUsages = DialogUsageService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
          $scope.dialogUsages = dialogUsages;
        }, function(err) {
          console.log(err);
        });
    };

    // Find a list of dialog success rate
    $scope.find_dialog_success = function () {
      var arg = 'empty';
      if ($scope.kind == 'year')
        arg = $scope.year;
      else if ($scope.kind == 'month')
        arg = $scope.ym;
      var dialogSuccess = DialogSuccessService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
          $scope.dialogSuccess = dialogSuccess;
        }, function(err) {
          console.log(err);
        });
    };

    // Find a list of session success rate
    $scope.find_session_success = function () {
      var arg = 'empty';
      if ($scope.kind == 'year')
        arg = $scope.year;
      else if ($scope.kind == 'month')
        arg = $scope.ym;
      var sessionSuccess = SessionSuccessService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
          $scope.sessionSuccess = sessionSuccess;
        }, function(err) {
          console.log(err);
        });
    };

    // Find a list of dialog fail
    $scope.find_dialog_failure = function () {
      var arg = 'empty';
      if ($scope.kind == 'year')
        arg = $scope.year;
      else if ($scope.kind == 'month')
        arg = $scope.ym;
      var dialogFailure = DialogFailureService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
          $scope.dialogFailure = dialogFailure;
        }, function(err) {
          console.log(err);
        });
    };
  }
]);
