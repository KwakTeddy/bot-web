//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('templates')
    .factory('TemplateDatasService', TemplateDatasService);

  TemplateDatasService.$inject = ['$resource'];

  function TemplateDatasService($resource) {
    return $resource('api/template-datas/:templateId/:templateDataId', {
      templateId: '@templateId',
      templateDataId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
