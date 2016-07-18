(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessageSendController', MessageSendController);

  MessageSendController.$inject = ['$state', '$stateParams'];

  function MessageSendController($state, $stateParams) {
    var vm = this;

    vm.users = [];
    if($stateParams.userKey) {
      vm.users.push({userKey: $stateParams.userKey, channel: $stateParams.channel});
    }
    vm.text = $stateParams.text;
    vm.image = $stateParams.image;
    vm.linkMessage  = $stateParams.linkMessage;
    vm.linkAddress = $stateParams.linkAddress;


    vm.botUsers = [{userKey: 'asdf', channel: 'kakao'}, {userKey: 'asdf', channel: 'kakao'}, {userKey: 'asdf', channel: 'kakao'}];

  }
})();
