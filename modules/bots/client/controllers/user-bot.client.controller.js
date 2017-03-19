'use strict';

// UserBots controller
angular.module('user-bots').controller('UserBotController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams',
  'Authentication', 'userBotResolve', 'FileUploader', 'UserBotsService', 'UserBotCommentService', 'UserBotDialogService', 'UserBotsFollowService', '$http', '$uibModal',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, Authentication, userBot, FileUploader, UserBotsService, UserBotCommentService, UserBotDialogService, UserBotsFollowService, $http, $uibModal) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userBot = userBot;
    vm.userBot.public = true;
    vm.userId = $rootScope.userId;

    vm.isLearnable = (vm.userBot.learn || vm.user === vm.userBot.user);

    vm.userBot.userFollow = UserBotsFollowService.list({userBot: vm.userBot, botUserId: vm.user._id}, function(res) {
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

    vm.fbShare = function () {
      console.log(vm.userBot);
      $scope.location = location.href;
      FB.ui({
          method: 'share',
          display: 'popup',
          href: $scope.location,
          title: vm.userBot.name,
          description: vm.userBot.description,
          image: location.protocol+'//'+location.hostname+'/'+vm.userBot.imageFile,
          picture: location.protocol+'//'+location.hostname+'/'+ vm.userBot.imageFile,
      }, function(response){
        console.log(response);
      });
    };

    // Create new UserBot
    vm.create = function (isValid) {
      $scope.error = null;
      $scope.submitted = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userBotForm');
        return false;
      }
      vm.learning = true;
      if(!vm.userBot.imageFile){
        vm.userBot.imageFile = "/files/default.png"
      }
      vm.type = 'connect';
      vm.userBot.$save(function (response) {
        vm.learning = false;
        $scope.close = function () {
          modalInstance.dismiss();
        };
        var modalInstance = $uibModal.open({
            templateUrl: 'modules/bots/client/views/modal-user-bots.client.learning.html',
            scope: $scope
        });
        modalInstance.result.then(function (response) {
            console.log(response);
        });

        if($state.is('user-bots-web.create') || $state.is('user-bots-web.edit')) {
          $rootScope.$broadcast('setUserBot', vm.userBot);

          // vm.type = 'connect';
          // $state.go('user-bots-web.list', {'#': 'myBots'});
        } else {
          // vm.type = 'conenct';
          // $state.go('user-bots.list');
        }
        // $location.path('userBots/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing UserBot
    vm.remove = function () {
      var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-user-bots.client.remove.html',
          scope: $scope
      });
      $scope.delete = function () {
        if (vm.userBot && vm.userBot._id) {
            vm.userBot.$remove(function () {
                $state.go('user-bots-web.list', {listType: 'my'});
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
      };
      $scope.close = function () {
          modalInstance.dismiss();
      }
    };

    // Update existing UserBot
    vm.update = function (isValid) {
      console.log(isValid);
      $scope.error = null;
      $scope.submitted = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userBotForm');
        return false;
      }
      console.log(vm.userBot._id);
      if(vm.userBot && vm.userBot._id) {
        vm.userBot.$update(function () {
          $state.go('user-bots-web.list', {listType: 'my'});
        }, function (errorResponse) {
          console.log(errorResponse);
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Connect UserBot Dialogue
    vm.modal = function (channel, method) {
      $scope.channel = channel;
      $scope.method = method;
      $scope.userBotId = vm.userBot.id;

      if ((channel == 'facebook') && (method !== 'easy')){
        FB.api('/me/accounts?fields=picture,name,link,access_token', function(response) {
          console.log(response);
          if (response.error.code == 2500){
            var url = '/api/auth/facebook/page';
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }
            // Effectively call OAuth authentication route:
              console.log(url);
            $window.location.href = url;
          }
          $scope.pageList = [];
          $scope.pageList = response.data;
        });
      }
      $scope.close = function () {
          modalInstance.dismiss();
      };
      $scope.connect = function (page) {
        modalInstance.dismiss();
        console.log(page);
        FB.api('me/subscribed_apps?access_token='+ page, 'post', function (response) {
            console.log(response)
        })
      };
      var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
          scope: $scope
      });
      modalInstance.result.then(function (response) {
        console.log(response);
      })
    };

    /********************* dialog *********************/
    vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
    vm.dialogs = UserBotDialogService.query({botId: vm.userBot.id});

    vm.createDialog = function() {
      vm.dialog.$save(function (response) {
        vm.dialogs.push(response);

        vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
      })
    };

    vm.updateDialog = function (dialog) {
      dialog.userBotId = vm.userBot.id;
      dialog.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeDialog = function(dialog) {
      dialog.userBotId = vm.userBot.id;
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
      // url: '/api/user-bots/dataset-files',
      url: '/api/dialogsets/uploadfile',
      alias: 'uploadFile',
      autoUpload: true
    });

    $scope.uploader.filters.push({
      name: 'fileFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        if('|plain|txt|csv|'.indexOf(type) == -1){
            $scope.success.file = null;
            $scope.error['file'] = '대화 파일이 아니에요'
        }else {
            $scope.error.file = null;
        }
        return '|plain|txt|csv|smi|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
          }, 0);
        };
      }
    };

    // var User = $resource('/user/:userId', {userId:'@id'});

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success['file'] = true;

      // vm.userBot.dialogFile = response.filename;

      vm.userBot.path = response.path;
      vm.userBot.filename = response.filename;
      vm.userBot.originalFilename = response.originalFilename;

      vm.userBot.fileuploaded = true;

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

