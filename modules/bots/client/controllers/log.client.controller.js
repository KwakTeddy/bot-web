'use strict';

angular.module('bots').controller('LogController', ['$scope', '$rootScope', '$document', '$cookies', 'Authentication', 'Socket', '$resource',
  function ($scope, $rootScope, $document, $cookies, Authentication, Socket, $resource) {
    var vm = this;
    $scope.authentication = Authentication;

    function emitMsg(msg) {
      Socket.emit('send_msg', {
        bot: vm.bot,
        user: vm.userId,
        msg: msg,
        options: vm.params
      });
    }
    vm.buildBot = function () {
      emitMsg(':build');
    };

    vm.resetBot = function () {
      emitMsg(':init');
    };
    vm.connectBot = function() {
      // console.log('connectBot');
      $rootScope.$broadcast('connectUserBot', {id: vm.bot});
    };

    vm.closeLog = function() {
      hideLogPanel();
    };

    vm.log = '';
    $scope.$on('updateLog', function(event, arg0) {
      vm.log += $rootScope.logUpdated;
      logScrollBottom();
    });

    vm.clearLog = function() {
      var logDiv = document.getElementById('logDiv');
      vm.log = '';
    };

    var logScrollTimer = -1;
    function logScrollBottom() {
      // if(logScrollTimer > -1) clearTimeout(logScrollTimer);

      // logScrollTimer = setTimeout(function() {
      var logDiv = document.getElementById('logDiv');
      logDiv.scrollTop = logDiv.scrollHeight - logDiv.clientHeight;
      // logScrollTimer = -1;
      // }, 300);
    }

    $scope.$on('getInitMsg', function(event, arg0) {
      $rootScope.initMsg = vm.initMsg;
    })
  }
]);


function showLogPanel() {
  document.getElementById('log-button').classList.add('log-button-hide');
  document.getElementById('intent-button').classList.add('intent-button-hide');
  document.getElementById('intent-include').className = 'hide-intent';
  document.getElementById('log-include').className='show-log';
  document.getElementById('main').classList.add('content-body-show-log');
  if(document.getElementById('content')) document.getElementById('content').classList.add('tree-content-show-log');

}

function hideLogPanel() {
  document.getElementById('log-button').classList.remove('log-button-hide');
  document.getElementById('intent-button').classList.remove('intent-button-hide');
  document.getElementById('log-include').className = 'hide-log';
  document.getElementById('main').classList.remove('content-body-show-log');
  if(document.getElementById('content')) document.getElementById('content').classList.remove('tree-content-show-log');
}