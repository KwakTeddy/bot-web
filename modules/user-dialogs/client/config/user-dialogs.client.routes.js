(function () {
  'use strict';

  angular
    .module('user-dialogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('user-dialogs', {
        abstract: true,
        url: '/developer/user-dialogs',
        template: '<ui-view/>'
      })
      .state('user-dialogs.list', {
        // url: '',
        url: '/:botId/:userKey',
        templateUrl: 'modules/user-dialogs/client/views/list-user-dialogs.client.view.html',
        controller: 'UserDialogsListController',
        controllerAs: 'vm',
        resolve: {
          userDialogsResolve: getUserDialogs
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bot users List'
        }
      })
      ;
  }

  getUserDialogs.$inject = ['$stateParams', 'UserDialogsService'];
  function getUserDialogs($stateParams, UserDialogsService) {
    return UserDialogsService.query({botId: $stateParams.botId, userKey: $stateParams.userKey}).$promise;
  }

})();
