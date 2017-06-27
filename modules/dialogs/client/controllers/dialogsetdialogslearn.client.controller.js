(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dialogsets')
    .controller('DialogsetDialogsLearnController', DialogsetDialogsLearnController);

  DialogsetDialogsLearnController.$inject = ['$scope', '$http', '$state', '$stateParams', '$window', 'Authentication', 'UserBotDialogService', 'dialogsResolve', 'botResolve',
    '$cookies', '$timeout', 'DTOptionsBuilder', '$compile', 'dialogsetsResolve', 'DialogsetsService', '$uibModal', 'FileUploader'];

  function DialogsetDialogsLearnController($scope, $http, $state, $stateParams, $window, Authentication, UserBotDialogService, getDialogs, botResolve, $cookies, $timeout,
                                           DTOptionsBuilder, $compile, dialogsetsResolve, DialogsetsService, $uibModal, FileUploader) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bot = botResolve;

    vm.dialogsets = dialogsetsResolve;
    vm.dialogs = getDialogs;
    vm.dialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id, depth: 0});
    vm.childDialog = new UserBotDialogService({user: vm.authentication.user, userBot: vm.bot, botId: vm.bot.id, depth: 0});
    vm.error = null;
    vm.filterDialogs = angular.copy(vm.dialogs);
    vm.hasParentDialogs = [];
    vm.modalMode = '';
    vm.modalType = 'oneByOne';

    if($stateParams.listType && ($stateParams.listType == 'additional')) vm.type = 'additionalDialogset';
    else vm.type = 'defaultDialogset';

    if(vm.dialogsets && vm.dialogsets.length &&vm.bot.dialogsets && vm.bot.dialogsets.length){
      vm.dialogsets.forEach(function (dialogset) {
        vm.bot.dialogsets.forEach(function (connectedDialogset) {
          if(dialogset._id == connectedDialogset._id){
            dialogset['connect'] = true;
          }
        })
      })
    }

    // if(vm.dialogs.length){
    //   for(var i = vm.dialogs.length - 1; i >= 0; i--){
    //     if(vm.dialogs[i].parent){
    //       vm.hasParentDialogs.push(vm.filterDialogs[i]);
    //       vm.dialogs.splice(i, 1)
    //     }
    //   }
    // }
    //
    // if(vm.hasParentDialogs.length){
    //   for (var k = 0; k < vm.hasParentDialogs.length; k++){
    //     for(var j = 0; j < vm.dialogs.length; j++){
    //       if (vm.dialogs[j]._id == vm.hasParentDialogs[k].parent){
    //         vm.dialogs.splice(j+1, 0, vm.hasParentDialogs[k])
    //         break;
    //       }
    //     }
    //   }
    // }


    vm.remove = function () {
      console.log(vm.dialogset)
      if (confirm('Are you sure you want to delete?')) {
        vm.dialogset.$remove(function (result) {
          DialogsetsService.query().$promise.then(function (result) {
            vm.dialogsets = result;
            vm.InfoModalInstance.dismiss();
          }, function (err) {
            console.log(err)
          });        }, function (err) {
          console.log(err)
        });
      }
    };


    // Save Custom action
    vm.save =function save(isValid) {
      console.log(vm.dialogset)
      if (vm.modalType == 'bulk'){
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.form.dialogsetForm');
          return false;
        }

        // TODO: move create/update logic to service
        function successCallback(res) {
          DialogsetsService.query().$promise.then(function (result) {
            vm.dialogsets = result;
            vm.createModalInstance.dismiss();
          }, function (err) {
            console.log(err)
          });
        }
        function errorCallback(res) {
          vm.error = res.data.message;
        }

        if (vm.dialogset._id) {
          vm.dialogset.$update(successCallback, errorCallback);
        } else {
          vm.dialogset.$save(successCallback, errorCallback);
        }
      }else {
        if (vm.dialogset._id) {
          if (!vm.dialogset.title || !vm.dialogset.content){
            return false;
          }
          vm.dialogset.$update(function (result) {
            DialogsetsService.query().$promise.then(function (result) {
              vm.dialogsets = result;
              vm.InfoModalInstance.dismiss();
            }, function (err) {
              console.log(err)
            });
          }, function (err) {
            console.log(err);
            vm.error = err.data.message
          });
        } else {
          if (!vm.dialogset.title || !vm.dialogset.content){
            return false;
          }
          vm.dialogset['type'] = 'oneByOne';
          console.log(vm.dialogset);
          vm.dialogset.$save(function (result) {
            DialogsetsService.query().$promise.then(function (result) {
              vm.dialogsets = result;
              vm.createModalInstance.dismiss();
            }, function (err) {
              console.log(err)
            });
          }, function (err) {
            console.log(err)
          });
        }
      }
    };



    vm.textareaFocus = function (target, index, focus, input) {
      if(input){
        var textareaTarget = document.querySelector('#' + input);
        if(focus == 'focus'){
          textareaTarget.setAttribute("rows", 14)
        }else {
          textareaTarget.setAttribute("rows", 2)
        }
      }else {
        var textareaTarget = document.querySelector('#textarea_' + target + '_' + index);
        if(focus == 'focus'){
          textareaTarget.setAttribute("rows", 14)
        }else {
          textareaTarget.setAttribute("rows", 2)
        }
      }
    };

    vm.openInfoModal = function (dialogset) {
      vm.modalMode = "info";
      vm.InfoModalInstance = $uibModal.open({
        templateUrl: 'modules/dialogs/client/views/modal-dialogs.html',
        scope: $scope
      });
      vm.temDialogset = dialogset;
      vm.dialogset = angular.copy(dialogset);

      vm.InfoModalInstance.result.then(function (response) {
        console.log(response);
      })
    };

    vm.openCreateModal = function () {
      vm.modalMode = "create";
      vm.createModalInstance = $uibModal.open({
        templateUrl: 'modules/dialogs/client/views/modal-dialogs.html',
        scope: $scope
      });
      vm.dialogset = new DialogsetsService();

      vm.createModalInstance.result.then(function (response) {
        console.log(response);
      })
    };
    vm.closeModal = function (target) {
      vm.createModalInstance.dismiss();
    };

    vm.connectBot = function (dialogset) {
      vm.bot.dialogsets.push(dialogset._id);
      vm.bot.$update(function (response) {
        console.log(response)
        vm.bot=response
        dialogset['connect'] = true
      }, function (err) {
        console.log(err)
      })
    };
    vm.disconnectBot = function (target) {
      vm.bot.dialogsets.splice(vm.bot.dialogsets.indexOf(target._id), 1);
      vm.bot.$update(function (response) {
        console.log(response)
        vm.bot=response
        delete target.connect
      }, function (err) {
        console.log(err)
      })
    };


    vm.changeType = function (type) {
      vm.type = type
    };

    vm.changeModalType = function (type) {
      vm.modalType = type
    };


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

    // vm.deleteChild = function (target) {
    //   for(var i = 0; i < vm.dialogs.length; i++){
    //     if(vm.dialogs[i].parent == target._id){
    //       vm.dialogs[i].deleted = 'true';
    //       vm.deleteChild(vm.dialogs[i])
    //     }
    //   }
    // };

    vm.removeDialog = function(dialog) {
      dialog.userBotId = vm.bot.id;
      dialog.$remove(function(response) {
        console.log(response);
        dialog.deleted = 'true';


        // for(var i = 0; i < vm.dialogs.length; i++){
        //   if(vm.dialogs[i].parent == dialog._id){
        //     vm.dialogs[i].deleted = 'true';
        //   }
        // }

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
    };

    /************** 파일 업로드 ****************/

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: '/api/dialogsets/uploadfile',
      alias: 'uploadFile',
      autoUpload: true
    });

    $scope.uploader.filters.push({
      name: 'fileFilter',
      fn: function (item, options) {
        if(item.name.endsWith('txt') || item.name.endsWith('csv')  || item.name.endsWith('xls')  || item.name.endsWith('xlsx')) {
          return true;
        } else {
          return false;
        }
        // var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        // return '|txt|csv|vnd.ms-excel|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          console.log(fileReaderEvent);
          // $timeout(function () {
          //   $scope.imageURL = fileReaderEvent.target.result;
          // }, 0);
        };
      }
    };

    // var User = $resource('/user/:userId', {userId:'@id'});

    // Show success message
    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      $scope.success = true;

      vm.dialogset.path = response.path;
      vm.dialogset.filename = response.filename;
      vm.dialogset.originalFilename = response.originalFilename;

      vm.dialogset.fileuploaded = true;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadDialogFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };


    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('bLengthChange', false)
      .withOption('info', false)
      .withOption('dom', 'l<"toolbar">frtip')
      .withOption('initComplete', function(settings, json) {
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
        $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ng-click="vm.openCreateModal()"><i class="fa fa-plus"></i> 신규등록</button>');
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
      })

  }
})();
