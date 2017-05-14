(function () {
  'use strict';

  angular
    .module('entitys')
    .controller('EntitysListController', EntitysListController);

  EntitysListController.$inject = ['entitysResolve','DTOptionsBuilder', '$compile', '$scope', '$rootScope', '$state', 'EntitysService'];

  function EntitysListController(entitys, DTOptionsBuilder, $compile, $scope, $rootScope, $state, EntitysService) {
    var vm = this;

    vm.entitys = entitys;
    // Remove existing Custom action
    vm.remove = function (target) {
      if (confirm('\'' + target.name + '\' ' + '정말 삭제하시겠습니까?')) {
        target.$remove({botName: $rootScope.botId}, function (response) {
          EntitysService.query({botName: $rootScope.botId}).$promise.then(function (data) {
            vm.entitys = data;
          }, function (err) {
            console.log(err)
          })
        });
      }
    };

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref="entitys.create"><i class="fa fa-plus"></i> 신규등록</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        })
  }
})();
