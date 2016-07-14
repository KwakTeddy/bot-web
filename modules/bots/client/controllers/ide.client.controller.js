/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('IDEController', ['$scope', '$stateParams', 'fileResolve', 'BotFilesService', 'Socket', 'CoreUtils',
  function ($scope, $stateParams, file, BotFilesService, Socket, CoreUtils) {
    var vm = this;
    vm.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'javascript'
    };
    vm.botName = file.botName;
    vm.name = file.name;
    vm.data = file.data;

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

        CoreUtils.showConfirmAlert('저장되었습니다.');
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      });
    };


    // $scope.$on('$destroy', function () {
    //   Socket.removeListener('send_msg');
    // });
  }
]);
