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
      console.log(doc);
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

    $http.post('/api/analytics/statistics/senario/exel-download/' + $cookies.get("default_bot")).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };
}]);