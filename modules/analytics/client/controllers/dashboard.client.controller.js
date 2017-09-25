'use strict';

// Dashboard controller
angular.module('analytics').controller('DashboardController', ['$scope', 'Authentication', 'AnalyticsService', '$cookies', 'DialogUsageService', 'DialogSuccessService', '$http', '$timeout',
  function ($scope, Authentication, AnalyticsService, $cookies, DialogUsageService, DialogSuccessService, $http, $timeout) {

    $scope.date = {
      start: "",
      end: ""
    };
    $scope.userType = "total";
    $scope.channel = "total";

    $scope.authentication = Authentication;
    $scope.totalDialogUsage = 0;
    $scope.facebookUserCount = 0;
    $scope.kakaoUserCount = 0;
    $scope.navertalkUserCount = 0;
    $scope.totalUserCount = 0;
    $scope.isFailDialogCount = 0;
    $scope.isSuccessDialogCount = 0;

    var color = {
      background:{
        kakao: 'rgba(251, 230, 0, 0.70)',
        facebook: 'rgba(59, 89, 152, 0.70)',
        navertalk: 'rgba(0, 199, 60, 0.70)',
        success: "rgba(66, 133, 244, 0.70)",
        fail: "rgba(221, 81, 68, 0.70)"
      },
      border:{
        kakao: '#ede500',
        facebook: '#29487d',
        navertalk: '#00af35',
        success: "rgb(51, 126, 248)",
        fail: "rgb(147, 75, 61)"
      }
    };
    //누적 총 대화량
    var userDialogCumulativeCount = function () {
      $http.get("/api/userDialogCumulativeCount/" + $cookies.get('default_bot')).then(function (doc) {
        $scope.userDialogCumulativeCount = doc.data
      }, function (err) {
        console.log(err);
      });
    };
    //이용자 통계
    var userCount = function (date, userType, channel, update) {
      $http.post("/api/userCount/" + $cookies.get('default_bot'), {date: date, userType: userType, channel: channel}).then(function (doc) {
        doc.data.forEach(function (data) {
          $scope.facebookUserCount += data.facebook;
          $scope.kakaoUserCount += data.kakao ;
          $scope.navertalkUserCount += data.navertalk;
          $scope.totalUserCount += data.total;
        });
        //Chart.js 그래프 그리는 스크립트
        var context = document.getElementById("botUserByChannel").getContext('2d');
        var data = {
          labels: ["KakaoTalk", "Facebook", "NaverTalkTalk"],
          datasets: [{
            data: [],
            backgroundColor: [
              color.background.kakao,
              color.background.facebook,
              color.background.navertalk
            ],
            borderColor: [
              color.border.kakao,
              color.border.facebook,
              color.border.navertalk
            ],
            borderWidth: 1
          }]
        };
        var options = {
        };
        data.datasets[0].data.push($scope.kakaoUserCount);
        data.datasets[0].data.push($scope.facebookUserCount);
        data.datasets[0].data.push($scope.navertalkUserCount);
        var myChart = new Chart(context, {
          type: 'doughnut',
          data: data,
          options: options
        });
      }, function (err) {
        console.log(err);
      });
    };
    //일별 사용량
    var dailyDialogUsage = function (date, userType, channel, update) {
      $http.post("/api/daily-dialog-usage", {botId: $cookies.get('default_bot'), date: date, userType: userType, channel: channel}).then(function (doc) {
        //Chart.js 그래프 그리는 스크립트
        var context = document.getElementById("dailyDialogUsage").getContext('2d');
        var pieContext = document.getElementById("dialogSuccessRate").getContext('2d');
        var data = {
          labels: [],
          datasets: [
            {
              label: "카카오톡",
              backgroundColor: color.border.kakao,
              borderColor: color.background.kakao,
              data: [],
              lineTension: 0,
              fill:false
            },
            {
              label: "페이스북",
              backgroundColor: color.border.facebook,
              borderColor: color.background.facebook,
              data: [],
              lineTension: 0,
              fill:false
            },
            {
              label: "네이버톡톡",
              backgroundColor: color.border.navertalk,
              borderColor: color.background.navertalk,
              data: [],
              lineTension: 0,
              fill:false
            },
            {
              label: "합계",
              backgroundColor: "#444444",
              borderColor: "#444444",
              data: [],
              lineTension: 0,
              fill:false
            }

          ]
        };

        var pieData = {
          labels: ["성공", "실패"],
          datasets: [{
            data: [],
            backgroundColor: [
              "#3367d6",
              "#ca0a13"
            ],
            borderColor: [
              "rgb(51, 126, 248)",
              "rgb(147, 75, 61)"
            ],
            borderWidth: 1
          }]
        };

        var array = [];
        var startYear =  $scope.date.start.getFullYear();
        var startMonth = $scope.date.start.getMonth() + 1;
        var startDay =   $scope.date.start.getDate();
        var endYear =  $scope.date.end.getFullYear();
        var endMonth = $scope.date.end.getMonth() + 1;
        var endDay =   $scope.date.end.getDate();
        var year;
        var month;
        var day = startDay;
        //데이터에 없는 날짜도 표시될 수 있게 날짜 array를 만듦
        for(var i = startDay;((day != endDay) || (month != endMonth) ||  (year != endYear)) && i<100; i++){
          var date = new Date(startYear, startMonth - 1, i);
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          array.push(year + '/'+ month + '/' + day)
        }
        data.labels = array;
        //날짜별로 그래프에 데이터 넣어주기
        array.forEach(function (date, index) {
          var Year =  parseInt(date.split('/')[0]);
          var Month = parseInt(date.split('/')[1]);
          var Day =   parseInt(date.split('/')[2]);
          var exist = false;
          for (var i = 0; i < doc.data.length; i++) {
            if((doc.data[i]._id.year == Year) && (doc.data[i]._id.month == Month) && (doc.data[i]._id.day == Day)){
              exist = true;
              data.datasets[0].data.push(doc.data[i].kakao);
              data.datasets[1].data.push(doc.data[i].facebook);
              data.datasets[2].data.push(doc.data[i].navertalk);
              data.datasets[3].data.push(doc.data[i].total);
              $scope.totalDialogUsage = $scope.totalDialogUsage + doc.data[i].total;

              $scope.isFailDialogCount = $scope.isFailDialogCount + doc.data[i].fail;
              $scope.isSuccessDialogCount = $scope.isSuccessDialogCount + doc.data[i].total - doc.data[i].fail;

              break;
            }
          }
          if(!exist){
            data.datasets[0].data.push(0);
            data.datasets[1].data.push(0);
            data.datasets[2].data.push(0);
            data.datasets[3].data.push(0);
          }
        });
        pieData.datasets[0].data.push($scope.isSuccessDialogCount);
        pieData.datasets[0].data.push($scope.isFailDialogCount);

        var myChart = new Chart(context, {
          type: 'line',
          data: data,
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero:true
                }
              }]
            }
          },
          plugins: [
            {
              afterInit: function() {
                //로딩 화면
                document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
                document.getElementsByName('dataLoading')[1].style.setProperty("display", "none", "important");
                document.getElementsByName('dataLoading')[2].style.setProperty("display", "none", "important");
                document.getElementsByName('dataLoading')[3].style.setProperty("display", "none", "important");
              }
            }
          ]
        });
        var pieChart = new Chart(pieContext, {
          type: 'pie',
          data: pieData,
          options: {
          }
        });

      }, function (err) {
        console.log(err);
      });
    };
    //시나리오 사용량
    var senarioUsage = function (date, userType, channel, update) {
      $http.post('/api/senarioUsage/' + $cookies.get("default_bot"), {limit : 10, date: date, userType: userType, channel: channel}).then(function (doc) {
        $scope.senarioUsageList = doc.data.senarioUsage;
      }, function (err) {
        console.log(err);
        console.log(err);
      });
    };
    //실패 대화
    var failDailogs = function (date, userType, channel, update) {
      $http.post('/api/failDailogs/' + $cookies.get("default_bot"), {date: date, channel: channel, limit: 10}).then(function (doc) {
        $scope.failDialogList = doc.data;
      }, function (err) {
        console.log(err);
      });
    };
    //사용자 입력
    var userInputCount = function (date, userType, channel, update) {
      $http.post('/api/user-input-statistics/' + $cookies.get("default_bot"), {date: date, channel: channel, limit: 10}).then(function (doc) {
        $scope.userInputUsageList = doc.data;
      }, function (err) {
        console.log(err);
      });
    };
    //시간 데이터를 String으로 바꿔주는 함수
    var formatDate = function (start, end) {
      var date = {start: "", end: ""};
      date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
      date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();
      return date;
    };
    //컨트롤러 시작할 때 불리는 함수
    $scope.init = function () {
      userDialogCumulativeCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
      userCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
      failDailogs(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
      senarioUsage(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
      userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
      dailyDialogUsage(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
    };
    //그래프 업데이트하는 함수
    $scope.update = function () {
      //로딩 화면
      document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
      document.getElementsByName('dataLoading')[1].style.setProperty("display", "block", "important");
      document.getElementsByName('dataLoading')[2].style.setProperty("display", "block", "important");
      document.getElementsByName('dataLoading')[3].style.setProperty("display", "block", "important");
      userDialogCumulativeCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
      userCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
      failDailogs(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
      senarioUsage(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
      userInputCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
      dailyDialogUsage(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
    };
    //DatePicker 모듈 스크립트
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

  }
]);
