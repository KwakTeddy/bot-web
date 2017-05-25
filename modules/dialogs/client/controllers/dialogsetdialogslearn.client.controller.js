(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dialogsets')
    .controller('DialogsetDialogsLearnController', DialogsetDialogsLearnController);

  DialogsetDialogsLearnController.$inject = ['$scope', '$state', '$window', 'Authentication', 'UserBotDialogService', 'dialogsResolve', 'botResolve', '$cookies', '$timeout'];

  function DialogsetDialogsLearnController($scope, $state, $window, Authentication, UserBotDialogService, getDialogs, botResolve, $cookies, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bot = botResolve.data;
    vm.dialogs = getDialogs;
    vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id, depth: 0});
    vm.childDialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id, depth: 0});
    vm.error = null;
    vm.filterDialogs = angular.copy(vm.dialogs);
    vm.hasParentDialogs = [];

    if(vm.dialogs.length){
      for(var i = vm.dialogs.length - 1; i >= 0; i--){
        if(vm.dialogs[i].parent){
          vm.hasParentDialogs.push(vm.filterDialogs[i]);
          vm.dialogs.splice(i, 1)
        }
      }
    }

    if(vm.hasParentDialogs.length){
      for (var k = 0; k < vm.hasParentDialogs.length; k++){
        for(var j = 0; j < vm.dialogs.length; j++){
          if (vm.dialogs[j]._id == vm.hasParentDialogs[k].parent){
            vm.dialogs.splice(j+1, 0, vm.hasParentDialogs[k])
            break;
          }
        }
      }
    }

    vm.createDialog = function() {
      vm.dialog.$save(function (response) {
        vm.dialogs.push(response);

        vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id, depth: 0});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id, depth: 0});
      })
    };

    vm.updateDialog = function (dialog) {
      dialog.userBotId = vm.bot.id;
      dialog.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeDialog = function(dialog) {
      dialog.userBotId = vm.bot.id;
      dialog.$remove(function(response) {
        console.log(response);
        dialog.deleted = 'true';
      });
    };


    vm.createDepthDialog = function(parent, index) {
      console.log(parent)
      vm.childDialog['parent'] = parent._id;
      vm.childDialog['depth'] = parent.depth + 1;

      vm.childDialog.$save(function (response) {
        console.log(response)
        vm.dialogs.splice(index+1, 0, response);
        vm.childDialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
      }, function (err) {
        $scope.error = errorResponse.data.message;
        vm.childDialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
      })
    };


    vm.keyDown = function (event) {
      if (event.keyCode == 13){ //enter
        vm.createDialog();
        angular.element('#question').focus();
      }
    }

  }
})();
