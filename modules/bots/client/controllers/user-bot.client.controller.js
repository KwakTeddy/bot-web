'use strict';

// UserBots controller
angular.module('user-bots').controller('UserBotController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams',
  'Authentication', 'userBotResolve', 'FileUploader', 'UserBotsService', 'UserBotCommentService', 'UserBotDialogService', 'UserBotsFollowService',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, Authentication, userBot, FileUploader, UserBotsService, UserBotCommentService, UserBotDialogService, UserBotsFollowService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userBot = userBot;
    vm.userBot.public = true;
    vm.userId = $rootScope.userId;

    vm.userBot.userFollow = UserBotsFollowService.list({userBot: vm.userBot, botUserId: vm.userId}, function(res) {
      if(res.length > 0) vm.userBot.userFollow = true;
      else vm.userBot.userFollow = undefined;
      // console.log(res);
    });

    // UserBotsFollowService.get()
    // if(vm.userBot && vm.userBot._id)
    //   $rootScope.$broadcast('setUserBot', vm.userBot);

    vm.type = '';
    if($state.is('user-bots-web.create')) {vm.state = 'create'; vm.type = 'edit';}
    else if($state.is('user-bots-web.edit')) {vm.state = 'edit'; vm.type = 'edit';}
    else if($state.is('user-bots-web.view')) {vm.state = 'view'; vm.type = 'view';}

    vm.changeType = function(type) {
      vm.type= type;
    };

    vm.followBot = function(userBot) {
      console.log($rootScope);
      UserBotsFollowService.follow({botUserId: vm.user._id, userBot: userBot._id}, function(err, result) {
        vm.userBot.userFollow = true;
        // alert('친구로 추가 되었습니다.')
      });
    };

    vm.unfollowBot = function(userBot) {
      UserBotsFollowService.unfollow({botUserId: vm.user._id, userBot: userBot._id}, function(err, result) {
        vm.userBot.userFollow = undefined;
        // alert('친구를 취소하였습니다.')
      });
    };

    vm.userBotChat = function(userBot) {
      // $scope.$emit('setUserBot', userBot);
      console.log('vm.userBotChat');
      $rootScope.$broadcast('setUserBot', userBot);
    };

    // Create new UserBot
    vm.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userBotForm');
        return false;
      }

      vm.userBot.$save(function (response) {
        if($state.is('user-bots-web.create') || $state.is('user-bots-web.edit')) {
          $rootScope.$broadcast('setUserBot', vm.userBot);

          vm.type = 'connect';
          // $state.go('user-bots-web.list', {'#': 'myBots'});
        } else {
          vm.type = 'conenct';
          // $state.go('user-bots.list');
        }
        // $location.path('userBots/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing UserBot
    vm.remove = function () {
      if (vm.userBot && vm.userBot._id) {
        vm.userBot.$remove(function () {
          $state.go('user-bots.list');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Update existing UserBot
    vm.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userBotForm');
        return false;
      }

      if(vm.userBot && vm.userBot._id) {
        vm.userBot.$update(function () {
          $state.go('user-bots.list');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    /********************* dialog *********************/
    vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
    vm.dialogs = UserBotDialogService.query({userBotId: vm.userBot._id});

    vm.createDialog = function() {
      vm.dialog.$save(function (response) {
        vm.dialogs.push(response);

        vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
      })
    };

    vm.updateDialog = function (dialog) {
      dialog.userBotId = vm.userBot._id;
      dialog.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeDialog = function(dialog) {
      dialog.userBotId = vm.userBot._id;
      dialog.$remove(function(response) {
        console.log(response);
        dialog.deleted = 'true';
      });
    };

    /********************* dialog *********************/
    vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
    vm.comments = UserBotCommentService.query({userBotId: vm.userBot._id});

    vm.createComment = function() {
      vm.comment.$save(function (response) {
        vm.comments.push(response);

        vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
      })
    };

    vm.updateComment = function (comment) {
      comment.userBotId = vm.userBot._id;
      comment.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeComment = function(comment) {
      comment.userBotId = vm.userBot._id;
      comment.$remove(function(response) {
        console.log(response);
        comment.deleted = 'true';
      });
    };

    // // Find a list of UserBots
    // $scope.find = function () {
    //   vm.userBots = UserBotsService.query();
    // };
    //
    // // Find existing UserBot
    // $scope.findOne = function () {
    //   vm.userBot = UserBotsService.get({
    //     userBotId: $stateParams.userBotId
    //   });
    // };


    /********************* image *********************/
    $scope.imageURL = undefined;

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
      $scope.success = true;

      vm.userBot.imageFile = '/files/' + response.filename;
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



    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: '/api/user-bots/dataset-files',
      alias: 'uploadFile',
      autoUpload: true
    });

    $scope.uploader.filters.push({
      name: 'fileFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|txt|csv|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
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

    // var User = $resource('/user/:userId', {userId:'@id'});

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      vm.userBot.dialogFile = response.filename;

      // var Convert = $resource('/api/user-bots/convert', null, {});
      // var _convert = new Convert({filename: response.filename});
      // _convert.$save(function() {
      //   $scope.successConvert = true;
      // });

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

  }
]);

