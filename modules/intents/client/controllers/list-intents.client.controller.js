(function () {
  'use strict';

  angular
    .module('intents')
    .controller('IntentsListController', IntentsListController);

  IntentsListController.$inject = ['intentsResolve', '$cookies', '$http','DTOptionsBuilder', '$compile', '$scope'];

  function IntentsListController(intents, $cookies, $http, DTOptionsBuilder, $compile, $scope) {
    var vm = this;

    vm.intents = intents;
    vm.bot = '';

    $http.get('/api/bots/byNameId/' + $cookies.get('default_bot')).then(function (result) {
      console.log(result.data);
      vm.bot = result.data;
    }, function (err) {
      console.log(err);
    });

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref="intents.create"><i class="fa fa-plus"></i> 신규등록</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        })
  }
})();
