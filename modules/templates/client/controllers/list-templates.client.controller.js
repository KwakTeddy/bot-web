(function () {
  'use strict';

  angular
    .module('templates')
    .controller('TemplatesListController', TemplatesListController);

  TemplatesListController.$inject = ['templatesResolve','DTOptionsBuilder', '$compile', '$scope'];

  function TemplatesListController(templates, DTOptionsBuilder, $compile, $scope) {
    var vm = this;

    vm.templates = templates;

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref="templates.create"><i class="fa fa-plus"></i> 신규등록</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        })
  }
})();
