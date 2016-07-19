'use strict';

// Setting up route
angular.module('learnings').config(['$stateProvider',
  function ($stateProvider) {
    // Learnings state routing
    $stateProvider
      .state('learnings', {
        abstract: true,
        url: '/learnings',
        template: '<ui-view/>'
      })
      .state('learnings.list', {
        url: '',
        templateUrl: 'modules/learnings/client/views/list-learnings.client.view.html'
      })
      .state('learnings.create', {
        url: '/create',
        templateUrl: 'modules/learnings/client/views/create-learning.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('learnings.view', {
        url: '/:learningId',
        templateUrl: 'modules/learnings/client/views/view-learning.client.view.html'
      })
      .state('learnings.edit', {
        url: '/:learningId/edit',
        templateUrl: 'modules/learnings/client/views/edit-learning.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
