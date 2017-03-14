'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsListController', ['$scope', '$stateParams', '$location', 'Authentication', 'AnalyticsService', 'DialogUsageService', 'DialogSuccessService', 'SessionSuccessService', 'DialogFailureService',
  function ($scope, $stateParams, $location, Authentication, AnalyticsService, DialogUsageService, DialogSuccessService, SessionSuccessService, DialogFailureService) {
    $scope.authentication = Authentication;
    $scope.kind = "all";
    $scope.year = new Date().getFullYear();
    $scope.ym = new Date();

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
          console.log(dialogSuccess);
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

    $scope.edit = function(preDialogId) {
      window.alert(preDialogId);
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
          console.log(dialogFailure);
          $scope.dialogFailure = dialogFailure;
        }, function(err) {
          console.log(err);
        });
    };

    $scope.dashboard = function() {
      $scope.find_dialog();
      var userCounts = AnalyticsService.query(
        {
          kind: "all",
          arg: "empty"
        }, function() {
          console.log(userCounts);

          var val = [];
          for (var i=0; i < userCounts.length && i < 10; ++i) {
            val.unshift([userCounts[i]._id.month + "/" + userCounts[i]._id.date, userCounts[i].count]);
          }
          var flotUserData = [{
            data: val,
            color: "#0088cc"
          }];
          drawFlot(flotUserData);

        }, function(err) {
          console.log(err);
        });

      var dialogSuccess = DialogSuccessService.query(
        {
          kind: 'all',
          arg: 'empty'
        }, function() {
          console.log(dialogSuccess);

          var val = [];
          for (var i=0; i < dialogSuccess.length && i < 10; ++i) {
            val.unshift(
              {
                y: dialogSuccess[i]._id.month + "/" + dialogSuccess[i]._id.date,
                a: dialogSuccess[i].success_count,
                b: dialogSuccess[i].fail_count
              });
          }
          console.log(val);
          drawBar(val);
        }, function(err) {
          console.log(err);
        });

      var calcRate = function(list)
      {
        var success = 0;
        var fail = 0;
        for (var i=0; i < list.length ; ++i) {
          success += list[i].success_count;
          fail += list[i].fail_count;
        }
        return (success-fail) / success * 100.0;
      };

      var dialogSuccessYear = DialogSuccessService.query(
        {
          kind: 'year',
          arg: $scope.year
        }, function() {
          console.log(dialogSuccessYear);
          drawLiquid("#meterYear", calcRate(dialogSuccessYear), '#0088cc');
        }, function(err) {
          console.log(err);
        });

      var dialogSuccessMonth = DialogSuccessService.query(
        {
          kind: 'month',
          arg: $scope.ym
        }, function() {
          console.log(dialogSuccessMonth);
          drawLiquid("#meterMonth", calcRate(dialogSuccessMonth), '#2baab1');
        }, function(err) {
          console.log(err);
        });

    };

    var drawFlot= function(flotUserData) {
      (function ($) {
        'use strict';
        var flotUser = $.plot('#flotUser', flotUserData, {
          series: {
            lines: {
              show: true,
              lineWidth: 2
            },
            points: {
              show: true
            },
            shadowSize: 0
          },
          grid: {
            hoverable: true,
            clickable: true,
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            labelMargin: 15,
            backgroundColor: 'transparent'
          },
          yaxis: {
            min: 0,
            color: 'rgba(0,0,0,0.1)'
          },
          xaxis: {
            mode: 'categories',
            color: 'rgba(0,0,0,0)'
          },
          legend: {
            show: false
          },
          tooltip: true,
          tooltipOpts: {
            content: '%x: %y',
            shifts: {
              x: -30,
              y: 25
            },
            defaultTheme: false
          }
        });
      }).apply(this, [jQuery]);
    };
    var drawLiquid = function(name, value, color)
    {
      $(name)[0].value = parseInt(value ,10);
      (function($) {
        'use strict';

        $(name).liquidMeter({
          shape: 'circle',
          color: color,
          background: '#F9F9F9',
          fontSize: '24px',
          fontWeight: '600',
          stroke: '#F2F2F2',
          textColor: '#333',
          liquidOpacity: 0.9,
          liquidPalette: ['#333'],
          speed: 3000,
          animate: !$.browser.mobile
        });

      }).apply(this, [jQuery]);
    };

    var drawBar = function(barData) {
      (function ($) {
        'use strict';

        Morris.Bar({
          resize: true,
          element: 'morrisStacked',
          data: barData,
          xkey: 'y',
          ykeys: ['a', 'b'],
          labels: ['성공', '실패'],
          barColors: ['#0088cc', '#2baab1'],
          fillOpacity: 0.7,
          smooth: false,
          stacked: true,
          hideHover: true
        });

      }).apply(this, [jQuery]);
    };

  }
]);
