/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// UserBots controller
angular.module('user-bots').controller('UserBotListController', ['$scope', '$rootScope', '$stateParams', '$state', 'userBotsResolve',
  'UserBotsService', 'UserBotsFollowService',
  function ($scope, $rootScope, $stateParams, $state, userBots, UserBotsService, UserBotsFollowService) {
    var vm = this;
    vm.userBots = userBots;

    // if(_platform == 'mobile') {
    //   if($stateParams['listType'] == 'popular') vm.listTypeName = '최신봇';
    //   else if($stateParams['listType'] == 'followed') vm.listTypeName = '친구봇';
    //   else if($stateParams['listType'] == 'my') vm.listTypeName = '마이봇';
    //   else vm.listTypeName = '인기봇';
    // }

    vm.listType = $stateParams['listType'];
    // if(vm.listType == undefined) vm.listType = 'recent';

    vm.followBot = function(userBot) {
      UserBotsFollowService.follow({botUserId: vm.userId, userBot: userBot._id}, function(err, result) {
      });
    };

    vm.unfollowBot = function(userBot) {
      UserBotsFollowService.unfollow({botUserId: vm.userId, userBot: userBot._id}, function(err, result) {
      });
    };

    vm.userBotChat = function(userBot) {
      // $scope.$emit('setUserBot', userBot);
      console.log('vm.userBotChat');
      $rootScope.$broadcast('setUserBot', userBot);
    };

    vm.goFind = function() {
      $state.go('user-bots-web.list', {query: vm.query, listType: ''});
    };

    angular.forEach(vm.userBots, function (userBot) {
      userBot.channel = '';
      if(userBot.kakao) {
        userBot.channel += '카카오톡'
      }
      if(userBot.line) {
        if(userBot.channel.length > 0) {
          userBot.channel += ', ';
        }
        userBot.channel += '라인'
      }
      if(userBot.facebook) {
        if(userBot.channel.length > 0) {
          userBot.channel += ', ';
        }
        userBot.channel += '페이스북'
      }
    });
  }
]);
