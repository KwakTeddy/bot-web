/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('BotFilesController', ['$scope', '$stateParams', 'botResolve', 'botFilesResolve', 'BotFilesService', 'CoreUtils',
  function ($scope, $stateParams, bot, files, BotFilesService, CoreUtils) {
    var vm = this;
    vm.bot = bot;
    vm.files = files;
    vm.addFileName = '';

    vm.remove = function (index) {
      CoreUtils.showYesOrNoAlert('정말 지우시겠습니까?', function () {
        vm.files[index].$remove({botId: vm.files[index].bot._id}, function (res) {
          vm.files.splice(index, 1);
        }, function (err) {
          CoreUtils.showConfirmAlert(err.data.message);
        });
      });
    };

    vm.create = function () {
      if(vm.addFileName && vm.addFileName.length > 0) {
        new BotFilesService({botId: vm.bot._id, fileName: vm.addFileName}).$save(function (botFile) {
          vm.files.push(botFile);
        }, function (err) {
          CoreUtils.showConfirmAlert(err.data.message);
        });
      }
    };

    vm.rename = function (index) {
      vm.files[index].$update({botId: vm.files[index].bot._id}, function (file) {
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
    
    // // Find a list of Bots
    // vm.find = function () {
    //   vm.bots = BotsService.query();
    // };
    //
    // // Find existing Bot
    // vm.findOne = function () {
    //   vm.bot = BotsService.get({
    //     botId: $stateParams.botId
    //   });
    // };
  }
]);
