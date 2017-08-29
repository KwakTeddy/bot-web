'use strict';

// Dashboard controller
angular.module('analytics').controller('DashboardController', ['$scope', 'Authentication', 'AnalyticsService', '$cookies', 'DialogUsageService', 'DialogSuccessService', '$http', '$timeout',
  function ($scope, Authentication, AnalyticsService, $cookies, DialogUsageService, DialogSuccessService, $http, $timeout) {

    $scope.date = {
      start: "",
      end: ""
    };
    $scope.quickDate = "month";
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

    var userDialogCumulativeCount = function () {
      $http.get("/api/userDialogCumulativeCount/" + $cookies.get('default_bot')).then(function (doc) {
        $scope.userDialogCumulativeCount = doc.data
      }, function (err) {
        console.log(err);
      });
    };

    var userCount = function (date, userType, channel, update) {
      $http.post("/api/userCount/" + $cookies.get('default_bot'), {date: date, userType: userType, channel: channel}).then(function (doc) {
        console.log(doc);
        doc.data.forEach(function (data) {
          $scope.facebookUserCount += data.facebook;
          $scope.kakaoUserCount += data.kakao ;
          $scope.navertalkUserCount += data.navertalk;
          $scope.totalUserCount += data.total;
        });

        var context = document.getElementById("botUserByChannel").getContext('2d');
        var data = {
          labels: ["KakaoTalk", "Facebook", "NaverTalkTalk"],
          datasets: [{
            data: [],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)'
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

    var dailyDialogUsage = function (date, userType, channel, update) {
      $http.post("/api/daily-dialog-usage", {botId: $cookies.get('default_bot'), date: date, userType: userType, channel: channel}).then(function (doc) {
        console.log(doc);
        var context = document.getElementById("dailyDialogUsage").getContext('2d');
        var pieContext = document.getElementById("dialogSuccessRate").getContext('2d');
        var data = {
          labels: [],
          datasets: [
            {
              label: "카카오톡",
              borderColor: "rgb(55, 199, 132)",
              data: [],
              lineTension: 0,
              fill:false
            },
            {
              label: "페이스북",
              borderColor: "rgb(255, 99, 132)",
              data: [],
              lineTension: 0,
              fill:false
            },
            {
              label: "네이버톡톡",
              borderColor: "rgb(55, 99, 232)",
              data: [],
              lineTension: 0,
              fill:false
            },
            {
              label: "합계",
              borderColor: "rgb(55, 99, 32)",
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
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(255,99,132,1)'
            ],
            borderWidth: 1
          }]
        };

        var array = [];
        var startYear =  parseInt($scope.date.start.split('/')[0]);
        var startMonth = parseInt($scope.date.start.split('/')[1]);
        var startDay =   parseInt($scope.date.start.split('/')[2]);
        var endYear =  parseInt($scope.date.end.split('/')[0]);
        var endMonth = parseInt($scope.date.end.split('/')[1]);
        var endDay =   parseInt($scope.date.end.split('/')[2]);
        var year;
        var month;
        var day = startDay;

        for(var i = startDay;((day != endDay) || (month != endMonth) ||  (year != endYear)) && i<100; i++){
          var date = new Date(startYear, startMonth - 1, i);
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          array.push(year + '/'+ month + '/' + day)
        }
        data.labels = array;

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
        pieData.datasets[0].data.push($scope.isFailDialogCount);
        pieData.datasets[0].data.push($scope.isSuccessDialogCount);

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
          }
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

    var senarioUsage = function (date, userType, channel, update) {
      $http.post('/api/senarioUsage/' + $cookies.get("default_bot"), {limit : 5, date: date, userType: userType, channel: channel}).then(function (doc) {
        $scope.senarioUsageList = doc.data.senarioUsage;
        var context = document.getElementById("senarioUsage").getContext('2d');
        var data = {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(25, 99, 132, 22)',
              'rgba(25, 99, 12, 222)',
              'rgba(25, 9, 132, 222)'
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(255,99,132,1)',
              'rgba(25,99,132,11)',
              'rgba(25,99,12,111)',
              'rgba(25,9,132,111)'
            ]
          }]
        };
        var options = {
        };
        doc.data.senarioUsage.forEach(function (senario) {
          data.labels.push(senario._id.dialogName);
          data.datasets[0].data.push(senario.total);
        });
        var myChart = new Chart(context, {
          type: 'pie',
          data: data,
          options: options
        });
      }, function (err) {
        console.log(err);
      });
    };

    // var dialogIsFail = function (date, userType, channel, update) {
    //   $http.get("/api/dialog-isFail/" + $cookies.get("default_bot")).then(function (doc) {
    //     doc.data.forEach(function (data) {
    //       if(data.isFail) $scope.isFailDialogCount = data.count;
    //       else            $scope.isSuccessDialogCount = data.count;
    //     });
    //     var context = document.getElementById("dialogSuccessRate").getContext('2d');
    //     var data = {
    //       labels: ["성공", "실패"],
    //       datasets: [{
    //         data: [$scope.isSuccessDialogCount, $scope.isFailDialogCount],
    //         backgroundColor: [
    //           'rgba(255, 159, 64, 0.2)',
    //           'rgba(255, 99, 132, 0.2)',
    //         ],
    //         borderColor: [
    //           'rgba(255, 159, 64, 1)',
    //           'rgba(255,99,132,1)',
    //         ],
    //         borderWidth: 1
    //       }]
    //     };
    //     var options = {
    //     };
    //     var myChart = new Chart(context, {
    //       type: 'pie',
    //       data: data,
    //       options: options
    //     });
    //
    //   }, function (err) {
    //     console.log(err);
    //   });
    // };

    var failDailogs = function (date, userType, channel, update) {
      $http.post('/api/failDailogs/' + $cookies.get("default_bot"), {date: $scope.date, channel: $scope.channel, limit: 10}).then(function (doc) {
        console.log(doc);
        $scope.failDialogList = doc.data;
      }, function (err) {
        console.log(err);
      });
    };

    var userInputCount = function (date, userType, channel, update) {
      $http.post('/api/user-input-statistics/' + $cookies.get("default_bot"), {date: $scope.date, channel: $scope.channel, limit: 10}).then(function (doc) {
        $scope.userInputUsageList = doc.data;
      }, function (err) {
        console.log(err);
      });
    };

    var formatDate = function (doc) {
      var start = new Date();
      var end = new Date();
      if(doc == "month")     start.setMonth(end.getMonth() - 1);
      else if(doc == "week") start.setDate(end.getDate() - 6);
      $scope.date.start = start.getFullYear() + '/' + (start.getMonth() + 1) + '/' + start.getDate();
      $scope.date.end = end.getFullYear() + '/' + (end.getMonth() +1 ) + '/' + end.getDate();
    };

    $scope.$watch("quickDate", function (doc) {
      formatDate(doc);
    });

    $scope.init = function () {
      formatDate($scope.quickDate);
      userDialogCumulativeCount($scope.date, $scope.userType, $scope.channel, false);
      userCount($scope.date, $scope.userType, $scope.channel, false);
      dailyDialogUsage($scope.date, $scope.userType, $scope.channel, false);
      failDailogs($scope.date, $scope.userType, $scope.channel, false);
      senarioUsage($scope.date, $scope.userType, $scope.channel, false);
      userInputCount($scope.date, $scope.userType, $scope.channel, false);
    };

    $scope.update = function () {
      userDialogCumulativeCount($scope.date, $scope.userType, $scope.channel, true);
      userCount($scope.date, $scope.userType, $scope.channel, true);
      dailyDialogUsage($scope.date, $scope.userType, $scope.channel, true);
      failDailogs($scope.date, $scope.userType, $scope.channel, true);
      senarioUsage($scope.date, $scope.userType, $scope.channel, true);
      userInputCount($scope.date, $scope.userType, $scope.channel, true);
    };

  }
]);
