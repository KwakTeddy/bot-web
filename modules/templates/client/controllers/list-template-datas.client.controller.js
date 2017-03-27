(function () {
  'use strict';

  angular
    .module('templates')
    .controller('TemplateDatasListController', TemplateDatasListController);

  TemplateDatasListController.$inject = ['templateDatasResolve'];

  function TemplateDatasListController(templateDatas) {
    var vm = this;

    vm.templateDatas = templateDatas;
  }
})();
