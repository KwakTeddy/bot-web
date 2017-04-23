(function () {
  'use strict';

  angular
    .module('entities')
    .controller('EntitiesListController', EntitiesListController);

  EntitiesListController.$inject = ['EntitiesService', 'entityResolve', '$state'];

  function EntitiesListController(EntitiesService, entity, $state) {
    var vm = this;

    vm.entities = EntitiesService.query();
    vm.save = save;
    console.log(entity);
    vm.entity = entity;


    // Save Entity
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
        return false;
      }
      console.log(vm.entity);

      // TODO: move create/update logic to service
      if (vm.entity._id) {
        vm.entity.$update(successCallback, errorCallback);
      } else {
        vm.entity.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log(res);
        vm.entities = EntitiesService.query();
        vm.entity = '';
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
