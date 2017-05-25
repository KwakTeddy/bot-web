(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dialogsets')
    .controller('DialogsetDialogsLearnController', DialogsetDialogsLearnController);

  DialogsetDialogsLearnController.$inject = ['$scope', '$state', '$window', 'Authentication', 'UserBotDialogService', 'dialogsResolve', 'botResolve', '$cookies'];

  function DialogsetDialogsLearnController($scope, $state, $window, Authentication, UserBotDialogService, getDialogs, botResolve, $cookies) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bot = botResolve.data;
    vm.dialogs = getDialogs;
    console.log(vm.dialogs)

    vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
    vm.childDialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
    vm.error = null;
    vm.ratio = 18/20

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

    $scope.$$postDigest(function () {
      if(vm.dialogs.length){
        for (var i = 0; i < vm.dialogs.length; i++){
          if(vm.dialogs[i].parent) {
            for(var j = 0; j < vm.dialogs.length; j++){
              if(vm.dialogs[j]._id == vm.dialogs[i].parent){
                // console.log('learnDialog_' + (i - 1))
                // console.log(String(parseInt(document.getElementById('learnDialog_' + (i - 1)).style.width)*(vm.ratio))+ '%');
                // document.getElementById('learnDialog_' + vm.dialogs[i]._id).style.width = String(parseInt(document.getElementById('learnDialog_' + vm.dialogs[j]._id).style.width)*(vm.ratio)) + '%'
                document.getElementById('learnDialog_' + i).style.width = String(parseInt(document.getElementById('learnDialog_' + j).style.width)*(vm.ratio)) + '%'
              }
            }
          }
        }
      }
    });

    vm.createDialog = function() {
      console.log(vm.dialog)

      vm.dialog.$save(function (response) {
        vm.dialogs.push(response);

        vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
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
      console.log(vm.childDialog)
      vm.childDialog['parent'] = parent._id;
      vm.childDialog.$save(function (response) {
        console.log(response)
        // vm.childDialog = response;
        vm.dialogs.splice(index+1, 0, response);

        // UserBotDialogService.query({botId: $cookies.get('default_bot')}, function (result) {
        //   vm.dialogs = result;
        //   vm.filterDialogs = angular.copy(vm.dialogs);
        //   vm.hasParentDialogs = []
        //   for(var i = vm.dialogs.length - 1; i >= 0; i--){
        //     if(vm.dialogs[i].parent){
        //       vm.hasParentDialogs.push(vm.filterDialogs[i]);
        //       vm.dialogs.splice(i, 1)
        //     }
        //   }
        //   for (var k = 0; k < vm.hasParentDialogs.length; k++){
        //     for(var j = 0; j < vm.dialogs.length; j++){
        //       if (vm.dialogs[j]._id == vm.hasParentDialogs[k].parent){
        //         vm.dialogs.splice(j+1, 0, vm.hasParentDialogs[k])
        //         break;
        //       }
        //     }
        //   }
        //
        //   for (var i = 0; i < vm.dialogs.length; i++) {
        //     document.getElementById('learnDialog_' + i).style.width = '100%'
        //     // document.getElementById('learnDialog_' + vm.dialogs[i]._id).style.width = '100%'
        //   }
        //   for (var i = 0; i < vm.dialogs.length; i++){
        //     if(vm.dialogs[i].parent) {
        //       for(var j = 0; j < vm.dialogs.length; j++){
        //         if(vm.dialogs[j]._id == vm.dialogs[i].parent){
        //           // console.log('learnDialog_' + (i - 1))
        //           // console.log(String(parseInt(document.getElementById('learnDialog_' + (i - 1)).style.width)*(1/2))+ '%');
        //           // document.getElementById('learnDialog_' + vm.dialogs[i]._id).style.width = String(parseInt(document.getElementById('learnDialog_' + vm.dialogs[j]._id).style.width)*(vm.ratio)) + '%'
        //           document.getElementById('learnDialog_' + i).style.width = String(parseInt(document.getElementById('learnDialog_' + j).style.width)*(vm.ratio)) + '%'
        //         }
        //       }
        //     }
        //   }
        //
        //
        //   // $scope.$$postDigest(function () {
        //   //   for (var i = 0; i < vm.dialogs.length; i++) {
        //   //     document.getElementById('learnDialog_' + i).style.width = '100%'
        //   //     // document.getElementById('learnDialog_' + vm.dialogs[i]._id).style.width = '100%'
        //   //   }
        //   //   for (var i = 0; i < vm.dialogs.length; i++){
        //   //     if(vm.dialogs[i].parent) {
        //   //       for(var j = 0; j < vm.dialogs.length; j++){
        //   //         if(vm.dialogs[j]._id == vm.dialogs[i].parent){
        //   //           // console.log('learnDialog_' + (i - 1))
        //   //           // console.log(String(parseInt(document.getElementById('learnDialog_' + (i - 1)).style.width)*(1/2))+ '%');
        //   //           // document.getElementById('learnDialog_' + vm.dialogs[i]._id).style.width = String(parseInt(document.getElementById('learnDialog_' + vm.dialogs[j]._id).style.width)*(vm.ratio)) + '%'
        //   //           document.getElementById('learnDialog_' + i).style.width = String(parseInt(document.getElementById('learnDialog_' + j).style.width)*(vm.ratio)) + '%'
        //   //         }
        //   //       }
        //   //     }
        //   //   }
        //   // })
        //
        //
        //
        //
        // }, function (err) {
        //   console.log(err)
        // })



        // $scope.$$postDigest(function () {
        //
        //   for (var i = 0; i < vm.dialogs.length; i++){
        //     if(vm.dialogs[i].parent) {
        //       for(var j = 0; j < vm.dialogs.length; j++){
        //         if(vm.dialogs[j]._id == vm.dialogs[i].parent){
        //           // console.log('learnDialog_' + (i - 1))
        //           // console.log(String(parseInt(document.getElementById('learnDialog_' + (i - 1)).style.width)*(1/2))+ '%');
        //           document.getElementById('learnDialog_' + vm.dialogs[i]._id).style.width = String(parseInt(document.getElementById('learnDialog_' + vm.dialogs[j]._id).style.width)*(vm.ratio)) + '%'
        //         }
        //       }
        //     }
        //   }
        //
        //
        //   // document.getElementById('learnDialog_' + vm.dialogs[index+1]._id).style.width = String(parseInt(document.getElementById('learnDialog_' + parent._id).style.width)*(vm.ratio)) + '%'
        // });
        // document.getElementById('learnDialog_' + (index+1)).style.width = String(parseInt(document.getElementById('learnDialog_' + parent._id).style.width)*(vm.ratio)) + '%'
        vm.childDialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id});
        // vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
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
