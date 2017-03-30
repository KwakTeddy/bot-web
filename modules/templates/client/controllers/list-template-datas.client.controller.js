(function () {
  'use strict';

  angular
    .module('templates')
    .controller('TemplateDatasListController', TemplateDatasListController);

  TemplateDatasListController.$inject = ['$state', '$stateParams', 'templateDatasResolve'];

  function TemplateDatasListController($state, $stateParams, templateDatas) {
    var vm = this;

    vm.templateDatas = templateDatas;
  }
})();
