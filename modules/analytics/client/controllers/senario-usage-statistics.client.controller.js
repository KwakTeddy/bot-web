"user strict"

angular.module("analytics").controller("SenarioUsageStatisticsController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
  $scope.date = "month";
  $scope.userType = "total";
  $scope.channel = "total";

  $scope.init = function () {
    senarioCount();
  };
  $scope.senarioIndex = {};
  var depth = "1";
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

  var senarioCount = function () {
    $http.post('/api/senarioUsage/' + $cookies.get("default_bot")).then(function (doc) {
      for(var i = 0; i < doc.data.botSenario.length; i++){
        if((doc.data.botSenario[i].name == "인기봇")||(doc.data.botSenario[i].name =="최신봇")||(doc.data.botSenario[i].name =="친구봇")||(doc.data.botSenario[i].name =="친구봇리스트")
          ||(doc.data.botSenario[i].name =="마이봇")||(doc.data.botSenario[i].name =="마이봇리스트")|| !doc.data.botSenario[i].name) {
          continue;
        }
        else if(doc.data.botSenario[i].name) {
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
        }
      });
      console.log(doc.data.senarioUsage);
      $scope.senarioUsageList = doc.data.senarioUsage;
    }, function (err) {
      console.log(err);
    });
  };

  $scope.update = function () {
    senarioCount();
  }
}]);