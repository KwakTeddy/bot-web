'use strict';

angular.module('core').controller('HomeController', ['$scope', '$rootScope', '$document', '$cookies', 'Authentication', 'Socket', '$resource',
  function ($scope, $rootScope, $document, $cookies, Authentication, Socket, $resource) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.test = '123';

    vm.resetDB = function() {
      $resource('/api/resetDB').delete();
    };

    vm.connectBot = function() {
      console.log('connectBot');
      $rootScope.$broadcast('connectUserBot', {id: vm.bot});
    };

    vm.log = '';
    $scope.$on('updateLog', function(event, arg0) {
      vm.log += $rootScope.logUpdated;
      logScrollBottom();
    });

    var logScrollTimer = -1;
    function logScrollBottom() {
      // if(logScrollTimer > -1) clearTimeout(logScrollTimer);

      // logScrollTimer = setTimeout(function() {
      var logDiv = document.getElementById('logDiv');
      logDiv.scrollTop = logDiv.scrollHeight - logDiv.clientHeight;
      // logScrollTimer = -1;
      // }, 300);
    }
  }
]);

