'use strict';

// Setting up route
angular.module('user-bots').config(['$stateProvider',
  function ($stateProvider) {
    // UserBots state routing
    $stateProvider
      .state('user-bots-web', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/user.client.view.html',
        controller: 'UserBotListController',
        controllerAs: 'vm',
        resolve: {
          userBotsResolve: getUserBotsWeb
        }
      })
      .state('user-bots-web.list', {
        url: '/list?listType&query',
        templateUrl: 'modules/bots/client/views/list-user-bot-web.client.view.html',
        controller: 'UserBotListController',
        controllerAs: 'vm',
        resolve: {
          userBotsResolve: getUserBotsWeb
        }
      })
      .state('user-bots-web.create', {
        url: '/create',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: newUserBotWeb
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('user-bots-web.edit', {
        url: '/:userBotId/edit',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBotWeb
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('user-bots-web.view', {
        url: '/:userBotId/view?authKey',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBotWeb
        }
      })
      .state('user-bots-web.settings', {
          abstract: true,
          url: '/settings',
          templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
          data: {
              roles: ['user', 'admin']
          }
      })
      .state('user-bots-web.settings.profile', {
          url: '/profile',
          templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('user-bots-web.settings.password', {
          url: '/password',
          templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('user-bots-web.settings.accounts', {
          url: '/accounts',
          templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('user-bots-web.settings.picture', {
          url: '/picture',
          templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      // .state('user-bots-web.authentication', {
      //     abstract: true,
      //     url: '/authentication',
      //     templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
      //     controller: 'AuthenticationController'
      // })
      // .state('user-bots-web.authentication.signup', {
      //     url: '/signup',
      //     templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      // })
      // .state('user-bots-web.authentication.signin', {
      //     url: '/signin?err',
      //     templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      // })
      .state('user-bots-web.password', {
          abstract: true,
          url: '/password',
          template: '<ui-view/>'
      })
      .state('user-bots-web.password.forgot', {
          url: '/forgot',
          templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('user-bots-web.password.reset', {
          abstract: true,
          url: '/reset',
          template: '<ui-view/>'
      })
      .state('user-bots-web.password.reset.invalid', {
          url: '/invalid',
          templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('user-bots-web.password.reset.success', {
          url: '/success',
          templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html',
      })
      .state('user-bots-web.password.reset.form', {
          url: '/:token',
          templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      })
      .state('user-bots-web.not-found', {
          url: '/not-found',
          templateUrl: 'modules/core/client/views/404.client.view.html',
          data: {
              ignoreState: true
          }
      })
      .state('user-bots-web.bad-request', {
          url: '/bad-request',
          templateUrl: 'modules/core/client/views/400.client.view.html',
          data: {
              ignoreState: true
          }
      })
      .state('user-bots-web.forbidden', {
          url: '/forbidden',
          templateUrl: 'modules/core/client/views/403.client.view.html',
          data: {
              ignoreState: true
          }
      })
      .state('user-bots-web.graph', {
        url: '/:userBotId/graph',
        templateUrl: 'modules/bots/client/views/bot-graph-knowledge.client.view.html',
        controller: 'BotGraphKnowledgeController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBotWeb
        },
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

getUserBotsWeb.$inject = ['UserBotsService', 'UserBotsFollowService', '$stateParams', '$rootScope', 'Authentication'];
function getUserBotsWeb(UserBotsService, UserBotsFollowService, $stateParams, $rootScope, Authentication) {
  if($stateParams['query']) {
    return UserBotsService.query({query: $stateParams['query']}).$promise;
  } else if($stateParams['listType']) {
    if($stateParams['listType'] == 'popular') return UserBotsService.query({sort: '-followed'}).$promise;
    else if($stateParams['listType'] == 'followed') return UserBotsFollowService.list({botUserId: Authentication.user._id}).$promise;
    else if($stateParams['listType'] == 'my') return UserBotsService.query({my: '1', botUserId: Authentication.user._id }).$promise;
    else return UserBotsService.query().$promise;
  } else {
    return UserBotsService.query({sort: '-followed'}).$promise;
    // return UserBotsService.query().$promise;
  }
}

getUserBotWeb.$inject = ['UserBotsService', '$stateParams'];
function getUserBotWeb(UserBotsService, $stateParams) {
  return UserBotsService.get({
    userBotId: $stateParams.userBotId
  }).$promise;
}

newUserBotWeb.$inject = ['UserBotsService'];
function newUserBotWeb(UserBotsService) {
  return new UserBotsService();
}

getUserBotFilesWeb.$inject = ['UserBotFilesService', '$stateParams'];
function getUserBotFilesWeb(UserBotFilesService, $stateParams) {
  return UserBotFilesService.query({
    userBotId: $stateParams.userBotId
  }).$promise;
}
readUserBotFileWeb.$inject = ['UserBotFilesService', '$stateParams'];
function readUserBotFileWeb(UserBotFilesService, $stateParams) {
  return UserBotFilesService.get({
    userBotId: $stateParams.userBotId,
    fileId: $stateParams.fileId
  }).$promise;
}
