(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('custom-actions')
    .controller('CustomActionsController', CustomActionsController);

  CustomActionsController.$inject = ['$scope', '$state', 'Authentication', 'customActionResolve'];

  function CustomActionsController($scope, $state, Authentication, customAction) {
    var vm = this;
    vm.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'javascript'
    };


    vm.authentication = Authentication;
    vm.customAction = customAction;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if (!vm.customAction.code) {
      vm.customAction.code = 'function execute(name, params, callback) {\n'
        + '  console.log(\'execute: \' + name);\n'
        + '  // Execute Actions ..\n'
        + '  callback(true);\n'
        + '}\n\n\n\n\n\n';
    }

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.customAction.$remove($state.go('custom-actions.list'));
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customActionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customAction._id) {
        vm.customAction.$update(successCallback, errorCallback);
      } else {
        vm.customAction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('custom-actions.list', {
          customActionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
