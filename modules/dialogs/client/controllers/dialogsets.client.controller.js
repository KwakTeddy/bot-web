(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dialogsets')
    .controller('DialogsetsController', DialogsetsController);

  DialogsetsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dialogsetResolve', 'BotsService','FileUploader', '$http', 'DialogsetsService'];

  function DialogsetsController($scope, $state, $window, Authentication, dialogset, BotsService, FileUploader, $http, DialogsetsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dialogset = dialogset;
    vm.dialogsetDialogs = [];
    vm.mybot = '';
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.type = 'oneByOne';

    BotsService.query({my: 1, developer: true, role: Authentication.user.roles}, function (result) {
      vm.mybot = result;
      console.log(vm.mybot)

    }, function (err) {
      console.log(err)
    });


    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.dialogset.$remove(function (result) {
          $state.go('dialogsets.list')
        }, function (err) {
          console.log(err)
        });
      }
    }

    // Save Custom action
    function save(isValid) {
      console.log(vm.dialogset)
      if (vm.type == 'bulk'){
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.form.dialogsetForm');
          return false;
        }

        // TODO: move create/update logic to service
        function successCallback(res) {
          $state.go('dialogsets.dialogsLearn', {listType: "additional"})

          // $state.go('dialogsets.dialogsLearn', {
          //   dialogsetId: res._id
          // }, {reload: true});
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
            // $state.go('dialogsets.dialogsLearn', {
            //   dialogsetId: result._id
            // }, {reload: true});

            $state.go('dialogsets.dialogsLearn', {listType: "additional"})
          }, function (err) {
            console.log(err);
            vm.error = err.data.message
          });
        } else {
          if (!vm.dialogset.title || !vm.dialogset.content){
            return false;
          }
          vm.dialogset['type'] = 'oneByOne';
          vm.dialogset['dialogs'] = vm.dialogsetDialogs;
          vm.dialogset.$save(function (result) {
            $state.go('dialogsets.dialogsLearn', {listType: "additional"})

          }, function (err) {
            console.log(err)
          });
        }
      }
    }

    $scope.topics = ["토픽1","토픽2","토픽3"];

    $scope.toggleSelection = function(topic) {
      var idx = vm.dialogset.topicKeywords.indexOf(topic);

      // Is currently selected
      if (idx > -1) {
        vm.dialogset.topicKeywords.splice(idx, 1);
      }
      // Is newly selected
      else {
        vm.dialogset.topicKeywords.push(topic);
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

    vm.disconnectBot = function (target) {
      target.dialogsets.splice(target.dialogsets.indexOf(vm.dialogset._id), 1);
      $http.put('/api/bots/' + target._id, target).then(function (result) {
        DialogsetsService.get({dialogsetId: vm.dialogset._id}, function (result) {
          vm.dialogset = result;
          BotsService.query({my: 1, developer: true, role: Authentication.user.roles}, function (result) {
            vm.mybot = result;
            vm.selectedBot = '';
          }, function (err) {
            console.log(err)
          });
        }, function (err) {
          console.log(err)
        })
      }, function (err) {
        console.log(err);
      })
    };

    vm.connectBot = function () {
      for(var i = 0; i < vm.selectedBot.dialogsets.length; i++){
        if(vm.selectedBot.dialogsets[i] == vm.dialogset._id){
          vm.selectedBot = '';
          return alert('이미 연결되어 있는 봇입니다')
        }
      }
      vm.selectedBot.dialogsets.push(vm.dialogset);
      vm.selectedBot.$update(function (response) {
        DialogsetsService.get({dialogsetId: vm.dialogset._id}, function (result) {
          vm.dialogset = result;
          BotsService.query({my: 1, developer: true, role: Authentication.user.roles}, function (result) {
            vm.mybot = result;
            vm.selectedBot = '';
          }, function (err) {
            console.log(err)
          });
        }, function (err) {
          console.log(err)
        })
      }, function (err) {
        console.log(err)
      })
    };

    vm.changeType = function (type) {
      vm.type = type;
    };

    vm.createDialog = function () {
      if(vm.dialog.inputRaw && vm.dialog.output){
        vm.dialogsetDialogs.push({inputRaw: vm.dialog.inputRaw, output: vm.dialog.output, depth: 0})
        vm.dialog = '';
      }
    };

    vm.removeDialog = function (target) {
      vm.dialogsetDialogs.splice(vm.dialogsetDialogs.indexOf(target), 1)
    };

    vm.createDepthDialog = function (target, index) {
      vm.childDialog = {parent: target, depth: target.depth + 1};
      vm.dialogsetDialogs.splice(index+1, 0, vm.childDialog)
    };

    vm.keyDown = function (event) {
      if (event.keyCode == 13){ //enter
        vm.createDialog();
        angular.element('#question').focus();
      }
    }

  }
})();
