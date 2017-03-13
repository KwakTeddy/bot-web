/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('IDEController', ['$scope', '$timeout', '$stateParams', 'fileResolve', 'BotFilesService', 'Socket', 'CoreUtils',
  function ($scope, $timeout, $stateParams, file, BotFilesService, Socket, CoreUtils) {
    var vm = this;
    vm.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'javascript'
    };
    // $scope.authentication = Authentication;

    vm.servers = ['localhost:1024'];
    vm.server = vm.servers[0];
    vm.userId = '';

    vm.msg = '';
    vm.connect = function () {
      if (!vm.userId || vm.userId.length <= 0) {
        alert('유저명을 입력해주세요!');
        return;
      }

      if (!Socket.socket) {
        Socket.connect();
      }

      vm.isConnected = true;
      init();
    };
    vm.isConnected = false;
    vm.sendMsg = function (msg) {
      console.log('sendMsg: ' + msg);
      if (!vm.isConnected) {
        return false;
      }
      var useInput = false;
      if(!msg || msg.length <= 0) {
        msg = vm.msg;
        useInput = true;
      }
      if(!msg || msg.length <= 0) {
        return false;
      }

      if(msg == ':build') {
        build();
        return false;
      }

      if (msg == ':viewGraph') {
          viewGraph();
          return false;
      }

      if (msg == ':init') {
        init();
        return false;
      }

      emitMsg(vm.msg);

      if(useInput) {
        vm.msg = '';
      }
    };
    vm.init = init;
    vm.botName = file.botName;
    vm.name = file.name;
    vm.data = file.data;

    $scope.refreshCodemirror = true;
    $timeout(function () {
      $scope.refreshCodemirror = false;
    }, 100);

      vm.viewGraph= function () {
          new BotFilesService({botId: $stateParams.botId, _id: $stateParams.fileId, fileData: vm.data}).$save(function (botFile) {
              // if (!Socket.socket) {
              //   Socket.connect();
              // }
              // Socket.emit('send_msg', {
              //   host: vm.server.split(':')[0],
              //   port: vm.server.split(':')[1],
              //   bot: vm.bot,
              //   user: vm.userId,
              //   msg: msg
              // });
              // vm.sendMsg(':build');

              vm.sendMsg(':viewGraph');
          }, function (err) {
              CoreUtils.showConfirmAlert(err.data.message);
          });
      };

    vm.buildBot = function () {
      new BotFilesService({botId: $stateParams.botId, _id: $stateParams.fileId, fileData: vm.data}).$save(function (botFile) {
        // if (!Socket.socket) {
        //   Socket.connect();
        // }
        // Socket.emit('send_msg', {
        //   host: vm.server.split(':')[0],
        //   port: vm.server.split(':')[1],
        //   bot: vm.bot,
        //   user: vm.userId,
        //   msg: msg
        // });
        // vm.sendMsg(':build');

        vm.sendMsg(':build');
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      });
    };
    vm.save = function () {
      new BotFilesService({botId: $stateParams.botId, _id: $stateParams.fileId, fileData: vm.data}).$save(function (botFile) {
        // if (!Socket.socket) {
        //   Socket.connect();
        // }
        // Socket.emit('send_msg', {
        //   host: vm.server.split(':')[0],
        //   port: vm.server.split(':')[1],
        //   bot: vm.bot,
        //   user: vm.userId,
        //   msg: msg
        // });
        // vm.sendMsg(':build');

        CoreUtils.showConfirmAlert('저장되었습니다.');
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      });
    };
    function build() {
      // console.log(vm.botName);
      emitMsg(':build ' + vm.botName + ' reset');
    }

      function viewGraph() {
          // console.log(vm.botName);
          emitMsg(':viewGraph ' + vm.botName);
      }

    function init() {
      emitMsg(':reset user');

      setTimeout(function() {
        console.log('init: ' + vm.initMsg);
        if(vm.initMsg != undefined && vm.initMsg != null && vm.initMsg != '') emitMsg(vm.initMsg);
      }, 200);

    }
    Socket.on('send_msg', function (message) {
      // console.log(vm.botName);
      console.log('out:' + message);
    });

    function emitMsg(msg) {
      Socket.emit('send_msg', {
        host: vm.server.split(':')[0],
        port: vm.server.split(':')[1],
        bot: vm.botName,
        user: vm.userId,
        msg: msg
      });
    }


    $scope.$on('$destroy', function () {
      Socket.removeListener('send_msg');
    });
    vm.userId = 'com2best';
    vm.connect();

    // $scope.$on('$destroy', function () {
    //   Socket.removeListener('send_msg');
    // });




}]
);
