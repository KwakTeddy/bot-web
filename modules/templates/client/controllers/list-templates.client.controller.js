(function () {
  'use strict';

  angular
    .module('templates')
    .controller('TemplatesListController', TemplatesListController);

  TemplatesListController.$inject = ['templatesResolve'];

  function TemplatesListController(templates) {
    var vm = this;

    vm.templates = templates;
  }
})();
