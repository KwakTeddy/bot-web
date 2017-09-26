//Faqs service used to communicate Faqs REST endpoints
(function () {
  'use strict';

  angular
    .module('faqs')
    .factory('FaqsService', FaqsService);

  FaqsService.$inject = ['$resource'];

  function FaqsService($resource) {
    return $resource('api/faqs/:faqId', {
      faqId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
