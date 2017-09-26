(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessagesListController', MessagesListController);

  MessagesListController.$inject = ['messagesResolve'];

  function MessagesListController(messages) {
    var vm = this;

    vm.messages = messages;
  }
})();
