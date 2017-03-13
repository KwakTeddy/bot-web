'use strict';

// Setting up route
angular.module('user-bots').config(['$stateProvider',
  function ($stateProvider) {
    // UserBots state routing
    $stateProvider
      .state('user-bots-web', {
        abstract: true,
        url: '/userbot',
        template: '<ui-view/>'
      })
      .state('user-bots-home', {
        url: '/userbot/home',
        templateUrl: 'modules/core/client/views/user.client.view.html',
        controller: 'UserBotListController',
        controllerAs: 'vm',
        resolve: {
          userBotsResolve: getUserBotsWeb
        }
      })
      .state('user-bots-web.list', {
        url: '?listType&query',
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
          userBotResolve: newUserBot
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
          userBotResolve: getUserBot
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('user-bots-web.view', {
        url: '/:userBotId/view',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBot
        },
        data: {
          roles: ['guest','user', 'admin']
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
      .state('user-bots-web.authentication', {
          abstract: true,
          url: '/authentication',
          templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
          controller: 'AuthenticationController'
      })
      .state('user-bots-web.authentication.signup', {
          url: '/signup',
          templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('user-bots-web.authentication.signin', {
          url: '/signin?err',
          templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
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

getUserBotFiles.$inject = ['UserBotFilesService', '$stateParams'];
function getUserBotFiles(UserBotFilesService, $stateParams) {
  return UserBotFilesService.query({
    userBotId: $stateParams.userBotId
  }).$promise;
}
readUserBotFile.$inject = ['UserBotFilesService', '$stateParams'];
function readUserBotFile(UserBotFilesService, $stateParams) {
  return UserBotFilesService.get({
    userBotId: $stateParams.userBotId,
    fileId: $stateParams.fileId
  }).$promise;
}
