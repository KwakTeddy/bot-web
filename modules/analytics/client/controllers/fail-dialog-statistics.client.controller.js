"user strict"

angular.module("analytics").controller("FailDialogStatisticsController", ["$scope","$http", "$cookies", "$timeout", "DialogChildren", "$uibModal", "Dialogs",
  function ($scope, $http, $cookies, $timeout, DialogChildren, $uibModal, Dialogs) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.userType = "total";
  $scope.channel = "total";
  var dataBackup;

  var formatDate = function (start, end) {
    var date = {start: "", end: ""};
    date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
    date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();
    return date;
  };
  //실패 대화 학습시 인풋 추가
  $scope.addInput = function() {
    $scope.selected.inputs.push({str:""});
  };
  //실패 대화 학습시 아웃풋 추가
  $scope.addOutput= function() {
    $scope.selected.outputs.push({str:{text: "", kind: "Text"}});
    console.log($scope.selected.outputs);
  };
  //추가할 다이얼로그 선택 함수
  $scope.selectDialog = function (target) {
    $scope.selected = target
  };
  //실패 대화 삭제 함수
  $scope.dialogFailureClear = function (target, index) {
    if(confirm("정말 삭제하시겠습니까?")){
      $scope.failDialogList.splice(index, 1);
      $http.put('/api/user-dialogs/failedDialog', target).then(function (result) {
      }, function (err) {
        console.log(err)
      })
    }
  };
  //실패 대화 학습 함수
  $scope.updateDialog = function (isValid, target) {
    $scope.modalInstance.dismiss();
    console.log($scope.modalIndex);
    $scope.failDialogList.splice($scope.modalIndex, 1);
    $scope.error = null;
    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'dialogForm');
      return false;
    }
    var unMake = function(obj) {
      if (Array.isArray(obj)) {
        return obj.map(function (o) { return o['str']; });
      }
    };
    var dialog = $scope.selected;
    dialog.botId = $cookies.get("default_bot");
    dialog.inputs = unMake(dialog.inputs);
    dialog.outputs = unMake(dialog.outputs);
    dialog.originalDialog = $scope.targetDialog;
    dialog.targetPreDialog = $scope.targetPreDialog;
    console.log(dialog);
    console.log($scope.selected);

    Dialogs.update(dialog, function (result) {
    }, function (err) {
      console.log(err);
    });


  };
  //실패 대화 수정창 데이터 불러오는 함수
  $scope.findChildren = function (dialogId, newDialog, index) {
    var botId = $cookies.get("default_bot");
    $scope.modalIndex = index;
    $scope.targetDialog = newDialog;
    $scope.targetPreDialog = dialogId;
    console.log(dialogId)

    var makeStr = function(obj) {
      if (Array.isArray(obj)) {
        return obj.map(function (o) { return {str: o}; });
      }
      return [{str: obj}];
    };

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

        console.log($scope.dialogs);
        console.log($scope.selected);

        $scope.modalInstance = $uibModal.open({
          templateUrl: 'modules/analytics/client/views/modal-fail-dialog.html',
          scope: $scope
        });
        $scope.modalInstance.result.then(function (response) {
          console.log(response);
        });
        $scope.modalDismiss = function () {
          $scope.modalInstance.dismiss();
        }
      }else {
        alert('시작 다이얼로그 입니다')
      }
    }, function(err) {
      console.log(err);
    });
  };

  $scope.init = function () {
    failDialogCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
    failDialogCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
  };
  //실패대화 데이터 불러오는 함수
  var failDialogCount = function (date, userType, channel, update) {
    $http.post('/api/fail-dialog-statistics/' + $cookies.get("default_bot"), {date: date, channel: channel, limit: 100}).then(function (doc) {
      dataBackup = angular.copy(doc.data);
      $scope.failDialogList = doc.data;
      document.getElementById('loading-screen').style.setProperty("display", "none", "important");
      document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
    }, function (err) {
      console.log(err);
    });
  };

  $scope.exelDownload = function () {
    var dataBackup1 = angular.copy(dataBackup);

    dataBackup1.forEach(function (doc) {
      Object.keys(doc._id).forEach(function (key) {
        doc[key] = doc._id[key]
      });
      delete doc._id;
    });
    var exelDataTemplate = {
      sheetName: "실패 대화 통계",
      columnOrder: ["dialog", "count"],
      orderedData: dataBackup1
    };
    var startYear =  $scope.date.start.getFullYear();
    var startMonth = $scope.date.start.getMonth() + 1;
    var startDay =   $scope.date.start.getDate();
    var endYear =  $scope.date.end.getFullYear();
    var endMonth = $scope.date.end.getMonth() + 1;
    var endDay =   $scope.date.end.getDate();
    var date = {
      start: startYear + "/" + startMonth + "/" + startDay,
      end: endYear + "/" + endMonth + "/" + endDay
    };
    $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate, date: date, transpose: true}).then(function (doc) {
      var fileName = $cookies.get("default_bot") + '_' + "실패 대화 통계" + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      saveAs(new Blob([s2ab(doc.data)],{type:"application/octet-stream"}), fileName);
    }, function (err) {
      console.log(err);
    });
  };

  $(function() {
      var start = moment().subtract(29, 'days');
      var end = moment();

      function cb(start, end) {
        $scope.date.start = start._d;
        $scope.date.end = end._d;
        $('#reportrange span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
        if($scope.first) $scope.update();
        $scope.first = true;
      }

      $('#reportrange').daterangepicker({
        parentEl: "#date-container",
        startDate: start,
        endDate: end,
        opens: "left",
        minDate : moment().subtract(62, 'days'),
        maxDate : moment().endOf('month'),
        ranges: {
          '오늘': [moment(), moment()],
          '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          '지난 7 일': [moment().subtract(6, 'days'), moment()],
          '지난 30 일': [moment().subtract(29, 'days'), moment()],
          '이번 달': [moment().startOf('month'), moment().endOf('month')],
          '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        locale: {
          "format": "YYYY/MM/DD",
          "separator": " - ",
          "applyLabel": "적용",
          "cancelLabel": "취소",
          "fromLabel": "부터",
          "toLabel": "까지",
          "customRangeLabel": "날짜 직접 선택",
          "weekLabel": "주",
          "daysOfWeek": [
            "일",
            "월",
            "화",
            "수",
            "목",
            "금",
            "토"
          ],
          monthNames: [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월"
          ],
          "firstDay": 1
        }
      }, cb);
      cb(start, end);
    });

}]);