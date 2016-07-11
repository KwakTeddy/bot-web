/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('BotFilesController', ['$scope', '$stateParams', 'botFilesResolve', 'BotFilesService', 'CoreUtils',
  function ($scope, $stateParams, files, BotFilesService, CoreUtils) {
    var vm = this;
    vm.files = files;
    vm.addFileName = '';

    vm.remove = function (index) {
      CoreUtils.showYesOrNoAlert('정말 지우시겠습니까?', function () {
        vm.files[index].$remove(function () {
          vm.files.splice(index, 1);
        }, function (res) {

        });
      });
    };

    vm.create = function () {
      if(vm.addFileName && vm.addFileName.length > 0) {
        new BotFilesService({fileName: vm.addFileName + '.top'}).$save(function (botFile) {
          vm.files.push(botFile);
        }, function (err) {
          
        });
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
