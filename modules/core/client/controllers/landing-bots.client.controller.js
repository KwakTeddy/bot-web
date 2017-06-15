'use strict';

angular.module('core').controller('LandingBotsController', ['$scope', '$state', 'Authentication', 'Menus', '$cookies', '$http', '$rootScope', 'Socket', '$location', '$window',
  'BotsService', '$timeout', '$uibModal', 'FileUploader',
  function ($scope, $state, Authentication, Menus, $cookies, $http, $rootScope, Socket, $location, $window, BotsService, $timeout, $uibModal, FileUploader) {
  var vm = this;
  document.getElementById('sidebar-left').style.display = 'none';
  document.getElementById('chat-include').style.display = 'none';
  document.getElementById('main').classList.remove('content-body');
  $scope.myBot = '';
  $scope.copyTargetBot = {};
  $scope.deleteInput = '';
  BotsService.query({my: 1, developer: true}).$promise.then(function (result) {
    $scope.myBot = result;
  }, function (err) {
    console.log(err)
  });
  $scope.newBot =  new BotsService();

  $scope.openCreateModal = function (bot) {
    $scope.modalMode = 'create';
    $scope.bot = bot;
    $scope.checkNew = null;
    if(bot == 'new') $scope.checkNew = true;
    else {
      $scope.checkNew = false;
    }

    $scope.modalInstance = $uibModal.open({
      templateUrl: 'modules/core/client/views/modal-bots.client.html',
      scope: $scope
    });
    $scope.closeModal = function () {
      $scope.newBot =  new BotsService();
      $scope.modalInstance.dismiss();
    };
    $scope.createBotModal = function (isValid) {
      $scope.createBot(isValid)
      $scope.modalInstance.dismiss();
    };
    $scope.modalInstance.result.then(function (response) {
      console.log(response);
    })
  };

  $scope.openCopyModal = function (bot) {
    $scope.copyTargetBot['name'] = bot.name + ' 복제봇;';
    $scope.copyTargetBot['description'] = bot.description;
    $scope.copyTargetBot.name = bot.name + ' 복제봇;'
    $scope.modalMode = 'copy';
    $scope.copyModalInstance = $uibModal.open({
      templateUrl: 'modules/core/client/views/modal-bots.client.html',
      scope: $scope
    });
    $scope.closeModal = function () {
      $scope.copyModalInstance.dismiss();
    };
    $scope.copyBotModal = function () {
      $scope.copyBot(bot);
      $scope.copyModalInstance.dismiss();
    };
    $scope.copyModalInstance.result.then(function (response) {
      console.log(response);
    })
  };

  $scope.openDeleteModal = function (bot) {
    $scope.deleteBtnActivation = null;
    $scope.modalMode = 'delete';
    $scope.deleteModalInstance = $uibModal.open({
      templateUrl: 'modules/core/client/views/modal-bots.client.html',
      scope: $scope
    });
    $scope.closeModal = function () {
      $scope.deleteModalInstance.dismiss();
    };
    $scope.deleteBotModal = function () {
      $scope.deleteBot(bot)
      $scope.deleteModalInstance.dismiss();
    };
    $scope.deleteModalInstance.result.then(function (response) {
      console.log(response);
    })
  };

  $scope.createBot = function (isValid) {
    $scope.error = null;
    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'botForm');
      return false;
    }

    // default settings
    $scope.newBot.isMakeFile = true;
    $scope.newBot.using = true;

    if ($scope.selectedTemplate) {
      var errors = editor.validate();
      if (errors.length) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }
      $scope.newBot.template = $scope.selectedTemplate;
      $scope.newBot.template.templateData = editor.getValue();
    }
    console.log($scope.newBot);

    $scope.newBot.$save(function (response) {
      $cookies.put('default_bot', response.id);
      $cookies.put('botObjectId', response._id);
      $state.go('dialogsets.dialogsLearn');
      $timeout(function () {
        $window.location.reload();
      }, 100)
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  // Update existing Bot
  $scope.updateBot = function (isValid) {
    $scope.error = null;
    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'botForm');
      return false;
    }

    if ($scope.selectedTemplate) {
      var errors = editor.validate();
      if (errors.length) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }
      $scope.bot.template = $scope.selectedTemplate;
      $scope.bot.template.templateData = editor.getValue();
    } else {
      $scope.bot.template = null;
    }

    if($scope.bot && $scope.bot._id) {
      $scope.bot.$update(function () {
        $scope.modalInstance.dismiss();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }
  };
    
  $scope.selectBot = function (bot) {
    $cookies.put('default_bot', bot.id);
    $cookies.put('botObjectId', bot._id);
    $state.go('dialogsets.dialogsLearn');
    $timeout(function () {
      $window.location.reload();
    }, 100)
  };

  $scope.deleteBot = function (bot) {
    if (bot && bot._id) {
      bot.$remove(function () {
        BotsService.query({my: 1, developer: true}).$promise.then(function (result) {
          $scope.myBot = result;
        }, function (err) {
          console.log(err)
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }
  };

  $scope.copyBot = function (bot) {
    console.log(bot);
  }

    /********************* image *********************/
    $scope.imageURL = undefined;
    $scope.error = {};
    $scope.success = {};

    // Create file imageUploader instance
    $scope.imageUploader = new FileUploader({
      url: '/api/user-bots/image-files',
      alias: 'uploadImageFile',
      autoUpload: true
    });

    $scope.imageUploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1){
          $scope.success.image = null;
          $scope.error['image'] = '이미지 파일이 아니에요'
        }else {
          $scope.error.image = null;
        }
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.imageUploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success['image'] = true;

      $scope.newBot.imageFile = '/files/' + response.filename;
      $scope.bot.imageFile = '/files/' + response.filename;
      // Clear upload buttons
      $scope.cancelImageUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.imageUploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelImageUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadImageFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.imageUploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelImageUpload = function () {
      $scope.imageUploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };

}
]);
