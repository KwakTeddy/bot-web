"user strict"
//신한카드 전용 faq 사용자입력
angular.module("analytics").controller("UserInputStatisticsFaqController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.userType = "total";
  $scope.channel = "total";
  $scope.pagingEnd = false;
  $scope.paging = {
    page: 0,
    perNum: 50
  };
  $scope.dataLoadingEnd = true;

  var dataBackup;

  var formatDate = function (start, end) {
    var date = {start: "", end: ""};
    date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
    date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();
    return date;
  };

  $scope.init = function () {
    // userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
    $scope.paging.page = 0;
    userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
  };

  var userInputCount = function (date, userType, channel, update, paging) {
    $http.post('/api/user-input-statistics-faq/' + $cookies.get("default_bot"), {date: date, channel: channel, paging: paging}).then(function (doc) {
      if($scope.paging.page == 0){
        dataBackup = angular.copy(doc.data);
        $scope.userInputUsageList = doc.data;
      }else {
        dataBackup = dataBackup.concat(angular.copy(doc.data));
        $scope.userInputUsageList = $scope.userInputUsageList.concat(doc.data);
      }
      if(doc.data.length < $scope.paging.perNum) $scope.pagingEnd = true;
      document.getElementById('loading-screen').style.setProperty("display", "none", "important");
      document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
      $scope.paging.page++;
      $scope.dataLoadingEnd = true;
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
      sheetName: "사용자 입력 통계",
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
      var fileName = $cookies.get("default_bot") + '_' + "사용자 입력 통계" + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';
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
  //무한 스크롤시 불리는 함수
  $scope.nextPage = function () {
    if($scope.dataLoadingEnd){
      $scope.dataLoadingEnd = false;
      userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true, $scope.paging);
    }
  }
}]);