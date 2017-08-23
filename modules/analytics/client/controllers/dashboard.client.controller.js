'use strict';

// Dashboard controller
angular.module('analytics').controller('DashboardController', ['$scope', 'Authentication', 'AnalyticsService', '$cookies', 'DialogUsageService', 'DialogSuccessService', '$http',
  function ($scope, Authentication, AnalyticsService, $cookies, DialogUsageService, DialogSuccessService, $http) {
    $scope.authentication = Authentication;
    $scope.totalDialogUsage = 0;
    $scope.facebookUserCount = 0;
    $scope.kakaoUserCount = 0;
    $scope.navertalkUserCount = 0;
    $scope.totalUserCount = 0;

    $http.get("/api/userDialogCumulativeCount/" + $cookies.get('default_bot')).then(function (doc) {
      $scope.userDialogCumulativeCount = doc.data
    }, function (err) {
      console.log(err);
    });

    $http.post("/api/userCount/" + $cookies.get('default_bot')).then(function (doc) {
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
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
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

    $http.post("/api/daily-dialog-usage", {botId: $cookies.get('default_bot')}).then(function (doc) {
      console.log(doc);
      var context = document.getElementById("dailyDialogUsage").getContext('2d');
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
      var options = {

      };

      for (var i = 0; i < doc.data.length; i++) {
        data.labels.unshift(doc.data[i]._id.month + "/" + doc.data[i]._id.day);
        data.datasets[0].data.push(doc.data[i].kakao);
        data.datasets[1].data.push(doc.data[i].facebook);
        data.datasets[2].data.push(doc.data[i].navertalk);
        data.datasets[3].data.push(doc.data[i].total);
        $scope.totalDialogUsage = $scope.totalDialogUsage + doc.data[i].total
      }

      var myChart = new Chart(context, {
        type: 'line',
        data: data,
        options: options
      });

    }, function (err) {
      console.log(err);
    });

    $http.get("/api/dialog-isFail/" + $cookies.get("default_bot")).then(function (doc) {
      doc.data.forEach(function (data) {
        if(data.isFail) $scope.isFailDialogCount = data.count;
        else            $scope.isSuccessDialogCount = data.count;
      });
      var context = document.getElementById("dialogSuccessRate").getContext('2d');
      var data = {
        labels: ["성공", "실패"],
        datasets: [{
          data: [$scope.isSuccessDialogCount, $scope.isFailDialogCount],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        }]
      };
      var options = {
      };
      var myChart = new Chart(context, {
        type: 'pie',
        data: data,
        options: options
      });

    }, function (err) {
      console.log(err);
    });

    $http.get('/api/failDailogs/' + $cookies.get("default_bot")).then(function (doc) {
      console.log(doc);
      $scope.failDialogList = doc.data;
    }, function (err) {
      console.log(err);
    });

    $http.post('/api/senarioUsage/' + $cookies.get("default_bot"), {limit : 5}).then(function (doc) {
      console.log(doc);
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
      console.log(doc.data.senarioUsage);
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

  }
]);
