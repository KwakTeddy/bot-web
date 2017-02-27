/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// UserBots controller
angular.module('user-bots').controller('UserBotFilesController', ['$scope', '$stateParams', 'userBotResolve', 'userBotFilesResolve', 'UserBotFilesService', 'CoreUtils',
  function ($scope, $stateParams, userBot, files, UserBotFilesService, CoreUtils) {
    var vm = this;
    vm.userBot = userBot;
    vm.files = files;
    vm.addFileName = '';

    vm.remove = function (index) {
      CoreUtils.showYesOrNoAlert('정말 지우시겠습니까?', function () {
        vm.files[index].$remove({userBotId: vm.files[index].userBot._id}, function (res) {
          vm.files.splice(index, 1);
        }, function (err) {
          CoreUtils.showConfirmAlert(err.data.message);
        });
      });
    };

    vm.create = function () {
      if(vm.addFileName && vm.addFileName.length > 0) {
        new UserBotFilesService({userBotId: vm.userBot._id, fileName: vm.addFileName}).$save(function (userBotFile) {
          vm.files.push(userBotFile);
        }, function (err) {
          CoreUtils.showConfirmAlert(err.data.message);
        });
      }
    };

    vm.rename = function (index) {
      vm.files[index].$update({userBotId: vm.files[index].userBot._id}, function (file) {
        vm.files.splice(index, 1, file);
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      })
    };

    vm.edit = function (index, edit) {
      vm.files[index].edit = edit;
      if(edit) {
        vm.files[index].renameFileName = vm.files[index].name;
      }
    };
    
    // // Find a list of UserBots
    // vm.find = function () {
    //   vm.userBots = UserBotsService.query();
    // };
    //
    // // Find existing UserBot
    // vm.findOne = function () {
    //   vm.userBot = UserBotsService.get({
    //     userBotId: $stateParams.userBotId
    //   });
    // };
  }
]);
