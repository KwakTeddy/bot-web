'use strict';
angular.module("analytics").controller("UserStatisticsController", ['$scope', "$http", '$cookies', function ($scope, $http, $cookies) {
  $scope.date = "month";
  $scope.userType = "total";
  $scope.channel = "total";
  $scope.kakao = 0;
  $scope.facebook = 0;
  $scope.navertalk = 0;
  var dataBackup;
  var color = {
    background:{
        kakao: '#fdf3db',
        facebook: 'rgba(25, 255, 132, 0.2)',
        navertalk: 'rgba(25, 22, 252, 0.2)'
    }, border:{
        kakao: 'rgba(25,99,132,255)',
        facebook: 'rgba(54, 162, 235, 0.2)',
        navertalk: 'rgba(75, 192, 192, 1)'
    }
  };
  var pieChart;
  var barChart;
  var pieDataTemplate = {
    labels: ["카카오톡", "페이스북", "네이버톡톡"],
    datasets: [
      {
        label: "카카오톡",
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
        borderWidth: 1,
        data: []
      }
    ]
  };
  var barDataTemplate = {
    labels: [],
    datasets: [{
      label: '카카오톡',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }, {
      label: '페이스북',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }, {
      label: '네이버톡톡',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  };
  var pieData = angular.copy(pieDataTemplate);
  var barData = angular.copy(barDataTemplate);

  var pieContext = document.getElementById("userRatioByChannel").getContext('2d');
  var barContext = document.getElementById("dailyUser").getContext('2d');

  var initChart = function () {
    pieChart = new Chart(pieContext, {
      type: 'doughnut',
      data: pieData,
      options: {}
    });
    barChart = new Chart(barContext, {
      type: 'bar',
      data: barData,
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });
  };

  var updateChart = function () {
    barChart.data = barData;
    barChart.update();
    pieChart.data = pieData;
    pieChart.update();
  };

  $scope.init = function () {
    userCount($scope.date, $scope.userType, $scope.channel, false);
  };

  var userCount = function (date, userType, channel, update) {
    $http.post("/api/userCount/" + $cookies.get('default_bot'), {date: date, userType: userType, channel: channel}).then(function (doc) {
      dataBackup = angular.copy(doc);
      if(update){
        pieData = angular.copy(pieDataTemplate);
        barData = angular.copy(barDataTemplate);
        $scope.kakao = 0;
        $scope.facebook = 0;
        $scope.navertalk = 0;
      }
      for (var i = 0; i < doc.data.length; i++) {
        barData.labels.unshift(doc.data[i]._id.month + "/" + doc.data[i]._id.day);
        barData.datasets[0].data.push(doc.data[i].kakao);
        barData.datasets[1].data.push(doc.data[i].facebook);
        barData.datasets[2].data.push(doc.data[i].navertalk);

        barData.datasets[0].backgroundColor.push(color.background.kakao);
        barData.datasets[1].backgroundColor.push(color.background.facebook);
        barData.datasets[2].backgroundColor.push(color.background.navertalk);

        barData.datasets[0].borderColor.push(color.border.kakao);
        barData.datasets[1].borderColor.push(color.border.facebook);
        barData.datasets[2].borderColor.push(color.border.navertalk);

        $scope.kakao = $scope.kakao + doc.data[i].kakao;
        $scope.facebook = $scope.facebook + doc.data[i].facebook;
        $scope.navertalk = $scope.navertalk + doc.data[i].navertalk;
      }
      pieData.datasets[0].data.push($scope.kakao);
      pieData.datasets[0].data.push($scope.facebook);
      pieData.datasets[0].data.push($scope.navertalk);

      $scope.startDate = barData.labels[0];
      $scope.endDate = barData.labels[barData.labels.length - 1];

      if(!update) initChart();
      else        updateChart();
    }, function (err) {
      console.log(err);
    });
  };
  $scope.update = function () {
    userCount($scope.date, $scope.userType, $scope.channel, true);
  };


  $scope.exelDownload = function () {
    console.log(dataBackup);
    $http.post('/api/analytics/statistics/exel-download', {data: dataBackup}).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };
}]);