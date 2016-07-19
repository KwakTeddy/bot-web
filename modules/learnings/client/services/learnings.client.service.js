'use strict';

//Learnings service used for communicating with the learnings REST endpoints
angular.module('learnings').factory('Learnings', ['$resource',
  function ($resource) {
    return $resource('api/learnings/:learningId', {
      learningId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
