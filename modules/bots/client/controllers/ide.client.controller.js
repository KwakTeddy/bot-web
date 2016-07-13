/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('IDEController', ['$scope', '$stateParams', 'fileResolve', 'BotFilesService', 'CoreUtils',
  function ($scope, $stateParams, file, BotFilesService, CoreUtils) {
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
        CoreUtils.showConfirmAlert('저장되었습니다.');
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      });
    }
  }
]);
