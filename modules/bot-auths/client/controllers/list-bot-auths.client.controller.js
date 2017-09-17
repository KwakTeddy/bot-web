(function () {
  'use strict';

  angular
    .module('bot-auths')
    .controller('BotAuthsListController', BotAuthsListController);

  BotAuthsListController.$inject = ['BotAuthsService', 'DTOptionsBuilder', '$compile', '$scope', '$cookies', "$timeout", "$stateParams"];

  function BotAuthsListController(BotAuthsService, DTOptionsBuilder, $compile, $scope, $cookies, $timeout, $stateParams) {
    $timeout(function () {
      document.getElementById('sidebar-left').style.display = 'none';
      document.getElementById('chat-include').style.display = 'none';
      document.getElementById('log-button').style.display = 'none';
      document.getElementById('intent-button').style.display = 'none';
      document.getElementById('main').classList.remove('content-body');
    });
    var vm = this;
    vm.botAuths = BotAuthsService.query({botId: $cookies.get('authManageId')}); //봇 선택 화면에서 권한 설정 선택한 봇의 id
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
