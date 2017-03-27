(function () {
  'use strict';

  angular
    .module('templates')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('templates', {
        abstract: true,
        url: '/developer/templates',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('templates.list', {
        url: '',
        templateUrl: 'modules/templates/client/views/list-templates.client.view.html',
        controller: 'TemplatesListController',
        controllerAs: 'vm',
        resolve: {
          templatesResolve: getTemplates
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('templates.create', {
        url: '/create',
        templateUrl: 'modules/templates/client/views/form-template.client.view.html',
        controller: 'TemplatesController',
        controllerAs: 'vm',
        resolve: {
          templateResolve: newTemplate
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('templates.edit', {
        url: '/:templateId/edit',
        templateUrl: 'modules/templates/client/views/form-template.client.view.html',
        controller: 'TemplatesController',
        controllerAs: 'vm',
        resolve: {
          templateResolve: getTemplate
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ templateResolve.name }}'
        }
      })
      .state('templates.view', {
        url: '/:templateId',
        templateUrl: 'modules/templates/client/views/view-template.client.view.html',
        controller: 'TemplatesController',
        controllerAs: 'vm',
        resolve: {
          templateResolve: getTemplate
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
    ;
  }

  getTemplates.$inject = ['TemplatesService'];
  function getTemplates(TemplatesService) {
    return TemplatesService.query().$promise;
  }

  getTemplate.$inject = ['$stateParams', 'TemplatesService'];
  function getTemplate($stateParams, TemplatesService) {
    return TemplatesService.get({
      templateId: $stateParams.templateId
    }).$promise;
  }

  newTemplate.$inject = ['TemplatesService'];
  function newTemplate(TemplatesService) {
    return new TemplatesService();
  }
})();
