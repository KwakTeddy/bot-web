"user strict"

angular.module("analytics").controller("SenarioUsageStatisticsController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.userType = "total";
  $scope.channel = "total";
  $scope.senarioIndex = {};
  $scope.senarioUsageList = [];
  var dataBackup;
  var indexing = function (senario, depth, index) {
    var newDepth;
    newDepth = depth + "-" + index;
    $scope.senarioIndex[senario.name] = newDepth;
    if(senario.children){
      senario.children.forEach(function (child, index) {
        index++;
        index = index.toString();
        indexing(child, newDepth, index)
      })
    }
  };

  var senarioCount = function (date, userType, channel, update) {
    $http.post('/api/senarioUsage/' + $cookies.get("default_bot"), {date: date, userType: userType, channel: channel}).then(function (doc) {
      $scope.senarioIndex = {};
      $scope.senarioUsageList = [];
      var depth = "1";
      for(var i = 0; i < doc.data.botSenario.length; i++){
        if(!doc.data.botSenario[i].name) {
          continue;
        }else{
          $scope.senarioIndex[doc.data.botSenario[i].name] = depth + "-0";
        }
        if(doc.data.botSenario[i].children){
          doc.data.botSenario[i].children.forEach(function (child, index) {
            index++;
            index = index.toString();
            indexing(child, depth, index)
          });
        }
        depth = parseInt(depth) + 1;
        depth = depth.toString();
      }
      doc.data.senarioUsage.forEach(function (_doc) {
        if($scope.senarioIndex[_doc._id.dialogName]) {

          var prefix = "";
          for(var i = 0; i < $scope.senarioIndex[_doc._id.dialogName].split('-')[0].length-1; i++){
            prefix = prefix + "a"
          }
          _doc['index'] = $scope.senarioIndex[_doc._id.dialogName];
          _doc['order'] = prefix + $scope.senarioIndex[_doc._id.dialogName];
          delete $scope.senarioIndex[_doc._id.dialogName]
        }
      });
      if($scope.senarioIndex){
        Object.keys($scope.senarioIndex).forEach(function (key) {
          var prefix = "";
          for(var i = 0; i < $scope.senarioIndex[key].split('-')[0].length-1; i++){
            prefix = prefix + "a"
          }
          var obj = {_id: {dialogName: ""}, order:"", index: "", facebook: 0, kakao: 0, navertalk: 0, total: 0};
          obj._id.dialogName = key;
          obj.order = $scope.senarioIndex[key];
          obj.index = prefix + $scope.senarioIndex[key];
          $scope.senarioUsageList.push(obj);
        })
      }
      var result = [];
      result.push.apply($scope.senarioUsageList, doc.data.senarioUsage);
      document.getElementById('loading-screen').style.setProperty("display", "none", "important");
      document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");

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
    senarioCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
    senarioCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
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
    $http.post('/api/analytics/statistics/senario/exel-download/' + $cookies.get("default_bot"), {date: date}).then(function (doc) {
      var fileName = $cookies.get("default_bot") + '_' + "시나리오 사용 통계" + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';
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
}]);