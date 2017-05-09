'use strict';

// Analytics controller
angular.module('analytics').controller('AnalyticsListController', ['$scope', '$rootScope', '$stateParams', '$location', '$window', '$http', '$cookies', 'Authentication', 'AnalyticsService',
  'DialogUsageService', 'DialogSuccessService', 'SessionSuccessService', 'DialogFailureService', 'Dialogs','DialogChildren', 'DialogFailureMaintenanceService','DTOptionsBuilder', '$compile',
  function ($scope, $rootScope, $stateParams, $location, $window, $http, $cookies, Authentication, AnalyticsService, DialogUsageService, DialogSuccessService, SessionSuccessService,
            DialogFailureService, Dialogs, DialogChildren, DialogFailureMaintenanceService, DTOptionsBuilder, $compile) {
    $scope.authentication = Authentication;
    $scope.kind = "all";
    $scope.year = new Date().getFullYear();
    $scope.ym = new Date();
    $scope.failedIntent = [];

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

    // dialog editing
    $scope.addInput = function() {
      $scope.selected.inputs.push({str:""});
    };
    $scope.addOutput= function() {
      $scope.selected.outputs.push({str:""});
    };

    var makeStr = function(obj) {
      if (Array.isArray(obj)) {
        return obj.map(function (o) { return {str: o}; });
      }
      return [{str: obj}];
    };

    var unMake = function(obj) {
      if (Array.isArray(obj)) {
        return obj.map(function (o) { return o['str']; });
      }
    };

    $scope.findOne = function (dialogId, newDialog) {
      var botId = $rootScope.botId;
      $scope.dialog = { botId: botId, dialogId: dialogId };

      var dialog = Dialogs.get({
        botId: botId,
        dialogId: dialogId
      }, function() {
        $scope.dialog.name = dialog.name;
        $scope.dialog.inputs = makeStr(dialog.inputs);
        $scope.dialog.outputs = makeStr(dialog.outputs);
        $scope.dialog.inputs.push({str:newDialog});
        $('.modal-with-form').click();
      });
    };

    $scope.findChildren = function (dialogId, newDialog) {
      var botId = $rootScope.botId;

      $scope.targetDialog = newDialog;
      $scope.targetPreDialog = dialogId;
      console.log(dialogId)

      var dialogs = DialogChildren.query({
        botId: botId,
        dialogId: dialogId
      }, function() {
        console.log(dialogs);
        if (dialogs.length){
          dialogs.forEach(function(obj, i) {
            obj.idx = i;
            obj.inputs = makeStr(obj.inputs);
            obj.outputs = makeStr(obj.outputs);
            obj.inputs.push({str:newDialog});
          });
          $scope.dialogs = dialogs;
          $scope.selected = $scope.dialogs[0];

          $('.modal-with-form').click(); 
        }else {
          alert('시작 다이얼로그 입니다')
        }
      }, function(err) {
        console.log(err);
      });
    };

    $scope.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'dialogForm');
        return false;
      }
      var dialog = $scope.selected;
      dialog.botId = $rootScope.botId;
      dialog.inputs = unMake(dialog.inputs);
      dialog.outputs = unMake(dialog.outputs);
      dialog.originalDialog = $scope.targetDialog;
      dialog.targetPreDialog = $scope.targetPreDialog;
      console.log(dialog);
      console.log($scope.selected);

      Dialogs.update(dialog, function (result) {
        console.log(result);
        $scope.find_dialog_failure();
      }, function (err) {
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
          botId: $rootScope.botId,
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
        var success = 0, fail = 0;
        list.forEach(function(obj) {
          success += obj.success_count;
          fail += obj.fail_count;
        });
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

    var vm = this;

    var abcd =
      '<form name="form" novalidate="novalidate">' +
      '<table width="100%"><tr><td>' +
      '<h2 class="panel-title">&nbsp;</h2>' +
      '<td align="right">' +
      '<select name="kind" ng-model="kind"  onchange="changeFunc(this)">' +
      '<option selected="selected" value="all">전체</option>' +
      '<option value="year">연도별</option>' +
      '<option value="month">월별</option>' +
      '</select>' +
      '<input type="number" id="year" ng-model="year" min="1999" max="2100" value="2017" style="display:none">' +
      '<input type="month" id="ym" ng-model="ym" style="display:none" value="2017-03">' +
      '<button class="btn btn-primary" ng-click="find_dialog_failure()">검색</button>' +
      '</td></tr></table>' +
      '</form>';

    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('bLengthChange', false)
      .withOption('info', false)
      .withOption('dom', 'l<"toolbar">frtip')
      .withOption('initComplete', function(settings, json) {
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
      })

    vm.dtOptions2 = DTOptionsBuilder.newOptions()
      .withOption('bLengthChange', false)
      .withOption('info', false)
      .withOption('dom', 'l<"toolbar">frtip')
      .withOption('initComplete', function(settings, json) {
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
        $("div.toolbar").html('<button class="btn btn-primary" ng-click="find_dialog_failure_maintenance()">오류 목록 검사</button>');
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
      })

    $scope.find_dialog_failure_maintenance = function () {
      $http.get('/api/intent/analyzeFailIntent/'+ $cookies.get('default_bot')).then(function (data) {
        console.log('분석 완료');
      }, function (err) {
        console.log(err)
      })
    }

    $scope.initDialogFailure = function() {
      DialogFailureMaintenanceService.query({botId: $cookies.get('default_bot')}, function (result) {
        $scope.failedIntent = result;
      }, function (err) {
        console.log(err);
      })
    }
  }
]);
