"user strict"

angular.module("analytics").controller("UserInputStatisticsController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
  $scope.date = "month";
  $scope.userType = "total";
  $scope.channel = "total";

  $scope.init = function () {
    userInputCount();
  };

  $scope.update = function () {
    userInputCount();
  };

  var userInputCount = function () {
    $http.post('/api/user-input-statistics/' + $cookies.get("default_bot"), {date: $scope.date, channel: $scope.channel}).then(function (doc) {
      console.log(doc);
       $scope.userInputUsageList = doc.data;
    }, function (err) {
      console.log(err);
    });
  };
}]);