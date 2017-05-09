(function () {
  'use strict';

  angular
    .module('dialogsets')
    .controller('DialogsetsListController', DialogsetsListController);

  DialogsetsListController.$inject = ['dialogsetsResolve', '$stateParams','DTOptionsBuilder', '$compile', '$scope'];

  function DialogsetsListController(dialogsets, $stateParams, DTOptionsBuilder, $compile, $scope) {
    var vm = this;
    console.log($stateParams);
    vm.listType = $stateParams.listType;
    if($stateParams.listType == 'public'){

    }

    vm.dialogsets = dialogsets;

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref="dialogsets.create"><i class="fa fa-plus"></i> 신규등록</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        })

  }
})();
