'use strict';

// Setting up route
angular.module('bots').config(['$stateProvider',
  function ($stateProvider) {
    // Bots state routing
    $stateProvider
      .state('bots', {
        abstract: true,
        url: '/bots',
        template: '<ui-view/>'
      })
      .state('bots.list', {
        url: '',
        templateUrl: 'modules/bots/client/views/list-bots.client.view.html'
      })
      .state('bots.files', {
        url: '/files',
        templateUrl: 'modules/bots/client/views/files-bots.client.view.html'
      })
      .state('bots.create', {
        url: '/create',
        templateUrl: 'modules/bots/client/views/create-bot.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('bots.ide', {
        url: '/ide',
        templateUrl: 'modules/bots/client/views/ide.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('bots.view', {
        url: '/:botId',
        templateUrl: 'modules/bots/client/views/view-bot.client.view.html'
      })
      .state('bots.edit', {
        url: '/:botId/edit',
        templateUrl: 'modules/bots/client/views/edit-bot.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
;
  }
]);
