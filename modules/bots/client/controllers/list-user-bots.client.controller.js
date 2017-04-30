/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// UserBots controller
angular.module('user-bots').controller('UserBotListController', ['$scope', '$rootScope', '$stateParams', '$state', 'userBotsResolve',
  'UserBotsService', 'UserBotsFollowService', '$http', 'Authentication', '$ionicModal',
  function ($scope, $rootScope, $stateParams, $state, userBots, UserBotsService, UserBotsFollowService, $http, Authentication, $ionicModal) {
    var vm = this;
    vm.authentication = Authentication;
    console.log(userBots);
    vm.userBots = userBots;
    if(_platform == 'mobile') {
        if($stateParams['listType'] == 'recent') vm.listTypeName = '최신봇';
        else if($stateParams['listType'] == 'followed') vm.listTypeName = '친구봇';
        else if($stateParams['listType'] == 'my') vm.listTypeName = '마이봇';
        else vm.listTypeName = '인기봇';
    }

    vm.listType = $stateParams['listType'];
    // if(vm.listType == undefined) vm.listType = 'recent';
    vm.currentPage = 1;
    vm.perPage = 10;
    vm.paging = function (find) {
      if(find){
        vm.userBots = [];
        vm.currentPage = 0;
        console.log('find');
      }
      vm.currentPageCopy = angular.copy(vm.currentPage);
      vm.currentPage = vm.currentPage + 1;
      var url = '';
      if(vm.listType == 'followed') {
        url = '/api/bots/follow';
      }else {
        url = '/api/bots/list';
      }
      $http.post(url, {currentPage : vm.currentPageCopy, perPage : vm.perPage, listType : vm.listType, botUserId : vm.authentication.user._id, query : vm.query}).success(function (response) {
          if(response.length < 10) {
            vm.userBots.push.apply(vm.userBots, response);
            vm.pagingEnd = true;
          } else {
            vm.userBots.push.apply(vm.userBots, response);
          }
      }).error(function (response) {
        console.log(response);
      })
    };


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
      var url = '';
      if(vm.listType == 'followed') {
          url = '/api/bots/follow';
      }else {
          url = '/api/bots/list';
      }
      $state.go('user-bots-web.list', {query: vm.query, listType: vm.listType});
    };

    // angular.forEach(vm.userBots, function (userBot) {
    //   userBot.channel = '';
    //   if(userBot.kakao) {
    //     userBot.channel += '카카오톡'
    //   }
    //   if(userBot.line) {
    //     if(userBot.channel.length > 0) {
    //       userBot.channel += ', ';
    //     }
    //     userBot.channel += '라인'
    //   }
    //   if(userBot.facebook) {
    //     if(userBot.channel.length > 0) {
    //       userBot.channel += ', ';
    //     }
    //     userBot.channel += '페이스북'
    //   }
    // });
  }
]);
