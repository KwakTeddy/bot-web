(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessageSendController', MessageSendController);

  MessageSendController.$inject = ['$state', '$stateParams', 'FileUploader', 'botUsersResolve'];

  function MessageSendController($state, $stateParams, FileUploader, botUsers) {
    var vm = this;

    vm.users = [];
    if($stateParams.userKey) {
      vm.users.push({userKey: $stateParams.userKey, channel: $stateParams.channel});
    }
    vm.text = $stateParams.text;
    vm.image = $stateParams.image;
    vm.linkMessage  = $stateParams.linkMessage;
    vm.linkAddress = $stateParams.linkAddress;


    vm.botUsers = botUsers;

    vm.uploader = new FileUploader();
    vm.uploader.onAfterAddingFile = function(fileItem) {
      vm.image = fileItem.file.name;
    };
  }
})();
