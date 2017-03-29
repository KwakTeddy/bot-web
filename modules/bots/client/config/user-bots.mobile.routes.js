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
        url: ''
      })
      .state('homeMobile', {
        url: '/',
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
      .state('user-bots.list', {
        // url: '?listType&botUserId',
        url: '/list?listType&query',
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
            //   userBotResolve: getUserBotWeb
            // }
          }
        }
      })
      .state('authenticationMobile', {
          abstract: true,
          url: '/authentication'
      })
      .state('authenticationMobile.signup', {
          url: '/signup',
          views: {
              'menuContent@': {
                  templateUrl: 'modules/users/client/views/authentication/signup.mobile.client.view.html',
                  controller: 'AuthenticationController'
              }
          }
      })
      .state('authenticationMobile.signin', {
          url: '/signin?err',
          views: {
              'menuContent@': {
                  templateUrl: 'modules/users/client/views/authentication/signin.mobile.client.view.html',
                  controller: 'AuthenticationController'
              }
          }
      })
      .state('mobileSettings', {
          abstract: true,
          url: '/settings',
          data: {
              roles: ['user', 'admin']
          }
      })
        // .state('mobile.settings.profile', {
        //     url: '/profile',
        //     templateUrl: 'modules/users/client/views/settings/edit-profile.mobile.client.view.html'
        // })
        .state('mobileSettings.password', {
            url: '/password',
            views: {
                'menuContent@': {
                    templateUrl: 'modules/users/client/views/settings/change-password.mobile.client.view.html',
                    controller: 'ChangePasswordController'
                }
            }
        })
        // .state('mobile.settings.accounts', {
        //     url: '/accounts',
        //     templateUrl: 'modules/users/client/views/settings/manage-social-accounts.mobile.client.view.html'
        // })
        // .state('mobile.settings.picture', {
        //     url: '/picture',
        //     templateUrl: 'modules/users/client/views/settings/change-profile-picture.mobile.client.view.html'
        // })
        .state('mobilePassword', {
            abstract: true,
            url: '/password'
        })
        .state('mobilePassword.forgot', {
            url: '/forgot',
            views: {
                'menuContent@': {
                    templateUrl: 'modules/users/client/views/password/forgot-password.mobile.client.view.html',
                    controller: 'PasswordController'
                }
            }
        })
        .state('mobilePassword.reset', {
            abstract: true,
            url: '/reset'
        })
        // .state('mobilePassword.reset.invalid', {
        //     url: '/invalid',
        //     templateUrl: 'modules/users/client/views/password/reset-password-invalid.mobile.client.view.html'
        // })
        // .state('mobilePassword.reset.success', {
        //     url: '/success',
        //     templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
        // })
        .state('mobilePassword.reset.form', {
            url: '/:token',
            views: {
                'menuContent@': {
                    templateUrl: 'modules/users/client/views/password/reset-password.mobile.client.view.html',
                    controller: 'PasswordController'
                }
            }
        });
  }
})();

getUserBots.$inject = ['UserBotsService', 'UserBotsFollowService', '$stateParams', 'Authentication', '$rootScope'];
function getUserBots(UserBotsService, UserBotsFollowService, $stateParams, Authentication, $rootScope) {
  if($stateParams['listType']) {
    if($stateParams['listType'] == 'popular') return UserBotsService.query({sort: '-followed'}).$promise;
    else if($stateParams['listType'] == 'followed'){
        if (!Authentication.user){
            return $rootScope.showSigninModal();
        }
        return UserBotsFollowService.list({botUserId: $stateParams['botUserId']}).$promise;
    } else if($stateParams['listType'] == 'my'){
        if (!Authentication.user){
            return $rootScope.showSigninModal();
        }
        return UserBotsService.query({my: '1'}).$promise;
    } else return UserBotsService.query().$promise;
  } else {
    return UserBotsService.query({sort: '-followed'}).$promise;
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
