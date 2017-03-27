(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('templates')
    .controller('TemplateDatasController', TemplateDatasController);

  TemplateDatasController.$inject = ['$scope', '$state', 'Authentication', 'templateDataResolve'];

  function TemplateDatasController($scope, $state, Authentication, templateData) {
    var vm = this;

    vm.authentication = Authentication;
    vm.templateData = templateData;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.templateData.$remove($state.go('template-datas.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.templateDataForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.templateData._id) {
        vm.templateData.$update(successCallback, errorCallback);
      } else {
        vm.templateData.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('template-datas.list', {
          templateDataId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
