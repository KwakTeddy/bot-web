"user strict";
angular.module("analytics").controller("DialogAmountStatisticsController", ["$scope","$http", "$cookies", function ($scope, $http, $cookies) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.userType = "total";
  $scope.channel = "total";
  $scope.kakao = 0;
  $scope.facebook = 0;
  $scope.navertalk = 0;
  var dataBackup;

  var color = {
    background:{
      // kakao: '#fff5dd',
      // kakao: '#fbe600',
      // facebook: '#3b5998',
      // navertalk: '#00c73c',
      kakao: 'rgba(251, 230, 0, 0.70)',
      facebook: 'rgba(59, 89, 152, 0.70)',
      navertalk: 'rgba(0, 199, 60, 0.70)',
      success: "rgba(66, 133, 244, 0.70)",
      fail: "rgba(221, 81, 68, 0.70)"
    }, border:{
      kakao: '#ede500',
      facebook: '#29487d',
      navertalk: '#00af35',
      success: "rgb(51, 126, 248)",
      fail: "rgb(147, 75, 61)"
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
          color.background.kakao,
          color.background.facebook,
          color.background.navertalk
        ],
        borderColor: [
          color.border.kakao,
          color.border.facebook,
          color.border.navertalk
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
            document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
            document.getElementsByName('dataLoading')[1].style.setProperty("display", "none", "important");
            document.getElementsByName('dataLoading')[2].style.setProperty("display", "none", "important");
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
    document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
    document.getElementsByName('dataLoading')[1].style.setProperty("display", "none", "important");
    document.getElementsByName('dataLoading')[2].style.setProperty("display", "none", "important");
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
      var startYear =  $scope.date.start.getFullYear();
      var startMonth = $scope.date.start.getMonth() + 1;
      var startDay =   $scope.date.start.getDate();
      var endYear =  $scope.date.end.getFullYear();
      var endMonth = $scope.date.end.getMonth() + 1;
      var endDay =   $scope.date.end.getDate();
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

  var formatDate = function (start, end) {
    var date = {start: "", end: ""};
    date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
    date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();
    return date;
  };

  $scope.init = function () {
    dialogCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    console.log(123123)
    document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
    document.getElementsByName('dataLoading')[1].style.setProperty("display", "block", "important");
    document.getElementsByName('dataLoading')[2].style.setProperty("display", "block", "important");
    dialogCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
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
      filename: "기간별 대화량 통계",
      sheetName: "기간별 대화량 통계",
      columnOrder: ["year", "month", "day", "kakao", "facebook","navertalk", "total", "fail"],
      orderedData: dataBackup1
    };

    $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate}).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };


}]);