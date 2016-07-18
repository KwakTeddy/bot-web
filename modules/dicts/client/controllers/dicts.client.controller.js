(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dicts')
    .controller('DictsController', DictsController);

  DictsController.$inject = ['$scope', '$state', 'Authentication', 'dictResolve'];

  function DictsController($scope, $state, Authentication, dict) {
    var vm = this;

    vm.wordClasses = [
      '명사','대명사','수사','동사','형용사','관형사','부사','조사','감탄사'
    ];

    vm.authentication = Authentication;
    vm.dict = dict;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if(!vm.dict.class) {
      vm.dict.class = vm.wordClasses[0];
    }

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.dict.$remove($state.go('dicts.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dictForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dict._id) {
        vm.dict.$update(successCallback, errorCallback);
      } else {
        vm.dict.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('dicts.list', {
          dictId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
