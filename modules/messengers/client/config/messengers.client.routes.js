// 'use strict';
//
// // Setting up route
// angular.module('messengers').config(['$stateProvider',
//   function ($stateProvider) {
//     // Messengers state routing
//     $stateProvider
//       .state('messengers', {
//         abstract: true,
//         url: '/messengers',
//         template: '<ui-view/>'
//       })
//       .state('messengers.list', {
//         url: '',
//         templateUrl: 'modules/messengers/client/views/list-messengers.client.view.html'
//       })
//       .state('messengers.create', {
//         url: '/create',
//         templateUrl: 'modules/messengers/client/views/create-messenger.client.view.html',
//         data: {
//           roles: ['user', 'admin']
//         }
//       })
//       .state('messengers.view', {
//         url: '/:messengerId',
//         templateUrl: 'modules/messengers/client/views/view-messenger.client.view.html'
//       })
//       .state('messengers.edit', {
//         url: '/:messengerId/edit',
//         templateUrl: 'modules/messengers/client/views/edit-messenger.client.view.html',
//         data: {
//           roles: ['user', 'admin']
//         }
//       });
//   }
//
// ]);
