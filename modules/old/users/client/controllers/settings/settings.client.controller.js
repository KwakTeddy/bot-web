'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$timeout',
  function ($scope, Authentication, $timeout) {
    $scope.user = Authentication.user;

    $timeout(function () {
      document.getElementById('sidebar-left').style.display = 'none';
      document.getElementById('chat-include').style.display = 'none';
      document.getElementById('log-button').style.display = 'none';
      document.getElementById('intent-button').style.display = 'none';
      document.getElementById('main').classList.remove('content-body');
    });

  }
]);
