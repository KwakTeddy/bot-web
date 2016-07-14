(function () {
  'use strict';

  // Bot users controller
  angular
    .module('bot-users')
    .controller('BotUsersController', BotUsersController);

  BotUsersController.$inject = ['$scope', '$state', 'Authentication', 'botUserResolve'];

  function BotUsersController ($scope, $state, Authentication, botUser) {
    var vm = this;

    vm.authentication = Authentication;
    vm.botUser = botUser;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
        $state.go('bot-users.view', {
          botUserId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
