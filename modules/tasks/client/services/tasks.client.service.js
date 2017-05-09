//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('tasks')
    .factory('TasksService', TasksService)
    .factory('OpenTasksService', OpenTasksService);

  TasksService.$inject = ['$resource'];
  function TasksService($resource) {
    return $resource('api/tasks/:botId/:taskId', {
      botId: '@botId',
      taskId: '@name'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  OpenTasksService.$inject = ['$resource'];
  function OpenTasksService($resource) {
    return $resource('api/openTasks/:botId/:taskId', {
      botId: '@botId',
      taskId: '@name'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
