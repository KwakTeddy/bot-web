(function () {
  'use strict';

  angular
    .module('banks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('banks', {
        abstract: true,
        url: '/developer/banks',
        template: '<ui-view/>'
      })
      .state('banks.list', {
        url: '',
        templateUrl: 'modules/banks/client/views/list-banks.client.view.html',
        controller: 'BanksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Banks List'
        }
      })
      .state('banks.create', {
        url: '/create',
        templateUrl: 'modules/banks/client/views/form-bank.client.view.html',
        controller: 'BanksController',
        controllerAs: 'vm',
        resolve: {
          bankResolve: newBank
        },
        data: {
          roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Banks Create'
        }
      })
      .state('banks.edit', {
        url: '/:bankId/edit',
        templateUrl: 'modules/banks/client/views/form-bank.client.view.html',
        controller: 'BanksController',
        controllerAs: 'vm',
        resolve: {
          bankResolve: getBank
        },
        data: {
          roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Bank {{ bankResolve.name }}'
        }
      })
      .state('banks.view', {
        url: '/:bankId',
        templateUrl: 'modules/banks/client/views/view-bank.client.view.html',
        controller: 'BanksController',
        controllerAs: 'vm',
        resolve: {
          bankResolve: getBank
        },
        data:{
          pageTitle: 'Bank {{ articleResolve.name }}'
        }
      });
  }

  getBank.$inject = ['$stateParams', 'BanksService'];

  function getBank($stateParams, BanksService) {
    return BanksService.get({
      bankId: $stateParams.bankId
    }).$promise;
  }

  newBank.$inject = ['BanksService'];

  function newBank(BanksService) {
    return new BanksService();
  }
})();
