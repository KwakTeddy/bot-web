(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dialogsets')
    .controller('DialogsetsController', DialogsetsController);

  DialogsetsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dialogsetResolve', 'FileUploader'];

  function DialogsetsController($scope, $state, $window, Authentication, dialogset, FileUploader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dialogset = dialogset;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.dialogset.$remove($state.go('dialogsets.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dialogsetForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dialogset._id) {
        vm.dialogset.$update(successCallback, errorCallback);
      } else {
        vm.dialogset.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('dialogsets.list', {
          dialogsetId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


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

      vm.dialogset.path = response.path;
      vm.dialogset.filename = response.filename;
      vm.dialogset.originalFilename = response.originalFilename;

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
})();
