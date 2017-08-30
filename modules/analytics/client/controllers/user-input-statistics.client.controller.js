"user strict"

angular.module("analytics").controller("UserInputStatisticsController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
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

  $scope.init = function () {
    userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
    userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
  };

  var userInputCount = function (date, userType, channel, update) {
    $http.post('/api/user-input-statistics/' + $cookies.get("default_bot"), {date: date, channel: channel, limit: 100}).then(function (doc) {
      dataBackup = angular.copy(doc.data);
      $scope.userInputUsageList = doc.data;
      document.getElementById('loading-screen').style.setProperty("display", "none", "important");
      document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
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

  $scope.exelDownload = function () {
    var dataBackup1 = angular.copy(dataBackup);

    dataBackup1.forEach(function (doc) {
      Object.keys(doc._id).forEach(function (key) {
        doc[key] = doc._id[key]
      });
      delete doc._id;
    });
    var exelDataTemplate = {
      filename: "사용자 입력 통계",
      sheetName: "사용자 입력 통계",
      columnOrder: ["dialog", "count"],
      orderedData: dataBackup1
    };
    $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate}).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };
}]);