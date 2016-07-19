(function () {
  'use strict';

  // Bot users controller
  angular
    .module('bot-users')
    .controller('BotUsersController', BotUsersController);

  BotUsersController.$inject = ['$scope', '$state', 'Authentication', 'BotUsersService', 'botUserResolve'];

  function BotUsersController ($scope, $state, Authentication, BotUsersService, botUser) {
    var vm = this;

    vm.channels = [
      '카카오톡', '라인', '페이스북'
    ];

    vm.authentication = Authentication;
    vm.botUser = botUser;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if(!vm.botUser.channel) {
      vm.botUser.channel = vm.channels[0];
    }

    // Remove existing Bot user
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.botUser.$remove($state.go('bot-users.list'));
      }
    }

    // Save Bot user
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.botUserForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.botUser._id) {
        vm.botUser.$update(successCallback, errorCallback);
      } else {
        vm.botUser.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = '생성되었습니다 : ' + vm.botUser.name;
        vm.botUser = new BotUsersService();
        // $state.go('bot-users.list', {
        //   botUserId: res._id
        // }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.randomCreate = function () {
      vm.botUser.userKey = randomString(10);
      vm.botUser.channel = vm.channels[Math.floor(Math.random() * vm.channels.length)];
      vm.botUser.name = randomString(Math.floor(Math.random() * 8));
      vm.botUser.phone = '010-' + randomNumber(4) + '-' + randomNumber(4);
      vm.botUser.email = vm.botUser.name + randomEmail();
      vm.botUser.isOn = Math.floor(Math.random() * 2) == 0 ? true : false;
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
