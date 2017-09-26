//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('dialogsets')
    .factory('DialogsetsService', DialogsetsService);

  DialogsetsService.$inject = ['$resource'];

  function DialogsetsService($resource) {
    return $resource('api/dialogsets/:dialogsetId', {
      dialogsetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('dialogsets')
    .factory('DialogsetDialogsService', DialogsetDialogsService);

  DialogsetDialogsService.$inject = ['$resource'];

  function DialogsetDialogsService($resource) {
    return $resource('api/dialogsets/:dialogsetId/dialogs/:dialogId', {
      dialogsetId: '@dialogset', dialogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('dialogsets')
    .filter('orderByDepth', orderByDepth);

  orderByDepth.$inject = ['$resource'];
  function orderByDepth() {
    return function(input, attribute) {
      if (!angular.isArray(input) || (input.length < 2)) return input;

      console.log(input);
      console.log(attribute);


      input.forEach(function (depthDialog) {
        depthDialog.data[0].depth;

      });


      var array = [];
      for(var objectKey in input) {
        array.push(input[objectKey]);
      }

      array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
      });
      return array;
    }
  }


})();
