"user strict";
angular.module("analytics").controller("DialogAmountStatisticsController", ["$scope","$http", "$cookies", function ($scope, $http, $cookies) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.quickDate = "month";
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
      navertalk: 'rgba(25, 22, 252, 0.2)',
      success: "blue",
      fail: "red"
    }, border:{
      kakao: 'rgba(25,99,132,255)',
      facebook: 'rgba(54, 162, 235, 0.2)',
      navertalk: 'rgba(75, 192, 192, 1)',
      success: "blue",
      fail: "red"
    }
  };
  var pieChart;
  var barChart;
  var isFailBarChart;
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
  var isFailBarDataTemplate = {
    labels: [],
    datasets: [{
      label: '성공',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }, {
      label: '실패',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  };
  var pieData = angular.copy(pieDataTemplate);
  var barData = angular.copy(barDataTemplate);
  var isFailBarData = angular.copy(isFailBarDataTemplate);

  var pieContext = document.getElementById("dialogRatioByChannel").getContext('2d');
  var barContext = document.getElementById("dailyDialog").getContext('2d');
  var isFailBarContext = document.getElementById("isFailDialog").getContext('2d');

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
            stacked: true,
            ticks: {
              beginAtZero:true
            }
          }]
        }
      },
      plugins: [
        {
          afterInit: function() {
            document.getElementById('loading-screen').style.setProperty("display", "none", "important")
          }
        }
      ]
    });
    isFailBarChart = new Chart(isFailBarContext, {
      type: 'bar',
      data: isFailBarData,
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero:true
            }
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
    isFailBarChart.data = isFailBarData;
    isFailBarChart.update();
  };

  var dialogCount = function (date, userType, channel, update) {
    $http.post("/api/daily-dialog-usage", {botId: $cookies.get('default_bot'), date: date, userType: userType, channel: channel}).then(function (doc) {
      dataBackup = angular.copy(doc.data);
      if(update){
        pieData = angular.copy(pieDataTemplate);
        barData = angular.copy(barDataTemplate);
        isFailBarData = angular.copy(isFailBarDataTemplate);
        $scope.kakao = 0;
        $scope.facebook = 0;
        $scope.navertalk = 0;
      }
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
      barData.labels = array;
      isFailBarData.labels = array;

      array.forEach(function (date, index) {
        var Year =  parseInt(date.split('/')[0]);
        var Month = parseInt(date.split('/')[1]);
        var Day =   parseInt(date.split('/')[2]);
        var exist = false;
        for (var i = 0; i < doc.data.length; i++) {
          if((doc.data[i]._id.year == Year) && (doc.data[i]._id.month == Month) && (doc.data[i]._id.day == Day)){
            exist = true;
            barData.datasets[0].data.push(doc.data[i].kakao);
            barData.datasets[1].data.push(doc.data[i].facebook);
            barData.datasets[2].data.push(doc.data[i].navertalk);

            isFailBarData.datasets[0].data.push(doc.data[i].total - doc.data[i].fail);
            isFailBarData.datasets[1].data.push(doc.data[i].fail);

            $scope.kakao = $scope.kakao + doc.data[i].kakao;
            $scope.facebook = $scope.facebook + doc.data[i].facebook;
            $scope.navertalk = $scope.navertalk + doc.data[i].navertalk;
            break;
          }
        }
        if(!exist){
          barData.datasets[0].data.push(0);
          barData.datasets[1].data.push(0);
          barData.datasets[2].data.push(0);
        }
        barData.datasets[0].backgroundColor.push(color.background.kakao);
        barData.datasets[1].backgroundColor.push(color.background.facebook);
        barData.datasets[2].backgroundColor.push(color.background.navertalk);

        barData.datasets[0].borderColor.push(color.border.kakao);
        barData.datasets[1].borderColor.push(color.border.facebook);
        barData.datasets[2].borderColor.push(color.border.navertalk);

        isFailBarData.datasets[0].backgroundColor.push(color.background.success);
        isFailBarData.datasets[1].backgroundColor.push(color.background.fail);

        isFailBarData.datasets[0].borderColor.push(color.border.success);
        isFailBarData.datasets[1].borderColor.push(color.border.success);
      });
      pieData.datasets[0].data.push($scope.kakao);
      pieData.datasets[0].data.push($scope.facebook);
      pieData.datasets[0].data.push($scope.navertalk);
      if(!update) initChart();
      else        updateChart();
    }, function (err) {
      console.log(err);
    });
  };

  var formatDate = function (doc) {
    var start = new Date();
    var end = new Date();
    if(doc == "month")     start.setMonth(end.getMonth() - 1);
    else if(doc == "week") start.setDate(end.getDate() - 6);
    $scope.date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
    $scope.date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();
  };

  $scope.$watch("quickDate", function (doc) {
    formatDate(doc);
  });

  $scope.init = function () {
    formatDate($scope.quickDate);
    dialogCount($scope.date, $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    dialogCount($scope.date, $scope.userType, $scope.channel, true);
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
      filename: "기간별 이용자 통계",
      sheetName: "기간별 이용자 통계",
      columnOrder: ["year", "month", "day", "kakao", "facebook","navertalk", "total", "fail"],
      orderedData: dataBackup1
    };

    $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate}).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };


}]);