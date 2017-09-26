(function () {
  'use strict';

  angular
    .module('messages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('messages', {
        abstract: true,
        url: '/developer/messages',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('messages.list', {
        url: '',
        templateUrl: 'modules/messages/client/views/list-messages.client.view.html',
        controller: 'MessagesListController',
        controllerAs: 'vm',
        resolve: {
          messagesResolve: getMessages
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('messages.create', {
        url: '/create',
        templateUrl: 'modules/messages/client/views/form-message.client.view.html',
        controller: 'MessagesController',
        controllerAs: 'vm',
        resolve: {
          messageResolve: newMessage
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('messages.edit', {
        url: '/:messageId/edit',
        templateUrl: 'modules/messages/client/views/form-message.client.view.html',
        controller: 'MessagesController',
        controllerAs: 'vm',
        resolve: {
          messageResolve: getMessage
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Custom action {{ messageResolve.name }}'
        }
      })
      .state('messages.view', {
        url: '/:messageId/view',
        templateUrl: 'modules/messages/client/views/view-message.client.view.html',
        controller: 'MessagesController',
        controllerAs: 'vm',
        resolve: {
          messageResolve: getMessage
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
      .state('messages.send', {
        url: '/send',
        templateUrl: 'modules/messages/client/views/send-message.client.view.html',
        controller: 'MessageSendController',
        controllerAs: 'vm',
        resolve: {
          botUsersResolve: getBotUsers
        },
        params: {
          userKey: null,
          channel: null,
          text: null,
          image: null,
          linkMessage: null,
          linkAddress: null
        }
      });
  }

  getBotUsers.$inject = ['BotUsersService'];
  function getBotUsers(BotUsersService) {
    return BotUsersService.query().$promise;
  }
  getMessages.$inject = ['MessagesService'];
  function getMessages(MessagesService) {
    return MessagesService.query().$promise;
  }

  getMessage.$inject = ['$stateParams', 'MessagesService'];
  function getMessage($stateParams, MessagesService) {
    return MessagesService.get({
      messageId: $stateParams.messageId
    }).$promise;
  }

  newMessage.$inject = ['MessagesService'];
  function newMessage(MessagesService) {
    return new MessagesService();
  }
})();
