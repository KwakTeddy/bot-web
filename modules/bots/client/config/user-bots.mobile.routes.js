(function () {
  'use strict';

  angular
    .module('user-bots')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('user-bots', {
        abstract: true,
        url: '/'
      })
      .state('user-bots.list', {
        url: '?listType&botUserId',
        views: {
          'menuContent@': {
            templateUrl: 'modules/bots/client/views/list-user-bots.mobile.view.html',
            controllerAs: 'vm',
            controller: 'UserBotListController',
            resolve: {
              userBotsResolve: getUserBots
            }
          }
        }
      })
      .state('user-bots.chat', {
        url: '/chat/:userBotId',
        views: {
          'menuContent@': {
            templateUrl: 'modules/bots/client/views/chat-user-bot.mobile.view.html',
            controllerAs: 'vm',
            controller: 'UserBotChatController'
            // resolve: {
            //   userBotResolve: getUserBot
            // }
          }
        }
      });
  }
})();

getUserBots.$inject = ['UserBotsService', 'UserBotsFollowService', '$stateParams'];
function getUserBots(UserBotsService, UserBotsFollowService, $stateParams) {
  if($stateParams['listType']) {
    if($stateParams['listType'] == 'popular') return UserBotsService.query({sort: '-followed'}).$promise;
    else if($stateParams['listType'] == 'followed') return UserBotsFollowService.list({botUserId: $stateParams['botUserId']}).$promise;
    else if($stateParams['listType'] == 'my') return UserBotsService.query({my: '1'}).$promise;
    else return UserBotsService.query().$promise;
  } else {
    return UserBotsService.query().$promise;
  }
}

getUserBot.$inject = ['UserBotsService', '$stateParams'];
function getUserBot(UserBotsService, $stateParams) {
  return UserBotsService.get({
    userBotId: $stateParams.userBotId
  }).$promise;
}

newUserBot.$inject = ['UserBotsService'];
function newUserBot(UserBotsService) {
  return new UserBotsService();
}
