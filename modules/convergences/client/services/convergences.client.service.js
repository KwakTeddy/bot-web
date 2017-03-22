// Convergences service used to communicate Convergences REST endpoints
(function () {
  'use strict';

  angular
    .module('convergences')
    .factory('ConvergencesService', ConvergencesService);

  ConvergencesService.$inject = ['$resource'];

  function ConvergencesService($resource) {
    return $resource('api/convergences/:convergenceId', {
      convergenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
