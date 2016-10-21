(function () {
  'use strict';

  // Bot users controller
  angular
    .module('bot-users')
    .controller('UserDialogsController', UserDialogsController);

  UserDialogsController.$inject = ['$scope', '$state', 'Authentication', 'UserDialogsService', 'userDialogResolve'];

  function UserDialogsController ($scope, $state, Authentication, UserDialogsService, userDialog) {
    var vm = this;

    vm.channels = [
      '카카오톡', '라인', '페이스북'
    ];

    vm.authentication = Authentication;
    vm.userDialog = userDialog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if(!vm.userDialog.channel) {
      vm.userDialog.channel = vm.channels[0];
    }

    // Remove existing Bot user
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.userDialog.$remove($state.go('bot-users.list'));
      }
    }

    // Save Bot user
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userDialogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userDialog._id) {
        vm.userDialog.$update(successCallback, errorCallback);
      } else {
        vm.userDialog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = '생성되었습니다 : ' + vm.userDialog.name;
        vm.userDialog = new UserDialogsService();
        // $state.go('bot-users.list', {
        //   userDialogId: res._id
        // }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.randomCreate = function () {
      vm.userDialog.userKey = randomString(10);
      vm.userDialog.channel = vm.channels[Math.floor(Math.random() * vm.channels.length)];
      vm.userDialog.name = randomString(Math.floor(Math.random() * 4) + 4);
      vm.userDialog.phone = '010-' + randomNumber(4) + '-' + randomNumber(4);
      vm.userDialog.email = vm.userDialog.name + randomEmail();
      vm.userDialog.isOn = Math.floor(Math.random() * 2) == 0 ? true : false;
    };

    var randomString = function(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };
    var randomNumber = function(length) {
      var text = "";
      var possible = "0123456789";
      for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };
    var randomEmail = function() {
      var emails = ['@gmail.com', '@moneybrain.com', '@finger.co.kr', '@naver.com'];
      return emails[Math.floor(Math.random() * emails.length)];
    }
  }
})();
