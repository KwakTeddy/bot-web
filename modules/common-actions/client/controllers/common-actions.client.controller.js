(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('common-actions')
    .controller('CommonActionsController', CommonActionsController);

  CommonActionsController.$inject = ['$scope', '$state', 'Authentication', 'commonActionResolve'];

  function CommonActionsController ($scope, $state, Authentication, commonAction) {
    var vm = this;
    vm.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'javascript'
    };

    vm.actionTypes = [
      'REST', 'DB'
    ];
    vm.restMethods = [
      'GET', 'POST', 'PUT', 'DELETE'
    ];
    vm.dbMethods = [
      'find', 'findOne', 'findById'
    ];


    vm.authentication = Authentication;
    vm.commonAction = commonAction;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if(!vm.commonAction.type) {
      vm.commonAction.type = vm.actionTypes[0];
    }

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.commonAction.$remove($state.go('common-actions.list'));
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commonActionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.commonAction._id) {
        vm.commonAction.$update(successCallback, errorCallback);
      } else {
        vm.commonAction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('common-actions.list', {
          commonActionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
