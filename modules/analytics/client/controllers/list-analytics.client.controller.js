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
      $scope.userCounts = AnalyticsService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
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
      $scope.dialogUsages = DialogUsageService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
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
      $scope.dialogSuccess= DialogSuccessService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
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
      $scope.sessionSuccess = SessionSuccessService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
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
      $scope.dialogFailure = DialogFailureService.query(
        {
          kind: $scope.kind,
          arg: arg
        }, function() {
        }, function(err) {
          console.log(err);
        });
    };
  }
]);
