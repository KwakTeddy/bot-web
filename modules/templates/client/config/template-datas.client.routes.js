(function () {
  'use strict';

  angular
    .module('templates')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('template-datas', {
        abstract: true,
        url: '/developer/templates/:templateId/template-datas',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('template-datas.list', {
        url: '',
        templateUrl: 'modules/templates/client/views/list-template-datas.client.view.html',
        controller: 'TemplateDatasListController',
        controllerAs: 'vm',
        resolve: {
          templateDatasResolve: getTemplateDatas
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('template-datas.create', {
        url: '/create',
        templateUrl: 'modules/templates/client/views/form-template-data.client.view.html',
        controller: 'TemplateDatasController',
        controllerAs: 'vm',
        resolve: {
          templateDataResolve: newTemplateData
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('template-datas.edit', {
        url: '/:templateDataId/edit',
        templateUrl: 'modules/templates/client/views/form-template-data.client.view.html',
        controller: 'TemplateDatasController',
        controllerAs: 'vm',
        resolve: {
          templateDataResolve: getTemplateData
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ template-dataResolve.name }}'
        }
      })
      .state('template-datas.view', {
        url: '/:templateDataId',
        templateUrl: 'modules/templates/client/views/view-template-data.client.view.html',
        controller: 'TemplateDatasController',
        controllerAs: 'vm',
        resolve: {
          templateDataResolve: getTemplateData
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getTemplateDatas.$inject = ['$stateParams', 'TemplateDatasService'];
  function getTemplateDatas($stateParams, TemplateDatasService) {
    return TemplateDatasService.query({templateId: $stateParams.templateId}).$promise;
  }

  getTemplateData.$inject = ['$stateParams', 'TemplateDatasService'];
  function getTemplateData($stateParams, TemplateDatasService) {
    return TemplateDatasService.get({
      templateId: $stateParams.templateId,
      templateDataId: $stateParams.templateDataId
    }).$promise;
  }

  newTemplateData.$inject = ['$stateParams', 'TemplateDatasService'];
  function newTemplateData($stateParams, TemplateDatasService) {
    return new TemplateDatasService({templateId: $stateParams.templateId});
  }
})();
