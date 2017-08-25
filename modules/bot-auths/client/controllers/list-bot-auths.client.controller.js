(function () {
  'use strict';

  angular
    .module('bot-auths')
    .controller('BotAuthsListController', BotAuthsListController);

  BotAuthsListController.$inject = ['BotAuthsService', 'DTOptionsBuilder', '$compile', '$scope', '$cookies'];

  function BotAuthsListController(BotAuthsService, DTOptionsBuilder, $compile, $scope, $cookies) {
    var vm = this;
    $scope.botId = $cookies.get('botObjectId');

    vm.botAuths = BotAuthsService.query({botId: $cookies.get('botObjectId')});
    console.log(vm.botAuths);

    vm.remove = function (target) {
      if (confirm('\'' + target.name + '\' ' + '정말 삭제하시겠습니까?')) {
        target.$remove({botName: $rootScope.botId}, function (response) {
          BotAuthsService.query({botName: $cookies.get('botId')}).$promise.then(function (data) {
            vm.botAuths = data;
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
        $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref="bot-auths.create"><i class="fa fa-plus"></i> 신규등록</button>');
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
      })
  }
}());
