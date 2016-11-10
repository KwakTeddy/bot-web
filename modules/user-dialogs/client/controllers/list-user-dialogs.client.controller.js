(function () {
  'use strict';

  angular
    .module('user-dialogs')
    .controller('UserDialogsListController', UserDialogsListController);

  UserDialogsListController.$inject = ['userDialogsResolve'];

  function UserDialogsListController(userDialogs) {
    var vm = this;

    vm.userDialogs = userDialogs;

    // addBotBubble('test');
  }
})();

function addBotBubble(msg) {
  var main = document.getElementById('chat_main');
  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'bubble');
  bubble.innerText = msg;
  main.appendChild(bubble);

  main.scrollTop = main.scrollHeight - main.clientHeight;
}
function addUserBubble(msg) {
  var main = document.getElementById('chat_main');
  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'bubble bubble--alt');
  bubble.innerText = msg;
  main.appendChild(bubble);

  document.chatForm.inputbox.value = '';
  main.scrollTop = main.scrollHeight - main.clientHeight;
}
