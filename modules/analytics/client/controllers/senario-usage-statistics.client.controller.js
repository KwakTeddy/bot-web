"user strict"

angular.module("analytics").controller("SenarioUsageStatisticsController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.quickDate = "month";
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
      console.log(doc.data.botSenario);
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
      document.getElementById('loading-screen').style.setProperty("display", "none", "important")
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

  $scope.init = function () {
    formatDate($scope.quickDate);
    senarioCount($scope.date, $scope.userType, $scope.channel, false);
  };

  $scope.$watch("quickDate", function (doc) {
    formatDate(doc);
  });

  $scope.update = function () {
    senarioCount($scope.date, $scope.userType, $scope.channel, true);
  };

  $scope.exelDownload = function () {

    $http.post('/api/analytics/statistics/senario/exel-download/' + $cookies.get("default_bot"), {date: $scope.date}).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };
}]);
// var array2 = [
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 29 },
//     total: 3,
//     kakao: 1,
//     facebook: 0,
//     navertalk: 2 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 28 },
//     total: 35,
//     kakao: 15,
//     facebook: 1,
//     navertalk: 19 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 27 },
//     total: 14,
//     kakao: 9,
//     facebook: 1,
//     navertalk: 4 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 26 },
//     total: 37,
//     kakao: 33,
//     facebook: 0,
//     navertalk: 4 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 25 },
//     total: 34,
//     kakao: 25,
//     facebook: 0,
//     navertalk: 9 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 24 },
//     total: 21,
//     kakao: 14,
//     facebook: 1,
//     navertalk: 6 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 23 },
//     total: 34,
//     kakao: 24,
//     facebook: 0,
//     navertalk: 10 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 22 },
//     total: 40,
//     kakao: 32,
//     facebook: 0,
//     navertalk: 8 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 21 },
//     total: 91,
//     kakao: 83,
//     facebook: 0,
//     navertalk: 8 },
//   { _id: { dialogName: '혜택선택형2', year: 2017, month: 8, day: 20 },
//     total: 11,
//     kakao: 6,
//     facebook: 0,
//     navertalk: 5 },
// ]
//
//
// var array = [
//   [
//     '메뉴',
//     '합계',
//     '8/1',
//     '8/2',
//     '8/3',
//     '8/4',
//     '8/5',
//     '8/6',
//     '8/7',
//     '8/8',
//     '8/9',
//     '8/10',
//     '8/11',
//     '8/12',
//     '8/13',
//     '8/14',
//     '8/15',
//     '8/16',
//     '8/17',
//     '8/18',
//     '8/19',
//     '8/20',
//     '8/21',
//     '8/22',
//     '8/23',
//     '8/24',
//     '8/25',
//     '8/26',
//     '8/27',
//     '8/28',
//     '8/29',
//     '8/30',
//     '8/31'
//   ],
//   [
//     '0. 시작',
//     '123',
//     '3123',
//     '1423',
//     '1243',
//     '1235',
//     '1263',
//     '1263',
//     '1273'
//   ],
//   [ 'month',
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     8,
//     7,
//     7,
//     7 ],
//   [ 'day',
//     29,
//     28,
//     27,
//     26,
//     25,
//     24,
//     23,
//     22,
//     21,
//     20,
//     19,
//     18,
//     17,
//     16,
//     15,
//     14,
//     13,
//     12,
//     11,
//     10,
//     9,
//     8,
//     7,
//     6,
//     5,
//     4,
//     3,
//     2,
//     1,
//     31,
//     30,
//     29 ],
//   [ 'kakao',
//     334,
//     1805,
//     1518,
//     2570,
//     2749,
//     1892,
//     2332,
//     2476,
//     4255,
//     1719,
//     1792,
//     2516,
//     2288,
//     2620,
//     2238,
//     3308,
//     2732,
//     4546,
//     6637,
//     9680,
//     46005,
//     41924,
//     15216,
//     1300,
//     1298,
//     1847,
//     1605,
//     1746,
//     1921,
//     2265,
//     2796,
//     5715 ],
//   [ 'facebook',
//     3,
//     15,
//     4,
//     2,
//     8,
//     7,
//     8,
//     7,
//     4,
//     1,
//     2,
//     4,
//     7,
//     3,
//     5,
//     3,
//     1,
//     5,
//     6,
//     7,
//     4,
//     5,
//     6,
//     7,
//     6,
//     4,
//     10,
//     11,
//     16,
//     3,
//     2,
//     3 ],
//   [ 'navertalk',
//     11,
//     101,
//     62,
//     54,
//     99,
//     85,
//     104,
//     99,
//     127,
//     70,
//     57,
//     95,
//     109,
//     124,
//     68,
//     102,
//     67,
//     53,
//     103,
//     106,
//     107,
//     100,
//     106,
//     61,
//     70,
//     100,
//     113,
//     119,
//     115,
//     22,
//     6,
//     7 ],
//   [ 'total',
//     348,
//     1921,
//     1584,
//     2626,
//     2856,
//     1984,
//     2444,
//     2582,
//     4386,
//     1790,
//     1851,
//     2615,
//     2404,
//     2747,
//     2311,
//     3413,
//     2800,
//     4604,
//     6746,
//     9793,
//     46116,
//     42029,
//     15328,
//     1368,
//     1374,
//     1951,
//     1728,
//     1876,
//     2052,
//     2290,
//     2804,
//     5725 ] ]
