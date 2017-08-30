"user strict"

angular.module("analytics").controller("UserInputStatisticsController", ["$scope","$http", "$cookies", "$timeout", function ($scope, $http, $cookies, $timeout) {
  $scope.date = {
    start: "",
    end: ""
  };
  $scope.quickDate = "month";
  $scope.userType = "total";
  $scope.channel = "total";
  var dataBackup;
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
    userInputCount($scope.date, $scope.userType, $scope.channel, false);
  };

  $scope.update = function () {
    userInputCount($scope.date, $scope.userType, $scope.channel, true);
  };

  var userInputCount = function () {
    $http.post('/api/user-input-statistics/' + $cookies.get("default_bot"), {date: $scope.date, channel: $scope.channel, limit: 100}).then(function (doc) {
      dataBackup = angular.copy(doc.data);
      $scope.userInputUsageList = doc.data;
      document.getElementById('loading-screen').style.setProperty("display", "none", "important")
    }, function (err) {
      console.log(err);
    });
  };

  $scope.exelDownload = function () {
    dataBackup.forEach(function (doc) {
      Object.keys(doc._id).forEach(function (key) {
        doc[key] = doc._id[key]
      });
      delete doc._id;
    });
    var exelDataTemplate = {
      filename: "사용자 입력 통계",
      sheetName: "사용자 입력 통계",
      columnOrder: ["dialog", "count"],
      orderedData: dataBackup
    };
    $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate}).then(function (doc) {

    }, function (err) {
      console.log(err);
    });
  };
}]);