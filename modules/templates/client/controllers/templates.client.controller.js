(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('templates')
    .controller('TemplatesController', TemplatesController);

  TemplatesController.$inject = ['$scope', '$state', 'Authentication', 'templateResolve'];

  function TemplatesController($scope, $state, Authentication, template) {
    var vm = this;

    vm.authentication = Authentication;
    vm.template = template;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.categorys = [
      '요식업', '숙박여행', '의료건강', '교육', '뷰', '온라인쇼핑', '오픈마켓', '비지니스'
    ];

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.template.$remove($state.go('templates.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.templateForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.template._id) {
        vm.template.$update(successCallback, errorCallback);
      } else {
        vm.template.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('templates.list', {
          templateId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
