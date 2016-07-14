(function () {
  'use strict';

  angular
    .module('faqs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('faqs', {
        abstract: true,
        url: '/faqs',
        template: '<ui-view/>'
      })
      .state('faqs.list', {
        url: '',
        templateUrl: 'modules/faqs/client/views/list-faqs.client.view.html',
        controller: 'FaqsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Faqs List'
        }
      })
      .state('faqs.create', {
        url: '/create',
        templateUrl: 'modules/faqs/client/views/form-faq.client.view.html',
        controller: 'FaqsController',
        controllerAs: 'vm',
        resolve: {
          faqResolve: newFaq
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Faqs Create'
        }
      })
      .state('faqs.edit', {
        url: '/:faqId/edit',
        templateUrl: 'modules/faqs/client/views/form-faq.client.view.html',
        controller: 'FaqsController',
        controllerAs: 'vm',
        resolve: {
          faqResolve: getFaq
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Faq {{ faqResolve.name }}'
        }
      })
      .state('faqs.view', {
        url: '/:faqId',
        templateUrl: 'modules/faqs/client/views/view-faq.client.view.html',
        controller: 'FaqsController',
        controllerAs: 'vm',
        resolve: {
          faqResolve: getFaq
        },
        data:{
          pageTitle: 'Faq {{ articleResolve.name }}'
        }
      });
  }

  getFaq.$inject = ['$stateParams', 'FaqsService'];

  function getFaq($stateParams, FaqsService) {
    return FaqsService.get({
      faqId: $stateParams.faqId
    }).$promise;
  }

  newFaq.$inject = ['FaqsService'];

  function newFaq(FaqsService) {
    return new FaqsService();
  }
})();
