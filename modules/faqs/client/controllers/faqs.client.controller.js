(function () {
  'use strict';

  // Faqs controller
  angular
    .module('faqs')
    .controller('FaqsController', FaqsController);

  FaqsController.$inject = ['$scope', '$state', 'Authentication', 'faqResolve'];

  function FaqsController ($scope, $state, Authentication, faq) {
    var vm = this;

    vm.authentication = Authentication;
    vm.faq = faq;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.faq.bankCode = '11';

    // Remove existing Faq
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.faq.$remove($state.go('faqs.list'));
      }
    }

    // Save Faq
    function save(isValid, nextId) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.faqForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.faq._id) {
        vm.faq.$update(successCallback, errorCallback);
      } else {
        vm.faq.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log(nextId);
        if(nextId) {
          $state.go('faqs.edit', {
             faqId: nextId
          });
        } else {
          $state.go('faqs.create', {

          }, {reload: true});
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
