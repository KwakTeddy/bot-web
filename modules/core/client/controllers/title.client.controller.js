'use strict';

<<<<<<< HEAD
angular.module('core').controller('TitleController', ['$scope', '$http',
  function ($scope, $http) {
=======
angular.module('core').controller('TitleController', ['$scope', '$state', 'Authentication', '$http',
  function ($scope, $state, Authentication, $http) {
>>>>>>> 6350e32e63672cf3757f31c120b3922fbb42c6a0
    $http.get("/config").then(function (result) {
      console.log(result.data);
      if(result.data.enterprise.title){
        $scope.enterpriseTitle = result.data.enterprise.title
      }else {
        $scope.enterpriseTitle = "아테나 Athena - 인공지능 챗봇 플랫폼, 머니브레인 MoneyBrain"
      }
    }, function (err) {
      console.log(err)
    });

  }
]);
