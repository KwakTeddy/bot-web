/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('BotListController', ['$scope', '$stateParams', 'botsResolve', 'BotsService', 'DTOptionsBuilder',
  function ($scope, $stateParams, bots, BotsService, DTOptionsBuilder) {
    var vm = this;
    vm.bots = bots;
    angular.forEach(vm.bots, function (bot) {
      bot.channel = '';
      if(bot.kakao) {
        bot.channel += '카카오톡'
      }
      if(bot.line) {
        if(bot.channel.length > 0) {
          bot.channel += ', ';
        }
        bot.channel += '라인'
      }
      if(bot.facebook) {
        if(bot.channel.length > 0) {
          bot.channel += ', ';
        }
        bot.channel += '페이스북'
      }
    });

    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('bLengthChange', false)
      .withOption('info', false)
      .withOption('dom', 'l<"toolbar">frtip')
      .withOption('initComplete', function(settings, json) {
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
        $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref="bots.create"><i class="fa fa-plus"></i> 신규등록</button>');
      })

  }
]);
