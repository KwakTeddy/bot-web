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

  }
})();
