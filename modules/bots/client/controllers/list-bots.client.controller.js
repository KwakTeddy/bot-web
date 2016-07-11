/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('BotListController', ['$scope', '$stateParams', 'botsResolve', 'BotsService',
  function ($scope, $stateParams, bots, BotsService) {
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

    // // Find a list of Bots
    // vm.find = function () {
    //   vm.bots = BotsService.query();
    // };
    //
    // // Find existing Bot
    // vm.findOne = function () {
    //   vm.bot = BotsService.get({
    //     botId: $stateParams.botId
    //   });
    // };
  }
]);
