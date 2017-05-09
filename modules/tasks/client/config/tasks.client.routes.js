(function () {
  'use strict';

  angular
    .module('tasks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tasks', {
        abstract: true,
        url: '/developer/tasks',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('tasks.list', {
        url: '?listType',
        templateUrl: 'modules/tasks/client/views/list-tasks.client.view.html',
        controller: 'TasksListController',
        controllerAs: 'vm',
        resolve: {
          tasksResolve: getTasks,
          openTasksResolve: getOpenTasks
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('tasks.create', {
        url: '/create?listType&taskId',
        templateUrl: 'modules/tasks/client/views/form-task.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask,
          openTaskResolve: getOpenTask
          // taskResolve: newTask
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('tasks.edit', {
        url: '/:taskId/edit?listType',
        templateUrl: 'modules/tasks/client/views/form-task.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask,
          openTaskResolve: getOpenTask

        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ taskResolve.name }}'
        }
      })
      .state('tasks.view', {
        url: '/:taskId?listType',
        templateUrl: 'modules/tasks/client/views/view-task.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask,
          openTaskResolve: getOpenTask

        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getOpenTasks.$inject = ['OpenTasksService', '$cookies'];
  function getOpenTasks(OpenTasksService, $cookies) {
    return OpenTasksService.query({botId: $cookies.get('default_bot')}).$promise;
  }

  getOpenTask.$inject = ['$stateParams', 'OpenTasksService', '$cookies'];
  function getOpenTask($stateParams, OpenTasksService, $cookies) {
    console.log($stateParams);
    return OpenTasksService.get({
      botId: $cookies.get('default_bot'),
      taskId: $stateParams.taskId
    }).$promise;
  }

  getTasks.$inject = ['TasksService', '$cookies'];
  function getTasks(TasksService, $cookies) {
    return TasksService.query({botId: $cookies.get('default_bot')}).$promise;
  }

  getTask.$inject = ['$stateParams', 'TasksService', '$cookies'];
  function getTask($stateParams, TasksService, $cookies) {
    console.log($stateParams.taskId);
    return TasksService.get({
      botId: $cookies.get('default_bot'),
      taskId: $stateParams.taskId
    }).$promise;
  }

  newTask.$inject = ['TasksService', '$cookies'];
  function newTask(TasksService, $cookies) {
    return new TasksService();
  }
})();
